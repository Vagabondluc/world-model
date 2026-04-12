"""Shared helpers for Phase 2 adapter snapshot tooling."""
from __future__ import annotations

import ast
import hashlib
import json
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List

try:
    import tomllib  # Python 3.11+
except Exception:  # pragma: no cover
    tomllib = None

try:
    import yaml
except Exception:  # pragma: no cover - exercised via CLI checks
    yaml = None


REQUIRED_DONORS = ["mythforge", "orbis", "adventure-generator"]
PLACEHOLDER_TOKEN = "REPLACE_"
ALLOWED_SOURCE_KINDS = {"doc", "typescript", "json", "schema_template"}
ALLOWED_PROMOTION_CLASSES = {
    "core",
    "simulation",
    "workflow",
    "donor_local",
    "reference_only",
}
DEFAULT_CONCEPT_FAMILIES = {
    "identity-history",
    "schema-contract",
    "entity-template",
    "simulation-profile",
    "simulation-snapshot",
    "simulation-domain",
    "simulation-event",
    "workflow-schema",
    "location-linkage",
    "domain-schema",
    "spatial-stack",
    "event-projection",
}

DEFAULT_MANDATORY_COVERAGE = [
    "world",
    "entity",
    "location",
    "city/settlement",
    "region",
    "biome",
    "dungeon",
    "landmark",
    "relation",
    "asset",
    "workflow",
    "simulation",
    "event",
    "projection",
    "schema-binding",
]


@dataclass(frozen=True)
class SnapshotFile:
    rel_path: str
    abs_path: Path
    size: int
    sha256: str


def ensure_yaml_available() -> None:
    if yaml is None:
        raise RuntimeError(
            "PyYAML is required. Install dependencies with `python -m pip install -r world-model/requirements.txt`."
        )


def world_model_root() -> Path:
    here = Path(__file__).resolve()
    return here.parent.parent


def workspace_root() -> Path:
    return world_model_root().parent


def normalize_posix(path: str) -> str:
    return path.replace("\\", "/").strip("./")


def donor_slug(value: str) -> str:
    return normalize_posix(value).replace("_", "-").lower()


def load_yaml(path: Path) -> dict:
    ensure_yaml_available()
    with path.open("r", encoding="utf-8") as fh:
        data = yaml.safe_load(fh) or {}
    if not isinstance(data, dict):
        raise ValueError(f"{path.as_posix()} does not contain a YAML object")
    return data


def dump_yaml(path: Path, data: dict) -> None:
    ensure_yaml_available()
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        yaml.safe_dump(
            data,
            fh,
            sort_keys=False,
            allow_unicode=False,
            default_flow_style=False,
        )


def read_registry(path: Path) -> dict:
    if not path.is_file():
        return {
            "concept_families": sorted(DEFAULT_CONCEPT_FAMILIES),
            "mandatory_coverage": list(DEFAULT_MANDATORY_COVERAGE),
        }
    data = load_yaml(path)
    families = data.get("concept_families", [])
    coverage = data.get("mandatory_coverage", [])
    if not isinstance(families, list):
        families = []
    if not isinstance(coverage, list):
        coverage = []
    return {
        "concept_families": sorted({str(v) for v in families} | DEFAULT_CONCEPT_FAMILIES),
        "mandatory_coverage": list(dict.fromkeys([str(v) for v in coverage] + DEFAULT_MANDATORY_COVERAGE)),
    }


def list_snapshot_files(snapshot_root: Path) -> List[SnapshotFile]:
    files: List[SnapshotFile] = []
    if not snapshot_root.is_dir():
        return files
    for path in sorted(snapshot_root.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(snapshot_root).as_posix()
        raw = path.read_bytes()
        digest, size = snapshot_hash_and_size(raw)
        files.append(SnapshotFile(rel_path=rel, abs_path=path, size=size, sha256=digest))
    return files


def file_sha256(path: Path) -> str:
    digest, _ = snapshot_hash_and_size(path.read_bytes())
    return digest


def snapshot_hash_and_size(raw: bytes) -> tuple[str, int]:
    h = hashlib.sha256()
    if b"\0" not in raw:
        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError:
            pass
        else:
            normalized = text.replace("\r\n", "\n").replace("\r", "\n").encode("utf-8")
            h.update(normalized)
            return h.hexdigest(), len(normalized)
    h.update(raw)
    return h.hexdigest(), len(raw)


def snapshot_fingerprint(files: Iterable[SnapshotFile]) -> str:
    h = hashlib.sha256()
    for entry in sorted(files, key=lambda item: item.rel_path):
        line = f"{entry.rel_path}|{entry.size}|{entry.sha256}\n".encode("utf-8")
        h.update(line)
    return h.hexdigest()


def writes_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2)


def load_spec_manifests(root: Path) -> Dict[str, dict]:
    manifests: Dict[str, dict] = {}
    spec_dir = root / "spec-sources"
    if not spec_dir.is_dir():
        return manifests
    for toml_path in sorted(spec_dir.glob("*.toml")):
        text = toml_path.read_text(encoding="utf-8")
        if tomllib is not None:
            data = tomllib.loads(text)
        else:
            data = _parse_simple_toml(text)
        donor = donor_slug(str(data.get("donor", toml_path.stem)))
        manifests[donor] = data
    return manifests


def _parse_simple_toml(text: str) -> dict:
    """Parse the small TOML subset used by spec-source manifests.

    The spec manifests only use flat string scalars plus multi-line arrays of
    strings, so we can keep the Phase 2 tooling self-contained without an
    optional third-party TOML dependency.
    """

    def parse_scalar(raw: str):
        value = raw.strip()
        if not value:
            return ""
        if value[0] in {"'", '"'} and value[-1] == value[0]:
            return ast.literal_eval(value)
        if value in {"true", "false"}:
            return value == "true"
        if re.fullmatch(r"[+-]?\d+", value):
            return int(value)
        return value

    def parse_inline_list(raw: str) -> list:
        inner = raw.strip()[1:-1].strip()
        if not inner:
            return []
        items: list = []
        current = []
        quote: str | None = None
        escaped = False
        for char in inner:
            if quote is not None:
                current.append(char)
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == quote:
                    quote = None
                continue
            if char in {"'", '"'}:
                quote = char
                current.append(char)
            elif char == ",":
                token = "".join(current).strip()
                if token:
                    items.append(parse_scalar(token))
                current = []
            else:
                current.append(char)
        token = "".join(current).strip()
        if token:
            items.append(parse_scalar(token))
        return items

    data: dict = {}
    current_key: str | None = None
    current_items: list = []
    for raw_line in text.splitlines():
        line = raw_line.split("#", 1)[0].strip()
        if not line:
            continue
        if current_key is not None:
            if line == "]":
                data[current_key] = current_items
                current_key = None
                current_items = []
                continue
            if line.endswith(","):
                line = line[:-1].strip()
            if line:
                current_items.append(parse_scalar(line))
            continue
        if "=" not in line:
            continue
        key, raw_value = [part.strip() for part in line.split("=", 1)]
        if raw_value == "[":
            current_key = key
            current_items = []
            continue
        if raw_value.startswith("[") and raw_value.endswith("]"):
            data[key] = parse_inline_list(raw_value)
            continue
        data[key] = parse_scalar(raw_value)
    if current_key is not None:
        raise ValueError("unterminated TOML array in spec manifest")
    return data


def safe_rel(path: Path, base: Path) -> str:
    try:
        return path.relative_to(base).as_posix()
    except Exception:
        return path.as_posix()

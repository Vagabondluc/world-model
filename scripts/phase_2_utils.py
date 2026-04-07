"""Shared helpers for Phase 2 adapter snapshot tooling."""
from __future__ import annotations

import hashlib
import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List

try:
    import tomllib  # Python 3.11+
except Exception:  # pragma: no cover
    tomllib = None
    import toml  # type: ignore

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
        size = path.stat().st_size
        digest = file_sha256(path)
        files.append(SnapshotFile(rel_path=rel, abs_path=path, size=size, sha256=digest))
    return files


def file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        while True:
            chunk = fh.read(65536)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()


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
            data = toml.loads(text)  # type: ignore[name-defined]
        donor = donor_slug(str(data.get("donor", toml_path.stem)))
        manifests[donor] = data
    return manifests


def safe_rel(path: Path, base: Path) -> str:
    try:
        return path.relative_to(base).as_posix()
    except Exception:
        return path.as_posix()

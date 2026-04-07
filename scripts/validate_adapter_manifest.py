"""Strict adapter manifest validator for Phase 2 contracts.

Usage:
  python validate_adapter_manifest.py PATH
  python validate_adapter_manifest.py PATH --json
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Iterable, List

from phase_2_utils import (
    ALLOWED_PROMOTION_CLASSES,
    ALLOWED_SOURCE_KINDS,
    PLACEHOLDER_TOKEN,
    donor_slug,
    list_snapshot_files,
    load_yaml as _load_yaml,
    read_registry,
    snapshot_fingerprint,
    world_model_root,
)

REQUIRED_TOP_LEVEL = [
    "id",
    "name",
    "version",
    "source",
    "source_kind",
    "default_promotion_class",
    "snapshot",
    "included_paths",
    "excluded_paths",
    "concepts",
    "mappings",
    "provenance",
]
SOURCE_FIELDS = ["repo", "commit", "path"]
SNAPSHOT_FIELDS = ["root", "fingerprint", "file_count"]
PROVENANCE_FIELDS = ["generated_at", "generated_by"]
_ISO_8601_UTC_RE = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$")


def load_yaml(path: str):
    return _load_yaml(Path(path))


def _is_non_empty_list(value) -> bool:
    return isinstance(value, list) and len(value) > 0


def _flatten_strings(value) -> Iterable[str]:
    if isinstance(value, dict):
        for v in value.values():
            yield from _flatten_strings(v)
    elif isinstance(value, list):
        for v in value:
            yield from _flatten_strings(v)
    elif isinstance(value, str):
        yield value


def _manifest_root_from_path(path: Path) -> Path:
    if path.name.lower().endswith((".yaml", ".yml")):
        return path.parent
    return path


def validate_manifest_detailed(
    manifest: dict,
    manifest_path: str | None = None,
    wm_root: str | None = None,
    allowed_concept_families: list[str] | None = None,
) -> list[str]:
    errors: List[str] = []

    for field in REQUIRED_TOP_LEVEL:
        if field not in manifest:
            errors.append(f"missing required field: {field}")

    source = manifest.get("source")
    if not isinstance(source, dict):
        errors.append("source must be an object")
    else:
        for field in SOURCE_FIELDS:
            if field not in source or not str(source.get(field)).strip():
                errors.append(f"missing required source field: source.{field}")

    snapshot = manifest.get("snapshot")
    if not isinstance(snapshot, dict):
        errors.append("snapshot must be an object")
    else:
        for field in SNAPSHOT_FIELDS:
            if field not in snapshot or str(snapshot.get(field)).strip() == "":
                errors.append(f"missing required snapshot field: snapshot.{field}")
        if isinstance(snapshot.get("file_count"), int):
            if snapshot["file_count"] < 0:
                errors.append("snapshot.file_count must be >= 0")
        else:
            errors.append("snapshot.file_count must be an integer")

    provenance = manifest.get("provenance")
    if not isinstance(provenance, dict):
        errors.append("provenance must be an object")
    else:
        for field in PROVENANCE_FIELDS:
            if field not in provenance or not str(provenance.get(field)).strip():
                errors.append(f"missing required provenance field: provenance.{field}")
        generated_at = str(provenance.get("generated_at", ""))
        if generated_at and not _ISO_8601_UTC_RE.match(generated_at):
            errors.append("provenance.generated_at must be UTC ISO-8601 (e.g. 2026-04-07T15:00:00Z)")

    if not _is_non_empty_list(manifest.get("included_paths")):
        errors.append("included_paths must be a non-empty list")
    if not _is_non_empty_list(manifest.get("excluded_paths")):
        errors.append("excluded_paths must be a non-empty list")
    if not _is_non_empty_list(manifest.get("concepts")):
        errors.append("concepts must be a non-empty list")
    if not _is_non_empty_list(manifest.get("mappings")):
        errors.append("mappings must be a non-empty list")

    source_kind = str(manifest.get("source_kind", "")).strip().lower()
    if source_kind and source_kind not in ALLOWED_SOURCE_KINDS:
        errors.append(
            f"source_kind must be one of {sorted(ALLOWED_SOURCE_KINDS)}, got {manifest.get('source_kind')}"
        )

    promotion_class = str(manifest.get("default_promotion_class", "")).strip().lower()
    if promotion_class and promotion_class not in ALLOWED_PROMOTION_CLASSES:
        errors.append(
            f"default_promotion_class must be one of {sorted(ALLOWED_PROMOTION_CLASSES)}, got {manifest.get('default_promotion_class')}"
        )

    for string_value in _flatten_strings(manifest):
        if PLACEHOLDER_TOKEN in string_value:
            errors.append(f"placeholder token `{PLACEHOLDER_TOKEN}` found in manifest")
            break

    donor = donor_slug(str(manifest.get("id", "")))
    if donor and donor not in {"mythforge", "orbis", "adventure-generator"}:
        errors.append(f"id must be one of mythforge|orbis|adventure-generator, got {manifest.get('id')}")

    if manifest_path:
        manifest_p = Path(manifest_path).resolve()
        root = Path(wm_root).resolve() if wm_root else world_model_root().resolve()

        # Paths in manifest are world-model-relative.
        for raw_path in manifest.get("mappings", []):
            mapping_path = (root / str(raw_path)).resolve()
            if not mapping_path.is_file():
                errors.append(f"mapping path does not exist: {raw_path}")

        snapshot_root_raw = None
        if isinstance(snapshot, dict):
            snapshot_root_raw = snapshot.get("root")
        if snapshot_root_raw:
            snapshot_root_path = (root / str(snapshot_root_raw)).resolve()
            allowed_prefix = (root / "adapters" / donor / "source-snapshot").resolve()
            if not str(snapshot_root_path).startswith(str(allowed_prefix)):
                errors.append(
                    f"snapshot.root must be inside adapters/{donor}/source-snapshot, got {snapshot_root_raw}"
                )
            if not snapshot_root_path.is_dir():
                errors.append(f"snapshot.root directory not found: {snapshot_root_raw}")
            else:
                snapshot_files = list_snapshot_files(snapshot_root_path)
                declared_count = snapshot.get("file_count")
                if isinstance(declared_count, int) and declared_count != len(snapshot_files):
                    errors.append(
                        f"snapshot.file_count mismatch: manifest={declared_count}, actual={len(snapshot_files)}"
                    )
                declared_fp = str(snapshot.get("fingerprint", "")).strip()
                actual_fp = snapshot_fingerprint(snapshot_files)
                if declared_fp and declared_fp != actual_fp:
                    errors.append("snapshot.fingerprint mismatch against source-snapshot contents")

    if allowed_concept_families:
        for concept in manifest.get("concepts", []):
            if str(concept) not in allowed_concept_families:
                errors.append(f"concept `{concept}` is not in allowed concept-family registry")

    return errors


def validate_manifest(
    manifest: dict,
    manifest_path: str | None = None,
    wm_root: str | None = None,
    allowed_concept_families: list[str] | None = None,
):
    errors = validate_manifest_detailed(
        manifest,
        manifest_path=manifest_path,
        wm_root=wm_root,
        allowed_concept_families=allowed_concept_families,
    )
    if errors:
        return False, errors[0]
    return True, "ok"


def _resolve_manifest_target(target: str) -> Path:
    candidate = Path(target)
    if candidate.is_dir():
        manifests = sorted(list(candidate.glob("*.yaml")) + list(candidate.glob("*.yml")))
        if not manifests:
            raise FileNotFoundError(f"No YAML manifest found in directory: {target}")
        return manifests[0]
    return candidate


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate adapter manifest contract")
    parser.add_argument("target", help="Manifest file path or donor directory")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON result")
    parser.add_argument(
        "--world-model-root",
        default=str(world_model_root()),
        help="Path to world-model root (default: auto-detected)",
    )
    parser.add_argument(
        "--registry",
        default=str(world_model_root() / "adapters" / "concept-family-registry.yaml"),
        help="Concept-family registry YAML",
    )
    args = parser.parse_args()

    payload = {"ok": False, "errors": [], "manifest_path": "", "world_model_root": args.world_model_root}
    try:
        manifest_path = _resolve_manifest_target(args.target).resolve()
        payload["manifest_path"] = manifest_path.as_posix()
        manifest = load_yaml(str(manifest_path))

        registry = read_registry(Path(args.registry))
        errors = validate_manifest_detailed(
            manifest,
            manifest_path=str(manifest_path),
            wm_root=args.world_model_root,
            allowed_concept_families=registry.get("concept_families", []),
        )
        payload["errors"] = errors
        payload["ok"] = not errors
    except Exception as exc:
        payload["errors"] = [str(exc)]
        payload["ok"] = False

    if args.json:
        print(json.dumps(payload, indent=2))
    else:
        if payload["ok"]:
            print("VALID: manifest passed strict checks")
        else:
            print("INVALID:")
            for err in payload["errors"]:
                print(f" - {err}")

    return 0 if payload["ok"] else 5


if __name__ == "__main__":
    sys.exit(main())

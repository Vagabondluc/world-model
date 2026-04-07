"""Phase 2 integrity checker for normalized adapter snapshots."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, Tuple

from phase_2_utils import (
    DEFAULT_MANDATORY_COVERAGE,
    REQUIRED_DONORS,
    list_snapshot_files,
    load_yaml,
    read_registry,
    snapshot_fingerprint,
    world_model_root,
    writes_json,
)
from validate_adapter_manifest import validate_manifest_detailed


REPORT_PATH = "phase-2-snapshot-integrity-report.json"


def _load_concept_map(path: Path) -> Tuple[List[dict], List[str]]:
    errors: List[str] = []
    try:
        data = load_yaml(path)
    except Exception as exc:
        return [], [str(exc)]

    entries = data.get("entries")
    if not isinstance(entries, list) or not entries:
        return [], [f"{path.as_posix()}: entries must be a non-empty list"]

    validated: List[dict] = []
    for idx, entry in enumerate(entries):
        if not isinstance(entry, dict):
            errors.append(f"{path.as_posix()}: entry[{idx}] must be an object")
            continue
        for field in [
            "donor_concept",
            "source_family",
            "canonical_key",
            "canonical_target",
            "status",
            "winner",
            "rationale",
            "provenance",
        ]:
            if field not in entry:
                errors.append(f"{path.as_posix()}: entry[{idx}] missing field `{field}`")
        status = str(entry.get("status", ""))
        if status not in {"mapped", "reference-only", "dropped"}:
            errors.append(
                f"{path.as_posix()}: entry[{idx}] status must be mapped|reference-only|dropped"
            )
        if status == "mapped" and not str(entry.get("canonical_target", "")).strip():
            errors.append(f"{path.as_posix()}: entry[{idx}] mapped entries need canonical_target")
        validated.append(entry)
    return validated, errors


def _validate_duplicate_rules(entries: List[dict]) -> List[str]:
    errors: List[str] = []
    by_key: Dict[str, dict] = {}
    for entry in entries:
        key = str(entry.get("canonical_key", "")).strip()
        if not key:
            continue
        rule = {
            "winner": str(entry.get("winner", "")),
            "status": str(entry.get("status", "")),
            "canonical_target": str(entry.get("canonical_target", "")),
        }
        if key not in by_key:
            by_key[key] = rule
            continue
        if by_key[key] != rule:
            errors.append(
                f"inconsistent duplicate rule for canonical_key `{key}`: {by_key[key]} vs {rule}"
            )
    return errors


def check() -> dict:
    wm_root = world_model_root().resolve()
    adapters_root = wm_root / "adapters"
    registry_path = adapters_root / "concept-family-registry.yaml"
    registry = read_registry(registry_path)
    allowed_families = set(registry.get("concept_families", []))
    mandatory_coverage = registry.get("mandatory_coverage", DEFAULT_MANDATORY_COVERAGE)

    report = {
        "ok": True,
        "world_model_root": wm_root.as_posix(),
        "adapters_root": adapters_root.as_posix(),
        "registry_path": registry_path.as_posix(),
        "results": [],
        "errors": [],
    }

    coverage_hits = set()
    merged_entries: List[dict] = []

    for donor in REQUIRED_DONORS:
        donor_errors: List[str] = []
        manifest_path = adapters_root / donor / "manifest.yaml"
        if not manifest_path.is_file():
            donor_errors.append(f"missing manifest: {manifest_path.as_posix()}")
            report["results"].append({"donor": donor, "ok": False, "errors": donor_errors})
            report["ok"] = False
            continue

        manifest = load_yaml(manifest_path)
        donor_errors.extend(
            validate_manifest_detailed(
                manifest,
                manifest_path=str(manifest_path),
                wm_root=str(wm_root),
                allowed_concept_families=sorted(allowed_families),
            )
        )

        snapshot_root = wm_root / str(manifest.get("snapshot", {}).get("root", ""))
        snapshot_files = list_snapshot_files(snapshot_root)
        if not snapshot_files:
            donor_errors.append(f"{donor}: source-snapshot is empty at {snapshot_root.as_posix()}")
        else:
            actual_fp = snapshot_fingerprint(snapshot_files)
            expected_fp = str(manifest.get("snapshot", {}).get("fingerprint", ""))
            if actual_fp != expected_fp:
                donor_errors.append(
                    f"{donor}: fingerprint mismatch expected={expected_fp} actual={actual_fp}"
                )

        map_paths = [wm_root / str(path) for path in manifest.get("mappings", [])]
        if not map_paths:
            donor_errors.append(f"{donor}: mappings list is empty")
        for map_path in map_paths:
            if not map_path.is_file():
                donor_errors.append(f"{donor}: mapping file missing {map_path.as_posix()}")
                continue
            entries, map_errors = _load_concept_map(map_path)
            donor_errors.extend(map_errors)
            merged_entries.extend(entries)
            declared_families = set(str(v) for v in manifest.get("concepts", []))
            mapped_families = set(str(entry.get("source_family", "")) for entry in entries)
            for family in declared_families:
                if family not in mapped_families:
                    donor_errors.append(
                        f"{donor}: manifest concept `{family}` missing from {map_path.as_posix()}"
                    )
            for entry in entries:
                family = str(entry.get("source_family", ""))
                if family and family not in allowed_families:
                    donor_errors.append(
                        f"{donor}: entry source_family `{family}` not in concept-family registry"
                    )
                coverage_key = str(entry.get("canonical_key", "")).strip()
                if coverage_key:
                    coverage_hits.add(coverage_key)

        donor_ok = not donor_errors
        if donor_errors:
            report["ok"] = False
            report["errors"].extend(donor_errors)
        report["results"].append(
            {
                "donor": donor,
                "ok": donor_ok,
                "manifest": manifest_path.as_posix(),
                "snapshot_files": len(snapshot_files),
                "errors": donor_errors,
            }
        )

    duplicate_rule_errors = _validate_duplicate_rules(merged_entries)
    report["errors"].extend(duplicate_rule_errors)
    if duplicate_rule_errors:
        report["ok"] = False

    missing_coverage = [item for item in mandatory_coverage if item not in coverage_hits]
    if missing_coverage:
        report["ok"] = False
        report["errors"].append(
            f"mandatory coverage missing canonical keys: {', '.join(missing_coverage)}"
        )
    report["mandatory_coverage_missing"] = missing_coverage

    return report


def main() -> int:
    report = check()
    writes_json(world_model_root() / REPORT_PATH, report)
    print(json.dumps(report, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

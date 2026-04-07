"""Build deterministic adapter source snapshots from spec-source manifests.

Usage:
  python world-model/scripts/build_adapter_snapshots.py --all
  python world-model/scripts/build_adapter_snapshots.py --donor mythforge
  python world-model/scripts/build_adapter_snapshots.py --all --dry-run
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List

from phase_2_utils import (
    donor_slug,
    dump_yaml,
    list_snapshot_files,
    load_spec_manifests,
    load_yaml,
    normalize_posix,
    safe_rel,
    snapshot_fingerprint,
    world_model_root,
    writes_json,
    workspace_root,
)


REPORT_PATH = "phase-2-snapshot-build-report.json"
DONOR_DEFAULTS = {
    "mythforge": {
        "name": "Mythforge",
        "source_repo": "local://mythforge",
        "source_path": "docs/schema-templates",
        "default_promotion_class": "core",
        "concepts": [
            "identity-history",
            "schema-contract",
            "entity-template",
            "spatial-stack",
            "event-projection",
        ],
    },
    "orbis": {
        "name": "Orbis",
        "source_repo": "local://mechanical-sycophant",
        "source_path": "src",
        "default_promotion_class": "simulation",
        "concepts": [
            "simulation-profile",
            "simulation-snapshot",
            "simulation-domain",
            "simulation-event",
            "spatial-stack",
        ],
    },
    "adventure-generator": {
        "name": "Adventure Generator",
        "source_repo": "local://adventure-generator",
        "source_path": "src",
        "default_promotion_class": "workflow",
        "concepts": [
            "workflow-schema",
            "location-linkage",
            "domain-schema",
            "spatial-stack",
        ],
    },
}


def iso_utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _collect_included_files(source_root: Path, include_paths: List[str], exclude_paths: List[str]) -> List[Path]:
    candidates: List[Path] = []
    for include in include_paths:
        include_norm = normalize_posix(str(include))
        target = (source_root / include_norm).resolve()
        if not target.exists():
            raise FileNotFoundError(f"included path not found: {safe_rel(target, source_root.parent)}")
        if target.is_file():
            candidates.append(target)
            continue
        for child in sorted(target.rglob("*")):
            if child.is_file():
                candidates.append(child)

    output: List[Path] = []
    for file_path in sorted(set(candidates)):
        rel = file_path.relative_to(source_root).as_posix()
        excluded = False
        for ex in exclude_paths:
            ex_norm = normalize_posix(str(ex))
            if rel == ex_norm or rel.startswith(ex_norm + "/"):
                excluded = True
                break
        if not excluded:
            output.append(file_path)
    return output


def _clean_snapshot_root(snapshot_root: Path) -> None:
    if snapshot_root.exists():
        shutil.rmtree(snapshot_root)
    snapshot_root.mkdir(parents=True, exist_ok=True)


def _copy_files(files: List[Path], source_root: Path, snapshot_root: Path, dry_run: bool) -> List[str]:
    copied: List[str] = []
    for src in files:
        rel = src.relative_to(source_root).as_posix()
        copied.append(rel)
        if dry_run:
            continue
        dest = snapshot_root / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
    return copied


def _mapping_default_path(donor: str) -> str:
    return f"adapters/{donor}/mappings/concept-map.yaml"


def _inventory_default_path(donor: str) -> str:
    return f"adapters/{donor}/snapshot-inventory.json"


def _manifest_path(root: Path, donor: str) -> Path:
    return root / "adapters" / donor / "manifest.yaml"


def _snapshot_root(root: Path, donor: str) -> Path:
    return root / "adapters" / donor / "source-snapshot"


def _load_manifest_if_exists(path: Path) -> dict:
    if path.is_file():
        return load_yaml(path)
    return {}


def _manifest_for_donor(
    donor: str,
    spec_manifest: dict,
    existing_manifest: dict,
    copied_files_count: int,
    fingerprint: str,
    generated_by: str,
) -> dict:
    defaults = DONOR_DEFAULTS.get(donor, {})
    spec_source_root = normalize_posix(str(spec_manifest.get("source_root", "")))
    source_kind = normalize_posix(str(spec_manifest.get("source_kind", "doc"))).lower()
    promotion_class = normalize_posix(str(spec_manifest.get("default_promotion_class", ""))).lower()

    mapping_paths = existing_manifest.get("mappings") or [_mapping_default_path(donor)]
    concept_families = existing_manifest.get("concepts") or spec_manifest.get("expected_concept_families") or defaults.get("concepts", [])
    include_paths = spec_manifest.get("included_paths", [])
    exclude_paths = spec_manifest.get("excluded_paths", [])

    source_repo = defaults.get("source_repo", f"local://{donor}")
    source_path = defaults.get("source_path", spec_source_root)
    source_commit = existing_manifest.get("source", {}).get("commit") if isinstance(existing_manifest.get("source"), dict) else None
    if not source_commit:
        source_commit = "workspace-local"

    existing_snapshot = existing_manifest.get("snapshot", {}) if isinstance(existing_manifest, dict) else {}
    existing_provenance = existing_manifest.get("provenance", {}) if isinstance(existing_manifest, dict) else {}
    existing_fp = str(existing_snapshot.get("fingerprint", ""))
    if existing_fp == fingerprint and str(existing_provenance.get("generated_at", "")).strip():
        generated_at = str(existing_provenance.get("generated_at"))
        generated_by_value = str(existing_provenance.get("generated_by") or generated_by)
    else:
        generated_at = iso_utc_now()
        generated_by_value = generated_by

    return {
        "id": donor,
        "name": defaults.get("name", donor.replace("-", " ").title()),
        "version": str(existing_manifest.get("version", "1.0.0")),
        "source": {
            "repo": str(existing_manifest.get("source", {}).get("repo", source_repo))
            if isinstance(existing_manifest.get("source"), dict)
            else source_repo,
            "commit": str(source_commit),
            "path": str(existing_manifest.get("source", {}).get("path", source_path))
            if isinstance(existing_manifest.get("source"), dict)
            else source_path,
        },
        "source_kind": source_kind or defaults.get("source_kind", "doc"),
        "default_promotion_class": promotion_class or defaults.get("default_promotion_class", "reference_only"),
        "snapshot": {
            "root": f"adapters/{donor}/source-snapshot",
            "fingerprint": fingerprint,
            "file_count": copied_files_count,
        },
        "included_paths": [str(v) for v in include_paths],
        "excluded_paths": [str(v) for v in exclude_paths],
        "concepts": [str(v) for v in concept_families],
        "mappings": [str(v) for v in mapping_paths],
        "provenance": {
            "generated_at": generated_at,
            "generated_by": generated_by_value,
        },
    }


def build_one(
    donor: str,
    spec_manifest: dict,
    wm_root: Path,
    ws_root: Path,
    dry_run: bool,
    generated_by: str,
) -> dict:
    source_root_raw = str(spec_manifest.get("source_root", "")).strip()
    source_root = Path(source_root_raw)
    if not source_root.is_absolute():
        source_root = (wm_root / source_root_raw).resolve()
    if not source_root.exists():
        raise FileNotFoundError(f"source_root does not exist for {donor}: {source_root_raw}")

    include_paths = [normalize_posix(str(v)) for v in spec_manifest.get("included_paths", [])]
    exclude_paths = [normalize_posix(str(v)) for v in spec_manifest.get("excluded_paths", [])]
    if not include_paths:
        raise ValueError(f"spec-sources for {donor} has empty included_paths")
    if not exclude_paths:
        raise ValueError(f"spec-sources for {donor} has empty excluded_paths")

    files = _collect_included_files(source_root, include_paths, exclude_paths)
    if not files:
        raise RuntimeError(f"no files resolved for {donor} from included_paths")

    manifest_path = _manifest_path(wm_root, donor)
    snapshot_root = _snapshot_root(wm_root, donor)
    inventory_path = wm_root / _inventory_default_path(donor)
    existing_manifest = _load_manifest_if_exists(manifest_path)

    if not dry_run:
        _clean_snapshot_root(snapshot_root)
    copied_rel = _copy_files(files, source_root, snapshot_root, dry_run=dry_run)

    if dry_run:
        # Predict deterministic fingerprint from source files.
        temp_entries = []
        for src in files:
            rel = src.relative_to(source_root).as_posix()
            size = src.stat().st_size
            import hashlib

            h = hashlib.sha256()
            with src.open("rb") as fh:
                while True:
                    chunk = fh.read(65536)
                    if not chunk:
                        break
                    h.update(chunk)
            temp_entries.append({"path": rel, "size": size, "sha256": h.hexdigest()})
        fingerprint = _fingerprint_from_json_entries(temp_entries)
        file_count = len(temp_entries)
        inventory_entries = temp_entries
    else:
        snapshot_entries = list_snapshot_files(snapshot_root)
        fingerprint = snapshot_fingerprint(snapshot_entries)
        file_count = len(snapshot_entries)
        inventory_entries = [
            {"path": entry.rel_path, "size": entry.size, "sha256": entry.sha256}
            for entry in snapshot_entries
        ]

    manifest_payload = _manifest_for_donor(
        donor=donor,
        spec_manifest=spec_manifest,
        existing_manifest=existing_manifest,
        copied_files_count=file_count,
        fingerprint=fingerprint,
        generated_by=generated_by,
    )

    if not dry_run:
        dump_yaml(manifest_path, manifest_payload)
        writes_json(
            inventory_path,
            {
                "donor": donor,
                "snapshot_root": manifest_payload["snapshot"]["root"],
                "source_root": safe_rel(source_root, ws_root),
                "file_count": file_count,
                "fingerprint": fingerprint,
                "files": inventory_entries,
            },
        )

    return {
        "donor": donor,
        "source_root": safe_rel(source_root, ws_root),
        "included_paths": include_paths,
        "excluded_paths": exclude_paths,
        "copied_files": len(copied_rel),
        "snapshot_fingerprint": fingerprint,
        "manifest_path": safe_rel(manifest_path, ws_root),
        "inventory_path": safe_rel(inventory_path, ws_root),
        "dry_run": dry_run,
    }


def _fingerprint_from_json_entries(entries: List[dict]) -> str:
    import hashlib

    h = hashlib.sha256()
    for item in sorted(entries, key=lambda d: d["path"]):
        line = f"{item['path']}|{item['size']}|{item['sha256']}\n".encode("utf-8")
        h.update(line)
    return h.hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser(description="Build deterministic Phase 2 adapter snapshots")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--all", action="store_true", help="Build all required donors")
    group.add_argument("--donor", help="Build one donor by id")
    parser.add_argument("--dry-run", action="store_true", help="Compute plan without writing files")
    args = parser.parse_args()

    wm_root = world_model_root().resolve()
    ws_root = workspace_root().resolve()
    specs = load_spec_manifests(wm_root)

    selected: List[str]
    if args.all:
        selected = ["mythforge", "orbis", "adventure-generator"]
    else:
        selected = [donor_slug(args.donor)]

    report = {
        "ok": True,
        "dry_run": bool(args.dry_run),
        "generated_at": iso_utc_now(),
        "generated_by": os.environ.get("USERNAME") or os.environ.get("USER") or "codex",
        "selected_donors": selected,
        "results": [],
        "errors": [],
    }

    for donor in selected:
        spec = specs.get(donor)
        if spec is None:
            report["ok"] = False
            report["errors"].append(f"missing spec-sources manifest for donor `{donor}`")
            continue
        try:
            result = build_one(
                donor=donor,
                spec_manifest=spec,
                wm_root=wm_root,
                ws_root=ws_root,
                dry_run=bool(args.dry_run),
                generated_by=report["generated_by"],
            )
            report["results"].append(result)
        except Exception as exc:  # pragma: no cover - CLI path
            report["ok"] = False
            report["errors"].append(f"{donor}: {exc}")

    writes_json(wm_root / REPORT_PATH, report)
    print(json.dumps(report, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

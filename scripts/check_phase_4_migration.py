"""Phase 4 migration checker.

Runs the real migration command against each donor fixture and verifies:
- dry-run emits a report but no bundle
- write mode emits a canonical bundle and report
- replay mode is deterministic
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

from cleanup_runtime import env_run_root, prepare_phase_scratch, register_artifact, resolve_scratch_root, write_command_log

ROOT = Path(__file__).resolve().parent.parent
DRIVER = [
    "cargo",
    "run",
    "-p",
    "world-model-driver",
    "--",
]
REPORT_PATH = ROOT / "phase-4-migration-report.json"

RUNS = [
    ("mythforge", "adapters/mythforge/fixtures/import-input.json", "write"),
    ("mythforge", "adapters/mythforge/fixtures/import-input.json", "dry-run"),
    ("orbis", "adapters/orbis/fixtures/import-input.json", "write"),
    ("orbis", "adapters/orbis/fixtures/import-input.json", "dry-run"),
    ("adventure-generator", "adapters/adventure-generator/fixtures/import-input.json", "write"),
    ("adventure-generator", "adapters/adventure-generator/fixtures/import-input.json", "dry-run"),
    ("adventure-generator", "adapters/adventure-generator/fixtures/import-input.json", "replay"),
]


def _run(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        check=False,
    )


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _assert_report_shape(report: dict[str, Any]) -> list[str]:
    required = [
        "donor",
        "run_id",
        "mode",
        "input_fingerprint",
        "adapter_version",
        "started_at",
        "finished_at",
        "mapped_count",
        "dropped_count",
        "conflict_count",
        "quarantined_count",
        "issues",
        "provenance_refs",
        "output_bundle_path",
        "replay_equivalent",
        "snapshot_fingerprint",
        "manifest_path",
        "concept_map_path",
    ]
    errors = [f"missing report field `{field}`" for field in required if field not in report]
    if not isinstance(report.get("issues"), list):
        errors.append("report.issues must be a list")
    if not isinstance(report.get("provenance_refs"), list):
        errors.append("report.provenance_refs must be a list")
    return errors


def _walk_keys(value: Any) -> list[str]:
    if isinstance(value, dict):
        keys: list[str] = []
        for key, child in value.items():
            keys.append(str(key))
            keys.extend(_walk_keys(child))
        return keys
    if isinstance(value, list):
        keys: list[str] = []
        for item in value:
            keys.extend(_walk_keys(item))
        return keys
    return []


def _assert_normalized_bundle(donor: str, bundle: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    keys = _walk_keys(bundle)
    forbidden_keys = [key for key in keys if key.startswith("donor_") or key == "ui_tab"]
    if forbidden_keys:
        errors.append(f"{donor}: canonical bundle leaked donor-local keys {sorted(set(forbidden_keys))}")

    world = bundle.get("world")
    entities = bundle.get("entities", {})
    workflows = bundle.get("workflows", {})
    projections = bundle.get("projections", {})
    events = bundle.get("events", [])

    if donor == "mythforge":
        scopes = {
            entity.get("location_attachment", {}).get("spatial_scope")
            for entity in entities.values()
            if isinstance(entity, dict)
        }
        for scope in {"city", "region", "biome", "dungeon", "landmark"}:
            if scope not in scopes:
                errors.append(f"{donor}: missing normalized spatial scope `{scope}`")
        if not world:
            errors.append(f"{donor}: expected canonical world record")
        if not bundle.get("assets"):
            errors.append(f"{donor}: expected canonical asset records")
        if not projections:
            errors.append(f"{donor}: expected canonical projections")
    elif donor == "orbis":
        if not isinstance(world, dict):
            errors.append(f"{donor}: expected canonical world record")
        elif not isinstance(world.get("simulation_attachment"), dict):
            errors.append(f"{donor}: expected simulation attachment on world record")
        if entities:
            errors.append(f"{donor}: simulation-only donor should not emit canonical entities")
        if workflows:
            errors.append(f"{donor}: simulation-only donor should not emit canonical workflows")
        if not events:
            errors.append(f"{donor}: expected canonical event envelopes")
    elif donor == "adventure-generator":
        scopes = {
            entity.get("location_attachment", {}).get("spatial_scope")
            for entity in entities.values()
            if isinstance(entity, dict)
        }
        for scope in {"city", "dungeon"}:
            if scope not in scopes:
                errors.append(f"{donor}: missing normalized workflow location scope `{scope}`")
        if not workflows:
            errors.append(f"{donor}: expected canonical workflow records")
        if not projections:
            errors.append(f"{donor}: expected canonical projections")

    return errors


def _migrate(
    donor: str,
    input_path: Path,
    mode: str,
    tmp: Path,
    *,
    phase_root: Path | None,
) -> dict[str, Any]:
    report_path = tmp / f"{donor}-{mode}.json"
    output_path = tmp / f"{donor}-{mode}.bundle.json"
    command = DRIVER + [
        "migrate",
        "--donor",
        donor,
        "--input",
        str(input_path),
        "--report",
        str(report_path),
    ]
    if mode == "write" or mode == "replay":
        command += ["--output", str(output_path)]
    if mode == "dry-run":
        command.append("--dry-run")
    if mode == "replay":
        command.append("--replay")

    proc = _run(command)
    output = "\n".join(part for part in (proc.stdout.strip(), proc.stderr.strip()) if part).strip()
    write_command_log(f"{donor}-{mode}", output or f"{donor} {mode} completed", phase_root=phase_root)
    if proc.returncode != 0:
        raise RuntimeError(output or f"migration failed for {donor} {mode}")
    if not report_path.is_file():
        raise RuntimeError(f"missing migration report: {report_path.as_posix()}")

    report = _read_json(report_path)
    errors = _assert_report_shape(report)
    if errors:
        raise RuntimeError("; ".join(errors))

    if mode == "dry-run":
        if output_path.exists():
            raise RuntimeError("dry-run unexpectedly wrote a bundle")
    else:
        if not output_path.is_file():
            raise RuntimeError("migration did not write the canonical bundle")
        bundle = _read_json(output_path)
        errors = _assert_normalized_bundle(donor, bundle)
        if errors:
            raise RuntimeError("; ".join(errors))

    if mode == "replay":
        if report.get("replay_equivalent") is not True:
            raise RuntimeError("replay migration did not report deterministic equivalence")

    if mode == "write" and report.get("mapped_count", 0) <= 0:
        raise RuntimeError("write migration did not map any records")

    return {
        "donor": donor,
        "mode": mode,
        "ok": True,
        "report_path": report_path.as_posix(),
        "output_bundle_path": output_path.as_posix() if output_path.exists() else None,
        "mapped_count": report.get("mapped_count", 0),
        "dropped_count": report.get("dropped_count", 0),
        "conflict_count": report.get("conflict_count", 0),
        "replay_equivalent": report.get("replay_equivalent"),
    }


def check(*, scratch_root: Path | None = None, report_path: Path = REPORT_PATH) -> dict[str, Any]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    phase_root: Path | None = None
    temp_ctx = None
    if scratch_root is None and env_run_root() is not None:
        phase_root = prepare_phase_scratch("phase-4-migration")
        tmp = phase_root
    elif scratch_root is not None:
        phase_root = prepare_phase_scratch("phase-4-migration", scratch_root=scratch_root)
        tmp = phase_root
    else:
        temp_ctx = tempfile.TemporaryDirectory(prefix="phase4-migration-")
        tmp = Path(temp_ctx.__enter__())
    try:
        for donor, input_rel, mode in RUNS:
            try:
                results.append(_migrate(donor, ROOT / input_rel, mode, tmp, phase_root=phase_root))
            except Exception as exc:  # pragma: no cover - exercised in gate failures
                errors.append(f"{donor} {mode}: {exc}")
                results.append(
                    {
                        "donor": donor,
                        "mode": mode,
                        "ok": False,
                        "error": str(exc),
                    }
                )
    finally:
        if temp_ctx is not None:
            temp_ctx.__exit__(None, None, None)

    report = {
        "ok": not errors,
        "results": results,
        "errors": errors,
        "report_path": report_path.as_posix(),
    }
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    register_artifact(
        report_path,
        phase=4,
        kind="durable_report",
        created_by="check_phase_4_migration",
        preserve_on_success=True,
        preserve_on_failure=True,
    )
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Phase 4 migration checker")
    parser.add_argument("--scratch-root", help="Write phase-4 scratch outputs under this directory")
    parser.add_argument("--report-path", help="Override the durable phase-4 report path")
    args = parser.parse_args()

    report = check(
        scratch_root=resolve_scratch_root(args.scratch_root) if args.scratch_root else None,
        report_path=Path(args.report_path).resolve() if args.report_path else REPORT_PATH,
    )
    print(json.dumps(report, indent=2))
    return 0 if not report["errors"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

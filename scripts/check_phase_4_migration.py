"""Phase 4 migration checker.

Runs the real migration command against each donor fixture and verifies:
- dry-run emits a report but no bundle
- write mode emits a canonical bundle and report
- replay mode is deterministic
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

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


def _migrate(donor: str, input_path: Path, mode: str, tmp: Path) -> dict[str, Any]:
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


def main() -> int:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    with tempfile.TemporaryDirectory(prefix="phase4-migration-") as tmpdir:
        tmp = Path(tmpdir)
        for donor, input_rel, mode in RUNS:
            try:
                results.append(_migrate(donor, ROOT / input_rel, mode, tmp))
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

    report = {
        "ok": not errors,
        "results": results,
        "errors": errors,
        "report_path": REPORT_PATH.as_posix(),
    }
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())

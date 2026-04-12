"""Phase 6 release checker.

Validates the shipped app surface, release docs, and the hardening checks
that must pass before the project can be considered release-ready.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

from cleanup_runtime import env_run_root, prepare_phase_scratch, register_artifact, resolve_scratch_root, write_command_log


ROOT = Path(__file__).resolve().parent.parent
APP_ROOT = ROOT / "apps" / "unified-app"
REPORT_PATH = ROOT / "phase-6-release-report.json"

REQUIRED_DOCS = [
    ROOT / "docs" / "release" / "RELEASE_CRITERIA.md",
    ROOT / "docs" / "release" / "USER_GUIDE.md",
    ROOT / "docs" / "release" / "KNOWN_LIMITATIONS.md",
    ROOT / "docs" / "release" / "MAINTENANCE_PLAN.md",
    ROOT / "docs" / "release" / "CHANGELOG.md",
]

REQUIRED_APP_SCRIPTS = ["lint", "typecheck", "test", "build", "verify"]
NPM_BIN = "npm.cmd" if os.name == "nt" else "npm"

CHECK_COMMANDS = [
    ("app verify", [NPM_BIN, "run", "verify"], APP_ROOT),
    ("phase 2 integrity", [sys.executable, str(ROOT / "scripts" / "check_phase_2_snapshots.py")], ROOT),
    ("phase 4 migration", [sys.executable, str(ROOT / "scripts" / "check_phase_4_migration.py")], ROOT),
]


def _build_check_commands(phase_root: Path | None) -> list[tuple[str, list[str], Path]]:
    commands = list(CHECK_COMMANDS)
    if phase_root is not None:
        phase4_root = phase_root / "nested"
        commands = [
            (
                name,
                command + ["--scratch-root", str(phase4_root)] if name == "phase 4 migration" else command,
                cwd,
            )
            for name, command, cwd in commands
        ]
    return commands


def _run(command: list[str], cwd: Path, *, phase_root: Path | None, name: str) -> tuple[bool, str]:
    proc = subprocess.run(command, cwd=str(cwd), capture_output=True, text=True, check=False)
    output = "\n".join(part for part in (proc.stdout.strip(), proc.stderr.strip()) if part).strip()
    write_command_log(name, output or "ok", phase_root=phase_root)
    return proc.returncode == 0, output or "ok"


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _check_required_docs() -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    criteria = ROOT / "docs" / "release" / "RELEASE_CRITERIA.md"

    patterns = [
        (r"World.*Story.*Schema", "public taxonomy documented"),
        (r"legacy.*guided.*studio.*architect", "legacy aliases documented"),
        (r"npm run verify", "release verification command documented"),
        (r"check_phase_6_release\.py", "phase 6 checker documented"),
        (r"known limitations", "known limitations documented"),
        (r"maintenance plan", "maintenance plan documented"),
    ]
    if criteria.is_file():
        text = criteria.read_text(encoding="utf-8")
        for pattern, label in patterns:
            ok = re.search(pattern, text, flags=re.IGNORECASE) is not None
            results.append({"name": label, "ok": ok, "target": criteria.as_posix()})
            if not ok:
                errors.append(f"release criteria doc missing {label}")
    else:
        results.append({"name": "release criteria doc exists", "ok": False, "target": criteria.as_posix()})
        errors.append(f"missing release criteria doc: {criteria.as_posix()}")

    for doc in REQUIRED_DOCS:
        ok = doc.is_file()
        results.append({"name": f"doc exists: {doc.name}", "ok": ok, "target": doc.as_posix()})
        if not ok:
            errors.append(f"missing release doc: {doc.as_posix()}")

    return results, errors


def _check_package_scripts() -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    package_json = APP_ROOT / "package.json"
    if not package_json.is_file():
        return [{"name": "package.json exists", "ok": False, "target": package_json.as_posix()}], [
            f"missing app package.json: {package_json.as_posix()}"
        ]

    package = _read_json(package_json)
    scripts = package.get("scripts", {})
    if not isinstance(scripts, dict):
        return [{"name": "scripts object exists", "ok": False, "target": package_json.as_posix()}], [
            "app package.json scripts object is missing"
        ]

    for script in REQUIRED_APP_SCRIPTS:
        ok = script in scripts
        results.append({"name": f"npm script: {script}", "ok": ok, "target": package_json.as_posix()})
        if not ok:
            errors.append(f"app package.json missing script `{script}`")

    return results, errors


def _check_release_tests() -> tuple[list[dict[str, Any]], list[str]]:
    test_file = APP_ROOT / "tests" / "release-hardening.test.tsx"
    ok = test_file.is_file()
    return [{"name": "release hardening tests exist", "ok": ok, "target": test_file.as_posix()}], (
        [] if ok else [f"missing release hardening test file: {test_file.as_posix()}"]
    )


def check(*, scratch_root: Path | None = None, report_path: Path = REPORT_PATH) -> dict[str, Any]:
    report: dict[str, Any] = {
        "ok": True,
        "workspace_root": ROOT.as_posix(),
        "app_root": APP_ROOT.as_posix(),
        "checks": [],
        "errors": [],
    }
    phase_root: Path | None = None
    if scratch_root is None and env_run_root() is not None:
        phase_root = prepare_phase_scratch("phase-6-release")
    elif scratch_root is not None:
        phase_root = prepare_phase_scratch("phase-6-release", scratch_root=scratch_root)

    for collector in (_check_required_docs, _check_package_scripts, _check_release_tests):
        results, errors = collector()
        report["checks"].extend(results)
        if errors:
            report["ok"] = False
            report["errors"].extend(errors)

    for name, command, cwd in _build_check_commands(phase_root):
        ok, output = _run(command, cwd, phase_root=phase_root, name=name)
        report["checks"].append({"name": name, "ok": ok, "command": " ".join(command), "cwd": cwd.as_posix(), "output": output})
        if not ok:
            report["ok"] = False
            report["errors"].append(f"{name} failed: {output}")

    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Phase 6 release checker")
    parser.add_argument("--scratch-root", help="Write phase-6 scratch outputs under this directory")
    parser.add_argument("--report-path", help="Override the durable phase-6 report path")
    args = parser.parse_args()

    report_path = Path(args.report_path).resolve() if args.report_path else REPORT_PATH
    report = check(
        scratch_root=resolve_scratch_root(args.scratch_root) if args.scratch_root else None,
        report_path=report_path,
    )
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    register_artifact(
        report_path,
        phase=6,
        kind="durable_report",
        created_by="check_phase_6_release",
        preserve_on_success=True,
        preserve_on_failure=True,
    )
    print(json.dumps(report, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

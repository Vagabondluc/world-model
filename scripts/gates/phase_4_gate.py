"""Phase 4 gate: Snapshot-to-canonical migration."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

from .base import GateReport, Remediation

PHASE = 4
NAME = "Import Migration"
WM = "world-model"
_RERUN = f"python {WM}/scripts/run_harness.py --phase 4"
_BOOTSTRAP = f"python {WM}/scripts/run_harness.py --bootstrap --phase 4"
_PLAN = f"{WM}/docs/migration/MIGRATION_PLAN.md"
_MATRIX = f"{WM}/docs/testing/ADAPTER_TEST_MATRIX.md"
_SCRIPT = f"{WM}/scripts/check_phase_4_migration.py"
_REPORT = Path(WM) / "phase-4-migration-report.json"


def _run_migration_check() -> tuple[bool, str]:
    proc = subprocess.run(
        ["python", _SCRIPT],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    output = "\n".join(part for part in ((proc.stdout or "").strip(), (proc.stderr or "").strip()) if part).strip()
    if proc.returncode == 0:
        return True, output or "phase-4 migration checker passed"
    if _REPORT.is_file():
        try:
            payload = json.loads(_REPORT.read_text(encoding="utf-8"))
            errors = payload.get("errors", [])
            if errors:
                return False, str(errors[0])
        except Exception:
            pass
    return False, output or "phase-4 migration checker failed"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    r.assert_file(
        _PLAN,
        "4.1 migration plan doc exists",
        remediation=Remediation(
            action="create",
            target=_PLAN,
            rerun_cmd=_RERUN,
            notes=f"Quick scaffold: run `{_BOOTSTRAP}` to create a starter stub.",
        ),
    )
    r.assert_file_contains(
        _PLAN,
        r"canonical.*(bundle|state)|bundle.*canonical",
        "4.3 canonical bundle referenced as durable state",
        remediation=Remediation(
            action="edit",
            target=_PLAN,
            required_fields=["canonical bundle as durable state"],
            rerun_cmd=_RERUN,
            notes="Document that canonical bundles are the only durable post-migration state.",
        ),
    )
    r.assert_file_contains(
        _PLAN,
        r"rollback|non.destructive|quarantine",
        "4.4 rollback/non-destructive policy referenced",
        remediation=Remediation(
            action="edit",
            target=_PLAN,
            required_fields=["rollback", "quarantine"],
            rerun_cmd=_RERUN,
            notes="Add explicit rollback/quarantine behavior for failed migrations.",
        ),
    )
    r.assert_file_contains(
        _PLAN,
        r"audit|provenance",
        "4.5 audit/provenance referenced",
        remediation=Remediation(
            action="edit",
            target=_PLAN,
            required_fields=["audit trail", "provenance"],
            rerun_cmd=_RERUN,
            notes="Add a section on provenance retention and audit-trail output.",
        ),
    )
    r.assert_file_contains(
        _PLAN,
        r"import|replay",
        "4.1/4.2 import and replay referenced",
        remediation=Remediation(
            action="edit",
            target=_PLAN,
            required_fields=["import", "replay"],
            rerun_cmd=_RERUN,
            notes="Document both one-time import and deterministic replay migration.",
        ),
    )
    r.assert_file(
        _MATRIX,
        "4.x adapter test matrix exists",
    )
    r.assert_file(
        _SCRIPT,
        "4.x migration checker script exists",
    )
    r.assert_file_contains(
        f"{WM}/docs/harness_checks.md",
        r"run_harness\.py --phase 4",
        "4.x harness checks doc includes phase 4 command",
    )
    r.assert_file_contains(
        f"{WM}/crates/world-model-driver/src/main.rs",
        r"migrate_command|Some\(\"migrate\"\)",
        "4.x driver exposes migrate command",
    )
    r.assert_file_contains(
        f"{WM}/crates/world-model-adapters/src/migration.rs",
        r"MigrationRunner|AdapterReader|ConceptTranslator",
        "4.x migration pipeline modules exist",
    )

    ok, msg = _run_migration_check()
    if ok:
        r.ok("4.8 migration checker passes", msg)
    else:
        r.fail(
            "4.8 migration checker passes",
            msg,
            remediation=Remediation(
                action="run",
                target=f"python {_SCRIPT}",
                rerun_cmd=_RERUN,
                notes="Fix the failing donor migration or report contract issue, then rerun the harness.",
            ),
        )

    r.assert_file(
        _REPORT,
        "4.8 phase-4 migration report exists",
        remediation=Remediation(
            action="run",
            target=f"python {_SCRIPT}",
            rerun_cmd=_RERUN,
        ),
    )

    return r

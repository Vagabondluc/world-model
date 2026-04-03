"""Phase 4 gate: Import Migration.

Checks that a migration plan, audit trail, and error-handling policy exist,
and that the canonical state bridge is separated from donor imports.
"""
from __future__ import annotations
from .base import GateReport, Remediation

PHASE = 4
NAME = "Import Migration"
WM = "world-model"
_RERUN4 = f"python {WM}/scripts/run_harness.py --phase 4"
_BOOTSTRAP4 = f"python {WM}/scripts/run_harness.py --bootstrap --phase 4"
_PLAN = f"{WM}/docs/migration/MIGRATION_PLAN.md"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    # 4.1-4.2 Migration plan doc exists
    r.assert_file(
        f"{WM}/docs/migration/MIGRATION_PLAN.md",
        "4.1 Migration plan doc exists",
        remediation=Remediation(
            action="create",
            target=_PLAN,
            rerun_cmd=_RERUN4,
            notes=f"Quick scaffold: run `{_BOOTSTRAP4}` to create a starter stub.",
        ),
    )

    # 4.3 Reload path: canonical bundles are the only durable state
    r.assert_file_contains(
        _PLAN,
        r"canonical.*(bundle|state)|bundle.*canonical",
        "4.3 Canonical bundles referenced as durable state in migration plan",
        remediation=Remediation(
            action="edit",
            target=_PLAN,
            required_fields=["canonical bundles as durable state"],
            rerun_cmd=_RERUN4,
            notes='Add a section stating canonical bundles are the only durable state after migration.',
        ),
    )

    # 4.4 Error handling / rollback referenced
    r.assert_file_contains(
        _PLAN,
        r"rollback|non.destructive|quarantine",
        "4.4 Rollback / non-destructive error policy in migration plan",
        remediation=Remediation(
            action="edit",
            target=_PLAN,
            required_fields=["rollback policy", "non-destructive"],
            rerun_cmd=_RERUN4,
            notes='Add a section describing rollback/non-destructive error handling.  Example: "Failed migration is non-destructive. Partial writes are rolled back or quarantined."',
        ),
    )

    # 4.5 Audit trail / provenance referenced
    r.assert_file_contains(
        _PLAN,
        r"audit|provenance",
        "4.5 Audit trail / provenance referenced in migration plan",
        remediation=Remediation(
            action="edit",
            target=_PLAN,
            required_fields=["audit trail", "provenance"],
            rerun_cmd=_RERUN4,
            notes='Add a section on provenance retention and audit trail for imported bundles.',
        ),
    )

    # Adapter test matrix confirms round-trip testing exists
    r.assert_file(
        f"{WM}/docs/testing/ADAPTER_TEST_MATRIX.md",
        "4.x Adapter test matrix doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/testing/ADAPTER_TEST_MATRIX.md",
            rerun_cmd=_RERUN4,
            notes="Create a matrix doc listing each donor and its round-trip test status.",
        ),
    )

    return r

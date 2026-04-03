"""Phase 6 gate: Hardening & Release.

Checks that regression protection, release readiness, and maintenance plans
are in place before the project is declared released.
"""
from __future__ import annotations
from .base import GateReport, Remediation

PHASE = 6
NAME = "Hardening & Release"
WM = "world-model"
_RERUN6 = f"python {WM}/scripts/run_harness.py --phase 6"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    # 6.1 Regression hardening documented
    r.assert_file(f"{WM}/docs/roadmap/phase-6-hardening-release.md",
                  "6.1 Hardening roadmap doc exists")
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-6-hardening-release.md",
        r"regression|direct.import|schema.drift",
        "6.1 Regression protection checks defined",
    )

    # 6.2 Scale/performance acceptance referenced
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-6-hardening-release.md",
        r"scale|performance|large",
        "6.2 Scale / performance acceptance criteria defined",
    )

    # 6.4 Release readiness: release criteria doc is non-empty
    r.assert_file(f"{WM}/docs/release/RELEASE_CRITERIA.md",
                  "6.4 Release criteria doc exists")
    r.assert_file_contains(
        f"{WM}/docs/release/RELEASE_CRITERIA.md",
        r"\w",
        "6.4 Release criteria doc is non-empty",
    )

    # 6.5 Post-release maintenance / snapshot refresh plan referenced
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-6-hardening-release.md",
        r"snapshot.*refresh|maintenance.*plan|post.release",
        "6.5 Post-release maintenance / snapshot refresh plan referenced",
    )

    # Final testing artefacts
    r.assert_file(
        f"{WM}/docs/testing/ADAPTER_TEST_MATRIX.md",
        "6.x Adapter test matrix doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/testing/ADAPTER_TEST_MATRIX.md",
            rerun_cmd=_RERUN6,
        ),
    )
    r.assert_file(
        f"{WM}/docs/testing/TESTING_STRATEGY.md",
        "6.x Testing strategy doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/testing/TESTING_STRATEGY.md",
            rerun_cmd=_RERUN6,
        ),
    )

    return r

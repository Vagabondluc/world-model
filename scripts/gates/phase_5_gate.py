"""Phase 5 gate: MVP Flows.

Checks that beginner / studio / architect loops are documented and
release criteria are defined before MVP is declared complete.
"""
from __future__ import annotations
from .base import GateReport, Remediation

PHASE = 5
NAME = "MVP Flows"
WM = "world-model"
_RERUN5 = f"python {WM}/scripts/run_harness.py --phase 5"
_BOOTSTRAP5 = f"python {WM}/scripts/run_harness.py --bootstrap --phase 5"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    # 5.1 Beginner loop documented
    r.assert_file(
        f"{WM}/docs/roadmap/phase-5-mvp-flows.md",
        "5.x MVP flows roadmap doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/roadmap/phase-5-mvp-flows.md",
            rerun_cmd=_RERUN5,
            notes="Create the MVP flows doc covering beginner, studio, and architect loops.",
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-5-mvp-flows.md",
        r"beginner|guided|onboard",
        "5.1 Beginner / onboarding loop defined",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/phase-5-mvp-flows.md",
            required_fields=["beginner loop"],
            rerun_cmd=_RERUN5,
            notes='Add a section describing the beginner/guided/onboarding loop.',
        ),
    )

    # 5.2 Studio loop documented
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-5-mvp-flows.md",
        r"studio",
        "5.2 Studio loop defined",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/phase-5-mvp-flows.md",
            required_fields=["studio loop"],
            rerun_cmd=_RERUN5,
        ),
    )

    # 5.3 Architect loop documented
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-5-mvp-flows.md",
        r"architect",
        "5.3 Architect loop defined",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/phase-5-mvp-flows.md",
            required_fields=["architect loop"],
            rerun_cmd=_RERUN5,
        ),
    )

    # 5.4 MVP is scoped — not feature parity
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-5-mvp-flows.md",
        r"not.*parity|scope|MVP",
        "5.4 MVP scope statement (not full parity) present",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/phase-5-mvp-flows.md",
            required_fields=["scope statement"],
            rerun_cmd=_RERUN5,
            notes='Add a statement clarifying MVP scope (e.g. "MVP is not full feature parity").',
        ),
    )

    # Release criteria gate exists before MVP ships
    r.assert_file(
        f"{WM}/docs/release/RELEASE_CRITERIA.md",
        "5.5 Release criteria doc exists before MVP",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/release/RELEASE_CRITERIA.md",
            rerun_cmd=_RERUN5,
            notes=f"Quick scaffold: run `{_BOOTSTRAP5}` to create a stub.",
        ),
    )

    # Testing strategy must exist before MVP
    r.assert_file(
        f"{WM}/docs/testing/TESTING_STRATEGY.md",
        "5.5 Testing strategy doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/testing/TESTING_STRATEGY.md",
            rerun_cmd=_RERUN5,
            notes="Document unit, integration, and E2E testing strategy for the MVP.",
        ),
    )

    return r

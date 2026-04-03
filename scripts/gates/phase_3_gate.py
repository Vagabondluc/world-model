"""Phase 3 gate: Final App Scaffold.

Checks that the app scaffold is documented and its structure matches the layout plan.
Note: `apps/unified-app` lives outside world-model; we verify via docs.
"""
from __future__ import annotations
from .base import GateReport, Remediation

PHASE = 3
NAME = "Final App Scaffold"
WM = "world-model"
_RERUN3 = f"python {WM}/scripts/run_harness.py --phase 3"
_ARCH = f"{WM}/docs/architecture/FINAL_APP_ARCHITECTURE.md"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    # 3.1 App workspace scaffold documented
    r.assert_file(
        f"{WM}/docs/architecture/FINAL_APP_ARCHITECTURE.md",
        "3.1 Final app architecture doc exists",
        remediation=Remediation(
            action="create",
            target=_ARCH,
            rerun_cmd=_RERUN3,
            notes="Include apps/unified-app path, canonical state bridge, all three modes, and four shell panels.",
        ),
    )
    r.assert_file_contains(
        _ARCH,
        r"apps/unified-app",
        "3.1 `apps/unified-app` path declared in architecture doc",
        remediation=Remediation(
            action="edit",
            target=_ARCH,
            required_fields=["apps/unified-app"],
            rerun_cmd=_RERUN3,
        ),
    )

    # 3.2 Canonical state bridge referenced in architecture
    r.assert_file_contains(
        _ARCH,
        r"canonical.*(bundle|state|bridge)|state.*(bridge|canonical)",
        "3.2 Canonical state bridge referenced in architecture doc",
        remediation=Remediation(
            action="edit",
            target=_ARCH,
            required_fields=["canonical state bridge"],
            rerun_cmd=_RERUN3,
            notes="Add a section explaining the canonical state bridge separating UI from import layer.",
        ),
    )

    # 3.3-3.5 Modes: Guided / Studio / Architect declared
    for mode in ("Guided", "Studio", "Architect"):
        r.assert_file_contains(
            f"{WM}/docs/architecture/FINAL_APP_ARCHITECTURE.md",
            mode,
            f"3.x Mode `{mode}` declared in architecture doc",
        )

    # 3.6 Shell layout: all four panels referenced
    for panel in ("left nav", "top context", "center workspace", "right inspector"):
        r.assert_file_contains(
            f"{WM}/docs/architecture/FINAL_APP_ARCHITECTURE.md",
            panel.replace(" ", "[ _-]?"),
            f"3.6 Shell panel `{panel}` defined",
        )

    # Repository layout complements the scaffold
    r.assert_file(f"{WM}/docs/architecture/REPOSITORY_LAYOUT.md",
                  "3.x Repository layout doc exists")

    return r

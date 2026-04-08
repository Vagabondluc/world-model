"""Phase 7 gate: Donor UI Capture, Characterization, Rehost, and Conformance."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from .base import GateReport, Remediation

PHASE = 7
NAME = "Donor UI Conformance"
WM = "world-model"
_RERUN = f"python {WM}/scripts/run_harness.py --phase 7"
_BOOTSTRAP = f"python {WM}/scripts/run_harness.py --bootstrap --phase 7"
_CHECK_SCRIPT = f"{WM}/scripts/check_phase_7_donor_ui.py"
_REPORT = Path(WM) / "phase-7-donor-ui-report.json"
_PYTHON = sys.executable


def _run_donor_ui_check() -> tuple[bool, str]:
    proc = subprocess.run(
        [_PYTHON, _CHECK_SCRIPT],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    output = "\n".join(part for part in ((proc.stdout or "").strip(), (proc.stderr or "").strip()) if part).strip()
    if proc.returncode == 0:
        return True, output or "phase-7 donor-ui checker passed"
    if _REPORT.is_file():
        try:
            payload = json.loads(_REPORT.read_text(encoding="utf-8"))
            errors = payload.get("errors", [])
            if errors:
                return False, str(errors[0])
        except Exception:
            pass
    return False, output or "phase-7 donor-ui checker failed"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    r.assert_file(
        f"{WM}/docs/testing/DONOR_UI_AUDIT.md",
        "7.0 donor UI audit doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/testing/DONOR_UI_AUDIT.md",
            rerun_cmd=_RERUN,
            notes=f"Quick scaffold: run `{_BOOTSTRAP}` to create a starter stub.",
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/testing/DONOR_UI_AUDIT.md",
        r"app donor|fragment donor|semantic-only donor|behavioral capture|intent reconstruction|designed intent authoring",
        "7.0 donor classifications and methodologies are fixed",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/testing/DONOR_UI_AUDIT.md",
            required_fields=["donor classifications", "resolved methodologies"],
            rerun_cmd=_RERUN,
        ),
    )

    r.assert_file(
        f"{WM}/docs/testing/DONOR_CHARACTERIZATION_MATRIX.md",
        "7.1 characterization matrix exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/testing/DONOR_CHARACTERIZATION_MATRIX.md",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/testing/DONOR_CHARACTERIZATION_MATRIX.md",
        r"Basis|captured|reconstructed|designed",
        "7.1 characterization matrix includes basis tracking",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/testing/DONOR_CHARACTERIZATION_MATRIX.md",
            required_fields=["basis column"],
            rerun_cmd=_RERUN,
        ),
    )

    r.assert_file(
        f"{WM}/docs/testing/DONOR_UI_CONFORMANCE_MATRIX.md",
        "7.3 donor UI conformance matrix exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/testing/DONOR_UI_CONFORMANCE_MATRIX.md",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/testing/DONOR_UI_CONFORMANCE_MATRIX.md",
        r"Basis|biome|location family",
        "7.3 conformance matrix records basis and shared-concept round-trip rule",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/testing/DONOR_UI_CONFORMANCE_MATRIX.md",
            required_fields=["basis column", "shared-concept round-trip rule"],
            rerun_cmd=_RERUN,
        ),
    )

    r.assert_file(
        f"{WM}/tests/characterization/baselines.yaml",
        "7.x characterization baselines manifest exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/tests/characterization/baselines.yaml",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/tests/conformance/waivers.yaml",
        "7.x waiver manifest exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/tests/conformance/waivers.yaml",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/scripts/check_phase_7_donor_ui.py",
        "7.x donor UI checker exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/scripts/check_phase_7_donor_ui.py",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/apps/unified-app/tests/conformance/mythforge.conformance.test.tsx",
        "7.x donor conformance tests exist",
        remediation=Remediation(
            action="create",
            target=f"{WM}/apps/unified-app/tests/conformance/mythforge.conformance.test.tsx",
            rerun_cmd=_RERUN,
        ),
    )

    ok, msg = _run_donor_ui_check()
    if ok:
        r.ok("7.10 donor UI checker passes", msg)
    else:
        r.fail(
            "7.10 donor UI checker passes",
            msg,
            remediation=Remediation(
                action="run",
                target=f"python {_CHECK_SCRIPT}",
                rerun_cmd=_RERUN,
                notes="Fix the failing donor docs, manifests, routes, characterization suite, or conformance suite, then rerun the harness.",
            ),
        )

    r.assert_file(
        _REPORT,
        "7.10 phase-7 donor UI report exists",
        remediation=Remediation(
            action="run",
            target=f"python {_CHECK_SCRIPT}",
            rerun_cmd=_RERUN,
        ),
    )
    return r

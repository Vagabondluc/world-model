"""Phase 9 gate: Exhaustive donor-ui representation and canonical folding."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from .base import GateReport, Remediation

PHASE = 9
NAME = "Exhaustive Donor UI"
WM = "world-model"
_RERUN = f"python {WM}/scripts/run_harness.py --phase 9"
_COMPLETENESS_SCRIPT = f"{WM}/scripts/check_phase_9_exhaustive_donors.py"
_EXACTNESS_SCRIPT = f"{WM}/scripts/check_phase_9_exact_donor_ui.py"
_REHOST_MATRIX_SCRIPT = f"{WM}/scripts/check_phase_9_rehost_matrix.py"
_COMPLETENESS_REPORT = Path(WM) / "phase-9-donor-completeness-report.json"
_EXACTNESS_REPORT = Path(WM) / "phase-9-exact-donor-ui-report.json"
_REHOST_MATRIX_REPORT = Path(WM) / "phase-9-rehost-matrix-report.json"
_PYTHON = sys.executable


def _run_phase9_check(script: str, report_path: Path, fallback: str) -> tuple[bool, str]:
    proc = subprocess.run(
        [_PYTHON, script],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    output = "\n".join(part for part in ((proc.stdout or "").strip(), (proc.stderr or "").strip()) if part).strip()
    if proc.returncode == 0:
        return True, output or f"{fallback} passed"
    if report_path.is_file():
        try:
            payload = json.loads(report_path.read_text(encoding="utf-8"))
            errors = payload.get("errors", [])
            if errors:
                return False, str(errors[0])
        except Exception:
            pass
    return False, output or f"{fallback} failed"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    r.assert_file(
        f"{WM}/docs/roadmap/phase-9-exhaustive-donor-ui.md",
        "9.0 phase-9 roadmap doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/roadmap/phase-9-exhaustive-donor-ui.md",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-9-exhaustive-donor-ui.md",
        r"mythforge|orbis|adventure-generator|mappa-imperium|dawn-of-worlds|faction-image|watabou-city|encounter-balancer",
        "9.0 phase-9 roadmap names all donor groups",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/phase-9-exhaustive-donor-ui.md",
            required_fields=["full donor set", "phase-9 gate", "canonical folding"],
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/scripts/check_phase_9_exhaustive_donors.py",
        "9.10 phase-9 inventory checker exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/scripts/check_phase_9_exhaustive_donors.py",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/scripts/check_phase_9_exact_donor_ui.py",
        "9.11 phase-9 exact donor-ui checker exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/scripts/check_phase_9_exact_donor_ui.py",
            rerun_cmd=_RERUN,
        ),
    )

    ok, msg = _run_phase9_check(_COMPLETENESS_SCRIPT, _COMPLETENESS_REPORT, "phase-9 inventory checker")
    if ok:
        r.ok("9.10 phase-9 inventory checker passes", msg)
    else:
        r.fail(
            "9.10 phase-9 inventory checker passes",
            msg,
            remediation=Remediation(
                action="run",
                target=f"python {_COMPLETENESS_SCRIPT}",
                rerun_cmd=_RERUN,
                notes="Fix donor inventory coverage/docs/scripts/tests and rerun phase 9.",
            ),
        )

    exact_ok, exact_msg = _run_phase9_check(_EXACTNESS_SCRIPT, _EXACTNESS_REPORT, "phase-9 exact donor-ui checker")
    if exact_ok:
        r.ok("9.11 phase-9 exact donor-ui checker passes", exact_msg)
    else:
        r.fail(
            "9.11 phase-9 exact donor-ui checker passes",
            exact_msg,
            remediation=Remediation(
                action="run",
                target=f"python {_EXACTNESS_SCRIPT}",
                rerun_cmd=_RERUN,
                notes="Vendor/mount app-donor subapps, add canonical bridges, and replace placeholder conformance before rerunning phase 9.",
            ),
        )

    matrix_ok, matrix_msg = _run_phase9_check(_REHOST_MATRIX_SCRIPT, _REHOST_MATRIX_REPORT, "phase-9 rehost matrix")
    if matrix_ok:
        r.ok("9.12 phase-9 rehost matrix checker passes", matrix_msg)
    else:
        r.fail(
            "9.12 phase-9 rehost matrix checker passes",
            matrix_msg,
            remediation=Remediation(
                action="run",
                target=f"python {_REHOST_MATRIX_SCRIPT}",
                rerun_cmd=_RERUN,
                notes="Use the rehost matrix to see which donor columns are still source-vendored, scaffold-mounted, bridge-missing, or parity-incomplete.",
            ),
        )

    r.assert_file(
        _COMPLETENESS_REPORT,
        "9.10 phase-9 donor inventory completeness report exists",
        remediation=Remediation(
            action="run",
            target=f"python {_COMPLETENESS_SCRIPT}",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        _EXACTNESS_REPORT,
        "9.11 phase-9 exact donor-ui report exists",
        remediation=Remediation(
            action="run",
            target=f"python {_EXACTNESS_SCRIPT}",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        _REHOST_MATRIX_REPORT,
        "9.12 phase-9 rehost matrix report exists",
        remediation=Remediation(
            action="run",
            target=f"python {_REHOST_MATRIX_SCRIPT}",
            rerun_cmd=_RERUN,
        ),
    )
    return r

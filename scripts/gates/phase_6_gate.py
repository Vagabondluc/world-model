"""Phase 6 gate: Hardening & Release.

Checks that regression protection, release readiness, and maintenance plans
are executable before the project is declared release-ready.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from .base import GateReport, Remediation

PHASE = 6
NAME = "Hardening & Release"
WM = "world-model"
_RERUN = f"python {WM}/scripts/run_harness.py --phase 6"
_BOOTSTRAP = f"python {WM}/scripts/run_harness.py --bootstrap --phase 6"
_CHECK_SCRIPT = f"{WM}/scripts/check_phase_6_release.py"
_REPORT = Path(WM) / "phase-6-release-report.json"
_PYTHON = sys.executable


def _run_release_check() -> tuple[bool, str]:
    proc = subprocess.run(
        [_PYTHON, _CHECK_SCRIPT],
        capture_output=True,
        text=True,
        check=False,
    )
    output = "\n".join(part for part in (proc.stdout.strip(), proc.stderr.strip()) if part).strip()
    if proc.returncode == 0:
        return True, output or "phase-6 release checker passed"
    if _REPORT.is_file():
        try:
            payload = json.loads(_REPORT.read_text(encoding="utf-8"))
            errors = payload.get("errors", [])
            if errors:
                return False, str(errors[0])
        except Exception:
            pass
    return False, output or "phase-6 release checker failed"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    # 6.1 Regression hardening documented and executable
    r.assert_file(
        f"{WM}/docs/roadmap/phase-6-hardening-release.md",
        "6.1 Hardening roadmap doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/roadmap/phase-6-hardening-release.md",
            rerun_cmd=_RERUN,
            notes=f"Quick scaffold: run `{_BOOTSTRAP}` to create a starter stub.",
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-6-hardening-release.md",
        r"regression|direct.import|schema.drift",
        "6.1 Regression protection checks defined",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/phase-6-hardening-release.md",
            required_fields=["regression protection"],
            rerun_cmd=_RERUN,
            notes="Document donor-import, schema drift, adapter mapping drift, and snapshot/replay checks.",
        ),
    )

    # 6.2 Scale/performance acceptance referenced
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-6-hardening-release.md",
        r"scale|performance|large",
        "6.2 Scale / performance acceptance criteria defined",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/phase-6-hardening-release.md",
            required_fields=["scale and performance"],
            rerun_cmd=_RERUN,
        ),
    )

    # 6.3 Accessibility and keyboard safety referenced
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-6-hardening-release.md",
        r"keyboard|focus|accessible",
        "6.3 Accessibility and keyboard safety criteria defined",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/phase-6-hardening-release.md",
            required_fields=["accessibility and keyboard safety"],
            rerun_cmd=_RERUN,
        ),
    )

    # 6.4 Release readiness: release criteria and supporting docs
    r.assert_file(
        f"{WM}/docs/release/RELEASE_CRITERIA.md",
        "6.4 Release criteria doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/release/RELEASE_CRITERIA.md",
            rerun_cmd=_RERUN,
            notes="Populate the release checklist with the shipped taxonomy, commands, and exit criteria.",
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/release/RELEASE_CRITERIA.md",
        r"World.*Story.*Schema|legacy.*guided.*studio.*architect|npm run verify",
        "6.4 Release criteria doc matches shipped app surface",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/release/RELEASE_CRITERIA.md",
            required_fields=["World / Story / Schema", "legacy aliases", "npm run verify"],
            rerun_cmd=_RERUN,
            notes="Align release criteria with the Phase 5 public taxonomy and verification commands.",
        ),
    )
    for doc in [
        f"{WM}/docs/release/USER_GUIDE.md",
        f"{WM}/docs/release/KNOWN_LIMITATIONS.md",
        f"{WM}/docs/release/MAINTENANCE_PLAN.md",
        f"{WM}/docs/release/CHANGELOG.md",
    ]:
        r.assert_file(
            doc,
            f"6.4 release doc exists: {Path(doc).name}",
            remediation=Remediation(
                action="create",
                target=doc,
                rerun_cmd=_RERUN,
            ),
        )

    # 6.5 Post-release maintenance / snapshot refresh plan referenced
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-6-hardening-release.md",
        r"snapshot.*refresh|maintenance.*plan|post.release",
        "6.5 Post-release maintenance / snapshot refresh plan referenced",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/phase-6-hardening-release.md",
            required_fields=["post-release maintenance plan"],
            rerun_cmd=_RERUN,
        ),
    )

    # Final testing artefacts
    r.assert_file(
        f"{WM}/docs/testing/ADAPTER_TEST_MATRIX.md",
        "6.x Adapter test matrix doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/testing/ADAPTER_TEST_MATRIX.md",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/docs/testing/TESTING_STRATEGY.md",
        "6.x Testing strategy doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/testing/TESTING_STRATEGY.md",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/harness_checks.md",
        r"run_harness\.py --phase 6|check_phase_6_release\.py|npm run verify",
        "6.x harness checks doc includes phase 6 release commands",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/harness_checks.md",
            required_fields=["phase 6 release commands"],
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/roadmap/support/TEST_HARNESS_MATRIX.md",
        r"test_release_shell_controls_are_keyboard_reachable|test_large_bundle_roundtrip_performance|test_release_checklist",
        "6.x test harness matrix references release-hardening tests",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/support/TEST_HARNESS_MATRIX.md",
            required_fields=["release-hardening tests"],
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/apps/unified-app/tests/release-hardening.test.tsx",
        "6.x release hardening app tests exist",
        remediation=Remediation(
            action="create",
            target=f"{WM}/apps/unified-app/tests/release-hardening.test.tsx",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/scripts/check_phase_6_release.py",
        "6.x release checker script exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/scripts/check_phase_6_release.py",
            rerun_cmd=_RERUN,
        ),
    )

    ok, msg = _run_release_check()
    if ok:
        r.ok("6.6 release checker passes", msg)
    else:
        r.fail(
            "6.6 release checker passes",
            msg,
            remediation=Remediation(
                action="run",
                target=f"python {_CHECK_SCRIPT}",
                rerun_cmd=_RERUN,
                notes="Fix the failing release doc, app verification, or integrity check, then rerun the harness.",
            ),
        )

    r.assert_file(
        _REPORT,
        "6.6 phase-6 release report exists",
        remediation=Remediation(
            action="run",
            target=f"python {_CHECK_SCRIPT}",
            rerun_cmd=_RERUN,
        ),
    )

    return r

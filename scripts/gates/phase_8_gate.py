"""Phase 8 gate: Unified Product Surface and Cross-Donor Integration."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from .base import GateReport, Remediation

PHASE = 8
NAME = "Unified Product Surface"
WM = "world-model"
_RERUN = f"python {WM}/scripts/run_harness.py --phase 8"
_BOOTSTRAP = f"python {WM}/scripts/run_harness.py --bootstrap --phase 8"
_CHECK_SCRIPT = f"{WM}/scripts/check_phase_8_integration.py"
_REPORT = Path(WM) / "phase-8-integration-report.json"
_PYTHON = sys.executable


def _run_integration_check() -> tuple[bool, str]:
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
        return True, output or "phase-8 integration checker passed"
    if _REPORT.is_file():
        try:
            payload = json.loads(_REPORT.read_text(encoding="utf-8"))
            errors = payload.get("errors", [])
            if errors:
                return False, str(errors[0])
        except Exception:
            pass
    return False, output or "phase-8 integration checker failed"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    r.assert_file(
        f"{WM}/docs/roadmap/phase-8-unified-product-surface.md",
        "8.1 Phase 8 roadmap doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/roadmap/phase-8-unified-product-surface.md",
            rerun_cmd=_RERUN,
            notes=f"Quick scaffold: run `{_BOOTSTRAP}` to create a starter stub.",
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-8-unified-product-surface.md",
        r"canonical bundle|World.*Story.*Schema|lens switch|shared canonical concept",
        "8.1 Phase 8 roadmap defines the unified product surface and shared concept lensing",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/roadmap/phase-8-unified-product-surface.md",
            required_fields=["canonical bundle routing", "shared concept lensing", "cross-donor journeys"],
            rerun_cmd=_RERUN,
        ),
    )

    r.assert_file(
        f"{WM}/docs/architecture/UNIFIED_PRODUCT_DESIGN.md",
        "8.4 Unified product design doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/architecture/UNIFIED_PRODUCT_DESIGN.md",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/architecture/UNIFIED_PRODUCT_DESIGN.md",
        r"surface-contract\.ts|product language|donor-faithful|\/compare|\/world",
        "8.4 Unified product design doc records the product/donor boundary",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/architecture/UNIFIED_PRODUCT_DESIGN.md",
            required_fields=["code-side boundary", "product language", "donor-faithful surfaces"],
            rerun_cmd=_RERUN,
        ),
    )

    r.assert_file(
        f"{WM}/docs/testing/CROSS_DONOR_INTEGRATION_MATRIX.md",
        "8.2 Cross-donor integration matrix exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/testing/CROSS_DONOR_INTEGRATION_MATRIX.md",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/testing/CROSS_DONOR_INTEGRATION_MATRIX.md",
        r"basis|biome-location|entities|workflows|simulation-events|projections|attachments|lens switch",
        "8.2 Cross-donor integration matrix records the shared concept families and lens switch",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/testing/CROSS_DONOR_INTEGRATION_MATRIX.md",
            required_fields=["basis column", "shared concept families", "lens-switch smoke"],
            rerun_cmd=_RERUN,
        ),
    )

    r.assert_file(
        f"{WM}/scripts/check_phase_8_integration.py",
        "8.x phase 8 checker script exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/scripts/check_phase_8_integration.py",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/apps/unified-app/src/product/surface-contract.ts",
        "8.x product surface contract exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/apps/unified-app/src/product/surface-contract.ts",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/apps/unified-app/tests/integration/lens-switch.smoke.test.tsx",
        "8.x lens-switch smoke test exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/apps/unified-app/tests/integration/lens-switch.smoke.test.tsx",
            rerun_cmd=_RERUN,
        ),
    )

    ok, msg = _run_integration_check()
    if ok:
        r.ok("8.10 phase-8 integration checker passes", msg)
    else:
        r.fail(
            "8.10 phase-8 integration checker passes",
            msg,
            remediation=Remediation(
                action="run",
                target=f"python {_CHECK_SCRIPT}",
                rerun_cmd=_RERUN,
                notes="Fix the missing product docs, shared concept matrix, tests, or route boundary, then rerun the harness.",
            ),
        )

    r.assert_file(
        _REPORT,
        "8.10 phase-8 integration report exists",
        remediation=Remediation(
            action="run",
            target=f"python {_CHECK_SCRIPT}",
            rerun_cmd=_RERUN,
        ),
    )

    return r

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(ROOT / "scripts") not in sys.path:
    sys.path.insert(0, str(ROOT / "scripts"))

import check_phase_8_integration as phase8_check  # noqa: E402
from gates import phase_8_gate  # noqa: E402


def _find_check(report, name: str):
    for check in report.checks:
        if check.name == name:
            return check
    raise AssertionError(f"missing check {name}")


class Phase8ScopeTests(unittest.TestCase):
    def test_checker_covers_journeys_lens_switch_and_round_trip_commands(self) -> None:
        scripts = set(phase8_check.REQUIRED_APP_SCRIPTS)
        self.assertIn("test:integration:journeys", scripts)
        self.assertIn("test:integration:lens-switch", scripts)
        self.assertIn("test:integration:round-trip", scripts)

    def test_shared_concept_matrix_lists_the_explicit_families(self) -> None:
        matrix = (ROOT / "docs" / "testing" / "CROSS_DONOR_INTEGRATION_MATRIX.md").read_text(encoding="utf-8")
        for family in [
            "biome-location",
            "entities",
            "workflows",
            "simulation-events",
            "projections",
            "attachments",
        ]:
            self.assertIn(family, matrix)
        self.assertIn("basis", matrix.lower())
        self.assertIn("lens-switch smoke", matrix.lower())

    def test_unified_product_design_names_the_code_side_boundary(self) -> None:
        design = (ROOT / "docs" / "architecture" / "UNIFIED_PRODUCT_DESIGN.md").read_text(encoding="utf-8")
        self.assertIn("surface-contract.ts", design)
        self.assertIn("canonical-bundle-aware landing page", design)
        self.assertIn("donor-faithful", design)

    def test_gate_routes_checker_failures_to_remediation(self) -> None:
        with mock.patch("gates.phase_8_gate._run_integration_check", return_value=(False, "integration failed")):
            report = phase_8_gate.run()

        check = _find_check(report, "8.10 phase-8 integration checker passes")
        self.assertFalse(check.passed)
        self.assertIsNotNone(check.remediation)
        self.assertIn("check_phase_8_integration.py", check.remediation.target)
        self.assertIn("run_harness.py --phase 8", check.remediation.rerun_cmd)

    def test_checker_writes_report_with_explicit_scratch_root(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            scratch = Path(tmp)
            report_path = scratch / "report.json"

            report = phase8_check.check(scratch_root=scratch, report_path=report_path)

            self.assertIsInstance(report["checks"], list)
            self.assertGreaterEqual(len(report["checks"]), 1)


if __name__ == "__main__":
    unittest.main()

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

import check_phase_7_donor_ui as phase7_check  # noqa: E402
from gates import phase_7_gate  # noqa: E402


def _find_check(report, name: str):
    for check in report.checks:
        if check.name == name:
            return check
    raise AssertionError(f"missing check {name}")


class Phase7ScopeTests(unittest.TestCase):
    def test_checker_covers_characterization_and_conformance_commands(self) -> None:
        commands = {name for name, _, _ in phase7_check.CHECK_COMMANDS}
        self.assertEqual(commands, {"donor characterization", "donor conformance"})

    def test_required_scripts_cover_all_donor_commands(self) -> None:
        scripts = set(phase7_check.REQUIRED_APP_SCRIPTS)
        self.assertIn("test:characterize:mythforge", scripts)
        self.assertIn("test:characterize:orbis", scripts)
        self.assertIn("test:characterize:adventure", scripts)
        self.assertIn("test:conformance", scripts)

    def test_baseline_manifest_registers_basis_values(self) -> None:
        baselines = (ROOT / "tests" / "characterization" / "baselines.yaml").read_text(encoding="utf-8")
        self.assertIn("basis: captured", baselines)
        self.assertIn("basis: designed", baselines)
        self.assertIn("basis: reconstructed", baselines)

    def test_conformance_matrix_mentions_basis_and_biome_roundtrip(self) -> None:
        matrix = (ROOT / "docs" / "testing" / "DONOR_UI_CONFORMANCE_MATRIX.md").read_text(encoding="utf-8")
        self.assertIn("Basis", matrix)
        self.assertRegex(matrix.lower(), r"biome|location family")

    def test_gate_routes_checker_failures_to_remediation(self) -> None:
        with mock.patch("gates.phase_7_gate._run_donor_ui_check", return_value=(False, "donor conformance failed")):
            report = phase_7_gate.run()

        check = _find_check(report, "7.10 donor UI checker passes")
        self.assertFalse(check.passed)
        self.assertIsNotNone(check.remediation)
        self.assertIn("check_phase_7_donor_ui.py", check.remediation.target)
        self.assertIn("run_harness.py --phase 7", check.remediation.rerun_cmd)

    def test_checker_writes_report_with_explicit_scratch_root(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            scratch = Path(tmp)
            report_path = scratch / "report.json"

            report = phase7_check.check(scratch_root=scratch, report_path=report_path)

            self.assertIsInstance(report["checks"], list)
            self.assertGreaterEqual(len(report["checks"]), 1)


if __name__ == "__main__":
    unittest.main()

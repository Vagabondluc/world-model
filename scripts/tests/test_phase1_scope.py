from __future__ import annotations

import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(ROOT / "scripts") not in sys.path:
    sys.path.insert(0, str(ROOT / "scripts"))

from gates import phase_1_contracts, phase_1_gate  # noqa: E402


def _find_check(report, name: str):
    for check in report.checks:
        if check.name == name:
            return check
    raise AssertionError(f"missing check {name}")


class Phase1ScopeTests(unittest.TestCase):
    def test_baseline_report_text_contains_phase1_scope_sources(self) -> None:
        report = phase_1_contracts.baseline_report_text()

        self.assertIn("# Phase 1 Baseline Report", report)
        self.assertIn("Source of truth:", report)
        self.assertIn("`contracts/json-schema/`", report)
        self.assertIn("`contracts/promoted-schema/`", report)
        self.assertIn("- `WorldRecord`", report)
        self.assertIn("- `WorldCommandRequest`", report)
        self.assertIn("- `cargo test -p world-model-core`", report)
        self.assertIn(
            "- `cargo run -p world-model-specs --bin export-promoted-schemas --quiet`",
            report,
        )

    def test_phase1_gate_routes_export_failures_to_contract_check_script(self) -> None:
        failing_export_check = phase_1_contracts.CommandCheck(
            name="promoted export deterministic",
            command=("cargo", "run", "-p", "world-model-specs"),
            passed=False,
            message="content differs: promoted-concepts.json",
        )

        with mock.patch(
            "gates.phase_1_gate.check_phase_1_semantics",
            return_value=[failing_export_check],
        ):
            gate_report = phase_1_gate.run()

        check = _find_check(gate_report, "promoted export deterministic")
        self.assertFalse(check.passed)
        self.assertIsNotNone(check.remediation)
        self.assertEqual(check.remediation.action, "run")
        self.assertEqual(
            check.remediation.target,
            "python world-model/scripts/check_phase_1_contracts.py",
        )
        self.assertEqual(
            check.remediation.rerun_cmd,
            "python world-model/scripts/check_phase_1_contracts.py",
        )

    def test_phase1_gate_routes_non_export_failures_to_original_command(self) -> None:
        failing_test_check = phase_1_contracts.CommandCheck(
            name="cargo test -p world-model-core",
            command=("cargo", "test", "-p", "world-model-core"),
            passed=False,
            message="test failed",
        )

        with mock.patch(
            "gates.phase_1_gate.check_phase_1_semantics",
            return_value=[failing_test_check],
        ):
            gate_report = phase_1_gate.run()

        check = _find_check(gate_report, "cargo test -p world-model-core")
        self.assertFalse(check.passed)
        self.assertIsNotNone(check.remediation)
        self.assertEqual(check.remediation.target, "cargo test -p world-model-core")

    def test_phase1_gate_records_passing_semantic_checks(self) -> None:
        passing_check = phase_1_contracts.CommandCheck(
            name="promoted exporters agree",
            command=("cargo", "run", "-p", "world-model-specs"),
            passed=True,
            message="both exporters produce identical promoted-schema outputs",
        )

        with mock.patch(
            "gates.phase_1_gate.check_phase_1_semantics",
            return_value=[passing_check],
        ):
            gate_report = phase_1_gate.run()

        check = _find_check(gate_report, "promoted exporters agree")
        self.assertTrue(check.passed)
        self.assertIn("identical promoted-schema outputs", check.message)


if __name__ == "__main__":
    unittest.main()

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

import check_phase_6_release as phase6_check  # noqa: E402
from gates import phase_6_gate  # noqa: E402


def _find_check(report, name: str):
    for check in report.checks:
        if check.name == name:
            return check
    raise AssertionError(f"missing check {name}")


class Phase6ScopeTests(unittest.TestCase):
    def test_checker_covers_app_verify_phase2_and_phase4_commands(self) -> None:
        commands = {name for name, _, _ in phase6_check.CHECK_COMMANDS}
        self.assertEqual(commands, {"app verify", "phase 2 integrity", "phase 4 migration"})

    def test_checker_propagates_scratch_root_to_phase4_command(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            commands = phase6_check._build_check_commands(Path(tmp))

        phase4_command = next(command for name, command, _ in commands if name == "phase 4 migration")
        self.assertIn("--scratch-root", phase4_command)

    def test_checker_requires_release_docs_and_tests(self) -> None:
        docs = {doc.name for doc in phase6_check.REQUIRED_DOCS}
        self.assertIn("RELEASE_CRITERIA.md", docs)
        self.assertIn("USER_GUIDE.md", docs)
        self.assertIn("KNOWN_LIMITATIONS.md", docs)
        self.assertIn("MAINTENANCE_PLAN.md", docs)
        self.assertIn("CHANGELOG.md", docs)

    def test_release_criteria_mentions_the_shipped_taxonomy(self) -> None:
        criteria = (ROOT / "docs" / "release" / "RELEASE_CRITERIA.md").read_text(encoding="utf-8")
        self.assertIn("World", criteria)
        self.assertIn("Story", criteria)
        self.assertIn("Schema", criteria)
        self.assertIn("guided", criteria.lower())
        self.assertIn("npm run verify", criteria)

    def test_gate_routes_release_checker_failures_to_remediation(self) -> None:
        with mock.patch("gates.phase_6_gate._run_release_check", return_value=(False, "app verify failed")):
            report = phase_6_gate.run()

        check = _find_check(report, "6.6 release checker passes")
        self.assertFalse(check.passed)
        self.assertIsNotNone(check.remediation)
        self.assertIn("check_phase_6_release.py", check.remediation.target)
        self.assertIn("run_harness.py --phase 6", check.remediation.rerun_cmd)


if __name__ == "__main__":
    unittest.main()

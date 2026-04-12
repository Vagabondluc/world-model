from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(ROOT / "scripts") not in sys.path:
    sys.path.insert(0, str(ROOT / "scripts"))

import cleanup_runtime  # noqa: E402
import run_harness  # noqa: E402
from gates.base import GateReport  # noqa: E402


def _passing_gate(phase: int):
    def run():
        report = GateReport(phase, f"Phase {phase}")
        report.ok("pass", "ok")
        return report

    return SimpleNamespace(PHASE=phase, run=run)


def _failing_gate(phase: int):
    def run():
        report = GateReport(phase, f"Phase {phase}")
        report.fail("fail", "broken")
        return report

    return SimpleNamespace(PHASE=phase, run=run)


class HarnessCleanupTests(unittest.TestCase):
    def test_cleanup_only_removes_stale_runs_and_preserves_reports(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            scratch = root / "scratch"
            old_run = scratch / "runs" / "run-old"
            old_run.mkdir(parents=True)
            (old_run / "artifact.txt").write_text("temp", encoding="utf-8")
            checklist = root / "phase-checklist.json"
            checklist.write_text("{}", encoding="utf-8")

            argv = ["run_harness.py", "--cleanup-only", "--scratch-root", str(scratch)]
            with mock.patch.object(sys, "argv", argv), \
                mock.patch.object(cleanup_runtime, "WORLD_MODEL_ROOT", root), \
                mock.patch.object(cleanup_runtime, "DURABLE_REPORTS", [checklist]), \
                mock.patch.object(cleanup_runtime, "SAFE_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "BALANCED_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "AGGRESSIVE_STATIC_CLEANUP", []):
                code = run_harness.main()

            self.assertEqual(code, 0)
            self.assertFalse(old_run.exists())
            self.assertTrue(checklist.exists())

    def test_cleanup_summary_is_saved_for_successful_runs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            scratch = root / "scratch"
            checklist = root / "phase-checklist.json"
            captured: dict[str, object] = {}

            def save_stub(reports, cleanup_summary=None):
                captured["reports"] = reports
                captured["cleanup_summary"] = cleanup_summary

            argv = ["run_harness.py", "--phase", "0", "--cleanup", "--scratch-root", str(scratch)]
            with mock.patch.object(sys, "argv", argv), \
                mock.patch.object(run_harness, "ALL_GATES", [_passing_gate(0)] * 7), \
                mock.patch.object(run_harness._checklist, "save", side_effect=save_stub), \
                mock.patch.object(run_harness._checklist, "print_summary"), \
                mock.patch.object(run_harness._checklist, "CHECKLIST_PATH", checklist.as_posix()), \
                mock.patch.object(run_harness, "_CHECKLIST_PATH", checklist), \
                mock.patch.object(cleanup_runtime, "WORLD_MODEL_ROOT", root), \
                mock.patch.object(cleanup_runtime, "DURABLE_REPORTS", [checklist]), \
                mock.patch.object(cleanup_runtime, "SAFE_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "BALANCED_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "AGGRESSIVE_STATIC_CLEANUP", []):
                code = run_harness.main()

            self.assertEqual(code, 0)
            self.assertTrue(captured["cleanup_summary"]["requested"])
            self.assertFalse((scratch / "runs").exists())

    def test_failed_runs_keep_current_run_root_for_diagnostics(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            scratch = root / "scratch"
            checklist = root / "phase-checklist.json"

            argv = ["run_harness.py", "--phase", "0", "--cleanup", "--scratch-root", str(scratch)]
            with mock.patch.object(sys, "argv", argv), \
                mock.patch.object(run_harness, "ALL_GATES", [_failing_gate(0)] * 7), \
                mock.patch.object(run_harness._checklist, "save"), \
                mock.patch.object(run_harness._checklist, "print_summary"), \
                mock.patch.object(run_harness._checklist, "CHECKLIST_PATH", checklist.as_posix()), \
                mock.patch.object(run_harness, "_CHECKLIST_PATH", checklist), \
                mock.patch.object(cleanup_runtime, "WORLD_MODEL_ROOT", root), \
                mock.patch.object(cleanup_runtime, "DURABLE_REPORTS", [checklist]), \
                mock.patch.object(cleanup_runtime, "SAFE_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "BALANCED_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "AGGRESSIVE_STATIC_CLEANUP", []):
                code = run_harness.main()

            self.assertEqual(code, 10)
            runs_root = scratch / "runs"
            self.assertTrue(runs_root.exists())
            self.assertEqual(len(list(runs_root.iterdir())), 1)

    def test_non_strict_only_runs_still_return_failure_code(self) -> None:
        code, reports = run_harness.run_gates([_failing_gate(9)], stop_on_fail=False)

        self.assertEqual(code, 19)
        self.assertEqual(len(reports), 1)
        self.assertFalse(reports[0].passed)


if __name__ == "__main__":
    unittest.main()

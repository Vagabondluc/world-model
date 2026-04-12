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

import cleanup_runtime  # noqa: E402


class CleanupRuntimeTests(unittest.TestCase):
    def test_safe_cleanup_removes_run_root_and_preserves_reports(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            scratch = root / "scratch"
            run_root = scratch / "runs" / "run-1"
            run_root.mkdir(parents=True)
            artifact_file = run_root / "phase4" / "bundle.json"
            artifact_file.parent.mkdir(parents=True)
            artifact_file.write_text("{}", encoding="utf-8")
            report = root / "phase-4-migration-report.json"
            report.write_text("{}", encoding="utf-8")
            pycache = root / "scripts" / "__pycache__"
            pycache.mkdir(parents=True)
            (pycache / "cleanup_runtime.cpython-311.pyc").write_bytes(b"cache")

            cleanup_runtime.register_artifact(
                artifact_file,
                phase=4,
                kind="scratch",
                created_by="test",
                preserve_on_success=False,
                preserve_on_failure=False,
                catalog_path=cleanup_runtime.artifact_catalog_path(run_root),
            )

            with mock.patch.object(cleanup_runtime, "WORLD_MODEL_ROOT", root), \
                mock.patch.object(cleanup_runtime, "DURABLE_REPORTS", [report]), \
                mock.patch.object(cleanup_runtime, "SAFE_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "BALANCED_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "AGGRESSIVE_STATIC_CLEANUP", []):
                result = cleanup_runtime.cleanup_phase_outputs(
                    scratch_root=scratch,
                    scope="safe",
                    report_retention="keep",
                    run_succeeded=True,
                    current_run_root=run_root,
                )

            self.assertFalse(run_root.exists())
            self.assertFalse(pycache.exists())
            self.assertTrue(report.exists())
            self.assertIn(report.as_posix(), result["preserved"])
            self.assertEqual(result["failed"], [])

    def test_balanced_cleanup_removes_app_build_outputs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            scratch = root / "scratch"
            dist = root / "apps" / "unified-app" / "dist"
            dist.mkdir(parents=True)
            (dist / "index.html").write_text("<html></html>", encoding="utf-8")

            with mock.patch.object(cleanup_runtime, "WORLD_MODEL_ROOT", root), \
                mock.patch.object(cleanup_runtime, "DURABLE_REPORTS", []), \
                mock.patch.object(cleanup_runtime, "SAFE_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "BALANCED_STATIC_CLEANUP", [dist]), \
                mock.patch.object(cleanup_runtime, "AGGRESSIVE_STATIC_CLEANUP", []):
                result = cleanup_runtime.cleanup_phase_outputs(
                    scratch_root=scratch,
                    scope="balanced",
                    report_retention="keep",
                    run_succeeded=True,
                    current_run_root=None,
                )

            self.assertFalse(dist.exists())
            self.assertIn(dist.as_posix(), result["deleted"])

    def test_delete_success_reports_removes_durable_report(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            scratch = root / "scratch"
            report = root / "phase-6-release-report.json"
            report.write_text("{}", encoding="utf-8")

            with mock.patch.object(cleanup_runtime, "WORLD_MODEL_ROOT", root), \
                mock.patch.object(cleanup_runtime, "DURABLE_REPORTS", [report]), \
                mock.patch.object(cleanup_runtime, "SAFE_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "BALANCED_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "AGGRESSIVE_STATIC_CLEANUP", []):
                result = cleanup_runtime.cleanup_phase_outputs(
                    scratch_root=scratch,
                    scope="safe",
                    report_retention="delete-success",
                    run_succeeded=True,
                    current_run_root=None,
                )

            self.assertFalse(report.exists())
            self.assertIn(report.as_posix(), result["deleted"])

    def test_cleanup_is_idempotent(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            scratch = root / "scratch"
            run_root = scratch / "runs" / "run-1"
            run_root.mkdir(parents=True)
            stale = root / "phase-0-inventory.temp.json"
            stale.write_text("{}", encoding="utf-8")

            with mock.patch.object(cleanup_runtime, "WORLD_MODEL_ROOT", root), \
                mock.patch.object(cleanup_runtime, "DURABLE_REPORTS", []), \
                mock.patch.object(cleanup_runtime, "SAFE_STATIC_CLEANUP", [stale]), \
                mock.patch.object(cleanup_runtime, "BALANCED_STATIC_CLEANUP", []), \
                mock.patch.object(cleanup_runtime, "AGGRESSIVE_STATIC_CLEANUP", []):
                first = cleanup_runtime.cleanup_phase_outputs(
                    scratch_root=scratch,
                    scope="safe",
                    report_retention="keep",
                    run_succeeded=True,
                    current_run_root=run_root,
                )
                second = cleanup_runtime.cleanup_phase_outputs(
                    scratch_root=scratch,
                    scope="safe",
                    report_retention="keep",
                    run_succeeded=True,
                    current_run_root=run_root,
                )

            self.assertEqual(first["failed"], [])
            self.assertEqual(second["failed"], [])

    def test_delete_path_retries_locked_file_errors(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "locked.log"
            target.write_text("x", encoding="utf-8")
            calls = {"count": 0}
            original = Path.unlink

            def flaky_unlink(path: Path, *args, **kwargs):
                calls["count"] += 1
                if calls["count"] == 1:
                    raise PermissionError("locked")
                return original(path, *args, **kwargs)

            with mock.patch.object(Path, "unlink", autospec=True, side_effect=flaky_unlink):
                ok, status = cleanup_runtime._delete_path(target)

            self.assertTrue(ok)
            self.assertEqual(status, "deleted")
            self.assertGreaterEqual(calls["count"], 2)


if __name__ == "__main__":
    unittest.main()

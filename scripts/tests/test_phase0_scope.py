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

import phase_0_direct_imports_scan as scan  # noqa: E402
from gates import phase_0_gate  # noqa: E402

REAL_ISFILE = phase_0_gate.os.path.isfile


def _find_check(report, name: str):
    for check in report.checks:
        if check.name == name:
            return check
    raise AssertionError(f"missing check {name}")


class Phase0ScopeTests(unittest.TestCase):
    @staticmethod
    def _isfile_with_triage(path: str) -> bool:
        normalized = str(path).replace("\\", "/")
        if normalized.endswith("world-model/phase-0-direct-imports-triage.json"):
            return True
        return REAL_ISFILE(path)

    def test_load_scope_merges_with_defaults(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "world-model").mkdir(parents=True, exist_ok=True)
            scope_file = root / "world-model" / "phase-0-scan-scope.json"
            scope_file.write_text(
                '{"deliverable_root":"world-model","frozen_donor_roots":["mythforge"]}',
                encoding="utf-8",
            )

            scope = scan.load_scope(root)

            self.assertEqual(scope["deliverable_root"], "world-model")
            self.assertEqual(scope["frozen_donor_roots"], ["mythforge"])
            self.assertIn("world-model/vendor", scope["approved_snapshot_roots"])

    def test_iter_scan_roots_splits_deliverable_and_donor_audit(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            scope = dict(scan.DEFAULT_SCOPE)

            deliverable_roots = scan.iter_scan_roots(root, scope, "deliverable")
            audit_roots = scan.iter_scan_roots(root, scope, "donor-audit")

            self.assertEqual(deliverable_roots, [root / "world-model"])
            self.assertIn(root / "mythforge", audit_roots)
            self.assertIn(root / "mechanical-sycophant", audit_roots)
            self.assertIn(root / "to be merged", audit_roots)

    def test_scan_paths_respects_excluded_phase0_artifacts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            deliverable = root / "world-model"
            source = deliverable / "src"
            source.mkdir(parents=True, exist_ok=True)

            included = source / "runtime.rs"
            included.write_text("use super::super::db::client::DatabaseClient;\n", encoding="utf-8")
            excluded = deliverable / "phase-0-direct-imports.json"
            excluded.write_text("use super::super::db::client::DatabaseClient;\n", encoding="utf-8")

            matches = scan.scan_paths([deliverable], root)
            paths = {m["path"] for m in matches}

            self.assertIn("world-model/src/runtime.rs", paths)
            self.assertNotIn("world-model/phase-0-direct-imports.json", paths)

    def test_phase0_gate_flags_runtime_imports_outside_deliverable(self) -> None:
        fake_triage = {
            "matches": [
                {
                    "classification": "runtime",
                    "path": "mechanical-sycophant/src-tauri/src/lib.rs",
                    "line": 12,
                    "text": "use super::super::db::client::DatabaseClient;",
                }
            ]
        }
        with (
            mock.patch("gates.phase_0_gate.os.path.isfile", side_effect=self._isfile_with_triage),
            mock.patch("gates.phase_0_gate.open", mock.mock_open(read_data="{}"), create=True),
            mock.patch("gates.phase_0_gate.json.load", return_value=fake_triage),
        ):
            report = phase_0_gate.run()

        check = _find_check(report, "0.3 No runtime donor imports outside deliverable scope")
        self.assertFalse(check.passed)
        self.assertIn("outside the deliverable scope", check.message)

    def test_phase0_gate_accepts_runtime_imports_within_deliverable(self) -> None:
        fake_triage = {
            "matches": [
                {
                    "classification": "runtime",
                    "path": "world-model/apps/unified-app/src/lib/importer.ts",
                    "line": 27,
                    "text": "import { foo } from './bar';",
                },
                {
                    "classification": "docs",
                    "path": "mechanical-sycophant/docs/readme.md",
                    "line": 3,
                    "text": "import sample",
                },
            ]
        }
        with (
            mock.patch("gates.phase_0_gate.os.path.isfile", side_effect=self._isfile_with_triage),
            mock.patch("gates.phase_0_gate.open", mock.mock_open(read_data="{}"), create=True),
            mock.patch("gates.phase_0_gate.json.load", return_value=fake_triage),
        ):
            report = phase_0_gate.run()

        check = _find_check(report, "0.3 No runtime donor imports outside deliverable scope")
        self.assertTrue(check.passed)


if __name__ == "__main__":
    unittest.main()

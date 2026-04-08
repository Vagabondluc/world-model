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

import check_phase_4_migration as phase4_check  # noqa: E402
from gates import phase_4_gate  # noqa: E402


def _find_check(report, name: str):
    for check in report.checks:
        if check.name == name:
            return check
    raise AssertionError(f"missing check {name}")


class Phase4ScopeTests(unittest.TestCase):
    def test_report_shape_accepts_complete_migration_report(self) -> None:
        report = {
            "donor": "mythforge",
            "run_id": "run-123",
            "mode": "write",
            "input_fingerprint": "abc123",
            "adapter_version": "1.0.0",
            "started_at": "2026-04-07T10:00:00Z",
            "finished_at": "2026-04-07T10:00:01Z",
            "mapped_count": 11,
            "dropped_count": 1,
            "conflict_count": 0,
            "quarantined_count": 0,
            "issues": [],
            "provenance_refs": [],
            "output_bundle_path": "bundle.json",
            "replay_equivalent": None,
            "snapshot_fingerprint": "snap-123",
            "manifest_path": "adapters/mythforge/manifest.yaml",
            "concept_map_path": "adapters/mythforge/mappings/concept-map.yaml",
        }

        errors = phase4_check._assert_report_shape(report)

        self.assertEqual(errors, [])

    def test_report_shape_flags_missing_required_fields(self) -> None:
        errors = phase4_check._assert_report_shape({"donor": "mythforge", "issues": [], "provenance_refs": []})

        self.assertTrue(any("missing report field `run_id`" in error for error in errors))
        self.assertTrue(any("missing report field `mode`" in error for error in errors))

    def test_checker_runs_cover_all_donors_and_replay(self) -> None:
        donors = {donor for donor, _, _ in phase4_check.RUNS}
        modes = {(donor, mode) for donor, _, mode in phase4_check.RUNS}

        self.assertEqual(donors, {"mythforge", "orbis", "adventure-generator"})
        self.assertIn(("adventure-generator", "replay"), modes)

    def test_normalized_bundle_check_rejects_donor_ui_leaks(self) -> None:
        errors = phase4_check._assert_normalized_bundle(
            "mythforge",
            {
                "world": {"world_id": "world:sample"},
                "entities": {},
                "workflows": {},
                "projections": {},
                "assets": {},
                "events": [],
                "donor_ui_state": {"panel": "world"},
            },
        )

        self.assertTrue(any("donor-local keys" in error for error in errors))

    def test_normalized_bundle_check_accepts_minimal_orbis_shape(self) -> None:
        errors = phase4_check._assert_normalized_bundle(
            "orbis",
            {
                "world": {"simulation_attachment": {"profile_id": "profile:sample"}},
                "entities": {},
                "workflows": {},
                "projections": {},
                "events": [{"event_id": "event:1"}],
            },
        )

        self.assertEqual(errors, [])

    def test_gate_routes_migration_checker_failures_to_remediation(self) -> None:
        with mock.patch("gates.phase_4_gate._run_migration_check", return_value=(False, "replay drift")):
            report = phase_4_gate.run()

        check = _find_check(report, "4.8 migration checker passes")
        self.assertFalse(check.passed)
        self.assertIsNotNone(check.remediation)
        self.assertIn("check_phase_4_migration.py", check.remediation.target)
        self.assertIn("run_harness.py --phase 4", check.remediation.rerun_cmd)

    def test_check_uses_explicit_scratch_root(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            scratch = Path(tmp)
            report_path = scratch / "report.json"

            report = phase4_check.check(scratch_root=scratch, report_path=report_path)

            self.assertTrue(report["ok"])
            self.assertTrue(report_path.is_file())
            result_paths = {
                Path(item["report_path"]).parent for item in report["results"] if item.get("report_path")
            }
            self.assertEqual(result_paths, {scratch / "phase-4-migration"})


if __name__ == "__main__":
    unittest.main()

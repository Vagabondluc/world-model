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

import check_phase_2_snapshots as phase2_check  # noqa: E402
from build_adapter_snapshots import _collect_included_files  # noqa: E402
from gates import phase_2_gate  # noqa: E402
from validate_adapter_manifest import validate_manifest_detailed  # noqa: E402


class Phase2ScopeTests(unittest.TestCase):
    def test_manifest_validation_rejects_placeholder_and_missing_fields(self) -> None:
        manifest = {
            "id": "mythforge",
            "name": "Mythforge",
            "version": "1.0.0",
            "source": {"repo": "local://mythforge", "commit": "REPLACE_SHA", "path": "docs"},
            "source_kind": "schema_template",
            "default_promotion_class": "core",
            "snapshot": {"root": "adapters/mythforge/source-snapshot", "fingerprint": "abc", "file_count": 0},
            "included_paths": ["schemas"],
            "excluded_paths": ["prompts"],
            "concepts": ["identity-history"],
            "mappings": ["adapters/mythforge/mappings/concept-map.yaml"],
            "provenance": {"generated_at": "2026-04-07T10:00:00Z", "generated_by": "codex"},
        }

        errors = validate_manifest_detailed(
            manifest,
            manifest_path=None,
            wm_root=None,
            allowed_concept_families=["identity-history"],
        )
        self.assertTrue(any("placeholder token" in err for err in errors))

    def test_collect_included_files_applies_exclusions(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "keep").mkdir(parents=True, exist_ok=True)
            (root / "drop").mkdir(parents=True, exist_ok=True)
            (root / "keep" / "a.txt").write_text("a", encoding="utf-8")
            (root / "drop" / "b.txt").write_text("b", encoding="utf-8")

            files = _collect_included_files(
                source_root=root,
                include_paths=["keep", "drop"],
                exclude_paths=["drop"],
            )
            rels = {f.relative_to(root).as_posix() for f in files}
            self.assertIn("keep/a.txt", rels)
            self.assertNotIn("drop/b.txt", rels)

    def test_duplicate_rule_detection(self) -> None:
        errors = phase2_check._validate_duplicate_rules(
            [
                {
                    "canonical_key": "world",
                    "winner": "mythforge",
                    "status": "mapped",
                    "canonical_target": "WorldRecord",
                },
                {
                    "canonical_key": "world",
                    "winner": "orbis",
                    "status": "mapped",
                    "canonical_target": "WorldRecord",
                },
            ]
        )
        self.assertTrue(errors)

    def test_phase2_gate_reports_integrity_failure_with_remediation(self) -> None:
        with mock.patch("gates.phase_2_gate._run_integrity_check", return_value=(False, "bad fingerprint")):
            report = phase_2_gate.run()
        failing = [c for c in report.checks if c.name == "2.8 integrity checker passes"]
        self.assertEqual(len(failing), 1)
        self.assertFalse(failing[0].passed)
        self.assertIsNotNone(failing[0].remediation)
        self.assertIn("check_phase_2_snapshots.py", failing[0].remediation.target)


if __name__ == "__main__":
    unittest.main()

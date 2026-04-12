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

import check_phase_9_exact_donor_ui as phase9_exact  # noqa: E402


class Phase9ExactScopeTests(unittest.TestCase):
    def test_app_donor_set_includes_clean_room_watabou(self) -> None:
        self.assertEqual(
            set(phase9_exact.APP_DONORS),
            {
                "mythforge",
                "orbis",
                "adventure-generator",
                "mappa-imperium",
                "dawn-of-worlds",
                "faction-image",
                "watabou-city",
            },
        )

    def test_path_conventions_are_derived_from_donor_ids(self) -> None:
        self.assertEqual(
            phase9_exact._expected_vendored_root("adventure-generator"),
            "world-model/apps/donors/adventure-generator",
        )
        self.assertEqual(
            phase9_exact._expected_bridge_test("faction-image"),
            "world-model/apps/unified-app/tests/conformance/faction-image.bridge.test.ts",
        )
        self.assertEqual(
            phase9_exact._expected_conformance_suite("watabou-city"),
            "world-model/apps/unified-app/tests/conformance/watabou-city.conformance.test.tsx",
        )
        self.assertEqual(
            phase9_exact._expected_characterization_baseline("encounter-balancer"),
            "world-model/tests/characterization/encounter-balancer/captured/",
        )

    def test_manifest_and_config_validation_rejects_mechanical_sycophant(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            manifest_path = root / "exactness-manifest.json"
            config_path = root / "config.ts"
            donor_page_path = root / "DonorPage.tsx"
            subapp_host_path = root / "DonorSubappHost.tsx"
            navigation_path = root / "Navigation.tsx"
            context_bar_path = root / "ContextBar.tsx"

            manifest_path.write_text(
                """
{
  "donorOrder": ["mythforge", "orbis", "adventure-generator", "mappa-imperium", "dawn-of-worlds", "faction-image", "watabou-city", "encounter-balancer", "mechanical-sycophant"],
  "donors": {
    "mythforge": {
      "id": "mythforge",
      "label": "Mythforge",
      "classification": "app donor",
      "route": "/donor/mythforge",
      "vendoredRoot": "world-model/apps/donors/mythforge",
      "mountKind": "external-source-reference",
      "implementationStatus": "external-source-reference",
      "canonicalBridge": {
        "projector": "world-model/apps/unified-app/src/donors/bridges/mythforge/projector.ts",
        "actionTranslator": "world-model/apps/unified-app/src/donors/bridges/mythforge/actionTranslator.ts",
        "tests": ["world-model/apps/unified-app/tests/conformance/mythforge.bridge.test.ts"]
      },
      "characterizationBaseline": "world-model/tests/characterization/mythforge/captured/",
      "conformanceSuite": "world-model/apps/unified-app/tests/conformance/mythforge.conformance.test.tsx",
      "compareHint": "Runnable donor UI with a live source app in the workspace.",
      "summary": "World authoring donor with explorer, workspace, dialogs, and canonical save/open affordances.",
      "sourceStatus": "Live donor source app exists in the workspace.",
      "sourceRoot": "mythforge/",
      "sourceUiUrl": "http://127.0.0.1:3000"
    }
  }
}
""",
                encoding="utf-8",
            )
            config_path.write_text(
                'import exactnessManifest from "./exactness-manifest.json";\n'
                "export const DONOR_DEFINITIONS = exactnessManifest.donors;\n",
                encoding="utf-8",
            )
            donor_page_path.write_text("export const DonorPage = () => null;\n", encoding="utf-8")
            subapp_host_path.write_text("export const DonorSubappHost = () => null;\n", encoding="utf-8")
            navigation_path.write_text("export const Navigation = () => null;\n", encoding="utf-8")
            context_bar_path.write_text("export const ContextBar = () => null;\n", encoding="utf-8")

            manifest = phase9_exact._read_json(manifest_path)
            with mock.patch.object(phase9_exact, "MANIFEST_PATH", manifest_path), \
                mock.patch.object(phase9_exact, "CONFIG_PATH", config_path), \
                mock.patch.object(phase9_exact, "DONOR_PAGE_PATH", donor_page_path), \
                mock.patch.object(phase9_exact, "DONOR_SUBAPP_HOST_PATH", subapp_host_path), \
                mock.patch.object(phase9_exact, "NAVIGATION_PATH", navigation_path), \
                mock.patch.object(phase9_exact, "CONTEXT_BAR_PATH", context_bar_path):
                results, errors = phase9_exact._check_manifest_and_config(manifest)

            self.assertTrue(any("mechanical-sycophant" in error for error in errors))
            self.assertTrue(any(item["name"] == "config.ts imports the exactness manifest" for item in results))

    def test_phase9b_command_runner_records_failures(self) -> None:
        command_results = [
            {"name": "phase-9 bridge suite", "command": "bridge", "ok": False, "returncode": 1, "output": "bridge failed"},
            {"name": "phase-9 mount suite", "command": "mount", "ok": True, "returncode": 0, "output": "mount ok"},
            {"name": "phase-9 exactness suite", "command": "exactness", "ok": True, "returncode": 0, "output": "exactness ok"},
            {"name": "phase-9 phase9b suite", "command": "phase9b", "ok": True, "returncode": 0, "output": "phase9b ok"},
            {"name": "phase-9 donor e2e suite", "command": "e2e", "ok": True, "returncode": 0, "output": "e2e ok"},
        ]
        with mock.patch.object(phase9_exact, "_run", side_effect=command_results):
            results, errors = phase9_exact._run_phase9b_commands(None)

        self.assertEqual(len(results), 6)
        self.assertTrue(errors)
        self.assertIn("phase-9 bridge suite failed", errors[0])


if __name__ == "__main__":
    unittest.main()

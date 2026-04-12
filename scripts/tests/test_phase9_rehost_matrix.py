from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in __import__("sys").path:
    __import__("sys").path.insert(0, str(ROOT))
if str(ROOT / "scripts") not in __import__("sys").path:
    __import__("sys").path.insert(0, str(ROOT / "scripts"))

import check_phase_9_rehost_matrix as phase9_matrix  # noqa: E402


DONORS = [
    "mythforge",
    "orbis",
    "adventure-generator",
    "mappa-imperium",
    "dawn-of-worlds",
    "faction-image",
    "watabou-city",
    "encounter-balancer",
]


def _write_donor_fixture(root: Path, donor: str) -> None:
    donor_root = root / "world-model" / "apps" / "donors" / donor
    (donor_root / "src").mkdir(parents=True, exist_ok=True)
    (donor_root / "src" / "WorldModelDonorApp.tsx").write_text("export default function WorldModelDonorApp() { return null; }\n", encoding="utf-8")
    (donor_root / "src" / "styles.css").write_text(".app { color: black; }\n", encoding="utf-8")
    (donor_root / "package.json").write_text('{"name":"demo","private":true}', encoding="utf-8")


def _write_manifest(root: Path, *, route_status: str = "scaffold-mounted", impl_status: str = "scaffold-mounted") -> Path:
    donors = {}
    for donor in DONORS:
        donors[donor] = {
            "id": donor,
            "label": donor,
            "classification": "clean-room app donor" if donor == "watabou-city" else ("scaffold-copy donor" if donor == "encounter-balancer" else "app donor"),
            "route": f"/donor/{donor}",
            "vendoredRoot": f"world-model/apps/donors/{donor}",
            "mountKind": "rehost-mounted" if donor == "watabou-city" else route_status,
            "implementationStatus": "rehost-mounted" if donor == "watabou-city" else impl_status,
            "canonicalBridge": {
                "projector": f"world-model/apps/unified-app/src/donors/bridges/{donor}/projector.ts",
                "actionTranslator": f"world-model/apps/unified-app/src/donors/bridges/{donor}/actionTranslator.ts",
                "tests": [f"world-model/apps/unified-app/tests/conformance/{donor}.bridge.test.ts"],
            },
            "characterizationBaseline": f"world-model/tests/characterization/{donor}/captured/",
            "conformanceSuite": f"world-model/apps/unified-app/tests/conformance/{donor}.conformance.test.tsx",
            "sourceRoot": f"source/{donor}",
        }
    manifest = {"donorOrder": DONORS, "donors": donors}
    manifest_path = root / "world-model" / "apps" / "unified-app" / "src" / "donors" / "exactness-manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest_path


def _write_exactness_report(root: Path) -> Path:
    report = {
        "ok": False,
        "commands": [
            {"name": "phase-9 bridge suite", "ok": True, "output": "bridge ok"},
            {"name": "phase-9 mount suite", "ok": True, "output": "mount ok"},
            {"name": "phase-9 exactness suite", "ok": True, "output": "exactness ok"},
            {"name": "phase-9 phase9b suite", "ok": True, "output": "phase9b ok"},
            {"name": "phase-9 donor e2e suite", "ok": False, "output": "skipped because donor routes are not yet exact-mounted and parity-certified"},
        ],
    }
    report_path = root / "world-model" / "phase-9-exact-donor-ui-report.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report_path


def _write_host(root: Path) -> Path:
    host_path = root / "world-model" / "apps" / "unified-app" / "src" / "donors" / "DonorSubappHost.tsx"
    host_path.parent.mkdir(parents=True, exist_ok=True)
    host_path.write_text(
        """
import { lazy } from "react";

const donorSubapps = {
  "watabou-city": lazy(() => import("../../../donors/watabou-city/src/WorldModelDonorApp")),
};

export function DonorSubappHost() {
  return null;
}
""".strip()
        + "\n",
        encoding="utf-8",
    )
    return host_path


class Phase9RehostMatrixTests(unittest.TestCase):
    def test_matrix_reports_current_donor_state_without_failing(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for donor in DONORS:
                _write_donor_fixture(root, donor)
                (root / "world-model" / "apps" / "unified-app" / "tests" / "conformance").mkdir(parents=True, exist_ok=True)
                (root / "world-model" / "apps" / "unified-app" / "tests" / "conformance" / f"{donor}.bridge.test.ts").write_text("test('bridge', () => {});\n", encoding="utf-8")
                (root / "world-model" / "apps" / "unified-app" / "tests" / "conformance" / f"{donor}.conformance.test.tsx").write_text("test('parity', () => {});\n", encoding="utf-8")
            manifest_path = _write_manifest(root)
            report_path = _write_exactness_report(root)
            host_path = _write_host(root)
            matrix_path = root / "world-model" / "phase-9-rehost-matrix-report.json"

            with mock.patch.object(phase9_matrix, "ROOT", root / "world-model"), \
                mock.patch.object(phase9_matrix, "WORKSPACE_ROOT", root), \
                mock.patch.object(phase9_matrix, "APP_ROOT", root / "world-model" / "apps" / "unified-app"), \
                mock.patch.object(phase9_matrix, "MANIFEST_PATH", manifest_path), \
                mock.patch.object(phase9_matrix, "EXACTNESS_REPORT_PATH", report_path), \
                mock.patch.object(phase9_matrix, "DONOR_SUBAPP_HOST_PATH", host_path), \
                mock.patch.object(phase9_matrix, "REPORT_PATH", matrix_path):
                report = phase9_matrix.check()

            self.assertTrue(report["ok"])
            self.assertTrue(report["donors"]["watabou-city"]["routeMounted"])
            self.assertFalse(report["donors"]["mythforge"]["routeMounted"])
            self.assertTrue(report["donors"]["mythforge"]["sourceVendored"])
            self.assertFalse(report["donors"]["mythforge"]["e2eEnabled"])
            self.assertIn("routeMounted", report["donors"]["mythforge"]["missing"])

    def test_require_exact_fails_until_every_donor_is_exact_mounted(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for donor in DONORS:
                _write_donor_fixture(root, donor)
                (root / "world-model" / "apps" / "unified-app" / "tests" / "conformance").mkdir(parents=True, exist_ok=True)
                (root / "world-model" / "apps" / "unified-app" / "tests" / "conformance" / f"{donor}.bridge.test.ts").write_text("test('bridge', () => {});\n", encoding="utf-8")
                (root / "world-model" / "apps" / "unified-app" / "tests" / "conformance" / f"{donor}.conformance.test.tsx").write_text("test('parity', () => {});\n", encoding="utf-8")
            manifest_path = _write_manifest(root)
            report_path = _write_exactness_report(root)
            host_path = _write_host(root)
            matrix_path = root / "world-model" / "phase-9-rehost-matrix-report.json"

            with mock.patch.object(phase9_matrix, "ROOT", root / "world-model"), \
                mock.patch.object(phase9_matrix, "WORKSPACE_ROOT", root), \
                mock.patch.object(phase9_matrix, "APP_ROOT", root / "world-model" / "apps" / "unified-app"), \
                mock.patch.object(phase9_matrix, "MANIFEST_PATH", manifest_path), \
                mock.patch.object(phase9_matrix, "EXACTNESS_REPORT_PATH", report_path), \
                mock.patch.object(phase9_matrix, "DONOR_SUBAPP_HOST_PATH", host_path), \
                mock.patch.object(phase9_matrix, "REPORT_PATH", matrix_path):
                report = phase9_matrix.check(require_exact=True)

            self.assertFalse(report["ok"])
            self.assertTrue(any("mythforge" in error for error in report["errors"]))
            self.assertFalse(report["donors"]["mythforge"]["exactMounted"])


if __name__ == "__main__":
    unittest.main()

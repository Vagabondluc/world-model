"""Phase 7 donor UI checker.

Validates donor audit docs, characterization baselines, donor routes, and the
characterization/conformance suites that back donor UI rehost work.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

from cleanup_runtime import env_run_root, prepare_phase_scratch, register_artifact, resolve_scratch_root, write_command_log


ROOT = Path(__file__).resolve().parent.parent
APP_ROOT = ROOT / "apps" / "unified-app"
REPORT_PATH = ROOT / "phase-7-donor-ui-report.json"
NPM_BIN = "npm.cmd" if os.name == "nt" else "npm"

REQUIRED_DOCS = [
    ROOT / "docs" / "testing" / "DONOR_UI_AUDIT.md",
    ROOT / "docs" / "testing" / "DONOR_CHARACTERIZATION_MATRIX.md",
    ROOT / "docs" / "testing" / "DONOR_UI_CONFORMANCE_MATRIX.md",
    ROOT / "docs" / "roadmap" / "phase-7-donor-ui-conformance.md",
]
REQUIRED_MANIFESTS = [
    ROOT / "tests" / "characterization" / "baselines.yaml",
    ROOT / "tests" / "conformance" / "waivers.yaml",
]
REQUIRED_APP_SCRIPTS = [
    "test:characterize:mythforge",
    "test:characterize:orbis",
    "test:characterize:adventure",
    "test:characterize:mappa-imperium",
    "test:characterize:dawn-of-worlds",
    "test:characterize:faction-image",
    "test:characterize:watabou-city",
    "test:characterize:encounter-balancer",
    "test:characterize",
    "test:conformance:mythforge",
    "test:conformance:orbis",
    "test:conformance:adventure",
    "test:conformance:mappa-imperium",
    "test:conformance:dawn-of-worlds",
    "test:conformance:faction-image",
    "test:conformance:watabou-city",
    "test:conformance:encounter-balancer",
    "test:conformance",
]
REQUIRED_TEST_FILES = [
    APP_ROOT / "tests" / "characterization" / "mythforge.characterization.test.ts",
    APP_ROOT / "tests" / "characterization" / "orbis.characterization.test.ts",
    APP_ROOT / "tests" / "characterization" / "adventure-generator.characterization.test.ts",
    APP_ROOT / "tests" / "conformance" / "mythforge.conformance.test.tsx",
    APP_ROOT / "tests" / "conformance" / "orbis.conformance.test.tsx",
    APP_ROOT / "tests" / "conformance" / "adventure-generator.conformance.test.tsx",
    APP_ROOT / "tests" / "characterization" / "mappa-imperium.characterization.test.ts",
    APP_ROOT / "tests" / "characterization" / "dawn-of-worlds.characterization.test.ts",
    APP_ROOT / "tests" / "characterization" / "faction-image.characterization.test.ts",
    APP_ROOT / "tests" / "characterization" / "watabou-city.characterization.test.ts",
    APP_ROOT / "tests" / "characterization" / "encounter-balancer.characterization.test.ts",
    APP_ROOT / "tests" / "conformance" / "mappa-imperium.conformance.test.tsx",
    APP_ROOT / "tests" / "conformance" / "dawn-of-worlds.conformance.test.tsx",
    APP_ROOT / "tests" / "conformance" / "faction-image.conformance.test.tsx",
    APP_ROOT / "tests" / "conformance" / "watabou-city.conformance.test.tsx",
    APP_ROOT / "tests" / "conformance" / "encounter-balancer.conformance.test.tsx",
]
CHECK_COMMANDS = [
    ("donor characterization", [NPM_BIN, "run", "test:characterize"], APP_ROOT),
    ("donor conformance", [NPM_BIN, "run", "test:conformance"], APP_ROOT),
]


def _run(command: list[str], cwd: Path, *, phase_root: Path | None, name: str) -> tuple[bool, str]:
    proc = subprocess.run(
        command,
        cwd=str(cwd),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    output = "\n".join(part for part in (proc.stdout.strip(), proc.stderr.strip()) if part).strip()
    write_command_log(name, output or "ok", phase_root=phase_root)
    return proc.returncode == 0, output or "ok"


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _check_docs() -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []

    for doc in REQUIRED_DOCS:
        ok = doc.is_file()
        results.append({"name": f"doc exists: {doc.name}", "ok": ok, "target": doc.as_posix()})
        if not ok:
            errors.append(f"missing donor-ui doc: {doc.as_posix()}")

    if errors:
        return results, errors

    audit_text = (ROOT / "docs" / "testing" / "DONOR_UI_AUDIT.md").read_text(encoding="utf-8")
    char_text = (ROOT / "docs" / "testing" / "DONOR_CHARACTERIZATION_MATRIX.md").read_text(encoding="utf-8")
    conf_text = (ROOT / "docs" / "testing" / "DONOR_UI_CONFORMANCE_MATRIX.md").read_text(encoding="utf-8")

    patterns = [
        (audit_text, r"mythforge", "audit includes Mythforge"),
        (audit_text, r"orbis", "audit includes Orbis"),
        (audit_text, r"adventure generator|adventure-generator", "audit includes Adventure Generator"),
        (audit_text, r"mappa imperium|mappa-imperium", "audit includes Mappa Imperium"),
        (audit_text, r"dawn of worlds|dawn-of-worlds", "audit includes Dawn of Worlds"),
        (audit_text, r"faction image|sacred sigil", "audit includes Faction Image"),
        (audit_text, r"watabou", "audit includes Watabou City"),
        (audit_text, r"encounter balancer", "audit includes Encounter Balancer"),
        (char_text, r"\|\s*Donor\s*\|\s*Class\s*\|\s*Methodology\s*\|\s*Basis\s*\|", "characterization matrix has basis column"),
        (conf_text, r"\|\s*Donor\s*\|\s*Basis\s*\|", "conformance matrix has basis column"),
        (conf_text, r"biome|location family", "conformance matrix names the shared-concept round-trip stress case"),
    ]
    for text, pattern, label in patterns:
        ok = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL) is not None
        results.append({"name": label, "ok": ok})
        if not ok:
            errors.append(f"donor-ui docs missing `{label}`")

    return results, errors


def _check_manifests() -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    for manifest in REQUIRED_MANIFESTS:
        ok = manifest.is_file()
        results.append({"name": f"manifest exists: {manifest.name}", "ok": ok, "target": manifest.as_posix()})
        if not ok:
            errors.append(f"missing manifest: {manifest.as_posix()}")

    if errors:
        return results, errors

    baselines = (ROOT / "tests" / "characterization" / "baselines.yaml").read_text(encoding="utf-8")
    waivers = (ROOT / "tests" / "conformance" / "waivers.yaml").read_text(encoding="utf-8")
    patterns = [
        (baselines, r"mythforge:.*basis:\s*captured", "baselines register Mythforge captured basis"),
        (baselines, r"orbis:.*basis:\s*captured", "baselines register Orbis captured basis"),
        (baselines, r"adventure-generator:.*basis:\s*captured", "baselines register Adventure captured basis"),
        (baselines, r"mappa-imperium", "baselines register Mappa Imperium"),
        (baselines, r"dawn-of-worlds", "baselines register Dawn of Worlds"),
        (baselines, r"faction-image", "baselines register Faction Image"),
        (baselines, r"watabou-city", "baselines register Watabou City"),
        (baselines, r"encounter-balancer", "baselines register Encounter Balancer"),
        (waivers, r"donor:\s*orbis", "waiver manifest includes Orbis"),
        (waivers, r"donor:\s*adventure-generator", "waiver manifest includes Adventure Generator"),
        (waivers, r"donor:\s*mappa-imperium", "waiver manifest includes Mappa Imperium"),
        (waivers, r"donor:\s*dawn-of-worlds", "waiver manifest includes Dawn of Worlds"),
        (waivers, r"donor:\s*faction-image", "waiver manifest includes Faction Image"),
        (waivers, r"donor:\s*watabou-city", "waiver manifest includes Watabou City"),
        (waivers, r"donor:\s*encounter-balancer", "waiver manifest includes Encounter Balancer"),
    ]
    for text, pattern, label in patterns:
        ok = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL) is not None
        results.append({"name": label, "ok": ok})
        if not ok:
            errors.append(f"manifest missing `{label}`")

    return results, errors


def _check_package_scripts() -> tuple[list[dict[str, Any]], list[str]]:
    package_json = APP_ROOT / "package.json"
    if not package_json.is_file():
        return [{"name": "package.json exists", "ok": False, "target": package_json.as_posix()}], [
            f"missing app package.json: {package_json.as_posix()}"
        ]
    package = _read_json(package_json)
    scripts = package.get("scripts", {})
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    for script in REQUIRED_APP_SCRIPTS:
        ok = script in scripts
        results.append({"name": f"npm script: {script}", "ok": ok})
        if not ok:
            errors.append(f"app package.json missing script `{script}`")
    return results, errors


def _check_routes_and_tests() -> tuple[list[dict[str, Any]], list[str]]:
    app_routes = (APP_ROOT / "src" / "routes" / "AppRoutes.tsx")
    navigation = (APP_ROOT / "src" / "shell" / "Navigation.tsx")
    donor_config = (APP_ROOT / "src" / "donors" / "config.ts")
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    route_text = app_routes.read_text(encoding="utf-8") if app_routes.is_file() else ""
    nav_text = navigation.read_text(encoding="utf-8") if navigation.is_file() else ""
    donor_text = donor_config.read_text(encoding="utf-8") if donor_config.is_file() else ""

    route_patterns = [
        (route_text, r"/donor/:donor", "donor route handler exists"),
        (route_text, r"/compare/donors", "donor compare route exists"),
        (nav_text, r"Compare donors", "navigation links to donor compare"),
        (donor_text, r'label:\s*"Mythforge"', "navigation links to Mythforge donor route"),
        (donor_text, r'label:\s*"Orbis"', "navigation links to Orbis donor route"),
        (donor_text, r'label:\s*"Adventure Generator"', "navigation links to Adventure Generator donor route"),
        (donor_text, r'label:\s*"Mappa Imperium"', "navigation links to Mappa Imperium donor route"),
        (donor_text, r'label:\s*"Dawn of Worlds"', "navigation links to Dawn of Worlds donor route"),
        (donor_text, r'label:\s*"Sacred Sigil Generator"', "navigation links to Faction Image donor route"),
        (donor_text, r'label:\s*"Watabou City"', "navigation links to Watabou City donor route"),
        (donor_text, r'label:\s*"Encounter Balancer Scaffold"', "navigation links to Encounter Balancer donor route"),
    ]
    for text, pattern, label in route_patterns:
        ok = re.search(pattern, text, flags=re.IGNORECASE) is not None
        results.append({"name": label, "ok": ok})
        if not ok:
            errors.append(f"missing donor route wiring: {label}")

    for test_file in REQUIRED_TEST_FILES:
        ok = test_file.is_file()
        results.append({"name": f"test exists: {test_file.name}", "ok": ok, "target": test_file.as_posix()})
        if not ok:
            errors.append(f"missing donor-ui test file: {test_file.as_posix()}")

    return results, errors


def check(*, scratch_root: Path | None = None, report_path: Path = REPORT_PATH) -> dict[str, Any]:
    report: dict[str, Any] = {
        "ok": True,
        "workspace_root": ROOT.as_posix(),
        "app_root": APP_ROOT.as_posix(),
        "checks": [],
        "errors": [],
    }
    phase_root: Path | None = None
    if scratch_root is None and env_run_root() is not None:
        phase_root = prepare_phase_scratch("phase-7-donor-ui")
    elif scratch_root is not None:
        phase_root = prepare_phase_scratch("phase-7-donor-ui", scratch_root=scratch_root)

    for collector in (_check_docs, _check_manifests, _check_package_scripts, _check_routes_and_tests):
        results, errors = collector()
        report["checks"].extend(results)
        if errors:
            report["ok"] = False
            report["errors"].extend(errors)

    for name, command, cwd in CHECK_COMMANDS:
        ok, output = _run(command, cwd, phase_root=phase_root, name=name)
        report["checks"].append({"name": name, "ok": ok, "command": " ".join(command), "cwd": cwd.as_posix(), "output": output})
        if not ok:
            report["ok"] = False
            report["errors"].append(f"{name} failed: {output}")

    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Phase 7 donor UI checker")
    parser.add_argument("--scratch-root", help="Write phase-7 scratch outputs under this directory")
    parser.add_argument("--report-path", help="Override the durable phase-7 report path")
    args = parser.parse_args()

    report_path = Path(args.report_path).resolve() if args.report_path else REPORT_PATH
    report = check(
        scratch_root=resolve_scratch_root(args.scratch_root) if args.scratch_root else None,
        report_path=report_path,
    )
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    register_artifact(
        report_path,
        phase=7,
        kind="durable_report",
        created_by="check_phase_7_donor_ui",
        preserve_on_success=True,
        preserve_on_failure=True,
    )
    print(json.dumps(report, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

"""Phase 9 exhaustive donor-ui completeness checker."""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from pathlib import Path
from typing import Any

from cleanup_runtime import env_run_root, prepare_phase_scratch, register_artifact, resolve_scratch_root, write_command_log


ROOT = Path(__file__).resolve().parent.parent
APP_ROOT = ROOT / "apps" / "unified-app"
REPORT_PATH = ROOT / "phase-9-donor-completeness-report.json"
NPM_BIN = "npm.cmd" if os.name == "nt" else "npm"

DONOR_IDS = [
    "mythforge",
    "orbis",
    "adventure-generator",
    "mappa-imperium",
    "dawn-of-worlds",
    "faction-image",
    "watabou-city",
    "encounter-balancer",
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
    docs = [
        ROOT / "docs" / "roadmap" / "phase-9-exhaustive-donor-ui.md",
        ROOT / "docs" / "roadmap" / "FINAL_APP_EXECUTION_PLAN.md",
        ROOT / "docs" / "donors" / "INDEX.md",
        ROOT / "docs" / "testing" / "DONOR_UI_AUDIT.md",
        ROOT / "docs" / "testing" / "DONOR_CHARACTERIZATION_MATRIX.md",
        ROOT / "docs" / "testing" / "DONOR_UI_CONFORMANCE_MATRIX.md",
    ]
    for doc in docs:
        ok = doc.is_file()
        results.append({"name": f"doc exists: {doc.name}", "ok": ok, "target": doc.as_posix()})
        if not ok:
            errors.append(f"missing phase-9 doc: {doc.as_posix()}")
    if errors:
        return results, errors

    final_plan = (ROOT / "docs" / "roadmap" / "FINAL_APP_EXECUTION_PLAN.md").read_text(encoding="utf-8")
    phase9 = (ROOT / "docs" / "roadmap" / "phase-9-exhaustive-donor-ui.md").read_text(encoding="utf-8")
    donor_index = (ROOT / "docs" / "donors" / "INDEX.md").read_text(encoding="utf-8")
    for donor in DONOR_IDS:
        checks = [
            (phase9, donor, f"phase-9 roadmap names {donor}"),
            (donor_index, donor.replace("-", "[- ]"), f"donor index names {donor}"),
        ]
        for text, pattern, label in checks:
            ok = re.search(pattern, text, flags=re.IGNORECASE) is not None
            results.append({"name": label, "ok": ok})
            if not ok:
                errors.append(f"doc coverage missing `{label}`")

    plan_checks = [
        (r"phase-9-exhaustive-donor-ui\.md", "roadmap index includes phase 9"),
        (r"donor UI behavior is source truth", "roadmap index records donor-ui source-truth rule"),
    ]
    for pattern, label in plan_checks:
        ok = re.search(pattern, final_plan, flags=re.IGNORECASE) is not None
        results.append({"name": label, "ok": ok})
        if not ok:
            errors.append(f"final execution plan missing `{label}`")

    return results, errors


def _check_app_surfaces() -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []

    donor_config = APP_ROOT / "src" / "donors" / "config.ts"
    routes = APP_ROOT / "src" / "routes" / "AppRoutes.tsx"
    compare = APP_ROOT / "src" / "donors" / "DonorComparePage.tsx"

    for path in (donor_config, routes, compare):
        ok = path.is_file()
        results.append({"name": f"file exists: {path.name}", "ok": ok, "target": path.as_posix()})
        if not ok:
            errors.append(f"missing app file: {path.as_posix()}")
    if errors:
        return results, errors

    donor_text = donor_config.read_text(encoding="utf-8")
    route_text = routes.read_text(encoding="utf-8")
    compare_text = compare.read_text(encoding="utf-8")

    for donor in DONOR_IDS:
        label = f"donor config includes {donor}"
        ok = donor in donor_text
        results.append({"name": label, "ok": ok})
        if not ok:
            errors.append(f"donor config missing `{donor}`")

    surface_checks = [
        (route_text, r"/donor/:donor", "donor route wildcard exists"),
        (route_text, r"/compare/donors", "compare donors route exists"),
        (compare_text, r"DONOR_ORDER\.map", "compare page is donor-keyed"),
        (donor_text, r"mechanical-sycophant", "mechanical-sycophant is not listed as donor", True),
    ]
    for item in surface_checks:
        if len(item) == 4 and item[3]:
            text, pattern, label, _negated = item
            ok = re.search(pattern, text, flags=re.IGNORECASE) is None
        else:
            text, pattern, label = item
            ok = re.search(pattern, text, flags=re.IGNORECASE) is not None
        results.append({"name": label, "ok": ok})
        if not ok:
            errors.append(f"app surface check failed: {label}")

    return results, errors


def _check_scripts_and_tests() -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    package_json = APP_ROOT / "package.json"
    if not package_json.is_file():
        return [{"name": "package.json exists", "ok": False, "target": package_json.as_posix()}], [
            f"missing package.json: {package_json.as_posix()}"
        ]
    scripts = _read_json(package_json).get("scripts", {})
    required_scripts = [
        "test:characterize",
        "test:conformance",
        "test:characterize:mythforge",
        "test:characterize:orbis",
        "test:characterize:adventure",
        "test:characterize:mappa-imperium",
        "test:characterize:dawn-of-worlds",
        "test:characterize:faction-image",
        "test:characterize:watabou-city",
        "test:characterize:encounter-balancer",
        "test:conformance:mythforge",
        "test:conformance:orbis",
        "test:conformance:adventure",
        "test:conformance:mappa-imperium",
        "test:conformance:dawn-of-worlds",
        "test:conformance:faction-image",
        "test:conformance:watabou-city",
        "test:conformance:encounter-balancer",
    ]
    for script in required_scripts:
        ok = script in scripts
        results.append({"name": f"npm script: {script}", "ok": ok})
        if not ok:
            errors.append(f"missing npm script `{script}`")

    required_tests = [
        APP_ROOT / "tests" / "characterization" / "mythforge.characterization.test.ts",
        APP_ROOT / "tests" / "characterization" / "orbis.characterization.test.ts",
        APP_ROOT / "tests" / "characterization" / "adventure-generator.characterization.test.ts",
        APP_ROOT / "tests" / "characterization" / "mappa-imperium.characterization.test.ts",
        APP_ROOT / "tests" / "characterization" / "dawn-of-worlds.characterization.test.ts",
        APP_ROOT / "tests" / "characterization" / "faction-image.characterization.test.ts",
        APP_ROOT / "tests" / "characterization" / "watabou-city.characterization.test.ts",
        APP_ROOT / "tests" / "characterization" / "encounter-balancer.characterization.test.ts",
        APP_ROOT / "tests" / "conformance" / "mythforge.conformance.test.tsx",
        APP_ROOT / "tests" / "conformance" / "orbis.conformance.test.tsx",
        APP_ROOT / "tests" / "conformance" / "adventure-generator.conformance.test.tsx",
        APP_ROOT / "tests" / "conformance" / "mappa-imperium.conformance.test.tsx",
        APP_ROOT / "tests" / "conformance" / "dawn-of-worlds.conformance.test.tsx",
        APP_ROOT / "tests" / "conformance" / "faction-image.conformance.test.tsx",
        APP_ROOT / "tests" / "conformance" / "watabou-city.conformance.test.tsx",
        APP_ROOT / "tests" / "conformance" / "encounter-balancer.conformance.test.tsx",
    ]
    for test_file in required_tests:
        ok = test_file.is_file()
        results.append({"name": f"test exists: {test_file.name}", "ok": ok, "target": test_file.as_posix()})
        if not ok:
            errors.append(f"missing phase-9 test: {test_file.as_posix()}")

    baselines = ROOT / "tests" / "characterization" / "baselines.yaml"
    waivers = ROOT / "tests" / "conformance" / "waivers.yaml"
    for manifest in (baselines, waivers):
        ok = manifest.is_file()
        results.append({"name": f"manifest exists: {manifest.name}", "ok": ok, "target": manifest.as_posix()})
        if not ok:
            errors.append(f"missing manifest: {manifest.as_posix()}")
    if baselines.is_file():
        text = baselines.read_text(encoding="utf-8")
        for donor in DONOR_IDS:
            ok = re.search(rf"{re.escape(donor)}:", text) is not None
            results.append({"name": f"baseline includes {donor}", "ok": ok})
            if not ok:
                errors.append(f"baselines manifest missing donor `{donor}`")
    if waivers.is_file():
        text = waivers.read_text(encoding="utf-8")
        for donor in DONOR_IDS:
            ok = re.search(rf"donor:\s*{re.escape(donor)}", text) is not None
            results.append({"name": f"waivers include {donor}", "ok": ok})
            if not ok:
                errors.append(f"waivers manifest missing donor `{donor}`")

    return results, errors


def check(*, scratch_root: Path | None = None) -> dict[str, Any]:
    report: dict[str, Any] = {
        "ok": True,
        "workspace_root": ROOT.as_posix(),
        "app_root": APP_ROOT.as_posix(),
        "checks": [],
        "errors": [],
    }
    phase_root: Path | None = None
    if scratch_root is None and env_run_root() is not None:
        phase_root = prepare_phase_scratch("phase-9-exhaustive-donors")
    elif scratch_root is not None:
        phase_root = prepare_phase_scratch("phase-9-exhaustive-donors", scratch_root=scratch_root)

    for collector in (_check_docs, _check_app_surfaces, _check_scripts_and_tests):
        results, errors = collector()
        report["checks"].extend(results)
        if errors:
            report["ok"] = False
            report["errors"].extend(errors)

    for name, command in (
        ("phase-9 characterization suite", [NPM_BIN, "run", "test:characterize"]),
        ("phase-9 conformance suite", [NPM_BIN, "run", "test:conformance"]),
    ):
        ok, output = _run(command, APP_ROOT, phase_root=phase_root, name=name)
        report["checks"].append({"name": name, "ok": ok, "command": " ".join(command), "output": output})
        if not ok:
            report["ok"] = False
            report["errors"].append(f"{name} failed: {output}")

    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Phase 9 exhaustive donor-ui checker")
    parser.add_argument("--scratch-root", help="Write phase-9 scratch outputs under this directory")
    parser.add_argument("--report-path", help="Override the durable phase-9 report path")
    args = parser.parse_args()

    report_path = Path(args.report_path).resolve() if args.report_path else REPORT_PATH
    report = check(scratch_root=resolve_scratch_root(args.scratch_root) if args.scratch_root else None)
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    register_artifact(
        report_path,
        phase=9,
        kind="durable_report",
        created_by="check_phase_9_exhaustive_donors",
        preserve_on_success=True,
        preserve_on_failure=True,
    )
    print(json.dumps(report, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

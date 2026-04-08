"""Phase 8 unified product surface and cross-donor integration checker.

Validates that the unified product navigation is intentionally designed (not a
Phase 3 stub), cross-donor integration matrices and design docs exist, integration
test scripts are present, and the architecture documentation reflects the full
product shape.
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
REPORT_PATH = ROOT / "phase-8-integration-report.json"
NPM_BIN = "npm.cmd" if os.name == "nt" else "npm"

REQUIRED_DOCS = [
    ROOT / "docs" / "architecture" / "UNIFIED_PRODUCT_DESIGN.md",
    ROOT / "docs" / "testing" / "CROSS_DONOR_INTEGRATION_MATRIX.md",
    ROOT / "docs" / "roadmap" / "phase-8-unified-product-surface.md",
]

REQUIRED_ARCH_DOCS = [
    ROOT / "docs" / "architecture" / "FINAL_APP_ARCHITECTURE.md",
    ROOT / "docs" / "architecture" / "REPOSITORY_LAYOUT.md",
]

REQUIRED_APP_SCRIPTS = [
    "test:integration:journeys",
    "test:integration:lens-switch",
    "test:integration",
    "test:integration:round-trip",
]

REQUIRED_TEST_FILES = [
    APP_ROOT / "tests" / "integration" / "cross-donor-world-flow.integration.test.tsx",
    APP_ROOT / "tests" / "integration" / "cross-donor-adventure-flow.integration.test.tsx",
    APP_ROOT / "tests" / "integration" / "shared-concept-round-trip.test.tsx",
    APP_ROOT / "tests" / "integration" / "context-retention.test.tsx",
    APP_ROOT / "tests" / "integration" / "lens-switch.smoke.test.tsx",
]

CHECK_COMMANDS = [
    ("cross-donor integration suite", [NPM_BIN, "run", "test:integration"], APP_ROOT),
    ("shared-concept round-trip suite", [NPM_BIN, "run", "test:integration:round-trip"], APP_ROOT),
]


def _run(
    command: list[str],
    cwd: Path,
    *,
    phase_root: Path | None,
    name: str,
) -> tuple[bool, str]:
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
            errors.append(f"missing phase-8 doc: {doc.as_posix()}")

    if errors:
        return results, errors

    design_text = (ROOT / "docs" / "architecture" / "UNIFIED_PRODUCT_DESIGN.md").read_text(encoding="utf-8")
    matrix_text = (ROOT / "docs" / "testing" / "CROSS_DONOR_INTEGRATION_MATRIX.md").read_text(encoding="utf-8")

    patterns = [
        (design_text, r"/world", "UNIFIED_PRODUCT_DESIGN documents /world route"),
        (design_text, r"/story", "UNIFIED_PRODUCT_DESIGN documents /story route"),
        (design_text, r"/schema", "UNIFIED_PRODUCT_DESIGN documents /schema route"),
        (design_text, r"donor.faithful|donor-faithful", "UNIFIED_PRODUCT_DESIGN distinguishes donor-faithful surfaces"),
        (design_text, r"product language|unified.product", "UNIFIED_PRODUCT_DESIGN draws the product/donor language boundary"),
        (matrix_text, r"basis", "CROSS_DONOR_INTEGRATION_MATRIX records the characterization basis column"),
        (matrix_text, r"biome-location", "CROSS_DONOR_INTEGRATION_MATRIX names the biome/location family"),
        (matrix_text, r"entities", "CROSS_DONOR_INTEGRATION_MATRIX names the entities family"),
        (matrix_text, r"workflows", "CROSS_DONOR_INTEGRATION_MATRIX names the workflows family"),
        (matrix_text, r"simulation-events", "CROSS_DONOR_INTEGRATION_MATRIX names the simulation-events family"),
        (matrix_text, r"projections", "CROSS_DONOR_INTEGRATION_MATRIX names the projections family"),
        (matrix_text, r"attachments", "CROSS_DONOR_INTEGRATION_MATRIX names the attachments family"),
        (matrix_text, r"mythforge.*orbis|orbis.*mythforge", "CROSS_DONOR_INTEGRATION_MATRIX covers Mythforge and Orbis lenses"),
        (matrix_text, r"adventure.generator|adventure generator", "CROSS_DONOR_INTEGRATION_MATRIX covers Adventure Generator lens"),
        (matrix_text, r"lens switch|lens-switch", "CROSS_DONOR_INTEGRATION_MATRIX records the explicit lens-switch smoke test"),
    ]
    for text, pattern, label in patterns:
        ok = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL) is not None
        results.append({"name": label, "ok": ok})
        if not ok:
            errors.append(f"phase-8 doc missing `{label}`")

    return results, errors


def _check_arch_docs() -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []

    for doc in REQUIRED_ARCH_DOCS:
        ok = doc.is_file()
        results.append({"name": f"arch doc exists: {doc.name}", "ok": ok, "target": doc.as_posix()})
        if not ok:
            errors.append(f"missing architecture doc: {doc.as_posix()}")

    if errors:
        return results, errors

    arch_text = (ROOT / "docs" / "architecture" / "FINAL_APP_ARCHITECTURE.md").read_text(encoding="utf-8")
    layout_text = (ROOT / "docs" / "architecture" / "REPOSITORY_LAYOUT.md").read_text(encoding="utf-8")

    patterns = [
        (arch_text, r"/donor/mythforge", "arch doc registers /donor/mythforge route"),
        (arch_text, r"/donor/orbis", "arch doc registers /donor/orbis route"),
        (arch_text, r"/donor/adventure", "arch doc registers /donor/adventure-generator route"),
        (arch_text, r"/compare/donors", "arch doc registers /compare/donors route"),
        (arch_text, r"cross-donor views|cross-donor surfaces", "arch doc describes cross-donor surfaces"),
        (arch_text, r"compatibility redirects|redirect-only compatibility paths", "arch doc classifies legacy redirects"),
        (layout_text, r"tests/\s*integration", "layout doc registers tests/integration folder"),
        (layout_text, r"UNIFIED_PRODUCT_DESIGN", "layout doc registers UNIFIED_PRODUCT_DESIGN artifact"),
    ]
    for text, pattern, label in patterns:
        ok = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL) is not None
        results.append({"name": label, "ok": ok})
        if not ok:
            errors.append(f"architecture doc missing `{label}`")

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
    app_routes = APP_ROOT / "src" / "routes" / "AppRoutes.tsx"
    product_boundary = APP_ROOT / "src" / "product" / "surface-contract.ts"
    product_landing = APP_ROOT / "src" / "product" / "UnifiedLandingPage.tsx"
    lens_panel = APP_ROOT / "src" / "product" / "SharedConceptLensPanel.tsx"
    results: list[dict[str, Any]] = []
    errors: list[str] = []

    route_text = app_routes.read_text(encoding="utf-8") if app_routes.is_file() else ""
    route_checks = [
        ('path="/"', "AppRoutes wires the product home route"),
        ('path="/:tab"', "AppRoutes wires the public product route family"),
        ('PublicRoute', "AppRoutes resolves the public product family through a dedicated route component"),
        ('defaultRouteForFamily("role")', "AppRoutes uses the role family as the public product default"),
        ('path="/compare"', "AppRoutes wires the product compare surface"),
        ('path="/compare/donors"', "AppRoutes wires the donor compare surface"),
        ("UnifiedLandingPage", "AppRoutes uses the unified landing page"),
    ]
    for needle, label in route_checks:
        ok = needle in route_text
        results.append({"name": label, "ok": ok})
        if not ok:
            errors.append(f"missing route wiring: {label}")

    for path, label, pattern in [
        (product_boundary, "product boundary contract exists", r"PRODUCT_SURFACE_BOUNDARY"),
        (product_landing, "unified landing page exists", r"Unified product surface"),
        (lens_panel, "shared concept lens panel exists", r"lens panel"),
    ]:
        ok = path.is_file()
        results.append({"name": label, "ok": ok, "target": path.as_posix()})
        if not ok:
            errors.append(f"missing phase-8 product file: {path.as_posix()}")
            continue
        text = path.read_text(encoding="utf-8")
        matched = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL) is not None
        results.append({"name": f"{label} content", "ok": matched})
        if not matched:
            errors.append(f"phase-8 product file missing required content: {label}")

    if product_boundary.is_file():
        boundary_text = product_boundary.read_text(encoding="utf-8")
        boundary_patterns = [
            (r"PRODUCT_SURFACE_BOUNDARY", "surface contract defines the product/donor boundary"),
            (r"SHARED_CONCEPT_FAMILIES", "surface contract defines shared concept families"),
            (r"CROSS_DONOR_JOURNEYS", "surface contract defines cross-donor journeys"),
            (r"biome-location", "surface contract names the biome/location family"),
            (r"entities", "surface contract names the entities family"),
            (r"workflows", "surface contract names the workflows family"),
            (r"simulation-events", "surface contract names the simulation-events family"),
            (r"projections", "surface contract names the projections family"),
            (r"attachments", "surface contract names the attachments family"),
        ]
        for pattern, label in boundary_patterns:
            ok = re.search(pattern, boundary_text, flags=re.IGNORECASE | re.DOTALL) is not None
            results.append({"name": label, "ok": ok})
            if not ok:
                errors.append(f"phase-8 product boundary missing `{label}`")

        route_boundary_patterns = [
            (r'recommendSurfaceForBundle', "surface contract exposes bundle-aware landing recommendation"),
            (r'PRODUCT_SURFACES', "surface contract enumerates the unified product surfaces"),
            (r'world', "surface contract includes the world surface"),
            (r'story', "surface contract includes the story surface"),
            (r'schema', "surface contract includes the schema surface"),
        ]
        for pattern, label in route_boundary_patterns:
            ok = re.search(pattern, boundary_text, flags=re.IGNORECASE | re.DOTALL) is not None
            results.append({"name": label, "ok": ok})
            if not ok:
                errors.append(f"phase-8 product boundary missing `{label}`")

    for test_file in REQUIRED_TEST_FILES:
        ok = test_file.is_file()
        results.append({"name": f"test exists: {test_file.name}", "ok": ok, "target": test_file.as_posix()})
        if not ok:
            errors.append(f"missing integration test file: {test_file.as_posix()}")

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
        phase_root = prepare_phase_scratch("phase-8-integration")
    elif scratch_root is not None:
        phase_root = prepare_phase_scratch("phase-8-integration", scratch_root=scratch_root)

    for collector in (_check_docs, _check_arch_docs, _check_package_scripts, _check_routes_and_tests):
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
    parser = argparse.ArgumentParser(description="Phase 8 unified product surface checker")
    parser.add_argument("--scratch-root", help="Write phase-8 scratch outputs under this directory")
    parser.add_argument("--report-path", help="Override the durable phase-8 report path")
    args = parser.parse_args()

    report_path = Path(args.report_path).resolve() if args.report_path else REPORT_PATH
    report = check(
        scratch_root=resolve_scratch_root(args.scratch_root) if args.scratch_root else None,
        report_path=report_path,
    )
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    register_artifact(
        report_path,
        phase=8,
        kind="durable_report",
        created_by="check_phase_8_integration",
        preserve_on_success=True,
        preserve_on_failure=True,
    )
    print(json.dumps(report, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

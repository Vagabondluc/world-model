"""Phase 9 rehost matrix.

This is a report-only harness that summarizes, per donor, whether the
implementation is source-vendored, route-mounted, bridge-wired,
parity-certified, e2e-enabled, and exact-mounted.

The matrix is intentionally stricter than a manifest dump, but it does not
replace the hard exactness gate. By default it reports status without failing
for incomplete donors. Use ``--require-exact`` when you want the matrix to act
as a gate.
"""
from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from typing import Any

from cleanup_runtime import register_artifact

ROOT = Path(__file__).resolve().parent.parent
WORKSPACE_ROOT = ROOT.parent
APP_ROOT = ROOT / "apps" / "unified-app"
REPORT_PATH = ROOT / "phase-9-rehost-matrix-report.json"
EXACTNESS_REPORT_PATH = ROOT / "phase-9-exact-donor-ui-report.json"
MANIFEST_PATH = APP_ROOT / "src" / "donors" / "exactness-manifest.json"
DONOR_SUBAPP_HOST_PATH = APP_ROOT / "src" / "donors" / "DonorSubappHost.tsx"

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
APP_DONORS = [
    "mythforge",
    "orbis",
    "adventure-generator",
    "mappa-imperium",
    "dawn-of-worlds",
    "faction-image",
    "watabou-city",
]
SOURCE_BACKED_DONORS = APP_DONORS + ["encounter-balancer"]

EXPECTED_CLASSIFICATION = {
    "mythforge": "app donor",
    "orbis": "app donor",
    "adventure-generator": "app donor",
    "mappa-imperium": "app donor",
    "dawn-of-worlds": "app donor",
    "faction-image": "app donor",
    "watabou-city": "clean-room app donor",
    "encounter-balancer": "scaffold-copy donor",
}

WATABOU_CLEAN_ROOM_SOURCE_ROOT = "to be merged/watabou-city-clean-room/2nd/"
FORBIDDEN_RUNTIME_DIRS = {"node_modules", ".git", ".next", "dist", "playwright-report", "test-results"}
FORBIDDEN_RUNTIME_FILES = {".env", ".env.local", ".env.development", ".env.production"}
FORBIDDEN_PLACEHOLDER_PATTERNS = [
    r"source baseline",
    r"SourceUiPreview",
    r"sourceUiUrl",
    r"live source UI",
    r"iframe",
    r"Open live source UI",
]


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.is_file() else ""


def _read_json(path: Path) -> dict[str, Any] | None:
    if not path.is_file():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def _path_from_manifest(value: str) -> Path:
    path = Path(value)
    if path.is_absolute():
        return path
    return (WORKSPACE_ROOT / path).resolve()


def _report_command_ok(report: dict[str, Any] | None, name: str) -> bool:
    if not report:
        return False
    for command in report.get("commands", []):
        if command.get("name") == name:
            return bool(command.get("ok"))
    return False


def _report_command_output(report: dict[str, Any] | None, name: str) -> str:
    if not report:
        return "missing exactness report"
    for command in report.get("commands", []):
        if command.get("name") == name:
            return str(command.get("output", ""))
    return f"missing command result for {name}"


def _has_nontrivial_source(root: Path) -> bool:
    if not root.is_dir():
        return False
    for pattern in ("src/**/*.tsx", "src/**/*.ts", "src/**/*.css", "src/**/*.scss", "src/**/*.svg", "src/**/*.png", "components/**/*.tsx", "public/**/*"):
        if any(path.is_file() for path in root.glob(pattern)):
            return True
    return False


def _has_forbidden_runtime_artifacts(root: Path) -> list[str]:
    violations: list[str] = []
    if not root.is_dir():
        return violations
    for path in root.rglob("*"):
        if not path.exists():
            continue
        parts = set(path.parts)
        if any(part in FORBIDDEN_RUNTIME_DIRS for part in parts):
            violations.append(path.as_posix())
            if len(violations) >= 5:
                break
        if path.is_file() and path.name in FORBIDDEN_RUNTIME_FILES:
            violations.append(path.as_posix())
            if len(violations) >= 5:
                break
    return violations


def _host_imports_donor(host_text: str, donor: str) -> bool:
    expected = f'../../../donors/{donor}/src/WorldModelDonorApp'
    return expected in host_text and f'"{donor}"' in host_text


def _conformance_has_placeholder_evidence(text: str) -> bool:
    return any(re.search(pattern, text, flags=re.IGNORECASE) for pattern in FORBIDDEN_PLACEHOLDER_PATTERNS)


def _source_vendored_status(donor: str, entry: dict[str, Any]) -> dict[str, Any]:
    root = _path_from_manifest(entry["vendoredRoot"])
    package_json = root / "package.json"
    entrypoint = root / "src" / "WorldModelDonorApp.tsx"
    source_files = _has_nontrivial_source(root)
    forbidden = _has_forbidden_runtime_artifacts(root)
    ok = root.is_dir() and package_json.is_file() and entrypoint.is_file() and source_files and not forbidden
    evidence = [
        f"vendored root: {root.as_posix()}",
        f"package.json: {'present' if package_json.is_file() else 'missing'}",
        f"WorldModelDonorApp.tsx: {'present' if entrypoint.is_file() else 'missing'}",
        f"nontrivial source: {'present' if source_files else 'missing'}",
    ]
    if forbidden:
        evidence.append(f"forbidden runtime artifacts: {', '.join(forbidden)}")
    return {"ok": ok, "evidence": evidence, "forbidden": forbidden}


def _route_mounted_status(donor: str, entry: dict[str, Any], host_text: str) -> dict[str, Any]:
    mount_kind = str(entry.get("mountKind", ""))
    implementation_status = str(entry.get("implementationStatus", ""))
    imports = _host_imports_donor(host_text, donor)
    ok = imports and mount_kind in {"rehost-mounted", "vendored-subapp", "representative-scaffold"} and implementation_status in {"rehost-mounted", "vendored-subapp", "representative-scaffold", "exact-vendored"}
    evidence = [
        f"DonorSubappHost import: {'present' if imports else 'missing'}",
        f"mountKind: {mount_kind or 'missing'}",
        f"implementationStatus: {implementation_status or 'missing'}",
    ]
    return {"ok": ok, "evidence": evidence}


def _bridge_wired_status(donor: str, entry: dict[str, Any], exactness_report: dict[str, Any] | None) -> dict[str, Any]:
    bridge = entry.get("canonicalBridge", {})
    projector = _path_from_manifest(str(bridge.get("projector", "")))
    action_translator = _path_from_manifest(str(bridge.get("actionTranslator", "")))
    tests = [
        _path_from_manifest(test_path)
        for test_path in bridge.get("tests", [])
        if isinstance(test_path, str)
    ]
    test_files_ok = projector.is_file() and action_translator.is_file() and all(test.is_file() for test in tests)
    suite_ok = _report_command_ok(exactness_report, "phase-9 bridge suite")
    ok = test_files_ok and suite_ok
    evidence = [
        f"projector: {'present' if projector.is_file() else 'missing'}",
        f"actionTranslator: {'present' if action_translator.is_file() else 'missing'}",
        f"bridge tests: {'all present' if tests and all(test.is_file() for test in tests) else 'missing'}",
        f"bridge suite: {'passed' if suite_ok else 'missing or failed'}",
    ]
    return {"ok": ok, "evidence": evidence}


def _parity_certified_status(donor: str, entry: dict[str, Any], exactness_report: dict[str, Any] | None) -> dict[str, Any]:
    conformance_suite = _path_from_manifest(str(entry.get("conformanceSuite", "")))
    suite_text = _read_text(conformance_suite)
    exactness_suite_ok = _report_command_ok(exactness_report, "phase-9 exactness suite")
    phase9b_suite_ok = _report_command_ok(exactness_report, "phase-9 phase9b suite")
    ok = conformance_suite.is_file() and not _conformance_has_placeholder_evidence(suite_text) and exactness_suite_ok and phase9b_suite_ok
    evidence = [
        f"conformance suite: {'present' if conformance_suite.is_file() else 'missing'}",
        f"placeholder evidence: {'present' if _conformance_has_placeholder_evidence(suite_text) else 'clean'}",
        f"exactness suite: {'passed' if exactness_suite_ok else 'missing or failed'}",
        f"phase9b suite: {'passed' if phase9b_suite_ok else 'missing or failed'}",
    ]
    return {"ok": ok, "evidence": evidence}


def _e2e_enabled_status(exactness_report: dict[str, Any] | None) -> dict[str, Any]:
    ok = _report_command_ok(exactness_report, "phase-9 donor e2e suite")
    evidence = [
        "phase-9 donor e2e suite: passed" if ok else f"phase-9 donor e2e suite: {_report_command_output(exactness_report, 'phase-9 donor e2e suite')}"
    ]
    return {"ok": ok, "evidence": evidence}


def _exact_mounted_status(
    source_vendored: bool,
    route_mounted: bool,
    bridge_wired: bool,
    parity_certified: bool,
    e2e_enabled: bool,
    entry: dict[str, Any],
) -> dict[str, Any]:
    claimed = str(entry.get("implementationStatus", ""))
    ok = all([source_vendored, route_mounted, bridge_wired, parity_certified, e2e_enabled, claimed == "exact-vendored"])
    evidence = [
        f"claimed implementationStatus: {claimed or 'missing'}",
        f"sourceVendored: {source_vendored}",
        f"routeMounted: {route_mounted}",
        f"bridgeWired: {bridge_wired}",
        f"parityCertified: {parity_certified}",
        f"e2eEnabled: {e2e_enabled}",
    ]
    return {"ok": ok, "evidence": evidence}


def _next_action(donor: str, classification: str, columns: dict[str, bool]) -> str:
    if not columns["sourceVendored"]:
        return f"Vendor {donor} into world-model/apps/donors/{donor} with package metadata, a WorldModelDonorApp entrypoint, and real source assets."
    if not columns["routeMounted"]:
        return f"Mount {donor} through DonorSubappHost so /donor/{donor} renders the vendored donor runtime instead of a scaffold placeholder."
    if not columns["bridgeWired"]:
        return f"Wire canonical projector/actionTranslator bridge coverage for {donor} and make its bridge test execute."
    if not columns["parityCertified"]:
        return f"Restore donor parity for {donor} with its conformance suite, baseline evidence, and browser-visible workflow coverage."
    if not columns["e2eEnabled"]:
        return f"Enable donor Playwright E2E for {donor} and rerun the donor-to-world-model parity contract."
    if columns["exactMounted"]:
        return f"{donor} is exact-vendored; keep the route, bridge, parity, and E2E evidence green."
    if classification == "clean-room app donor":
        return f"Promote {donor} to exact-vendored using the clean-room rehost and rerun the exactness gate."
    return f"Promote {donor} to exact-vendored and rerun the exact donor UI gate."


def _build_donor_report(
    donor: str,
    entry: dict[str, Any],
    host_text: str,
    exactness_report: dict[str, Any] | None,
) -> dict[str, Any]:
    source = _source_vendored_status(donor, entry)
    route = _route_mounted_status(donor, entry, host_text)
    bridge = _bridge_wired_status(donor, entry, exactness_report)
    parity = _parity_certified_status(donor, entry, exactness_report)
    e2e = _e2e_enabled_status(exactness_report)
    exact = _exact_mounted_status(source["ok"], route["ok"], bridge["ok"], parity["ok"], e2e["ok"], entry)
    columns = {
        "sourceVendored": bool(source["ok"]),
        "routeMounted": bool(route["ok"]),
        "bridgeWired": bool(bridge["ok"]),
        "parityCertified": bool(parity["ok"]),
        "e2eEnabled": bool(e2e["ok"]),
        "exactMounted": bool(exact["ok"]),
    }
    missing = [name for name, ok in columns.items() if not ok]
    if exact["ok"]:
        derived_status = "exact-vendored"
    elif route["ok"]:
        derived_status = "rehost-mounted"
    elif source["ok"]:
        derived_status = "source-vendored"
    else:
        derived_status = "missing"
    return {
        "id": donor,
        "label": entry.get("label"),
        "classification": entry.get("classification"),
        "mountKind": entry.get("mountKind"),
        "implementationStatus": entry.get("implementationStatus"),
        "derivedStatus": derived_status,
        "sourceVendored": columns["sourceVendored"],
        "routeMounted": columns["routeMounted"],
        "bridgeWired": columns["bridgeWired"],
        "parityCertified": columns["parityCertified"],
        "e2eEnabled": columns["e2eEnabled"],
        "exactMounted": columns["exactMounted"],
        "missing": missing,
        "evidence": {
            "sourceVendored": source["evidence"],
            "routeMounted": route["evidence"],
            "bridgeWired": bridge["evidence"],
            "parityCertified": parity["evidence"],
            "e2eEnabled": e2e["evidence"],
            "exactMounted": exact["evidence"],
        },
        "nextAction": _next_action(donor, str(entry.get("classification", "")), columns),
    }


def _build_report(*, require_exact: bool = False, report_path: Path = REPORT_PATH) -> dict[str, Any]:
    manifest = _read_json(MANIFEST_PATH)
    exactness_report = _read_json(EXACTNESS_REPORT_PATH)
    host_text = _read_text(DONOR_SUBAPP_HOST_PATH)
    report: dict[str, Any] = {
        "ok": True,
        "mode": "require-exact" if require_exact else "report-only",
        "workspace_root": ROOT.as_posix(),
        "app_root": APP_ROOT.as_posix(),
        "report_path": report_path.as_posix(),
        "checks": [],
        "donors": {},
        "summary": {
            "sourceVendored": 0,
            "routeMounted": 0,
            "bridgeWired": 0,
            "parityCertified": 0,
            "e2eEnabled": 0,
            "exactMounted": 0,
        },
        "errors": [],
    }

    if not manifest:
        report["ok"] = False
        report["errors"].append(f"missing manifest: {MANIFEST_PATH.as_posix()}")
        return report
    if not exactness_report:
        report["ok"] = False
        report["errors"].append(f"missing exactness report: {EXACTNESS_REPORT_PATH.as_posix()}")
        return report
    if not DONOR_SUBAPP_HOST_PATH.is_file():
        report["ok"] = False
        report["errors"].append(f"missing donor subapp host: {DONOR_SUBAPP_HOST_PATH.as_posix()}")
        return report

    donors = manifest.get("donors", {})
    for donor in DONOR_IDS:
        entry = donors.get(donor)
        if not isinstance(entry, dict):
            report["ok"] = False
            report["errors"].append(f"{donor} missing from exactness manifest")
            continue
        donor_report = _build_donor_report(donor, entry, host_text, exactness_report)
        report["donors"][donor] = donor_report
        for key in ("sourceVendored", "routeMounted", "bridgeWired", "parityCertified", "e2eEnabled", "exactMounted"):
            report["summary"][key] += int(bool(donor_report[key]))
        if require_exact and not donor_report["exactMounted"]:
            report["ok"] = False
            report["errors"].append(
                f"{donor} is not exact-mounted; missing: {', '.join(donor_report['missing']) or 'unknown'}"
            )

    if require_exact and report["errors"]:
        report["ok"] = False

    report["summary"]["total"] = len(report["donors"])
    report["summary"]["routeMountedOrExact"] = sum(1 for donor in report["donors"].values() if donor["routeMounted"] or donor["exactMounted"])
    report["summary"]["sourceRootClassifications"] = {
        donor: report["donors"][donor]["derivedStatus"] for donor in report["donors"]
    }
    return report


def check(*, require_exact: bool = False, report_path: Path = REPORT_PATH) -> dict[str, Any]:
    return _build_report(require_exact=require_exact, report_path=report_path)


def main() -> int:
    parser = argparse.ArgumentParser(description="Phase 9 rehost matrix")
    parser.add_argument("--require-exact", action="store_true", help="Fail unless every donor is exact-mounted")
    parser.add_argument("--report-path", help="Override the durable phase-9 rehost matrix report path")
    args = parser.parse_args()

    report_path = Path(args.report_path).resolve() if args.report_path else REPORT_PATH
    report = check(require_exact=args.require_exact, report_path=report_path)
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    register_artifact(
        report_path,
        phase=9,
        kind="durable_report",
        created_by="check_phase_9_rehost_matrix",
        preserve_on_success=True,
        preserve_on_failure=True,
    )
    print(json.dumps(report, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

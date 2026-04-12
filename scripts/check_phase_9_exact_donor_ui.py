"""Phase 9B exact donor-ui verification checker.

The Phase 9 inventory checker proves that the donor set is present. This
checker is stricter: it fails unless donor UI evidence is executable and no
current scaffold can self-attest as behavior-exact.
"""
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
WORKSPACE_ROOT = ROOT.parent
APP_ROOT = ROOT / "apps" / "unified-app"
DONOR_HARNESS_ROOT = ROOT / "apps" / "donor-harness"
REPORT_PATH = ROOT / "phase-9-exact-donor-ui-report.json"
DONOR_E2E_REPORT_PATH = ROOT / "phase-9-donor-e2e-report.json"
MANIFEST_PATH = APP_ROOT / "src" / "donors" / "exactness-manifest.json"
CONFIG_PATH = APP_ROOT / "src" / "donors" / "config.ts"
DONOR_PAGE_PATH = APP_ROOT / "src" / "donors" / "DonorPage.tsx"
DONOR_SUBAPP_HOST_PATH = APP_ROOT / "src" / "donors" / "DonorSubappHost.tsx"
NAVIGATION_PATH = APP_ROOT / "src" / "shell" / "Navigation.tsx"
CONTEXT_BAR_PATH = APP_ROOT / "src" / "shell" / "ContextBar.tsx"
NPM_BIN = "npm.cmd" if os.name == "nt" else "npm"
COMMAND_TIMEOUT_SECONDS = int(os.environ.get("PHASE9B_COMMAND_TIMEOUT_SECONDS", "120"))

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
SCAFFOLD_DONORS = ["encounter-balancer"]
EXACT_UI_DONORS = APP_DONORS + SCAFFOLD_DONORS

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

ACCEPTABLE_MOUNT_KINDS = {
    "app donor": {"scaffold-mounted", "rehost-mounted", "vendored-subapp"},
    "clean-room app donor": {"scaffold-mounted", "rehost-mounted", "vendored-subapp"},
    "scaffold-copy donor": {"scaffold-mounted", "representative-scaffold"},
}
EXACT_MOUNT_KINDS = {"rehost-mounted", "vendored-subapp", "representative-scaffold"}
EXACT_IMPLEMENTATION_STATUS = "exact-vendored"
WATABOU_CLEAN_ROOM_SOURCE_ROOT = "to be merged/watabou-city-clean-room/2nd/"

FORBIDDEN_CONFORMANCE_PATTERNS = [
    r"source baseline",
    r"SourceUiPreview",
    r"sourceUiUrl",
    r"live source UI",
    r"iframe",
    r"Open live source UI",
]


def _add_check(
    results: list[dict[str, Any]],
    errors: list[str],
    name: str,
    ok: bool,
    *,
    target: str | None = None,
    message: str | None = None,
) -> None:
    check: dict[str, Any] = {"name": name, "ok": ok}
    if target:
        check["target"] = target
    if message and not ok:
        check["message"] = message
    results.append(check)
    if not ok:
        errors.append(message or name)


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.is_file() else ""


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _path_from_manifest(value: str) -> Path:
    path = Path(value)
    if path.is_absolute():
        return path
    return (WORKSPACE_ROOT / path).resolve()


def _expected_vendored_root(donor: str) -> str:
    return f"world-model/apps/donors/{donor}"


def _expected_bridge_test(donor: str) -> str:
    return f"world-model/apps/unified-app/tests/conformance/{donor}.bridge.test.ts"


def _expected_conformance_suite(donor: str) -> str:
    return f"world-model/apps/unified-app/tests/conformance/{donor}.conformance.test.tsx"


def _expected_characterization_baseline(donor: str) -> str:
    return f"world-model/tests/characterization/{donor}/captured/"


def _expected_subapp_import(donor: str) -> str:
    return f"../../../donors/{donor}/src/WorldModelDonorApp"


def _donor_subapp_host_mounts_donor(donor: str, host_text: str) -> bool:
    return f'"{donor}"' in host_text and _expected_subapp_import(donor) in host_text


def _expected_clone_roots() -> list[Path]:
    return [
        WORKSPACE_ROOT / "to be merged" / "apocalypse",
        WORKSPACE_ROOT / "to be merged" / "character-creator",
        WORKSPACE_ROOT / "to be merged" / "deity creator",
        WORKSPACE_ROOT / "to be merged" / "genesis",
    ]


def _has_donor_subapp_package(root: Path) -> bool:
    return (root / "package.json").is_file()


def _has_world_model_entrypoint(root: Path) -> bool:
    return (root / "src" / "WorldModelDonorApp.tsx").is_file()


def _has_style_or_asset_evidence(root: Path) -> bool:
    if not root.is_dir():
        return False
    evidence_patterns = (
        "*.css",
        "src/**/*.css",
        "src/**/*.scss",
        "src/**/*.svg",
        "src/**/*.png",
        "src/**/*.jpg",
        "src/**/*.jpeg",
        "src/components/**/*.tsx",
        "components/**/*.tsx",
        "public/**/*",
        "PNG/**/*",
        "icons/**/*",
    )
    for pattern in evidence_patterns:
        if any(path.is_file() for path in root.glob(pattern)):
            return True
    return False


def _is_marker_only_runtime(root: Path) -> bool:
    files = [path for path in root.rglob("*") if path.is_file()] if root.is_dir() else []
    return len(files) == 1 and files[0].name == "runtime.ts"


def _run(command: list[str], cwd: Path, *, phase_root: Path | None, name: str) -> dict[str, Any]:
    try:
        proc = subprocess.run(
            command,
            cwd=str(cwd),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False,
            timeout=COMMAND_TIMEOUT_SECONDS,
        )
    except subprocess.TimeoutExpired as exc:
        output = "\n".join(
            part for part in ((exc.stdout or "").strip(), (exc.stderr or "").strip()) if isinstance(part, str) and part
        ).strip()
        message = output or f"timed out after {COMMAND_TIMEOUT_SECONDS}s"
        write_command_log(name, message, phase_root=phase_root)
        return {
            "name": name,
            "command": " ".join(command),
            "ok": False,
            "returncode": "timeout",
            "output": message,
            "rerun": f"cd {cwd.as_posix()} && {' '.join(command)}",
        }
    output = "\n".join(part for part in ((proc.stdout or "").strip(), (proc.stderr or "").strip()) if part).strip()
    write_command_log(name, output or "ok", phase_root=phase_root)
    return {
        "name": name,
        "command": " ".join(command),
        "ok": proc.returncode == 0,
        "returncode": proc.returncode,
        "output": output or "ok",
        "rerun": f"cd {cwd.as_posix()} && {' '.join(command)}",
    }


def _load_manifest() -> dict[str, Any]:
    return _read_json(MANIFEST_PATH)


def _check_manifest_and_config(manifest: dict[str, Any]) -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    required_sources = [
        MANIFEST_PATH,
        CONFIG_PATH,
        DONOR_PAGE_PATH,
        DONOR_SUBAPP_HOST_PATH,
        NAVIGATION_PATH,
        CONTEXT_BAR_PATH,
    ]
    for path in required_sources:
        _add_check(results, errors, f"exactness source exists: {path.name}", path.is_file(), target=path.as_posix())
    if errors:
        return results, errors

    manifest_text = _read_text(MANIFEST_PATH)
    config_text = _read_text(CONFIG_PATH)
    donor_page_text = _read_text(DONOR_PAGE_PATH)
    donor_subapp_host_text = _read_text(DONOR_SUBAPP_HOST_PATH)
    navigation_text = _read_text(NAVIGATION_PATH)
    context_bar_text = _read_text(CONTEXT_BAR_PATH)

    _add_check(
        results,
        errors,
        "config.ts imports the exactness manifest",
        'exactness-manifest.json' in config_text,
        target=CONFIG_PATH.as_posix(),
        message="config.ts must import exactness-manifest.json instead of hardcoding donor registry evidence",
    )
    _add_check(
        results,
        errors,
        "DonorPage no longer renders SourceUiPreview",
        "SourceUiPreview" not in donor_page_text,
        target=DONOR_PAGE_PATH.as_posix(),
        message="DonorPage still renders SourceUiPreview; source previews belong on compare/debug surfaces only",
    )
    _add_check(
        results,
        errors,
        "DonorPage no longer uses DonorRuntimeHost as the primary donor route body",
        "DonorRuntimeHost" not in donor_page_text,
        target=DONOR_PAGE_PATH.as_posix(),
        message="DonorPage still mounts DonorRuntimeHost; app donor routes must mount the donor subapp entrypoint directly",
    )
    _add_check(
        results,
        errors,
        "DonorSubappHost does not use SourceUiPreview",
        "SourceUiPreview" not in donor_subapp_host_text,
        target=DONOR_SUBAPP_HOST_PATH.as_posix(),
        message="DonorSubappHost must not use SourceUiPreview; source previews belong on compare/debug surfaces only",
    )
    _add_check(
        results,
        errors,
        "DonorSubappHost does not use DonorRuntimeHost",
        "DonorRuntimeHost" not in donor_subapp_host_text,
        target=DONOR_SUBAPP_HOST_PATH.as_posix(),
        message="DonorSubappHost must mount donor subapp entrypoints directly, not the retired DonorRuntimeHost",
    )
    _add_check(
        results,
        errors,
        "Navigation no longer advertises live source UI routes",
        "Live source UI" not in navigation_text,
        target=NAVIGATION_PATH.as_posix(),
        message="Navigation still advertises live source UI routes for donors",
    )
    _add_check(
        results,
        errors,
        "ContextBar no longer labels donor routes as live source UI routes",
        "live source UI route" not in context_bar_text,
        target=CONTEXT_BAR_PATH.as_posix(),
        message="ContextBar still labels donor routes as live source UI routes",
    )
    _add_check(
        results,
        errors,
        "mechanical-sycophant is excluded from the manifest",
        "mechanical-sycophant" not in manifest_text,
        target=MANIFEST_PATH.as_posix(),
        message="mechanical-sycophant must not appear in the donor manifest",
    )

    donor_order = manifest.get("donorOrder", [])
    donors = manifest.get("donors", {})
    _add_check(
        results,
        errors,
        "manifest donor order covers the frozen donor set",
        donor_order == DONOR_IDS,
        target=MANIFEST_PATH.as_posix(),
        message="manifest donor order must match the frozen eight-donor inventory",
    )
    _add_check(
        results,
        errors,
        "manifest donor keys cover the frozen donor set",
        set(donors.keys()) == set(DONOR_IDS),
        target=MANIFEST_PATH.as_posix(),
        message="manifest donor keys must match the frozen eight-donor inventory",
    )

    for donor in DONOR_IDS:
        entry = donors.get(donor)
        if not isinstance(entry, dict):
            _add_check(results, errors, f"{donor} manifest entry exists", False, target=MANIFEST_PATH.as_posix(), message=f"{donor} missing from exactness manifest")
            continue

        classification = entry.get("classification")
        mount_kind = entry.get("mountKind")
        implementation_status = entry.get("implementationStatus")
        canonical_bridge = entry.get("canonicalBridge", {})
        acceptable_mount_kinds = ACCEPTABLE_MOUNT_KINDS.get(EXPECTED_CLASSIFICATION[donor], set())

        _add_check(results, errors, f"{donor} classification matches donor class", classification == EXPECTED_CLASSIFICATION[donor], message=f"{donor} classification is `{classification}`, expected `{EXPECTED_CLASSIFICATION[donor]}`")
        _add_check(results, errors, f"{donor} mountKind is valid for donor class", mount_kind in acceptable_mount_kinds, message=f"{donor} mountKind is `{mount_kind}`, expected one of {sorted(acceptable_mount_kinds)}")
        _add_check(results, errors, f"{donor} vendoredRoot follows donor convention", entry.get("vendoredRoot") == _expected_vendored_root(donor), message=f"{donor} vendoredRoot is `{entry.get('vendoredRoot')}`, expected `{_expected_vendored_root(donor)}`")
        _add_check(results, errors, f"{donor} characterization baseline follows donor convention", entry.get("characterizationBaseline") == _expected_characterization_baseline(donor), message=f"{donor} characterizationBaseline is `{entry.get('characterizationBaseline')}`, expected `{_expected_characterization_baseline(donor)}`")
        _add_check(results, errors, f"{donor} conformance suite follows donor convention", entry.get("conformanceSuite") == _expected_conformance_suite(donor), message=f"{donor} conformanceSuite is `{entry.get('conformanceSuite')}`, expected `{_expected_conformance_suite(donor)}`")
        _add_check(results, errors, f"{donor} projector follows donor convention", canonical_bridge.get("projector") == f"world-model/apps/unified-app/src/donors/bridges/{donor}/projector.ts", message=f"{donor} projector is `{canonical_bridge.get('projector')}`")
        _add_check(results, errors, f"{donor} actionTranslator follows donor convention", canonical_bridge.get("actionTranslator") == f"world-model/apps/unified-app/src/donors/bridges/{donor}/actionTranslator.ts", message=f"{donor} actionTranslator is `{canonical_bridge.get('actionTranslator')}`")
        _add_check(results, errors, f"{donor} bridge tests follow donor convention", canonical_bridge.get("tests") == [_expected_bridge_test(donor)], message=f"{donor} bridge tests are `{canonical_bridge.get('tests')}`, expected `[{_expected_bridge_test(donor)}]`")
        _add_check(
            results,
            errors,
            f"{donor} exactness status is not self-attesting",
            implementation_status != EXACT_IMPLEMENTATION_STATUS or mount_kind in EXACT_MOUNT_KINDS,
            message=f"{donor} claims `{implementation_status}` with non-exact mountKind `{mount_kind}`",
        )
        if donor in EXACT_UI_DONORS:
            _add_check(
                results,
                errors,
                f"{donor} has behavior-exact implementation status",
                implementation_status == EXACT_IMPLEMENTATION_STATUS,
                message=f"{donor} is `{implementation_status}`; exactness requires `{EXACT_IMPLEMENTATION_STATUS}` after a real donor subapp package, route mount, bridge, and parity suite exist.",
            )
        if donor == "watabou-city":
            _add_check(
                results,
                errors,
                "watabou-city source root points at the clean-room implementation",
                entry.get("sourceRoot") == WATABOU_CLEAN_ROOM_SOURCE_ROOT,
                message=f"watabou-city sourceRoot is `{entry.get('sourceRoot')}`, expected `{WATABOU_CLEAN_ROOM_SOURCE_ROOT}`",
            )

    return results, errors


def _check_runtime_root_evidence(donor: str, root: Path) -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    _add_check(results, errors, f"{donor} donor root exists", root.exists(), target=root.as_posix(), message=f"{donor} missing donor root: {root.as_posix()}")
    _add_check(results, errors, f"{donor} donor root is not marker-only", not _is_marker_only_runtime(root), target=root.as_posix(), message=f"{donor} root is still only a runtime.ts marker; vendor a real donor subapp package")
    _add_check(results, errors, f"{donor} donor subapp package metadata exists", _has_donor_subapp_package(root), target=(root / "package.json").as_posix(), message=f"{donor} missing donor subapp package metadata")
    _add_check(results, errors, f"{donor} WorldModelDonorApp entrypoint exists", _has_world_model_entrypoint(root), target=(root / "src" / "WorldModelDonorApp.tsx").as_posix(), message=f"{donor} missing WorldModelDonorApp entrypoint")
    _add_check(results, errors, f"{donor} style, asset, or visual component evidence exists", _has_style_or_asset_evidence(root), target=root.as_posix(), message=f"{donor} missing style/assets/visual component evidence under its donor subapp root")
    return results, errors


def _check_static_evidence(manifest: dict[str, Any]) -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    donors = manifest.get("donors", {})
    donor_subapp_host_text = _read_text(DONOR_SUBAPP_HOST_PATH)

    for donor in EXACT_UI_DONORS:
        entry = donors[donor]
        mount_kind = entry.get("mountKind")
        implementation_status = entry.get("implementationStatus")
        runtime_results, runtime_errors = _check_runtime_root_evidence(donor, _path_from_manifest(entry["vendoredRoot"]))
        results.extend(runtime_results)
        errors.extend(runtime_errors)
        if mount_kind in EXACT_MOUNT_KINDS or implementation_status in {"rehost-mounted", EXACT_IMPLEMENTATION_STATUS}:
            _add_check(
                results,
                errors,
                f"{donor} donor subapp route mount is registered",
                _donor_subapp_host_mounts_donor(donor, donor_subapp_host_text),
                target=DONOR_SUBAPP_HOST_PATH.as_posix(),
                message=f"{donor} is `{implementation_status}`/`{mount_kind}` but DonorSubappHost does not import `{_expected_subapp_import(donor)}`",
            )
        for label, configured_path in [
            ("characterization baseline", entry["characterizationBaseline"]),
            ("conformance suite", entry["conformanceSuite"]),
            ("canonical projector", entry["canonicalBridge"]["projector"]),
            ("canonical action translator", entry["canonicalBridge"]["actionTranslator"]),
            ("canonical bridge test", entry["canonicalBridge"]["tests"][0]),
        ]:
            path = _path_from_manifest(configured_path)
            ok = path.is_file() if label in {"conformance suite", "canonical projector", "canonical action translator", "canonical bridge test"} else path.exists()
            _add_check(results, errors, f"{donor} {label} exists", ok, target=path.as_posix(), message=f"{donor} missing {label}: {configured_path}")

    for clone_root in _expected_clone_roots():
        _add_check(
            results,
            errors,
            f"encounter-balancer clone root exists: {clone_root.name}",
            clone_root.is_dir(),
            target=clone_root.as_posix(),
            message=f"encounter-balancer clone root missing: {clone_root.as_posix()}",
        )

    return results, errors


def _run_phase9b_commands(phase_root: Path | None, *, include_e2e: bool = True) -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    commands = [
        ("phase-9 bridge suite", [NPM_BIN, "run", "test:conformance:bridges"], APP_ROOT),
        ("phase-9 mount suite", [NPM_BIN, "run", "test:conformance:mounts"], APP_ROOT),
        ("phase-9 exactness suite", [NPM_BIN, "run", "test:conformance:exactness"], APP_ROOT),
        ("phase-9 phase9b suite", [NPM_BIN, "run", "test:conformance:phase9b"], APP_ROOT),
    ]
    for name, command, cwd in commands:
        result = _run(command, cwd, phase_root=phase_root, name=name)
        results.append(result)
        if not result["ok"]:
            errors.append(f"{name} failed: {result['output']}")
    if include_e2e:
        result = _run([NPM_BIN, "run", "test:e2e:donor-world-model"], DONOR_HARNESS_ROOT, phase_root=phase_root, name="phase-9 donor e2e suite")
        results.append(result)
        if not result["ok"]:
            errors.append(f"phase-9 donor e2e suite failed: {result['output']}")
    else:
        result = {
            "name": "phase-9 donor e2e suite",
            "command": "npm run test:e2e:donor-world-model",
            "ok": False,
            "returncode": "skipped",
            "output": "skipped because donor routes are not yet exact-mounted and parity-certified; wire donor subapps and promote exactness before browser parity",
            "rerun": f"cd {DONOR_HARNESS_ROOT.as_posix()} && npm run test:e2e:donor-world-model",
        }
        results.append(result)
        errors.append("phase-9 donor e2e suite skipped: donor routes are not yet exact-mounted and parity-certified")
    if include_e2e:
        _add_check(
            results,
            errors,
            "phase-9 donor e2e report exists",
            DONOR_E2E_REPORT_PATH.is_file(),
            target=DONOR_E2E_REPORT_PATH.as_posix(),
            message="phase-9 donor e2e report is missing after the Playwright run",
        )
    else:
        results.append(
            {
                "name": "phase-9 donor e2e report fresh for this run",
                "ok": False,
                "target": DONOR_E2E_REPORT_PATH.as_posix(),
                "message": "E2E was skipped because donor routes are not yet exact-mounted and parity-certified; ignore any stale prior E2E report.",
            }
        )
    return results, errors


def _scan_forbidden_patterns() -> tuple[list[dict[str, Any]], list[str]]:
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    donor_test_files = list((APP_ROOT / "tests" / "conformance").glob("*.conformance.test.tsx")) + list((APP_ROOT / "tests" / "integration").glob("*.test.tsx"))
    for path in donor_test_files:
        text = _read_text(path)
        for pattern in FORBIDDEN_CONFORMANCE_PATTERNS:
            ok = re.search(pattern, text, flags=re.IGNORECASE) is None
            _add_check(results, errors, f"{path.name} does not contain `{pattern}` placeholder evidence", ok, target=path.as_posix(), message=f"{path.name} still contains placeholder evidence matching `{pattern}`")
    return results, errors


def check(*, scratch_root: Path | None = None, report_path: Path = REPORT_PATH) -> dict[str, Any]:
    manifest = _load_manifest()
    report: dict[str, Any] = {
        "ok": True,
        "workspace_root": ROOT.as_posix(),
        "app_root": APP_ROOT.as_posix(),
        "scope": "phase-9 exact donor-ui verification",
        "report_path": report_path.as_posix(),
        "checks": [],
        "commands": [],
        "errors": [],
    }
    if scratch_root is None and env_run_root() is not None:
        phase_root = prepare_phase_scratch("phase-9-exact-donor-ui")
    elif scratch_root is not None:
        phase_root = prepare_phase_scratch("phase-9-exact-donor-ui", scratch_root=scratch_root)
    else:
        phase_root = None

    for collector in (
        lambda: _check_manifest_and_config(manifest),
        lambda: _check_static_evidence(manifest),
        _scan_forbidden_patterns,
    ):
        results, errors = collector()
        report["checks"].extend(results)
        if errors:
            report["ok"] = False
            report["errors"].extend(errors)

    include_e2e = not any(
        "WorldModelDonorApp" in error or "runtime.ts marker" in error or "exactness requires" in error
        for error in report["errors"]
    )
    command_results, command_errors = _run_phase9b_commands(phase_root, include_e2e=include_e2e)
    report["commands"].extend(command_results)
    report["checks"].extend(command_results)
    if command_errors:
        report["ok"] = False
        report["errors"].extend(command_errors)

    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Phase 9B exact donor-ui verification checker")
    parser.add_argument("--scratch-root", help="Write phase-9B scratch outputs under this directory")
    parser.add_argument("--report-path", help="Override the durable phase-9B report path")
    args = parser.parse_args()

    report_path = Path(args.report_path).resolve() if args.report_path else REPORT_PATH
    report = check(
        scratch_root=resolve_scratch_root(args.scratch_root) if args.scratch_root else None,
        report_path=report_path,
    )
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    register_artifact(
        report_path,
        phase=9,
        kind="durable_report",
        created_by="check_phase_9_exact_donor_ui",
        preserve_on_success=True,
        preserve_on_failure=True,
    )
    print(json.dumps(report, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

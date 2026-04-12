"""Phase 2 gate: Adapter Snapshots and mapping integrity."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

from .base import GateReport, Remediation

PHASE = 2
NAME = "Adapter Snapshots"
WM = "world-model"
_RERUN = f"python {WM}/scripts/run_harness.py --phase 2"
_CHECK_CMD = ["python", f"{WM}/scripts/check_phase_2_snapshots.py"]
_BOOTSTRAP = f"python {WM}/scripts/run_harness.py --bootstrap --phase 2"
_EXPECTED_DONORS = ["mythforge", "orbis", "adventure-generator"]
_INTEGRITY_REPORT = Path(WM) / "phase-2-snapshot-integrity-report.json"
_BUILD_REPORT = Path(WM) / "phase-2-snapshot-build-report.json"


def _run_integrity_check() -> tuple[bool, str]:
    proc = subprocess.run(_CHECK_CMD, capture_output=True, text=True, encoding="utf-8", errors="replace", check=False)
    output = "\n".join(part for part in ((proc.stdout or "").strip(), (proc.stderr or "").strip()) if part).strip()
    if proc.returncode == 0:
        return True, output or "phase-2 snapshot integrity checker passed"
    if _INTEGRITY_REPORT.is_file():
        try:
            payload = json.loads(_INTEGRITY_REPORT.read_text(encoding="utf-8"))
            errors = payload.get("errors", [])
            if errors:
                return False, errors[0]
        except Exception:
            pass
    return False, output or "phase-2 snapshot integrity checker failed"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    # Core normalized Phase 2 surface.
    r.assert_dir(
        f"{WM}/adapters",
        "2.0 adapters/ root exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/adapters",
            rerun_cmd=_RERUN,
            notes="Create normalized adapter roots under world-model/adapters/<donor>/",
        ),
    )
    r.assert_file(
        f"{WM}/adapters/concept-family-registry.yaml",
        "2.0 concept-family registry exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/adapters/concept-family-registry.yaml",
            rerun_cmd=_RERUN,
            notes="Define allowed concept families and mandatory canonical coverage keys.",
        ),
    )

    for donor in _EXPECTED_DONORS:
        base = f"{WM}/adapters/{donor}"
        r.assert_dir(
            base,
            f"2.1 adapter root exists for {donor}",
            remediation=Remediation(
                action="create",
                target=base,
                rerun_cmd=_RERUN,
                notes=f"Bootstrap adapters with `{_BOOTSTRAP}` then replace all REPLACE_ placeholders.",
            ),
        )
        r.assert_file(
            f"{base}/manifest.yaml",
            f"2.1 manifest exists for {donor}",
            remediation=Remediation(
                action="create",
                target=f"{base}/manifest.yaml",
                template=f"{WM}/docs/templates/adapter-manifest-template.md",
                rerun_cmd=_RERUN,
            ),
        )
        r.assert_dir(
            f"{base}/source-snapshot",
            f"2.1 source-snapshot exists for {donor}",
            remediation=Remediation(
                action="run",
                target=f"python {WM}/scripts/build_adapter_snapshots.py --donor {donor}",
                rerun_cmd=_RERUN,
            ),
        )
        r.assert_dir(
            f"{base}/mappings",
            f"2.1 mappings dir exists for {donor}",
            remediation=Remediation(
                action="create",
                target=f"{base}/mappings",
                rerun_cmd=_RERUN,
            ),
        )
        r.assert_file(
            f"{base}/mappings/concept-map.yaml",
            f"2.1 concept-map exists for {donor}",
            remediation=Remediation(
                action="create",
                target=f"{base}/mappings/concept-map.yaml",
                rerun_cmd=_RERUN,
                notes="Map donor concepts to canonical keys/targets with winner+rationale+provenance.",
            ),
        )
        r.assert_dir(f"{base}/fixtures", f"2.1 fixtures dir exists for {donor}")
        r.assert_dir(f"{base}/tests", f"2.1 tests dir exists for {donor}")

    # Validator and checker scripts must exist.
    r.assert_file(
        f"{WM}/scripts/validate_adapter_manifest.py",
        "2.2 strict manifest validator script exists",
    )
    r.assert_file(
        f"{WM}/scripts/build_adapter_snapshots.py",
        "2.3 deterministic snapshot builder script exists",
    )
    r.assert_file(
        f"{WM}/scripts/check_phase_2_snapshots.py",
        "2.3 phase-2 integrity checker script exists",
    )

    ok, msg = _run_integrity_check()
    if ok:
        r.ok("2.8 integrity checker passes", msg)
    else:
        r.fail(
            "2.8 integrity checker passes",
            msg,
            remediation=Remediation(
                action="run",
                target="python world-model/scripts/check_phase_2_snapshots.py",
                rerun_cmd=_RERUN,
                notes="Fix manifest/mapping/snapshot errors reported in phase-2-snapshot-integrity-report.json.",
            ),
        )

    r.assert_file(
        f"{WM}/phase-2-snapshot-integrity-report.json",
        "2.8 integrity report exists",
        remediation=Remediation(
            action="run",
            target="python world-model/scripts/check_phase_2_snapshots.py",
            rerun_cmd=_RERUN,
        ),
    )
    r.assert_file(
        f"{WM}/phase-2-snapshot-build-report.json",
        "2.3 snapshot build report exists",
        remediation=Remediation(
            action="run",
            target="python world-model/scripts/build_adapter_snapshots.py --all",
            rerun_cmd=_RERUN,
        ),
    )

    # Documentation alignment.
    r.assert_file(
        f"{WM}/docs/adapters/ADAPTER_COPY_POLICY.md",
        "2.10 adapter copy policy doc exists",
    )
    r.assert_file_contains(
        f"{WM}/docs/adapters/ADAPTER_COPY_POLICY.md",
        r"adapters/<donor>/source-snapshot",
        "2.10 copy policy references adapters/<donor>/source-snapshot",
    )
    r.assert_file_contains(
        f"{WM}/docs/templates/adapter-manifest-template.md",
        r"adapters/<donor>/manifest.yaml|adapters/.*/manifest\.yaml",
        "2.10 manifest template references adapters/*",
    )
    r.assert_file_contains(
        f"{WM}/docs/roadmap/phase-2-adapter-snapshots.md",
        r"adapters/<donor>/source-snapshot|adapters/",
        "2.10 phase-2 roadmap references normalized adapters scope",
    )
    r.assert_file_contains(
        f"{WM}/docs/harness_checks.md",
        r"run_harness\.py --phase 2",
        "2.11 harness checks doc includes phase 2 command",
    )

    # Legacy snapshots remain audit-only and non-blocking.
    legacy_manifests = list((Path(WM) / "snapshots").glob("*/manifest.yaml"))
    if legacy_manifests:
        r.ok(
            "2.1 legacy snapshots are audit-only",
            f"{len(legacy_manifests)} legacy manifests under world-model/snapshots/ (non-blocking)",
        )
    else:
        r.ok("2.1 legacy snapshots are audit-only", "no legacy snapshot manifests found")

    # Boundary compatibility with Phase 0: no donor runtime imports in crate surface.
    r.assert_no_grep(
        r"(?:\.\./|\.\.\\|/)(?:mythforge|mechanical-sycophant|to be merged|antigravity)",
        f"{WM}/crates/**/*.rs",
        "2.8 no donor runtime imports in crates/",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/crates",
            rerun_cmd=_RERUN,
            notes="Replace direct donor-path references with adapter snapshots or canonical contracts.",
        ),
    )

    return r

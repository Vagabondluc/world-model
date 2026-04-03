"""Phase 0 gate: Boundaries & Workspace Freeze.

Checks that ownership, app scope, adapter contracts, and repo layout are locked.
"""
from __future__ import annotations
import glob
import os
from .base import GateReport, Remediation, load_manifest_validator

PHASE = 0
NAME = "Boundaries & Workspace Freeze"
WM = "world-model"
_RERUN0 = f"python {WM}/scripts/run_harness.py --phase 0"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)
    validator = load_manifest_validator()

    # 0.1 Canonical ownership freeze
    r.assert_file(f"{WM}/docs/roadmap/phase-0-boundaries.md",
                  "0.1 Phase 0 roadmap doc exists")
    r.assert_file_contains(f"{WM}/docs/roadmap/phase-0-boundaries.md",
                           r"^---",
                           "0.1 Roadmap doc has YAML frontmatter")

    # 0.2 Final app scope: architecture docs exist and modes are named
    r.assert_file(
        f"{WM}/docs/architecture/FINAL_APP_ARCHITECTURE.md",
        "0.2 Final app architecture doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/architecture/FINAL_APP_ARCHITECTURE.md",
            rerun_cmd=_RERUN0,
            notes="Include mode names (Guided/Studio/Architect), apps/unified-app path, and shell panel layout.",
        ),
    )
    r.assert_file(
        f"{WM}/docs/architecture/REPOSITORY_LAYOUT.md",
        "0.2 Repository layout doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/architecture/REPOSITORY_LAYOUT.md",
            rerun_cmd=_RERUN0,
        ),
    )
    r.assert_file_contains(
        f"{WM}/docs/architecture/FINAL_APP_ARCHITECTURE.md",
        r"Guided|Studio|Architect",
        "0.2 Mode names (Guided/Studio/Architect) referenced in architecture doc",
        remediation=Remediation(
            action="edit",
            target=f"{WM}/docs/architecture/FINAL_APP_ARCHITECTURE.md",
            required_fields=["Guided mode", "Studio mode", "Architect mode"],
            rerun_cmd=_RERUN0,
            notes="Add a section describing the three user modes.",
        ),
    )

    # 0.3 Adapter boundary: every snapshot dir has a valid manifest
    snapshot_dirs = sorted([
        d for d in glob.glob(f"{WM}/snapshots/*/")
        if os.path.isdir(d)
    ])
    if not snapshot_dirs:
        r.fail("0.3 Snapshot directories exist",
               f"no directories found under {WM}/snapshots/")
    else:
        r.ok("0.3 Snapshot directories exist",
             f"{len(snapshot_dirs)} found")
        for s in snapshot_dirs:
            donor = os.path.basename(s.rstrip("/\\"))
            manifest = os.path.join(s, "manifest.yaml")
            if not os.path.isfile(manifest):
                r.fail(f"0.3 Manifest present for {donor}",
                       f"missing: {manifest}")
                continue
            try:
                data = validator.load_yaml(manifest)
                ok, msg = validator.validate_manifest(data)
                if ok:
                    r.ok(f"0.3 Manifest valid for {donor}", msg)
                else:
                    r.fail(f"0.3 Manifest valid for {donor}", msg)
            except Exception as e:
                r.fail(f"0.3 Manifest valid for {donor}", str(e))

    # 0.3 No hardcoded donor repo URLs in world-model Rust source
    r.assert_no_grep(
        r"github\.com/[A-Za-z0-9_-]+/(?:mythforge|orbis|adventure.generator)",
        f"{WM}/crates/**/*.rs",
        "0.3 No runtime donor repo URLs in crate source",
    )

    # 0.4 Repository layout: required top-level folders exist
    for folder, label in [
        (f"{WM}/docs",      "0.4 docs/ exists"),
        (f"{WM}/contracts", "0.4 contracts/ exists"),
        (f"{WM}/crates",    "0.4 crates/ exists"),
        (f"{WM}/scripts",   "0.4 scripts/ exists"),
        (f"{WM}/snapshots", "0.4 snapshots/ exists"),
    ]:
        r.assert_dir(folder, label)

    return r

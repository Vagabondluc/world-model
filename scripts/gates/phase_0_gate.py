"""Phase 0 gate: Boundaries & Workspace Freeze.

Checks that ownership, app scope, adapter contracts, and repo layout are locked.
"""
from __future__ import annotations
import glob
import json
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

    # 0.3 Adapter boundary: each adapter directory has a manifest
    adapter_dirs = sorted([
        d for d in glob.glob(f"{WM}/adapters/*/")
        if os.path.isdir(d)
    ])
    if not adapter_dirs:
        r.fail("0.3 Adapter directories exist",
               f"no directories found under {WM}/adapters/")
    else:
        r.ok("0.3 Adapter directories exist",
             f"{len(adapter_dirs)} found")
        for s in adapter_dirs:
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

    r.assert_file(
        f"{WM}/phase-0-inventory.json",
        "0.3 Phase 0 inventory JSON is committed",
        remediation=Remediation(
            action="create",
            target=f"{WM}/phase-0-inventory.json",
            rerun_cmd=_RERUN0,
            notes="Promote the generated inventory from phase-0-inventory.temp.json into the committed inventory file.",
        ),
    )

    r.assert_file(
        f"{WM}/phase-0-scan-scope.json",
        "0.3 Phase 0 scan scope config is committed",
        remediation=Remediation(
            action="create",
            target=f"{WM}/phase-0-scan-scope.json",
            rerun_cmd=_RERUN0,
            notes="Declare the deliverable scope and frozen donor roots so the scan/gate agree on what blocks Phase 0.",
        ),
    )

    triage_path = f"{WM}/phase-0-direct-imports-triage.json"
    if os.path.isfile(triage_path):
        try:
            with open(triage_path, "r", encoding="utf-8") as fh:
                triage = json.load(fh)
        except Exception as e:
            r.fail(
                "0.3 Direct-import triage JSON is readable",
                f"failed to parse {triage_path}: {e}",
            )
        else:
            runtime_outside_world_model = []
            for match in triage.get("matches", []):
                if match.get("classification") != "runtime":
                    continue
                path = str(match.get("path", "")).replace("\\", "/")
                if not path.startswith("world-model/"):
                    runtime_outside_world_model.append(match)

            if runtime_outside_world_model:
                samples = runtime_outside_world_model[:5]
                sample_text = "; ".join(
                    f"{m.get('path')}:{m.get('line')} -> {m.get('text')}"
                    for m in samples
                )
                r.fail(
                    "0.3 No runtime donor imports outside deliverable scope",
                    f"{len(runtime_outside_world_model)} runtime matches are outside the deliverable scope; samples: {sample_text}",
                    remediation=Remediation(
                        action="edit",
                        target=f"{WM}/docs/roadmap/phase-0/PHASE_0_TRIAGE_REMEDIATION.md",
                        rerun_cmd=_RERUN0,
                        notes="Move deliverable-scope runtime imports into adapter snapshots or vendor/canonicalize them before rerunning the harness. Frozen donor roots remain audit-only.",
                    ),
                )
            else:
                r.ok(
                    "0.3 No runtime donor imports outside deliverable scope",
                    "runtime matches are confined to the world-model deliverable surface",
                )
    else:
        r.fail(
            "0.3 Direct-import triage JSON exists",
            f"missing: {triage_path}",
            remediation=Remediation(
                action="create",
                target=triage_path,
                rerun_cmd=_RERUN0,
                notes="Run the phase-0 direct-import triage step before enforcing the runtime donor-import gate.",
            ),
        )

    # 0.4 Repository layout: required top-level folders exist
    for folder, label in [
        (f"{WM}/docs",      "0.4 docs/ exists"),
        (f"{WM}/contracts", "0.4 contracts/ exists"),
        (f"{WM}/crates",    "0.4 crates/ exists"),
        (f"{WM}/scripts",   "0.4 scripts/ exists"),
        (f"{WM}/adapters",  "0.4 adapters/ exists"),
    ]:
        r.assert_dir(folder, label)

    return r

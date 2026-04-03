"""Phase 2 gate: Adapter Snapshots.

Checks that each donor declared in spec-sources has a snapshot manifest
with concepts, mappings, and traceability fields.
"""
from __future__ import annotations
import os
from .base import GateReport, Remediation, load_manifest_validator

PHASE = 2
NAME = "Adapter Snapshots"
WM = "world-model"

_EXPECTED_DONORS = ["mythforge", "orbis", "adventure-generator"]
_TEMPLATE = f"{WM}/docs/templates/adapter-manifest-template.md"
_REQUIRED = ["id", "name", "source.repo", "source.commit", "snapshot", "mappings", "concepts"]
_RERUN = f"python {WM}/scripts/run_harness.py --phase 2"
_BOOTSTRAP = f"python {WM}/scripts/run_harness.py --bootstrap --phase 2"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)
    validator = load_manifest_validator()

    for donor in _EXPECTED_DONORS:
        manifest_path = f"{WM}/snapshots/{donor}/manifest.yaml"

        missing_rem = Remediation(
            action="create",
            target=manifest_path,
            template=_TEMPLATE,
            required_fields=_REQUIRED,
            rerun_cmd=_RERUN,
            notes=(
                f"Quick scaffold: run `{_BOOTSTRAP}` to auto-create a stub, "
                "then replace every REPLACE_ value before re-running."
            ),
        )
        if not r.assert_file(manifest_path, f"2.x Snapshot manifest for {donor}",
                             remediation=missing_rem):
            continue

        try:
            data = validator.load_yaml(manifest_path)
            ok, msg = validator.validate_manifest(data)
            if ok:
                r.ok(f"2.x Manifest valid for {donor}", msg)
            else:
                r.fail(f"2.x Manifest valid for {donor}", msg,
                       remediation=Remediation(
                           action="edit",
                           target=manifest_path,
                           template=_TEMPLATE,
                           required_fields=_REQUIRED,
                           rerun_cmd=_RERUN,
                           notes=f"Validation error: {msg}",
                       ))

            concepts = data.get("concepts", [])
            if concepts:
                r.ok(f"2.5 Concept families declared for {donor}",
                     f"{len(concepts)} concepts: {concepts[:3]}")
            else:
                r.fail(f"2.5 Concept families declared for {donor}",
                       "concepts field missing or empty",
                       remediation=Remediation(
                           action="edit",
                           target=manifest_path,
                           template=_TEMPLATE,
                           required_fields=["concepts"],
                           rerun_cmd=_RERUN,
                           notes="Add a `concepts:` list (e.g. character, location, item).",
                       ))

            mappings = data.get("mappings", [])
            if mappings:
                r.ok(f"2.5 Mappings declared for {donor}", f"{len(mappings)} entries")
            else:
                r.fail(f"2.5 Mappings declared for {donor}",
                       "mappings field missing or empty",
                       remediation=Remediation(
                           action="edit",
                           target=manifest_path,
                           template=_TEMPLATE,
                           required_fields=["mappings"],
                           rerun_cmd=_RERUN,
                       ))

        except Exception as e:
            r.fail(f"2.x Manifest parse for {donor}", str(e),
                   remediation=Remediation(
                       action="edit",
                       target=manifest_path,
                       template=_TEMPLATE,
                       required_fields=_REQUIRED,
                       rerun_cmd=_RERUN,
                   ))

    r.assert_glob_min(
        f"{WM}/docs/adapters/*.md", 3,
        "2.5 Adapter docs (>=3)",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/adapters/<donor>.md",
            template=f"{WM}/docs/adapters/MYTHFORGE_ADAPTER.md",
            rerun_cmd=_RERUN,
            notes="Create one adapter doc per donor under docs/adapters/.",
        ),
    )
    r.assert_file(
        f"{WM}/docs/adapters/ADAPTER_COPY_POLICY.md",
        "2.5 Adapter copy policy doc exists",
        remediation=Remediation(
            action="create",
            target=f"{WM}/docs/adapters/ADAPTER_COPY_POLICY.md",
            rerun_cmd=_RERUN,
            notes="Create a doc defining the policy for copying files from donor repos.",
        ),
    )

    return r

"""Phase 1 gate: Canonical Model.

Checks that canonical records, schemas, promotion rules, and wire contracts are stable.
"""
from __future__ import annotations
from .base import GateReport, Remediation
from .phase_1_contracts import check_phase_1_semantics

PHASE = 1
NAME = "Canonical Model"
WM = "world-model"
_CHECK_SCRIPT = f"python {WM}/scripts/check_phase_1_contracts.py"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    # 1.1 Canonical record freeze
    r.assert_file(
        f"{WM}/docs/roadmap/phase-1/PHASE_1_BASELINE_REPORT.md",
        "1.0 Phase 1 baseline report exists",
    )
    r.assert_file(f"{WM}/docs/CANONICAL_TRUNK_MODEL.md",
                  "1.1 Canonical trunk model doc exists")
    r.assert_file(f"{WM}/docs/data-model/CANONICAL_MODEL.md",
                  "1.1 Data-model canonical doc exists")
    for crate in ("world-model-core", "world-model-schema", "world-model-specs"):
        r.assert_dir(f"{WM}/crates/{crate}", f"1.1 Crate {crate}/ exists")

    # 1.2 Schema binding: JSON Schema contracts exist
    r.assert_glob_min(
        f"{WM}/contracts/json-schema/*.schema.json", 5,
        "1.2 JSON Schema contracts (>=5)",
    )

    # 1.3 Promotion freeze
    r.assert_glob_min(
        f"{WM}/contracts/promoted-schema/*.schema.json", 5,
        "1.3 Promoted-schema contracts (>=5)",
    )
    r.assert_file(f"{WM}/docs/PROMOTION_RULES.md",
                  "1.3 Promotion rules doc exists")
    r.assert_file(f"{WM}/docs/PROVENANCE_AND_CONFLICTS.md",
                  "1.3 Provenance and conflicts doc exists")

    # 1.4 Wire-contract freeze
    r.assert_file(f"{WM}/docs/SPEC_SOURCE_REGISTRY.md",
                  "1.4 Spec source registry exists")
    r.assert_file(f"{WM}/scripts/check_phase_1_contracts.py",
                  "1.4 Phase 1 contract check script exists")
    r.assert_glob_min(
        f"{WM}/spec-sources/*.toml", 3,
        "1.4 Spec-source donor manifests (>=3)",
    )
    r.assert_file(f"{WM}/contracts/json-schema/VERSION.txt",
                  "1.4 Contract version file exists")
    for promoted_artifact in [
        "promoted-concepts.json",
        "split-concepts.json",
        "spec-promotion-report.json",
    ]:
        r.assert_file(
            f"{WM}/contracts/promoted-schema/{promoted_artifact}",
            f"1.4 Promoted artifact {promoted_artifact} exists",
        )

    # 1.5 Change-management
    r.assert_file(f"{WM}/docs/adr/README.md",
                  "1.5 ADR folder exists (change management)")

    # 1.x Semantic freeze: tests and export determinism
    for result in check_phase_1_semantics():
        if result.passed:
            r.ok(result.name, result.message)
            continue

        target = " ".join(result.command)
        if "export" in result.name or "version" in result.name:
            target = _CHECK_SCRIPT
        r.fail(
            result.name,
            result.message,
            remediation=Remediation(
                action="run",
                target=target,
                rerun_cmd=_CHECK_SCRIPT,
                notes="Run the Phase 1 contract check script after fixing the failing semantic or export drift condition.",
            ),
        )

    return r

"""Phase 1 gate: Canonical Model.

Checks that canonical records, schemas, promotion rules, and wire contracts are stable.
"""
from __future__ import annotations
from .base import GateReport

PHASE = 1
NAME = "Canonical Model"
WM = "world-model"


def run() -> GateReport:
    r = GateReport(PHASE, NAME)

    # 1.1 Canonical record freeze
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
    r.assert_glob_min(
        f"{WM}/spec-sources/*.toml", 3,
        "1.4 Spec-source donor manifests (>=3)",
    )

    # 1.5 Change-management
    r.assert_file(f"{WM}/docs/adr/README.md",
                  "1.5 ADR folder exists (change management)")

    return r

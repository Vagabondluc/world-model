# Mythforge Docs Index

This directory contains the canonical documentation set for Mythforge.

## Canonical Documents

- [Documentation Normalization Plan](./DOCS_NORMALIZATION_PLAN.md)
- [Documentation Normalization Roadmap](./DOCS_NORMALIZATION_ROADMAP.md)
- [Schema Templates Index](./schema-templates/index.md)
- [UUID Container Architecture](./schema-templates/UUID_CONTAINER_ARCHITECTURE.md)
- [UUID Container Implementation Plan](./schema-templates/UUID_CONTAINER_IMPLEMENTATION_PLAN.md)
- [OpenUI OptionA Checklist](./loom/OPENUI_OPTIONA_SPEC.md)
- [OpenUI Integration Plan](./loom/OPENUi_INTEGRATION_PLAN.md)
- [OpenUI Integration Guide](./loom/OPENUi_INTEGRATION.md)
- [OpenUI Overlap Analysis](./loom/OPENUi_OVERLAP_ANALYSIS.md)
- [OpenUI MythForge Integration](./loom/OPENUi_MYTHFORGE_INTEGRATION.md)
- [The Loom README](./loom/README.md)
- [The Loom Specification](./loom/SPEC.md)
- [The Loom TDD Plan](./loom/TDD_PLAN.md)
- [Mythforge End Goal Specification](./specs/MYTHFORGE_ENDGOAL_SPEC.md)
- [Mythforge Inventory](./specs/MYTHFORGE_INVENTORY.md)

## Documentation Rules

- Use one canonical file per topic.
- Prefer short, direct sections with explicit status labels.
- Keep specs, implementation plans, and testing plans separate.
- Treat `docs/schema-templates` as the canonical schema/workflow source for category templates.
- If a doc describes a harness or test contract, it must also say where it is exercised in real UI flows.
- Any roadmap milestone that changes user-visible behavior must end with a manual UI test checkpoint.
- Every roadmap milestone should include atomic implementation actions and an exact browser/desktop gate test.
- Treat OpenUI docs as checklist-driven references, not as competing specs.

## Current Focus

The current cleanup pass is centered on:

- normalizing overlapping specs and plans
- aligning terminology across the Loom, schema-templates, OpenUI, and Mythforge core docs
- making the schema-templates folder the visible source of truth for category schemas, prompts, and workflow notes
- making the UUID container model the shared runtime concept across native and project schemas
- ensuring all E2E claims are backed by a real UI harness and not only unit tests
- adding onboarding-style checkpoints so the user confirms each milestone before the next one starts

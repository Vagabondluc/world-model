# Dependency Order and Milestones

## Dependency Order (high-level)
- [ ] Align schema and validation: `schema-validation.md` before any feature that adds new data shapes.
- [ ] Establish persistence and migration: `persistence.md` and `state-migration.md` before features that store new entities.
- [ ] Add identifiers: `uuid-integration.md` before cross-linking, graphing, or any new entity references.
- [ ] Implement core UX shells: `adventure-maker-ux.md` and `location-ux-overhaul.md` before feature-specific UI.
- [ ] Implement generators and feature logic: spec-specific generators after data + UX shells.
- [ ] Add tests and TDD plans after each feature or milestone slice.

## Milestone Map (minimal)

**MVP 0: Data Foundations**
- [ ] `schema-validation.md`
- [ ] `persistence.md`
- [ ] `state-migration.md`
- [ ] `uuid-integration.md`

**MVP 1: Core UX Shells**
- [ ] `adventure-maker-ux.md`
- [ ] `location-ux-overhaul.md`

**MVP 2: Core Workflows**
- [ ] `robust-adventure-workflow.md`
- [ ] `encounter-workflow-narrative.md`

**MVP 3: Core Generators**
- [ ] `cr-calculator.md`
- [ ] `spec-procedural-jobs.md`
- [ ] `procedural-simple-adventure.md`

**Phase 2: Expansion Features**
- [ ] `spec-compendium-graph.md`
- [ ] `spec-multi-plane-layers.md`
- [ ] `spec-ability-packs.md`
- [ ] `spec-no-atom.md`
- [ ] `narrative-encounter-designer.md`
- [ ] `quick-delve-procedural.md`
- [ ] `quick-delve-v3.md`

**Phase 3: Narrative Scripts**
- [ ] All specs under `docs/Narrative Scripts/specs/`

**Phase 4: TDD Plans**
- [ ] All specs under `docs/tdd/`

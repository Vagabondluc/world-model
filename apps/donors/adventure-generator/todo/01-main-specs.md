# Main Specs (docs/specs/)

## spec-compendium-graph.md
- [ ] Open `docs/specs/spec-compendium-graph.md` and extract acceptance criteria.
- [ ] Identify entities/links needed for the graph (nodes, edges, metadata).
- [ ] Add/extend schema/types for graph entities in the data layer.
- [ ] Build a data loader that exports graph-ready nodes/edges.
- [ ] Implement force-directed graph UI (initial render only).
- [ ] Add cross-link navigation on node click.
- [ ] Add timeline viewer stub wired to graph selection.
- [ ] Add navigation history (back/forward state) for graph interactions.
- [ ] Add unit tests for graph data builder.
- [ ] Add smoke test for graph UI mount.

## spec-ability-packs.md
- [ ] Open `docs/specs/spec-ability-packs.md` and extract acceptance criteria.
- [ ] Audit current theme/ability system for replacement points.
- [ ] Define ability pack schema (types, validations).
- [ ] Add ability pack storage/loading in state layer.
- [ ] Implement ability pack selection UI.
- [ ] Update generators to consume ability packs instead of theme.
- [ ] Add migration path for existing data.
- [ ] Add tests for pack selection and generator output.

## spec-no-atom.md
- [ ] Open `docs/specs/spec-no-atom.md` and extract acceptance criteria.
- [ ] Locate PowerAtom usage in monster generation.
- [ ] Define new self-contained rule engine interfaces.
- [ ] Replace PowerAtom integration with new engine.
- [ ] Update rule data loaders to match new engine.
- [ ] Remove PowerAtom dependency from build.
- [ ] Add regression tests for monster outputs.

## spec-multi-plane-layers.md
- [ ] Open `docs/specs/spec-multi-plane-layers.md` and extract acceptance criteria.
- [ ] Define plane enum/types and biome mappings.
- [ ] Add plane-aware data to location schema/state.
- [ ] Implement plane switcher UI control.
- [ ] Render plane-specific biome visuals.
- [ ] Update generators to accept plane parameter.
- [ ] Add tests for plane selection and generation.

## location-ux-overhaul.md
- [ ] Open `docs/specs/location-ux-overhaul.md` and extract acceptance criteria.
- [ ] Inventory existing location interaction controls.
- [ ] Define toolbar modes and mode transitions.
- [ ] Implement toolbar UI with mode buttons.
- [ ] Wire each mode to its interaction handler.
- [ ] Remove deprecated controls.
- [ ] Add UI test for mode switching.

## robust-adventure-workflow.md
- [ ] Open `docs/specs/robust-adventure-workflow.md` and extract acceptance criteria.
- [ ] Define Arcane Library persistence data model.
- [ ] Add storage/retrieval methods to persistence layer.
- [ ] Implement contextual back navigation in UI shell.
- [ ] Add origin tracking fields to entity models.
- [ ] Add tests for persistence and back nav.

## encounter-workflow-narrative.md
- [ ] Open `docs/specs/encounter-workflow-narrative.md` and extract acceptance criteria.
- [ ] Define 6-stage workflow data schema.
- [ ] Implement stage container UI.
- [ ] Build stage editors for each stage (empty stubs).
- [ ] Wire stage progression logic.
- [ ] Add validation per stage.
- [ ] Add tests for stage flow.

## adventure-maker-ux.md
- [ ] Open `docs/specs/adventure-maker-ux.md` and extract acceptance criteria.
- [ ] Define Generator Shell layout regions (Procedural + AI).
- [ ] Implement base shell layout in UI.
- [ ] Add multi-stage flow controller.
- [ ] Wire placeholder panels for each stage.
- [ ] Add navigation between stages.
- [ ] Add layout snapshot test.

## cr-calculator.md
- [ ] Open `docs/specs/cr-calculator.md` and extract acceptance criteria.
- [ ] Define CR calculator input/output schema.
- [ ] Implement defensive CR calculation.
- [ ] Implement offensive CR calculation.
- [ ] Add validation rules for outputs.
- [ ] Build UI for CR inputs/results.
- [ ] Add unit tests for CR math.

## schema-validation.md
- [x] Open `docs/specs/schema-validation.md` and extract acceptance criteria.
  - Acceptance criteria: Zod schemas live in `/schemas`, AI outputs validate with Zod, helper exists to convert Zod to JSON schema for Gemini, Zod replaces manual validation for adventures/outline, and schema failures are handled gracefully.
- [x] Inventory schema usage across codebase.
  - Current usage: AI providers validate via Zod in `src/services/ai/*Impl.ts`, `useZodForm` validates forms, `FactionClockSchema` parses in `src/stores/factionClockStore.ts`, and python-zod compatibility tests in `src/tests/python-zod-compatibility.test.ts`.
- [x] Identify missing runtime validation points.
  - Missing validation: JSON loads in `src/services/fileSystemStore.ts`, session import in `src/services/sessionManager.ts`, SRD import in `src/services/srdImportService.ts`, and raw JSON parsing in `src/hooks/useMonsterCreator.ts`.
- [x] Add Zod validation for each entrypoint.
  - Added schema validation for campaign config, location state, biome data, session imports, and SRD import saves.
- [x] Replace weak/implicit validation with Zod parsing.
  - Replaced raw JSON usage in file system loads and SRD imports with `safeParse` guards.
- [x] Add tests for schema failures.
  - Added `src/tests/behavior/fileSystemStoreValidation.test.ts`.

# Phase Execution Prompts

Each phase prompt below is a self-contained instruction set for a coding AI to execute the phase in a deterministic, auditable way. All paths and filenames are relative to `world-model/`.

---

# Phase 0: Boundaries

## Objective
Establish ownership, scope, and immutable boundaries for the project artifacts so all subsequent work targets canonical artifacts only.

## Dependencies
- None (foundational)

## Deliverables
- `docs/adr/0001-ownership-boundaries.md`
- `docs/adr/0002-adapter-contracts.md`
- Update `docs/roadmap/phase-0-boundaries.md` to mark completion

## Required Tests
- `test_phase0_ownership_frozen()`
- `test_phase0_app_scope_frozen()`
- `test_phase0_adapter_scope_frozen()`
- `test_adapter_manifest_schema()`

## Exit Criteria
- All ownership docs exist and are committed
- Adapter boundaries and app scope are documented and marked frozen
- `docs/harness_checks.md` passes baseline checks

## Failure Cases
- Missing ownership documents
- Any runtime dependency referencing donor source repos
- Adapter manifest template violations reported by `world-model/scripts/validate_adapter_manifest.py`

---

# Phase 1: Canonical Model

## Objective
Produce the canonical data model implementation (Rust crates) and JSON schema artifacts that will be the single source of truth for the app surface.

## Dependencies
- Phase 0 complete

## Deliverables
- `crates/world-model-core/src/records.rs` (implement all canonical record types)
- `crates/world-model-core/src/lib.rs` (library exports)
- `contracts/json-schema/*.schema.json` (produce any missing canonical schemas)
- `contracts/json-schema/VERSION.txt` (version stamp)

## Required Tests
- `test_world_record_roundtrip()`
- `test_entity_record_roundtrip()`
- `test_json_schema_matches_rust_types()`
- `test_promoted_concepts_have_schemas()`

## Exit Criteria
- All 11 canonical nouns implemented in Rust
- JSON schemas present for each canonical type
- Roundtrip serialization tests pass

## Failure Cases
- Missing Rust implementations for canonical nouns
- Mismatch between JSON schemas and Rust types
- Broken bundle roundtrip tests

---

# Phase 2: Adapter Snapshots

## Objective
Create copy-only adapter snapshots and manifests for each donor, validate manifests, and document concept-to-canonical mappings.

## Dependencies
- Phase 1 complete
- Access to donor source files, including the external local Adventure Generator source root and other donor source roots

## Deliverables
- `adapters/<donor>/manifest.yaml` for Mythforge, Orbis, Adventure Generator
- `adapters/<donor>/source-snapshot/` containing only included paths
- `adapters/<donor>/mappings/concept-map.yaml` documenting mapping rules
- Updates to `crates/world-model-adapters/src/lib.rs` if integration points needed

## Required Tests
- `test_adapter_manifest_validates()`
- `test_snapshot_files_exist()`
- `test_concept_mapping_complete()`
- Donor-specific snapshot integrity tests

## Exit Criteria
- All adapter manifests validated
- Snapshot directories exist and contain the declared files
- Mappings to canonical targets documented and reviewable

## Failure Cases
- Missing or incomplete snapshots
- Manifest validation failures
- Adventure Generator source root was not copied into a local adapter snapshot

---

# Phase 3: Final App Scaffold

## Objective
Create the unified application scaffold (React/TypeScript) that consumes canonical bundles and exposes the three interaction modes.

## Dependencies
- Phase 2 complete

## Deliverables
- `apps/unified-app/package.json`
- Scaffold components: `src/App.tsx`, `src/components/*` (Shell, Navigation, ContextBar, Workspace, Inspector)
- `src/stores/canonicalStore.ts` (store for canonical bundles)

## Required Tests
- `test_app_shell_renders()`
- `test_navigation_present()`
- `test_app_reads_only_canonical()`

## Exit Criteria
- App scaffold builds and renders basic shell
- No runtime imports from donor repositories
- CanonicalStore skeleton implemented

## Failure Cases
- Scaffold imports donor runtime code
- App fails to mount or render
- Missing canonical store APIs

---

# Phase 4: Import and Migration

## Objective
Implement adapter readers and translators to convert adapter snapshots into canonical bundles deterministically, preserving provenance.

## Dependencies
- Phase 3 complete
- Adapter snapshots available (Phase 2)

## Deliverables
- `apps/unified-app/src/lib/adapterReader.ts`
- `apps/unified-app/src/lib/conceptTranslator.ts`
- `apps/unified-app/src/lib/migrationRunner.ts`
- `apps/unified-app/src/components/ImportWizard.tsx`

## Required Tests
- `test_adapter_reader_loads_snapshot()`
- `test_concept_translator_maps_correctly()`
- `test_migration_produces_valid_bundle()`

## Exit Criteria
- AdapterReader loads snapshots and yields adapter payloads
- ConceptTranslator deterministically emits canonical records with provenance
- MigrationRunner produces a validated CanonicalBundle

## Failure Cases
- Translator produces unmapped concepts
- Provenance lost during translation
- Non-deterministic migration output

---

# Phase 5: MVP Flows

## Objective
Implement the primary user flows (Guided, Studio, Architect) and ensure end-to-end create/load/edit/save workflows operate on canonical bundles.

## Dependencies
- Phase 4 complete

## Deliverables
- Mode implementations under `apps/unified-app/src/modes/`
- Primary E2E tests under `apps/unified-app/tests/e2e/`

## Required Tests
- `test_guided_mode_wizard()`
- `test_studio_mode_edit()`
- `test_create_world_flow()`

## Exit Criteria
- Guided/Studio/Architect modes functional
- Primary create/load/edit/save loop works with canonical bundles
- Import flow from adapter snapshots works

## Failure Cases
- Modes fail to persist changes to canonical bundles
- UI breaks on large bundles
- Import flow fails to map required canonical fields

---

# Phase 6: Hardening and Release

## Objective
Stabilize, performance-test, document, and gate the release behind a deterministic checklist.

## Dependencies
- Phase 5 complete
- All tests passing

## Deliverables
- E2E release tests
- `apps/unified-app/docs/user-guide.md`
- `docs/release/RELEASE_CRITERIA.md` updated
- `CHANGELOG.md`

## Required Tests
- `test_performance_under_load()`
- `test_concurrent_edits()`
- `test_release_checklist()`

## Exit Criteria
- All release checklist items met and recorded in `docs/release/RELEASE_CRITERIA.md`
- No critical bugs open
- User guide and changelog present

## Failure Cases
- Performance regressions under load
- Unresolved critical bugs
- Missing or incomplete release documentation

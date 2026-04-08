# Test Harness Matrix

Phase-by-phase test matrix. Tests should be automated where possible and collected under `world-model/tests/` and `world-model/apps/unified-app/tests` per phase.

---

## Phase 0: Boundaries

Unit Tests:
- `test_phase0_ownership_frozen()` - Verify ownership docs exist and are unmodifiable
- `test_phase0_app_scope_frozen()` - Verify app scope documented
- `test_phase0_adapter_scope_frozen()` - Verify adapter boundaries documented

Contract Tests:
- `test_canonical_schema_valid()` - All JSON schemas in `world-model/contracts/json-schema/` validate
- `test_promoted_schema_valid()` - All promoted schemas in `world-model/contracts/promoted-schema/` validate

Adapter Tests:
- `test_adapter_manifest_schema()` - All adapter manifests conform to template
- `test_spec_source_toml_valid()` - All spec-source TOML files parse correctly

Exit Criteria:
- All ownership docs exist and reference frozen artifacts
- No hidden dependencies on donor repos
- All harness checks in `world-model/docs/harness_checks.md` pass

---

## Phase 1: Canonical Model

Unit Tests:
- `test_world_record_roundtrip()` - WorldRecord serializes/deserializes correctly
- `test_entity_record_roundtrip()` - EntityRecord serializes/deserializes correctly
- `test_event_envelope_immutability()` - EventEnvelope cannot be modified after creation
- `test_projection_record_derivation()` - ProjectionRecord correctly derived from events

Contract Tests:
- `test_json_schema_matches_rust_types()` - JSON schemas match Rust struct definitions
- `test_promoted_concepts_have_schemas()` - All promoted concepts have schema files

Migration Tests:
- `test_canonical_bundle_load_save()` - CanonicalBundle can be saved and loaded identically

Exit Criteria:
- All 11 canonical nouns have Rust implementations
- All canonical types have JSON schemas
- Bundle roundtrip tests pass

---

## Phase 2: Adapter Snapshots

Unit Tests:
- `test_adapter_manifest_validates()` - Each adapter manifest passes validation script
- `test_snapshot_files_exist()` - All declared snapshot files exist
- `test_concept_mapping_complete()` - All concept mappings reference valid canonical targets
- `test_snapshot_fingerprint_stable()` - Snapshot fingerprint matches deterministic file inventory

Adapter Tests:
- `test_mythforge_snapshot_integrity()` - Mythforge snapshot files match manifest
- `test_orbis_snapshot_integrity()` - Orbis snapshot files match manifest
- `test_adventure_generator_snapshot_integrity()` - Adventure Generator snapshot files match manifest and copied source snapshot

Exit Criteria:
- All adapter manifests validate
- All snapshot files copied and accounted for
- Concept mappings documented
- `python world-model/scripts/check_phase_2_snapshots.py` passes

---

## Phase 3: Final App Scaffold

Unit Tests:
- `test_app_shell_renders()` - App shell renders without crash
- `test_navigation_present()` - Left navigation exists
- `test_context_bar_present()` - Top context bar exists
- `test_workspace_present()` - Center workspace exists
- `test_inspector_present()` - Right inspector exists
- `test_bottom_drawer_present()` - Optional bottom drawer exists by default
- `test_mode_switch_preserves_world_context()` - Switching modes keeps the selected world visible
- `test_canonical_bundle_roundtrip()` - Canonical bundle load/save roundtrip preserves JSON
- `test_overlay_state_isolation()` - Overlay state does not leak into saved bundles

Contract Tests:
- `test_app_reads_only_canonical()` - App only imports from canonical model
- `test_no_donor_runtime_imports()` - No imports from donor repos
- `test_contract_version_matches()` - App contract version matches emitted schema version

Integration Tests:
- `test_app_loads_canonical_bundle()` - App can load a CanonicalBundle
- `test_app_saves_canonical_bundle()` - App can save a CanonicalBundle

Exit Criteria:
- App shell renders
- No runtime imports from donor repos
- Canonical bundle load/save works
- Guided, Studio, and Architect modes render and switch cleanly

---

## Phase 4: Import and Migration

Unit Tests:
- `test_adapter_reader_loads_snapshot()` - AdapterReader loads snapshot files
- `test_concept_translator_maps_correctly()` - ConceptTranslator produces valid canonical records

Adapter Tests:
- `test_mythforge_import()` - Mythforge concepts import to canonical model
- `test_orbis_import()` - Orbis concepts import to canonical model
- `test_adventure_generator_import()` - Adventure Generator concepts import to canonical model from copied snapshot

Migration Tests:
- `test_migration_produces_valid_bundle()` - Migration produces valid CanonicalBundle
- `test_migration_idempotent()` - Running migration twice produces same result
- `test_migration_preserves_provenance()` - Provenance info preserved after migration

Exit Criteria:
- All adapters can import their snapshots
- Migration produces valid canonical bundles
- Provenance preserved

---

## Phase 5: MVP Flows

Integration Tests:
- `test_guided_mode_wizard()` - Guided mode wizard completes
- `test_studio_mode_edit()` - Studio mode can edit entities
- `test_architect_mode_schema()` - Architect mode can inspect schemas

E2E Tests:
- `test_create_world_flow()` - User can create a new world
- `test_load_world_flow()` - User can load an existing world
- `test_save_world_flow()` - User can save world changes
- `test_import_donor_flow()` - User can import from donor snapshot

Exit Criteria:
- All three modes (Guided, Studio, Architect) functional
- Primary loop (create/load/edit/save) works
- Import flow works

---

## Phase 6: Hardening and Release

Unit Tests:
- `test_release_shell_controls_are_keyboard_reachable()` - Release-critical controls are keyboard reachable
- `test_modal_focus_returns_to_trigger()` - Modal focus returns to the triggering control after close
- `test_large_bundle_roundtrip_performance()` - Large canonical bundles roundtrip within release thresholds

Integration Tests:
- `test_release_app_verification()` - App verification passes with lint, typecheck, tests, and build
- `test_phase2_snapshot_integrity()` - Snapshot hashes and adapter mapping checks remain stable
- `test_phase4_migration_replay()` - Migration replay remains deterministic under release checks

E2E Tests:
- `test_release_checklist()` - All release criteria verified
- `test_documentation_complete()` - All release docs present and accurate
- `test_legacy_routes_redirect()` - Legacy routes redirect to public routes

Exit Criteria:
- All release criteria in `world-model/docs/release/RELEASE_CRITERIA.md` met
- `python world-model/scripts/check_phase_6_release.py` passes
- No critical bugs
- Documentation complete

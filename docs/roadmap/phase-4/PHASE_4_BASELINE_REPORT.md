# Phase 4 Baseline Report

Source of truth:

- `world-model/adapters/<donor>/fixtures/import-input.json`
- `world-model/adapters/<donor>/mappings/concept-map.yaml`
- `world-model/crates/world-model-adapters/src/migration.rs`
- `world-model/crates/world-model-driver/src/main.rs`

Baseline notes:

- Migration is implemented as an executable adapter-owned pipeline.
- Canonical bundles remain the only durable post-migration state.
- Replay determinism is checked by the migration checker and the gate.

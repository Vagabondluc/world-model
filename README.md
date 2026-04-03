# world-model

`world-model` is the neutral canonical domain core for the platform.

It exists outside Mythforge and outside every donor application so no app can become the accidental source of truth.

It also owns the Rust driver layer that validates mutation commands and returns canonical bundle/projection deltas to donor shims.
It now also owns the spec-promotion layer that ingests donor schema, classifies it, and emits promoted canonical contracts with provenance.

## Scope

This workspace owns:

- canonical world/entity/workflow/asset/event/projection records
- schema binding metadata
- optional simulation and workflow attachments
- JSON Schema wire contracts
- donor comparison and adapter boundary specifications

This workspace does not own:

- React or Tauri UI
- donor-specific stores
- donor workflow runners
- simulation engines
- schema authoring interfaces

## Workspace Layout

- `crates/world-model-core`
  - canonical domain types and append-only state contracts
- `crates/world-model-specs`
  - donor source manifests, ingestion, promotion reports, and promoted schema contracts
- `crates/world-model-schema`
  - JSON Schema emission, fixtures, and wire-contract validation
- `crates/world-model-adapters`
  - donor comparison metadata and adapter-boundary specifications
- `docs`
  - source-analysis docs plus promotion registry/rules/provenance docs
- `spec-sources`
  - donor ingest manifests that define the only canonical source roots
- `contracts/promoted-schema`
  - emitted promoted schema contracts and promotion reports
- `fixtures`
  - serialized sample records used as golden examples
- `docs/architecture`
  - final app layout, repository layout, and shell/mode boundaries
- `docs/adapters`
  - copy-only adapter policy and donor-specific adapter docs
- `docs/data-model`
  - canonical model definition for the final app
- `docs/migration`
  - import, migration, and cutover rules
- `docs/testing`
  - unit, contract, integration, and E2E testing strategy
- `docs/release`
  - cutover and release criteria
- `docs/adr`
  - architecture decision records for non-obvious choices
- `docs/roadmap`
  - phase-by-phase execution roadmap for the final app handoff

## Canonical Thesis

- Mythforge contributes the trunk model:
  - UUID container identity
  - append-only event history
  - schema binding
  - projections
- Orbis contributes optional simulation attachments:
  - domain toggles
  - fidelity
  - snapshots
  - simulation events
- Adventure Generator contributes optional workflow attachments:
  - guided steps
  - checkpoints
  - progress
  - resumable outputs

## Current Phase

Phase 1 is intentionally narrow:

- canonical Rust records
- JSON Schema contracts
- donor comparison docs
- explicit adapter boundaries
- Rust command/application driver
- donor shim contract for Mythforge, Orbis, and Adventure Generator
- donor spec ingestion
- promoted schema contracts with provenance
- machine-readable promotion report

No donor app is modified by this workspace.

## Final App Roadmap

The final app is built inside this workspace as an adapter-first product:

- donor repositories remain immutable source material
- required donor files are copied into `adapters/<donor>/source-snapshot`
- adapters translate copied donor material into canonical `world-model` state
- the final app never imports runtime code directly from donor repos

The roadmap and supporting rules live in:

- `docs/architecture/FINAL_APP_ARCHITECTURE.md`
- `docs/architecture/REPOSITORY_LAYOUT.md`
- `docs/adapters/ADAPTER_COPY_POLICY.md`
- `docs/adapters/MYTHFORGE_ADAPTER.md`
- `docs/adapters/ORBIS_ADAPTER.md`
- `docs/adapters/ADVENTURE_GENERATOR_ADAPTER.md`
- `docs/data-model/CANONICAL_MODEL.md`
- `docs/migration/MIGRATION_PLAN.md`
- `docs/testing/TESTING_STRATEGY.md`
- `docs/testing/ADAPTER_TEST_MATRIX.md`
- `docs/release/RELEASE_CRITERIA.md`
- `docs/roadmap/FINAL_APP_EXECUTION_PLAN.md`

# Repository Layout

This repository is organized around one canonical model and a set of frozen adapter snapshots.

## Top-Level Layout

```text
world-model/
  apps/
    unified-app/
      src/
        shell/
        modes/
          guided/
          studio/
          architect/
        workspace/
        inspectors/
        panels/
        state/
        services/
        routes/
        theme/
      tests/
      e2e/
      public/
  adapters/
    mythforge/
      manifest.yaml
      source-snapshot/
      mappings/
      fixtures/
      tests/
      docs/
    orbis/
      manifest.yaml
      source-snapshot/
      mappings/
      fixtures/
      tests/
      docs/
    adventure-generator/
      manifest.yaml
      source-snapshot/
      mappings/
      fixtures/
      tests/
      docs/
  crates/
    world-model-core/
    world-model-specs/
    world-model-schema/
    world-model-adapters/
    world-model-driver/
  contracts/
    json-schema/
    promoted-schema/
    adapter-contracts/
  docs/
    architecture/
    adapters/
    data-model/
    migration/
    testing/
    release/
    adr/
  fixtures/
    canonical/
    adapters/
    e2e/
  tools/
    ingest/
    validate/
    export/
  scripts/
```

## Meaning of Each Area

- `apps/unified-app`
  - the final user-facing app
  - holds the shell, UI modes, and view state
- `adapters/<donor>`
  - copied donor material and mapping logic
  - acts as a frozen adapter source
- `crates`
  - canonical Rust model, promotion, contracts, and driver code
- `contracts`
  - emitted canonical and promoted schema artifacts
- `docs`
  - architecture, migration, adapter, and testing documentation
- `fixtures`
  - canonical and adapter example payloads
- `tools`
  - ingest, validation, and export helpers
- `scripts`
  - automation and developer convenience scripts

## Hard Boundary Rules

- donor repos are not runtime dependencies
- copied adapter snapshots are read-only inputs
- canonical state is owned by `world-model`
- app-local overlays stay in the final app only
- generated contracts are committed, reproducible artifacts

## Why This Layout Exists

The layout isolates the final app from donor churn. If donor repos move, break, or disappear, the final app still builds and tests against the copied adapter snapshots and the canonical `world-model` contracts.

# Testing Strategy

The final app and its adapters must be tested at four layers: model, adapter, integration, and UI.

## 1. Canonical Model Tests

Test the Rust core directly:

- opaque IDs serialize predictably
- records enforce ownership rules
- append-only history is preserved
- projections are derived from events
- schema bindings reference external schema IDs
- attachments remain optional and non-owning

## 2. Adapter Snapshot Tests

Test the copied donor material:

- manifests include the intended source files
- excluded paths stay excluded
- copied snapshots are complete enough to drive the adapter
- provenance is preserved

## 3. Integration Tests

Test the end-to-end path through the canonical driver:

- donor snapshot -> adapter -> canonical command -> canonical bundle
- canonical bundle -> hydrate -> app state
- promoted schema references resolve correctly
- model-to-model round-trips preserve canonical fields
- Phase 8 cross-donor integration covers the unified product surface, donor route transitions, shared concept lens switching, and context retention

## 4. UI and E2E Tests

Test the final app shell:

- World
- Story
- Schema
- legacy redirects for guided / studio / architect
- open/save/load round-trip
- switching modes does not lose canonical state
- modal tools remain keyboard reachable and focus safe
- release-hardening checks cover large bundles and documentation

## Regression Rules

- no direct runtime import from donor repos
- no donor-specific fields leak into canonical records
- no UI overlay becomes durable state unless promoted
- no adapter may bypass `world-model` contracts

## CI Gates

Recommended order:

1. format
2. lint
3. unit tests
4. contract tests
5. adapter tests
6. migration tests
7. integration tests
8. E2E tests
9. release-hardening checks
10. Phase 8 cross-donor integration checks
11. release gate

If any earlier gate fails, later gates should not run.

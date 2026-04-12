# Migration Plan

The final app migrates donor data into canonical bundles without runtime dependency on the donor repos. Phase 4 is executable, not prose-only: the migration checker must run the real driver command, validate the generated report, and prove replay determinism.

## Migration Strategy

1. create a donor snapshot in `adapters/<donor>/source-snapshot`
2. define the adapter manifest
3. define the adapter-owned migration input fixture in `adapters/<donor>/fixtures/import-input.json`
4. map donor-local records into canonical records
5. write the canonical bundle
6. emit a migration report with provenance, conflicts, and replay status
7. hydrate the final app from the canonical bundle only

## Migration Types

- one-time import
  - older donor data enters the canonical model once and writes a canonical bundle
- replay migration
  - re-run the mapping against the same adapter input and verify deterministic equivalence
- schema migration
  - convert between versions of promoted contracts while preserving provenance

## Migration Rules

- never treat donor-local state as the permanent truth
- never require the donor repo at runtime
- preserve provenance for imported records
- allow app-local overlays to remain local
- keep migration logic testable without the UI
- quarantine failed migrations and keep the source snapshot untouched

## Cutover Sequence

1. read the donor source snapshot
2. ingest it through the adapter-owned migration input
3. validate against `world-model` contracts
4. persist canonical bundle
5. write a migration report
6. reopen the app on the canonical bundle
7. verify no canonical data was lost

## Failure Handling

If migration fails:

- the canonical bundle is not committed
- the donor snapshot is not mutated
- the error is reported with provenance and adapter context
- the report includes quarantine/rollback diagnostics

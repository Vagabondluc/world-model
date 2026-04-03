# Migration Plan

The final app migrates donor data into canonical bundles without runtime dependency on the donor repos.

## Migration Strategy

1. create a donor snapshot in `adapters/<donor>/source-snapshot`
2. define the adapter manifest
3. map donor-local records into canonical records
4. write the canonical bundle
5. hydrate the final app from the canonical bundle only

## Migration Types

- one-time import
  - older donor data enters the canonical model once
- replay migration
  - re-run the mapping against a refreshed adapter snapshot
- schema migration
  - convert between versions of promoted contracts

## Migration Rules

- never treat donor-local state as the permanent truth
- never require the donor repo at runtime
- preserve provenance for imported records
- allow app-local overlays to remain local
- keep migration logic testable without the UI

## Cutover Sequence

1. read the donor source snapshot
2. ingest it through the adapter
3. validate against `world-model` contracts
4. persist canonical bundle
5. reopen the app on the canonical bundle
6. verify no canonical data was lost

## Failure Handling

If migration fails:

- the canonical bundle is not committed
- the donor snapshot is not mutated
- the error is reported with provenance and adapter context

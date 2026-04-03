# Phase 4: Import and Migration

## Objective

Bring donor data into the canonical model through the adapter snapshots and keep only the canonical bundle afterward.

## Dependencies

- Phase 2 complete
- canonical driver stable
- snapshot manifests stable

## Subphases

### 4.1 Import pipeline

Deliverables:

- read donor snapshot
- parse donor-local records
- map donor data into canonical commands or records
- emit canonical bundle

Acceptance:

- imported data lands in canonical structures only
- donor-local names are translated through the adapter

### 4.2 One-time migration

Deliverables:

- migration entrypoint
- provenance retention
- invalid-data rejection
- ambiguous-data resolution rules

Acceptance:

- old donor data can be converted once without losing canonical meaning

### 4.3 Reload path

Deliverables:

- open canonical bundles from disk
- hydrate app state from canonical bundles only
- preserve overlay separation

Acceptance:

- donor repos are not required after migration
- canonical bundles are the only durable state

### 4.4 Error handling and rollback

Deliverables:

- failed migration is non-destructive
- partial writes are rolled back or quarantined
- errors include donor provenance context

Acceptance:

- a bad source snapshot cannot corrupt canonical state

### 4.5 Import audit trail

Deliverables:

- imported-by record
- timestamp
- snapshot hash
- adapter version
- promotion/report reference

Acceptance:

- every imported bundle can be audited later

## Harness

- migration round-trip test
- provenance retention test
- invalid-input rejection test
- rollback test
- audit-trail test

## Exit Criteria

- imported data survives reload
- no runtime dependency on donor repos remains
- canonical bundle is the only durable state
- migration is auditable

## Failure Cases

- migration silently drops data
- rollback is incomplete
- imports still depend on donor runtime code
- audit metadata is missing

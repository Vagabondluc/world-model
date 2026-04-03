# Phase 1: Canonical Data and Promotion Backbone

## Objective

Stabilize the canonical model and promoted schema layer so every later phase can rely on one strict data contract.

## Dependencies

- Phase 0 complete
- canonical records already exist
- promotion manifests already exist
- schema emission already exists

## Subphases

### 1.1 Canonical record freeze

Deliverables:

- opaque ID semantics are fixed
- `WorldRecord`, `EntityRecord`, `AssetRecord`, `WorkflowRecord` are stable
- `LocationAttachment`, `RelationRecord`, `EventEnvelope`, `ProjectionRecord` are stable
- append-only semantics remain canonical

Acceptance:

- record fields do not drift without an explicit model decision
- projections remain derived rather than authoritative

### 1.2 Schema binding freeze

Deliverables:

- `SchemaBindingRecord` is stable
- external schema references are stable
- promoted schema references are stable
- provenance links are stable

Acceptance:

- every canonical record can cite its source schema/provenance
- no schema definition is silently embedded in app-local state

### 1.3 Promotion freeze

Deliverables:

- `world-model-specs` promotion classes remain fixed
- conflict rules remain fixed
- alias table remains fixed until a deliberate revision
- promotion report remains machine readable

Acceptance:

- Mythforge remains trunk donor
- Orbis remains simulation donor
- Adventure Generator remains workflow donor

### 1.4 Wire-contract freeze

Deliverables:

- JSON Schema emission is stable
- command/result envelopes are stable
- adapter lookup tables are stable
- contract fixtures are committed

Acceptance:

- emitted contracts can be validated by tests
- adapters can target promoted schema ids rather than donor-local names

### 1.5 Change-management rule

Deliverables:

- document which changes require a new schema version
- document which changes require a new adapter mapping
- document which changes are additive only

Acceptance:

- future agents know what counts as a breaking change

## Harness

- Rust unit tests for IDs, records, attachments, and projections
- schema export validation
- promotion classification validation
- provenance report validation
- contract fixture validation

## Exit Criteria

- canonical records are stable
- promoted contracts are emitted and versioned
- adapters can refer to promoted schema ids
- no schema ambiguity remains in the plan

## Failure Cases

- canonical fields are still being renamed casually
- donor-local fields leak into core records
- promotion conflicts are unresolved
- JSON Schema output is not reproducible

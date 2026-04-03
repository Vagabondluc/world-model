# Promotion Rules

Winner statement:

- Mythforge is the trunk donor
- Orbis is the simulation donor
- Adventure Generator is the workflow donor

Promotion classes:

- `Core`
  - canonical world/entity/history/schema/projection semantics
  - owned by Mythforge-derived concepts
- `Simulation`
  - optional simulation attachments, profile contracts, snapshot contracts, simulation payloads
  - owned by Orbis-derived concepts
- `Workflow`
  - optional guided activity state, step/checkpoint/output linkage contracts
  - owned by Adventure-derived concepts
- `DonorLocal`
  - donor-only UI, routing, dashboard, or shell concepts
- `ReferenceOnly`
  - source material kept for provenance but not promoted to canonical contracts

Conflict policy:

- core identity/history conflicts resolve to Mythforge
- simulation conflicts resolve to Orbis
- guided workflow conflicts resolve to Adventure Generator
- non-winning conflicting fields are dropped, split into attachments, or left donor-local
- no donor may introduce a new canonical top-level noun without a deliberate world-model change

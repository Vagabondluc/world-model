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
  - owned by Adventure Generator-derived concepts
- `Era`
  - optional world-historical time/period attachment
  - owned by Mappa Imperium-derived concepts
- `WorldTaxonomy`
  - optional world-object classification and turn tracking attachment
  - owned by Dawn of Worlds-derived concepts
- `Asset-Sigil`
  - optional SVG layer composition and faction symbol attachment
  - owned by Sacred Sigil Generator-derived concepts
- `CollaborativeSession` (cross-donor)
  - optional multiplayer session state; may be merged from Mappa Imperium and Dawn of Worlds
  - requires ADR to define merge strategy
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

# Canonical Trunk Model

Source-analysis document only. Promoted canonical contracts are emitted under `contracts/promoted-schema/`.

## Thesis

`world-model` is the neutral source of truth for platform domain contracts.

It is not an app. It is not a workflow runner. It is not a simulation engine. It is not a schema authoring surface.

Its job is to define the canonical records that Mythforge and donor systems must adapt to.

## Canonical Nouns

- `World`
- `Entity`
- `Location`
- `Asset`
- `Workflow`
- `SchemaBinding`
- `Event`
- `Projection`
- `Relation`
- `SimulationAttachment` — planetary/biosphere simulation state (Orbis)
- `WorkflowAttachment` — linear generation pipeline state (Adventure Generator)
- `LocationAttachment` — spatial coordinates, biome, discovery status (cross-donor)
- `EraAttachment` — world-historical era state and goals (Mappa Imperium)
- `WorldTurnAttachment` — world-object turn tracking and age (Dawn of Worlds)
- `SigilAttachment` — SVG layer composition, color palette, symmetry (Sacred Sigil Generator)
- `CollaborativeSessionAttachment` — multiplayer session state (Mappa Imperium / Dawn of Worlds)

## Ownership Rules

### World

`World` is the top-level durable container for world-scoped state.

It owns:

- world identity
- human metadata
- root event ledger
- top-level entity index
- optional root schema binding
- optional simulation attachment
- workflow registry references

It does not own:

- donor-local UI state
- page routing
- component state

### Entity

`Entity` is the canonical UUID container for world objects.

It owns:

- entity identity
- entity type
- schema binding
- relation references
- optional location attachment
- asset attachments
- event history
- latest projection reference
- optional workflow attachment

It does not own:

- donor-local wizard pages
- donor component state

### Location

`Location` is not a separate identity system.

It is an `Entity` with a `LocationAttachment`.

The spatial layer is attached to identity, not parallel to it.

### Asset

`Asset` is a durable record attached to a world or entity owner.

It does not become a donor-local output blob without ownership.

### Workflow

`Workflow` is activity state, not primary identity.

It exists to preserve progress, checkpoints, outputs, and resumability.

It does not replace the world/entity trunk.

## Schema Rule

Schemas remain external.

`world-model` owns:

- schema identity
- schema class
- external source reference
- version
- activation event reference
- migration lineage

`world-model` does not own:

- schema source files
- prompt templates
- UI editors for schemas

## History Rule

History is append-only.

The durable truth is:

- event history
- schema binding
- projection rules

## Adapter Rules

Each donor maps to world-model canonical records through a registered adapter. The following rules define what each donor contributes and what stays donor-local.

### Mythforge (trunk)
- **Contributes:** WorldRecord, EntityRecord, EventEnvelope, RelationRecord, AssetRecord, SchemaBindingRecord, ProjectionRecord, LocationAttachment (trunk definition)
- **Stays donor-local:** page routing, component state, prompt templates, AI provider config

### Orbis (planetary-simulation)
- **Contributes:** SimulationAttachment (full domain profile + snapshot + event payload)
- **Canonical primitives:** SimulationDomainId (15 values), SimulationDomainBiome (40+ values, distinct from canonical BiomeType)
- **Stays donor-local:** dashboard visualizations, WebSocket session management, kernel diagnostics

### Adventure Generator (workflow / location-spatial)
- **Contributes:** WorkflowAttachment, LocationAttachment extension (hex coordinates, biome, discovery status, layer type), FactionClockAttachment
- **Canonical primitives:** HexCoordinate {q,r,s}, BiomeType (17 values), DiscoveryStatus (4 values), LayerType (6 spatial values), LocationType (4 values), FactionCategory (11 values), ConditionEnum (14 D&D conditions)
- **Stays donor-local:** 5-step adventure generation workflow UI, AI provider wiring, campaign configuration, history store browser, delve room editor (WIP), loot generator (WIP)

### Mappa Imperium (world-era / collaborative-session)
- **Contributes:** EraAttachment, CollaborativeSessionAttachment, NodeEditorSchema, element taxonomy (9 ElementCard types → EntityRecord)
- **Canonical primitives:** EraName (6 epochs), HexCoordinate (confirms AG), BiomeType (confirms AG 17-value set)
- **Stays donor-local:** multiplayer session UI, player roster management, AI personality profiles, era graph renderer

### Dawn of Worlds (world-object-taxonomy / world-turn)
- **Contributes:** WorldTurnAttachment, world-object classification taxonomy (WorldKind → EntityRecord attribute)
- **Canonical primitives:** WorldKind (22 values), Age (1|2|3), MapSize
- **Canonical protocol contribution:** multiplayer room protocol (C2S/S2C) — candidate for CollaborativeSessionAttachment extension
- **Stays donor-local:** Three.js/OGL hex globe renderer, turn UI, combat session tracker

### Sacred Sigil Generator (asset-sigil)
- **Contributes:** SigilAttachment on AssetRecord or EntityRecord
- **Canonical primitives:** SigilLayerType (25 values), BlendMode (12 CSS values), FilterPreset (4 values), DomainPalette keys
- **Stays donor-local:** SVG renderer, icon discovery UI, keyword index scripts, symmetry editor

### Watabou City (procedural-city — candidate)
- **Contributes (candidate):** CityLayoutAttachment on LocationAttachment
- **Stays donor-local:** all GPL canvas rendering code (must not be copied)

The projection is a replaceable cache.
It is never treated as sole truth.

## Simulation Rule

Simulation is an optional attachment.

It may contribute:

- world profile
- enabled domains
- fidelity
- tick policy
- snapshot references
- simulation provenance

It may not replace:

- world identity
- entity identity
- canonical persistence ownership

## Workflow Rule

Guided workflow state is an optional attachment.

It may contribute:

- step state
- checkpoints
- progress
- output references
- resumability

It may not replace:

- canonical world ownership
- entity identity
- external schema binding

## Result

This yields a narrower but stronger trunk:

- Mythforge contributes the core identity/history/schema/projection ideas.
- Orbis contributes optional simulation attachments.
- Adventure Generator contributes optional workflow attachments.

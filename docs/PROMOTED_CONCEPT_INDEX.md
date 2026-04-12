# Promoted Concept Index

Core promotions:

- `core/world` -> `WorldRecord`
- `core/entity` -> `EntityRecord`
- `core/schema-binding` -> `SchemaBindingRecord`
- `core/event-envelope` -> `EventEnvelope`
- `core/projection` -> `ProjectionRecord`
- `core/relation` -> `RelationRecord`
- `core/asset` -> `AssetRecord`

Split core promotion:

- `core/location` -> `LocationAttachment`

Simulation promotions:

- `simulation/orbis-attachment` -> `SimulationAttachment`
- `simulation/domain-profile` -> `PromotedDomainProfileContract`
- `simulation/snapshot` -> `PromotedSimulationSnapshotContract`
- `simulation/event-payload` -> `PromotedSimulationEventPayloadContract`

Workflow promotions:

- `workflow/adventure-generator` -> `WorkflowAttachment`
- `workflow/step` -> `PromotedWorkflowStepContract`
- `workflow/checkpoint` -> `PromotedWorkflowCheckpointContract`
- `workflow/output-reference` -> `PromotedGeneratedOutputReferenceContract`

Split workflow promotion:

- `workflow/location-adventure-linkage` -> `PromotedLocationAdventureLinkageContract`

---

## Candidate Promotions (not yet promoted — ADR required)

Spatial primitives — cross-donor confirmed:

- `spatial/hex-coordinate` -> `HexCoordinate { q: number; r: number; s: number }` — confirmed AG + MI; DoW adapter derives s = -q-r — **READY TO PROMOTE**
- `spatial/biome-type` -> `BiomeType` (17 lowercase values, AG source-confirmed) — confirmed AG + MI; Orbis maps to `SimulationDomainBiome` — **READY TO PROMOTE**
- `spatial/discovery-status` -> `DiscoveryStatus` (4 values: undiscovered|rumored|explored|mapped) — AG + MI — **READY TO PROMOTE**
- `spatial/layer-type` -> `LayerType` (6 spatial values: surface|underdark|feywild|shadowfell|elemental|custom) — AG confirmed; MI confirms surface/underdark subset
- `spatial/location-type` -> `LocationType` (4 values: Battlemap|Dungeon|Settlement|Special Location) — AG only

World-era (Mappa Imperium):

- `world-era/era-attachment` -> `EraAttachment` — candidate from Mappa Imperium
- `world-era/era-name` -> `EraName` (6 epochs: geography|mythology|factions|exploration|expansion|events) — Mappa Imperium source-confirmed

World-object taxonomy (Dawn of Worlds):

- `world-taxonomy/world-kind` -> `WorldKind` (22 classification values) — Dawn of Worlds source-confirmed. **Open conflict:** relationship to `EntityRecord.entityType` unresolved. ADR needed before promotion.
- `world-turn/world-turn-attachment` -> `WorldTurnAttachment` — candidate from Dawn of Worlds (Age, TurnEvent, WorldGenParams)

Asset-sigil (Sacred Sigil Generator):

- `asset-sigil/sigil-attachment` -> `SigilAttachment` — candidate from Sacred Sigil Generator
- `asset-sigil/sigil-layer-type` -> `SigilLayerType` (25 shape values) — Sacred Sigil Generator source-confirmed
- `asset-sigil/blend-mode` -> `BlendMode` (12 CSS blend mode values) — Sacred Sigil Generator source-confirmed

Collaborative session (cross-donor):

- `session/collaborative-attachment` -> `CollaborativeSessionAttachment` — candidate; Mappa Imperium + Dawn of Worlds both define multiplayer session structures. Merge design needed.

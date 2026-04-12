# Canonical Data Model

**Version:** 2.0 — Full donor inventory  
**Status:** Authoritative  
**Scope:** All donors confirmed in `to be merged/` as of April 2026

The canonical model is the shared source of truth for the final app. It defines the types, records, and primitives that all donor systems must map to. No donor may introduce new canonical types without an explicit promotion recorded here.

---

## Donor Registry (Quick Reference)

| ID | Name | Class | Canonical Contribution Lane | Source |
|---|---|---|---|---|
| `mythforge` | Mythforge | real app | **trunk** — identity, history, schema binding, projection | `../mythforge/docs/schema-templates` |
| `orbis` | Orbis | real app | **simulation** — 15-domain planetary simulation, snapshot, event payload | `to be merged/true orbis/Orbis Spec 2.0/` |
| `adventure-generator` | Adventure Generator | real app | **workflow** — 5-step generation pipeline, campaign, NPC, location, encounter | `to be merged/dungeon generator/` |
| `mappa-imperium` | Mappa Imperium | real app (unregistered) | **world-era + collaborative** — 6-era history, hex world, faction, collaborative session | `to be merged/mappa imperium/` |
| `dawn-of-worlds` | Dawn of Worlds | real app (unregistered) | **world-object taxonomy + multiplayer** — 22-kind WorldObject, Age turn system, event-sourced hex game | `to be merged/world-builder-ui/` |
| `faction-image` | Faction-Image (Sacred Sigil Generator) | real app (unregistered) | **asset / sigil** — SVG layer composition, icon keyword index, faction sigil generation | `to be merged/faction-image/` |
| `watabou-city` | Watabou City | clean-room app donor | **procedural-city** — clean-room city-layout UI and canonical city attachment candidate | `to be merged/watabou-city-clean-room/2nd/` |
| `encounter-balancer` | Encounter Balancer Scaffold | scaffold-copy | **encounter** — CR/XP balance, tactical elements, environmental scenarios | `to be merged/apocalypse/` (× 4 identical copies) |

---

## Core Record Types

These are the canonical identity-bearing types. All donor data must be adapted into one of these before it is considered durable canonical state.

### WorldRecord
Owned by: **Mythforge (trunk)**

The top-level durable container for all world-scoped state.

| Field | Type | Owner |
|---|---|---|
| `world_id` | `EntityId` | Mythforge |
| `metadata` | `WorldMetadata` | Mythforge |
| `schema_binding` | `SchemaBindingRecord?` | Mythforge |
| `event_ledger_root` | `EventId` | Mythforge |
| `entity_index` | `EntityId[]` | Mythforge |
| `simulation_attachment` | `SimulationAttachment?` | Orbis |
| `era_attachment` | `EraAttachment?` | Mappa Imperium (candidate) |
| `world_gen_params` | `WorldGenParams?` | Dawn of Worlds (candidate) |

### EntityRecord
Owned by: **Mythforge (trunk)**

The canonical UUID container for all world objects — characters, factions, locations, events, etc.

| Field | Type | Owner |
|---|---|---|
| `entity_id` | `EntityId` | Mythforge |
| `entity_type` | `string` | Mythforge |
| `world_id` | `WorldId` | Mythforge |
| `schema_binding` | `SchemaBindingRecord?` | Mythforge |
| `location_attachment` | `LocationAttachment?` | Mythforge + AG + MI |
| `asset_attachments` | `AssetRecord[]` | Mythforge |
| `event_history` | `EventId[]` | Mythforge |
| `latest_projection` | `ProjectionRecord?` | Mythforge |
| `relation_refs` | `RelationRecord[]` | Mythforge |
| `workflow_attachment` | `WorkflowAttachment?` | Adventure Generator |
| `world_kind` | `WorldKind?` | Dawn of Worlds (candidate) |
| `sigil_attachment` | `SigilAttachment?` | Faction-Image (candidate) |

### EventEnvelope
Owned by: **Mythforge (trunk)**

Append-only, immutable. Never mutated after creation.

| Field | Type | Owner |
|---|---|---|
| `event_id` | `EventId` | Mythforge |
| `world_id` | `WorldId` | Mythforge |
| `ts` | `Timestamp` | Mythforge (all donors) |
| `source_system` | `SourceSystem` | Mythforge |
| `entity_id` | `EntityId?` | Mythforge |
| `payload` | `object` | donor-specific |

### RelationRecord
Owned by: **Mythforge (trunk)**

Connects two canonical records.

| Field | Type |
|---|---|
| `relation_id` | `RelationId` |
| `from_entity` | `EntityId` |
| `to_entity` | `EntityId` |
| `relation_type` | `string` |
| `attrs` | `Record<string, any>` |

### AssetRecord
Owned by: **Mythforge (trunk), with Faction-Image contribution**

| Field | Type | Owner |
|---|---|---|
| `asset_id` | `AssetId` | Mythforge |
| `owner_id` | `WorldId \| EntityId` | Mythforge |
| `asset_type` | `string` | Mythforge |
| `source_system` | `SourceSystem` | Mythforge |
| `sigil_spec` | `SigilSpec?` | Faction-Image (candidate) |

### SchemaBindingRecord / ProjectionRecord
Owned by: **Mythforge (trunk)**. Unchanged from prior model.

---

## Shared Attachment Types

Attachments are non-owning optional structs embedded in record types. They cross donor boundaries — the same attachment type must work for all donors that contribute to it.

### LocationAttachment
Contributed by: **Mythforge, Adventure Generator, Mappa Imperium, Dawn of Worlds**

This is the most cross-donor attachment in the model.

| Field | Type | Source Donors | Notes |
|---|---|---|---|
| `coordinate_ref` | `string?` | Mythforge | Generic fallback for non-hex spatial refs |
| `hex_coordinate` | `HexCoordinate?` | AG + MI + DoW | Cube coords `{q,r,s}` where q+r+s=0 |
| `biome_type` | `BiomeType?` | AG (17) + MI (17–18) | Canonical enum: 17 lowercase values (see below) |
| `discovery_status` | `DiscoveryStatus?` | AG + MI | `undiscovered\|rumored\|explored\|mapped` |
| `layer_type` | `LayerType?` | AG | `surface\|underdark\|feywild\|shadowfell\|elemental\|custom` |
| `location_type` | `LocationType?` | AG | `Battlemap\|Dungeon\|Settlement\|Special Location` |
| `map_anchor` | `string?` | Mythforge | Unresolved — keep as string until donor mapping matures |
| `spatial_scope` | `string?` | Mythforge | Unresolved — same |
| `world_kind` | `WorldKind?` | Dawn of Worlds | 22-value object kind (TERRAIN, SETTLEMENT, NATION, etc.) |
| `era_ref` | `string?` | Mappa Imperium (candidate) | Which era this location belongs to |

### SimulationAttachment
Contributed by: **Orbis**

| Field | Type |
|---|---|
| `simulation_domain` | `SimulationDomainId` (15 values — see below) |
| `fidelity` | `SimulationFidelity` |
| `tick_rate` | `number` |
| `snapshot_ref` | `SimulationSnapshotRef?` |
| `active_profiles` | `DomainProfile[]` |

### WorkflowAttachment
Contributed by: **Adventure Generator**

| Field | Type |
|---|---|
| `workflow_id` | `WorkflowId` |
| `current_step` | `WorkflowStep` |
| `loading_state` | `LoadingState` |
| `history_entries` | `GenerationHistory[]` |
| `checkpoint_refs` | `CheckpointRef[]` |

### EraAttachment *(candidate — Mappa Imperium)*
| Field | Type |
|---|---|
| `current_era` | `EraName` |
| `era_status` | `EraStatus[]` |
| `completed_eras` | `EraName[]` |

### WorldTurnAttachment *(candidate — Dawn of Worlds)*
| Field | Type |
|---|---|
| `age` | `Age` (1\|2\|3) |
| `round` | `number` |
| `active_player_id` | `PlayerId` |
| `ap_remaining` | `number` |
| `map_size` | `MapSize` |

### SigilAttachment *(candidate — Faction-Image)*
| Field | Type |
|---|---|
| `layers` | `SigilLayer[]` |
| `primary_color` | `string` |
| `secondary_color` | `string` |
| `accent_color` | `string` |
| `symmetry` | `SymmetryType` |
| `filter_preset` | `FilterPreset` |
| `domain_palette` | `string?` |

---

## Shared Primitive Types

These are the lowest-level types confirmed identical or strongly compatible across two or more donors. They are the innermost shared vocabulary and require no disambiguation.

### EntityId / WorldId / EventId / AssetId
```
type EntityId = string; // UUID v4
type WorldId  = string; // UUID v4
type EventId  = string; // UUID v4
type AssetId  = string; // UUID v4
```
All donors use UUID strings. No numeric IDs.

### Timestamp
```
type Timestamp = number; // Unix milliseconds (Date.now())
```
Confirmed: Mythforge, Dawn of Worlds (`ts: z.number()`), Adventure Generator.

### HexCoordinate
```
type HexCoordinate = { q: number; r: number; s: number };
// Invariant: q + r + s === 0
```
Confirmed identical: Adventure Generator (`HexCoordinateSchema`), Mappa Imperium (cube coordinate invariant documented), Dawn of Worlds (`HexSchema` with `{q, r}` — `s` derived).  
**Resolution:** Canonical form requires all three axes. DoW schemas must be migrated from `{q,r}` to `{q,r,s}`.

### BiomeType (17 values)
```
type BiomeType =
  | "arctic" | "coastal" | "desert" | "forest" | "grassland"
  | "hill"   | "jungle"  | "mountain" | "swamp" | "underdark"
  | "underwater" | "urban" | "planar" | "wasteland" | "volcanic"
  | "ocean"  | "lake";
```
Confirmed source: Adventure Generator `BiomeTypeEnum` (src/schemas/common.ts).  
Confirmed consistent: Mappa Imperium enum (17–18 values, same vocabulary).  
Conflicting: Orbis uses SCREAMING_SNAKE 40+ values (ecological biomes, not gameplay biomes). Orbis values are retained in `SimulationAttachment.biome_zone` and do NOT map into this canonical enum.

### DiscoveryStatus (4 values)
```
type DiscoveryStatus = "undiscovered" | "rumored" | "explored" | "mapped";
```
Confirmed source: Adventure Generator `DiscoveryStatusEnum` (src/schemas/common.ts).  
Confirmed consistent: `docs/donors/MAPPA_IMPERIUM.md` (same 4 values).

### LayerType — spatial (6 values)
```
type LayerType = "surface" | "underdark" | "feywild" | "shadowfell" | "elemental" | "custom";
```
Source: Adventure Generator. Do NOT confuse with faction-image `LayerType` (sigil layer shapes — a separate type in a separate namespace).

### LocationType (4 values)
```
type LocationType = "Battlemap" | "Dungeon" | "Settlement" | "Special Location";
```
Source: Adventure Generator `LocationTypeEnum`.

### MapSize (3 values)
```
type MapSize = "small" | "standard" | "grand";
```
Dawn of Worlds uses `SMALL | STANDARD | GRAND` (uppercase). Canonical uses lowercase.

### Age — Dawn of Worlds turn era
```
type Age = 1 | 2 | 3;
```
Dawn of Worlds: Age I = Terrain, Age II = Life/Race, Age III = Civilization. Not the same concept as Mappa Imperium's 6 named eras.

### EraName — Mappa Imperium epoch
```
type EraName = "geography" | "mythology" | "factions" | "exploration" | "expansion" | "events";
```
Source: Mappa Imperium (`EraRecord`). 6 sequential eras spanning planet formation through civilizational history.

### WorldKind — Dawn of Worlds object taxonomy (22 values)
```
type WorldKind =
  | "TERRAIN" | "CLIMATE" | "WATER" | "REGION" | "LANDMARK"
  | "RACE"    | "SUBRACE" | "SETTLEMENT" | "CITY" | "CULTURE_TAG"
  | "NATION"  | "BORDER"  | "TREATY" | "WAR" | "PROJECT"
  | "AVATAR"  | "ORDER"   | "ARMY"   | "EVENT" | "CATASTROPHE" | "LABEL";
```
Source: Dawn of Worlds `WorldKindSchema` (logic/schema.ts).  
This is the richest canonical object taxonomy found in any donor.

### SimulationDomainId — Orbis (15 values)
```
type SimulationDomainId =
  | "CORE_TIME"            // 0
  | "PLANET_PHYSICS"       // 10
  | "CLIMATE"              // 20
  | "HYDROLOGY"            // 30
  | "BIOSPHERE_CAPACITY"   // 40
  | "TROPHIC_ENERGY"       // 50
  | "POP_DYNAMICS"         // 60
  | "EXTINCTION"           // 70
  | "REFUGIA_COLONIZATION" // 80
  | "EVOLUTION_BRANCHING"  // 90
  | "CIVILIZATION_NEEDS"   // 100
  | "CIVILIZATION_BEHAVIOR"// 110
  | "WARFARE"              // 120
  | "NARRATIVE_LOG"        // 200
  | "MYTHOS";              // 201
```
Source: True Orbis 1.0 `DomainId` enum (`types.ts`).  
**"Genesis" is NOT a valid SimulationDomainId.** Any schema or code using `"Genesis"` as a domain value is incorrect and must be replaced with the values above.

### SigilLayerType — Faction-Image (25 values)
```
type SigilLayerType =
  | "circle" | "ring"   | "triangle" | "square" | "diamond"
  | "pentagon" | "eye"  | "sun"      | "moon"   | "serpent"
  | "hand"   | "cross"  | "arc"      | "rays"   | "dots"
  | "text"   | "symbol" | "hammer"   | "mandala" | "rune"
  | "beast"  | "star"   | "crown"    | "shield"  | "raw-svg";
```
Source: Faction-Image `LayerType` (src/icon-generator/types.ts). Namespace: `sigil` only.

### FactionCategory — Adventure Generator (11 values)
```
type FactionCategory =
  | "Government & Authority" | "Religious Organizations" | "Criminal Enterprises"
  | "Economic & Trade"       | "Arcane & Scholarly"      | "Adventuring & Mercenary"
  | "Racial & Cultural"      | "Ideological & Revolutionary" | "Secret & Shadow"
  | "Planar & Extraplanar"   | "Environmental & Territorial";
```
Source: Adventure Generator `FactionCategoryEnum` (src/schemas/common.ts).

### NpcType — Adventure Generator (4 values)
```
type NpcType = "Minor" | "Major" | "Antagonist" | "Creature";
```

---

## Resolved Conflicts

### BiomeType
- **Orbis** uses 40+ `SCREAMING_SNAKE` ecological biome values → retained as `SimulationDomainBiome` in `SimulationAttachment` only
- **AG + MI** use 17 lowercase gameplay biome values → these become canonical `BiomeType`
- **Resolution:** Two distinct types. `BiomeType` (gameplay) and `SimulationDomainBiome` (Orbis ecological) coexist without unification

### DiscoveryStatus
- **AG**: `undiscovered | rumored | explored | mapped`
- **Orbis**: `hidden | revealed | scouted | explored` (3 of 4 names differ)
- **Resolution:** AG vocabulary wins for canonical `LocationAttachment.discovery_status`. Orbis vocabulary retained donor-local in `SimulationAttachment`.

### HexCoordinate axes
- **AG + MI**: cube `{q, r, s}` where q+r+s=0
- **DoW**: offset `{q, r}` (no s)
- **Resolution:** Canonical requires 3-axis cube coordinates. DoW adapter must derive `s = -q - r`.

---

## Open Conflicts (Require ADR)

| Conflict | Donors | Status |
|---|---|---|
| `WorldKind` vs `EntityType` — DoW's 22-value taxonomy vs. Mythforge's free-string entity type | DoW + Mythforge | Unresolved — may become a constrained enum for `entity_type` |
| `Age` (DoW 1/2/3) vs `EraName` (MI 6 named eras) — both model "historical phase" but incompatibly | DoW + MI | Unresolved — likely two separate fields |
| `MapSize` casing — DoW uses uppercase enum | DoW | Minor — needs adapter normalization |

---

## Ownership Rules

- **WorldRecord** is the top-level container. It owns the event ledger root and entity index.
- **EntityRecord** is the canonical identity-bearing object. Every world object with a durable UUID is an entity.
- **LocationAttachment** is not a separate identity system. It attaches to `EntityRecord`.
- **AssetRecord** attaches to a world or entity owner. It does not become a floating output blob.
- **WorkflowAttachment** is activity state, not identity. It does not replace entity records.
- **SimulationAttachment** is optional, non-owning, and scoped to Orbis domain semantics.
- **EraAttachment** is optional, non-owning, and scoped to Mappa Imperium era semantics.
- **SigilAttachment** is optional, non-owning, and scoped to Faction-Image asset semantics.
- **EventEnvelope** is append-only and immutable after creation.
- **ProjectionRecord** is derived state — never primary truth.
- **Schemas remain external.** `world-model` owns schema identity and source reference, not schema content.

---

## UI Layers Over the Model (Unchanged)

- `Guided` — beginner flow over the canonical model
- `Studio` — deep editing over the canonical model
- `Architect` — schema, adapter, and migration work over the canonical model

All layers edit the same canonical records. No layer owns its own parallel record system.

---

## Persistence Rules

- Canonical data is saved as a bundle (`CanonicalBundle`)
- App-local overlays are not part of the canonical bundle unless explicitly promoted
- Imported donor data must be converted into canonical records before it is considered durable
- Adapter snapshots are source material — not runtime state

---

## Adapter Rules

| Donor | Lane | What It Contributes |
|---|---|---|
| Mythforge | trunk | WorldRecord, EntityRecord, EventEnvelope, RelationRecord, AssetRecord, ProjectionRecord, SchemaBindingRecord |
| Orbis | simulation | SimulationAttachment, SimulationDomainId (15 values), DomainProfile, SimulationSnapshot |
| Adventure Generator | workflow | WorkflowAttachment, WorkflowStep, WorkflowCheckpoint, GenerationHistory, CampaignRecord, NPC schemas, LocationAttachment (biome, discovery, layer, location type) |
| Mappa Imperium | world-era + hex-spatial | EraAttachment (candidate), HexCoordinate confirmation, BiomeType confirmation, FactionRecord extension |
| Dawn of Worlds | world-object taxonomy | WorldKind (22 values), Age system, WorldObject, MultiplayerRoomProtocol |
| Faction-Image | asset / sigil | SigilAttachment (candidate), SigilLayerType (25 values), DomainPalette, SymmetryType |
| Watabou City | procedural-city | Clean-room city-layout app; do not vendor the GPL reference tree |
| Encounter Balancer Scaffold | encounter | EncounterBalancer, TacticalElement, EnvironmentalCombatScenario (pending differentiation of 4 copies) |

# Mappa Imperium — Donor Specification

## Identity

| Field | Value |
|---|---|
| Donor Name | Mappa Imperium |
| Class | **real app** |
| Adapter ID | `mappa-imperium` (pending) |
| Manifest | not yet created |
| Source Root | `to be merged/mappa imperium/` |
| Source Kind | `typescript` (React + Vite + Zustand) |
| Canonical Lane | world-history / hex-spatial / collaborative-session (all candidate, awaiting promotion) |
| Phase 7 Methodology | behavioral capture |
| Adapter Status | **unregistered** — registration required before canonical promotion |

## What It Is

Mappa Imperium is a collaborative digital worldbuilding game. Players work together to construct a world across six structured eras, each with defined phases. The app uses a hex-grid map, a faction system, a biome taxonomy, and a node-graph element editor for building era-specific schemas. It supports real-time multiplayer via WebSocket. It is the richest domain-concept donor in the workspace.

The application is fully runnable: React + Vite, Zustand store with domain slices, TypeScript throughout, and a clean separation between map, game, and element-editor domains.

## Application Stack

- Framework: React 18, TypeScript, Vite
- State: Zustand with store slices (`gameplaySlice`, `sessionSlice`, `uiSlice`, `debugSlice`, `elementEditorSlice`)
- Persistence: `eraStorageService` (era-scoped saves), `exportService`
- Realtime: `websocketService` (collaborative session)
- AI: `aiService` (generation assistance)

## Canonical Contribution Surface

These are the domains where Mappa Imperium contributes concepts with no current canonical equivalent. Each is a candidate for canonical promotion.

### 1. BiomeType — Rich Biome Vocabulary

The `BiomeType` enum defines 18 values:

```
grassland | hill | coastal | urban | forest | jungle | swamp | mountain |
underdark | volcanic | arctic | desert | wasteland | planar | ocean | lake | underwater
```

This extends the canonical `LocationAttachment.biome` field, which currently accepts a free string from Mythforge templates. Mappa Imperium provides the authoritative enumerated vocabulary for the biome field.

**Cross-donor biome constraint:** Mythforge, Mappa Imperium, and potentially Dungeon Generator all use biomes. Each donor surface must render biomes in its own donor-faithful way. The canonical biome vocabulary is shared data — the UI over it is not.

### 2. HexCoordinate + MapGenerationAlgorithm — Hex-Spatial Attachment

| Type | Shape |
|---|---|
| `HexCoordinate` | `{ q: number, r: number, s: number }` (cube coordinates; q + r + s = 0 invariant) |
| `MapGenerationAlgorithm` | `'imperial' \| 'wilderness'` |
| `WorldSettings` | `{ seed: number, algorithm: MapGenerationAlgorithm, width: number, height: number, biomeDistribution: Partial<Record<BiomeType, number>> }` |

This is a candidate for a `HexCoordinateAttachment` on `LocationAttachment` or a separate `HexMapRecord`. The algorithm and generation params belong in a `WorldRecord` extension.

### 3. Era System — Multi-Era World History

Mappa Imperium defines a 6-era epoch history model:

| Era | Description |
|---|---|
| `geography` | physical world formation |
| `mythology` | divine and mythological age |
| `factions` | political and social emergence |
| `exploration` | discovery and expansion |
| `expansion` | territorial consolidation |
| `events` | landmark events and present-day |

Each era has: name, label, status (`locked | active | completed`), completion percentage, and a per-era `EraUIState` that tracks step-by-step progress within that era.

This is a candidate for a new canonical record type: `EraRecord` (a named epoch in a world's history) and a `PeriodAttachment` on `WorldRecord` or `EventEnvelope`.

### 4. Faction — Rich Entity Type

Mappa Imperium's `Faction` carries:
- `id`, `name`, `territory: HexCoordinate[]`
- `race: string`, `symbol: string`, `capital: string`
- `color: string`
- `resources: Resource[]`, `lore: string`, `allies: string[]`, `enemies: string[]`

Faction is also a concept in Mythforge schema templates. This donor's version adds: territory shape (hex array), race, symbol, capital, and alliance lists — all of which are absent from the Mythforge schema stub. This makes Mappa Imperium's Faction definition a strong candidate for enriching `EntityRecord` when `entity_kind = faction`.

### 5. Collaborative Session Model

| Type | Description |
|---|---|
| `Player` | `{ id, name, color, role }` — a participant in a collaborative world session |
| `PlayerProgress` | `{ playerId, completedEras, currentEra, totalScore }` |
| `GameState` | overall game phase: `setup \| lobby \| playing \| era_transition \| completed` |
| `ChronicleStats` | `{ totalEras, completedEras, totalFactions, totalSettlements, totalLocations, totalDeities, totalResources, dominantFaction }` |

This is a candidate for a `CollaborativeSessionAttachment` on `WorldRecord`.

### 6. Other Entity Types

| Type | Proposed Canonical Status |
|---|---|
| `Settlement` | enriches Mythforge's Settlement template with `population`, `type`, `faction`, `location: HexCoordinate`, `resources: string[]` |
| `Deity` | enriches or parallels Mythforge NPC template — `domain: string`, `alignment: string`, `symbol: string`, `followers` |
| `Location` | named point of interest on the hex map with `type`, `description`, `faction`, `coordinate` |
| `Resource` | scarce material `{ id, name, type, rarity, quantity }` |

### 7. ElementEditorSlice — Node-Graph Authoring

The `elementEditorSlice` is a Zustand store slice for a node-graph schema editor:
- Nodes represent era-specific concepts (e.g., a faction milestone, a geological event)
- Connections between nodes represent relationships
- The graph can be saved and loaded per era (`saveEraGraph`, `loadEraGraph`)

This is a candidate for a `NodeGraphAttachment` or `EraSchemaGraphRecord`. It is the most UI-specific concept in the donor and may be suitable for Phase 7 behavioral capture only (not canonical promotion).

## What Is Extracted

For the future adapter manifest, suggested `included_paths`:

| Path | Reason |
|---|---|
| `src/types/` | all canonical type definitions |
| `src/stores/storeTypes.ts` | store slice interface declarations |
| `src/stores/slices/gameplaySlice.ts` | game state transitions |
| `src/stores/slices/sessionSlice.ts` | multiplayer session state |
| `src/stores/slices/elementEditorSlice.ts` | node graph editor state (for Phase 7 characterization) |

## What Is Not Extracted

| Excluded Path | Reason |
|---|---|
| `src/components/` | donor UI (renders for this donor's surfaces only) |
| `src/services/` | side-effects services (AI, WebSocket, export) |
| `src/assets/` | media files |
| `public/` | static files |
| `dist/` | build output |

The `src/components/` folder contains the donor-faithful UI surfaces. These are excluded from data-extraction scope but are the primary input for Phase 7 behavioral capture.

## Provisional Concept-to-Canonical Mapping

| Mappa Imperium Concept | Provisional Canonical Target | Status |
|---|---|---|
| `BiomeType` | `LocationAttachment.biome` vocabulary extension | candidate |
| `HexCoordinate` | new `HexCoordinateAttachment` on `LocationAttachment` | candidate |
| `WorldSettings` | extension on `WorldRecord` | candidate |
| `Era` (6-era model) | new `EraRecord` | candidate |
| `EraStatus` | `EraRecord.status` enum | candidate |
| `Faction` (richer) | `EntityRecord` when `entity_kind = faction` enrichment | candidate |
| `Settlement` | `EntityRecord` when `entity_kind = settlement` enrichment | candidate |
| `Deity` | `EntityRecord` when `entity_kind = deity` enrichment | candidate |
| `Player` + `PlayerProgress` | new `CollaborativeSessionAttachment` | candidate |
| `GameState` | `CollaborativeSessionAttachment.phase` | candidate |
| `ChronicleStats` | `WorldRecord` derived projection or `ProjectionRecord` | candidate |
| `ElementEditorSlice` | `NodeGraphAttachment` (Phase 7 only, not trunk) | candidate |

All candidates require a world-model change + new promoted-schema contracts before they can be used in canonical records.

## UI Characterization Methodology

**Behavioral capture.** The full application is runnable from `to be merged/mappa imperium/`. Phase 7 characterization:

1. Run the donor app (`npm install && npm run dev` from source root)
2. Walk the full 6-era creation flow, map surface, faction editor, element editor, and collaborative lobby
3. Record: field labels, state transitions, hex-grid interaction, era progression steps, node-graph operations
4. Produce behavior matrix with `basis: captured`

All Mappa Imperium Phase 7 requirements must carry `basis: captured` or `basis: captured_with_deviation` with a registered waiver.

## Registration Steps Required

1. Create `adapters/mappa-imperium/manifest.yaml`
2. Copy the `included_paths` above into `adapters/mappa-imperium/source-snapshot/`
3. Create `adapters/mappa-imperium/mappings/concept-map.yaml`
4. Add concept families to `adapters/concept-family-registry.yaml`
5. Promote candidate schema contracts into `contracts/promoted-schema/`
6. Confirm canonical lane assignments with the world-model maintainer

## Open Questions

- Which of the candidate canonical records should be promoted in Phase 7 vs. deferred to Phase 8 or 9?
- Is the 6-era model donor-specific (Mappa Imperium only) or is it general enough to be trunk-level?
- Does `CollaborativeSessionAttachment` belong on `WorldRecord` or on a new `SessionRecord` top-level type?
- How should `ElementEditorSlice` (node graph) interact with `SchemaBindingRecord`? Are node-graph saves a form of schema binding?
- Is there a canonical meaning difference between Mappa Imperium's `Faction` and Mythforge's `Faction` template, or do they merge?

# Mappa Imperium — Donor Specification (Full WIP Surface)

## Identity

| Field | Value |
|---|---|
| Donor Name | Mappa Imperium |
| Class | **real app** |
| Adapter ID | `mappa-imperium` (pending) |
| Manifest | not yet created |
| Source Root | `to be merged/mappa imperium/` |
| Source Kind | TypeScript — React 18, Vite, Zustand |
| Canonical Lane | world-history / hex-spatial / collaborative-session / element-authoring (all candidate) |
| Phase 7 Methodology | behavioral capture |
| Adapter Status | **unregistered** |

## What It Is

Mappa Imperium is a turn-based collaborative worldbuilding game. Players collectively build a world across **seven phases** (Eras 0–6), spanning geological creation through civilizational collapse. Each era has a branched, step-driven gameplay interface backed by AI content generation.

**Cross-donor status:** Mappa Imperium contributes `EraName` (6 epoch vocabulary), `BiomeType` (17 values, shared with Adventure Generator), and `HexCoordinate` (shared with Adventure Generator and confirmed by Dawn of Worlds). See [INDEX.md](INDEX.md) for cross-donor convergence details.

The application is fully runnable React/Vite but was in active development — several subsystems are typed in full, scaffolded structurally, or have explicit stub placeholders with no functional logic behind them.

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

## Application Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| State | Zustand with named slices (gameplay, session, ui, debug, elementEditor) |
| Persistence | IndexedDB via `EraStorageService` (node graph per era) |
| Realtime | `websocketService` — **stub only** (`console.log` only; no server) |
| AI | `aiService` — Google Gemini via `@google/genai`; works when `VITE_GOOGLE_API_KEY` set |
| Export | `exportService` — HTML/Markdown/JSON; **minimal implementation** |
| Map generation | `mapGenerator.ts` dispatches to `imperialGenerator` or `perlinGenerator` |

---

## Era System — Full Intended Spec

### Era List

| Era ID | Name | Icon | Component |
|---|---|---|---|
| 0 | Basics & Setup | 📖 | `EraHomeContent.tsx` |
| 1 | Age of Creation | 🌍 | `EraCreationContent.tsx` |
| 2 | Age of Myth | ⚡ | `EraMythContent.tsx` |
| 3 | Age of Foundation | 🏛️ | `EraFoundationContent.tsx` |
| 4 | Age of Discovery | 🗺️ | `EraDiscoveryContent.tsx` |
| 5 | Age of Empires | 👑 | `EraEmpiresContent.tsx` |
| 6 | Age of Collapse | 🔥 | `EraCollapseContent.tsx` |

### Per-Era Step Structure

Each era has a `gameplayStep` field in `EraUIState` driving a step-progress bar and gating content:

| Era | Steps | Element Types Created | Limits |
|---|---|---|---|
| 1 — Age of Creation | geography → map-creation → resources → sites | `Resource`, `Location` | `RESOURCE_LIMIT=2`, `SITES_LIMIT=2` |
| 2 — Age of Myth | setup → pantheon → sites | `Deity`, `Location` | — |
| 3 — Age of Foundation | faction → neighbor → settlement | `Faction`, `Settlement` | — |
| 4 — Age of Discovery | exploration → colonization → prosperity | `Event`, `Character`, `Faction.industry` | colonization heroes max 3 |
| 5 — Age of Empires | expansion → neighbors | `Event`, `Faction` (neighbor dev) | N turns of Empire Events |
| 6 — Age of Collapse | events → landmarks → omen | `Event`, `Settlement`, `War`, `Monument` | landmarks limit 1, omen limit 1 |

**WIP gap — Era 3**: `EraUIState.eraThree.gameplayStep` defines a `'complete'` value in the type, but `EraFoundationContent.tsx` only uses `'faction' | 'neighbor' | 'settlement'`. The `'complete'` step is never set.

**WIP gap — Era 0**: `EraHomeContent.tsx` has no step types defined in `EraUIState`. Era 0 is the "Basics & Setup" screen and does not progress through sub-steps.

### Game Length Configuration

```
TURNS_PER_ERA:
  Short:    era3=3, era4=3, era5=4, era6=3
  Standard: era3=3, era4=6, era5=6, era6=5
  Long:     era3=3, era4=8, era5=8, era6=6
  Epic:     era3=3, era4=11, era5=12, era6=10
turnDuration = years per in-game turn (user configurable)
totalYears = sum(turns × turnDuration for eras 3–6)
```

---

## Implemented Features

### Core Game Loop
- Game state machine: `setup → world_setup → player_selection → playing → finished`
- Additional states: `loading_feed`, `lobby`, `ai_configuration`, `host_setup`, `join_setup`, `lobby_room`, `element_editor`
- Era progression: `advanceEra()` increments `currentEraId` (capped at 6); transition animation via `isTransitioning`
- Per-player UI state isolation: each player has their own `EraUIState` keyed by `playerNumber`
- View switching: `eras | elements | map` via `currentView` in uiSlice

### Element System (fully implemented)
All nine element types are implemented with create/update/delete in `gameplaySlice`:

| Type | Key Fields |
|---|---|
| `Resource` | `name`, `type` (mineral/flora/fauna/magical/other), `properties`, `symbol`, `location?: HexCoordinate` |
| `Deity` | `name`, `domain`, `symbol`, `emoji`, `description` |
| `Location` | `name`, `siteType`, `description`, `symbol`, `deityId?` |
| `Faction` | `name`, `race`, `symbolName`, `emoji`, `color`, `theme`, `description`, `leaderName`, `capitalName?`, `isNeighbor`, `neighborType?`, `industry?`, `industryDescription?` |
| `Settlement` | `name`, `purpose`, `description`, `factionId?`, `notes?` |
| `Event` | `name`, `description`, `factionId?` |
| `Character` | `name`, `description`, `factionId?` |
| `War` | `name`, `description`, `attackers: string[]`, `defenders: string[]` |
| `Monument` | `name`, `description`, `locationId?` |

Each `ElementCard` also carries: `id`, `type`, `owner` (playerNumber), `era`, `location?: HexCoordinate`, `createdYear?`, `creationStep?`

### Map System
- Two generation algorithms: `'imperial'` (territory-based, 1–6 players, rhombus or hex board) and `'wilderness'` (Perlin noise, seeded biome layout)
- **Imperial generator**: player-count → board shape (rhombus at 4P, hexagon otherwise); tiers `small=5`, `standard=8`, `large=12` (k parameter); sectors partitioned by atan2 per player
- **Wilderness generator**: radius, scale, waterLevel, moistureOffset, numRegions, locationDensity, settlementDensity all configurable; biome assigned from combined elevation+moisture
- `BiomeType` (18 values): `grassland | hill | coastal | urban | forest | jungle | swamp | mountain | underdark | volcanic | arctic | desert | wasteland | planar | ocean | lake | underwater`
- `HexCoordinate` (q, r, s cube system; q+r+s=0 invariant)
- `Region` — named hex cluster with dominant biome, dangerLevel, politicalControl, culturalNotes
- `ManagedLocation` — named point-of-interest with discovery status, biome, region assignment
- Map render layers: `{ surface: boolean, underdark: boolean, fogOfWar: boolean }` — tracked in `gameplaySlice.layerState`
- `MapRenderPreferences`: `mode ('svg' | 'tile')`, `theme ('classic' | 'vibrant' | 'pastel' | 'sketchy')`

### Player System (fully implemented)
- `Player`: `{ playerNumber, name, isOnline, password?, deityCount?, isAi, aiPersonality?, playStyle? }`
- `playStyle`: `'Standard' | 'Asymmetric' | 'Avatar'`
- `AIPersonality` — Big Five OCEAN scores (0–100 each: openness, conscientiousness, extraversion, agreeableness, neuroticism) + `persona: string` + `biography: string`
- `AIProfileTemplate` — named preset AI personality for quick selection
- `AiPlayerSetup` component: configure AI player count, personalities, and proficiency
- `PlayerSelection` component: password-protected player slots, observer mode

### AI Service (implemented; requires API key)
- Provider: Google Gemini (`@google/genai`)
- Lazy init: creates client only when `VITE_GOOGLE_API_KEY` is present
- UUID reference injection: if user text contains a UUID matching a known `ElementCard`, injects element details into prompt
- Temporal context injection: for eras 4+ adds `turnDuration` scale context ("intimate" vs "grand") and current world year
- Called per-era by each era content component to generate chronicle entries and element descriptions

### Node Editor (editor implemented; runtime execution partial)
Full visual node-graph editor backed by `elementEditorSlice`:
- Components: `NodeCanvas`, `NodePalette`, `Toolbar`, `EraMenuBar` — all present
- 35 `NodeType` values across 4 categories:
  - **Element nodes**: `resource`, `deity`, `faction`, `settlement`, `event`, `character`, `war`, `monument`, `location` — each with an `Input` variant
  - **Logic/utility nodes**: `progress`, `segment`, `eraGoal`, `transform`, `aggregate`, `filter`, `conditional`, `logic`, `style`, `table`, `dataInput`
  - **Interactive nodes**: `diceRoll`, `form`, `choice`
  - **Workflow nodes**: `step`, `eraGate`
- Port data types: `elementData | progressData | number | string | boolean | array | object | tableRow`
- `GraphError` validation via `setValidationErrors`
- Per-era graph persistence: `EraStorageService` saves/loads to IndexedDB (`MappaImperiumEraDB`, `era_graphs` store)

### Data Tables (authored game content — all implemented)
- `factionTables.ts`: `ancestryTable` (2d6→12 races including Player's Choice), `symbolTables` (6×6), `colorTable` (36 values), `namingTable` (faction name suffixes), `neighborTable` (1d6 neighbor types)
- `referenceTables.ts`: full inline HTML for rulebook reference tables (deity count, deity domain, deity symbol, sacred sites, name list, faction steps)
- `collapseEvents.ts`: 14 collapse events (roll 3–16) — each has `name`, `description`, `prompt`, `elementType`
- `foundationEvents.ts`, `discoveryEvents.ts`, `empiresEvents.ts`, `mythEvents.ts`, `creationEvents.ts`: event prompt tables per era
- `eras.ts`: `ERA_LIST` with id 0–6 and full names

### Export and Chronicle
- `exportElementToHtml`: returns a stub `<div><h1>name</h1><p>desc</p></div>` — minimal
- `exportElementToMarkdown`: returns `# name\n\ndesc` — minimal
- `exportChronicleFeed`: returns `JSON.stringify({ elements, players, gameSettings, currentPlayer })` — functional
- `GameEndScreen`: `ChronicleStats` display — totalYears, primeFactions, elementCounts
- Chronicle Lobby fetches `/chronicles/manifest.json` from `/public/`; `GameManifest` shape: `{ gameId, gameName, lastUpdate, nextPlayerUp, playerList, currentEraStep, feedUrl }`
- Import from feed URL: loads exported chronicle JSON and restores game state

### App Settings
- `markdownFormat ('regular' | 'homebrewery')`
- `mapRenderPreferences`
- `colorBlindMode ('none' | 'deuteranopia' | 'protanopia' | 'tritanopia')`

---

## Unimplemented / Stub Features

### WebSocket / Realtime Collaboration — **not working**
`websocketService.ts` contains only three stub functions: `connect()`, `disconnect()`, `sendMessage()` — all call `console.log` only.

The full intended multiplayer model is typed and scaffold-present:
- `LobbyState`: `{ roomId, isHost, players[], isReady, chat: ChatMessage[], cursors: Record<string, {q,r}>, markers: SharedMarker[], notes: SharedNote[] }`
- `ChatMessage`: `{ sender, content, timestamp, type: 'system' | 'player' | 'action' | 'note' }`
- `SharedMarker`: positioned annotation at hex coordinate with label and color
- `SharedNote`: `{ title, content, creatorId, timestamp }`
- `GameRoom`: `{ id, hostId, name, players, maxPlayers, mapSettings, status }`
- `GameState` includes: `lobby`, `lobby_room`, `host_setup`, `join_setup` — none of these states have functional transport
- `sessionSlice` imports `createRoomActions`, `createChatActions`, `createMapActions`, `createGameActions`, `createImportActions` — five sub-action slices; their interaction with websocketService is not implemented

### Era Templates — **empty**
`data/era-templates/index.ts` exports no templates. `elementEditorSlice.saveEraGraph` references `ERA_TEMPLATES` but the map is empty. Each era was intended to have a default node graph template defining that era's valid authoring workflow.

### Observer Mode — **scaffolded**
`ObserverMode` component renders when `currentPlayer === null`. No network streaming to observers — any observer sees only local state.

### Play Style Differentiation — **typed, no effect**
`Player.playStyle ('Standard' | 'Asymmetric' | 'Avatar')` is typed and settable in player setup. No gameplay code branches on it. Intended: `Asymmetric` and `Avatar` modes change rules for specific eras.

### Faction Industry / Prosperity Step — **partial**
`Faction.industry?` and `Faction.industryDescription?` are the Era 4 "prosperity" step completion criteria. UI exists in `ProsperityDeveloper.tsx`. Whether AI generation for the industry narrative is wired is unclear — the field exists but the generated text pathway may not be connected.

### `isEraNavigationUnlocked` Flag — **guard without setter**
`gameplaySlice.selectEra()` checks `isEraNavigationUnlocked` before allowing manual era jumps. No UI surface or action sets this flag to `true`.

### `eraDrafts` — **never read**
`GameplaySlice.eraDrafts: Record<string, any>` has an `updateDraft(eraId, draftData)` action. No component reads from `eraDrafts`. Intended as an auto-save draft before era commit.

### `layerState.fogOfWar` — **no reveal logic**
Toggle stored in `gameplaySlice.layerState.fogOfWar`. No exploration-based reveal logic or per-hex visibility state.

### `layerState.underdark` — **partial**
`BiomeType.underdark` exists in the vocabulary and in the layer toggle. Whether the map renderer actually switches to a distinct underdark layout is unclear — the layer toggle exists but the render path was not confirmed.

### Map Location `isGenerating` Flag — **never set**
`MapLocationState.isGenerating: boolean` is defined but no action sets it `true`. Implies AI-assisted map location generation was planned but not connected.

### Homebrewery Markdown Export — **typed, ignored**
`AppSettings.markdownFormat: 'homebrewery'` is selectable in settings. `exportElementToMarkdown(format)` receives the param but produces identical output regardless of value. Intended: Homebrewery `/div` column-break syntax.

### `exportGameData` Action — **missing**
`GameEndScreen` has an "Export Game Data" button. No `exportGameData` action exists in `exportService.ts`. Only `exportChronicleFeed` is implemented.

### AI Player Gameplay — **flag only**
`Player.isAi = true` marks an AI player. `AiPlayerSetup` configures personality. Actual AI decision-making during gameplay (turn selection, element creation on behalf of the AI player) is not implemented.

### Temporal Context for Eras 0–3 — **partial**
`aiService` injects temporal context only when `eraId >= 4`. Earlier eras use generic prompts without world-time framing.

### Session Action Sub-Slices — **unread**
`sessionSlice` imports from five sub-module files: `session/roomActions`, `session/chatActions`, `session/mapActions`, `session/gameActions`, `session/importActions`. Content of these modules was not read. They likely wire the WebSocket stubs — the degree of completeness is unknown.

### Chronicle Lobby Server — **static file only**
Chronicle Lobby works only if `/public/chronicles/manifest.json` exists as a static file. No server component serves or updates this manifest. Game resume via `feedUrl` requires the exported JSON to be hosted somewhere accessible.

---

## Canonical Contribution Surface

### 1. BiomeType — 18-Value Vocabulary
Authoritative enumeration for `LocationAttachment.biome`:
```
grassland | hill | coastal | urban | forest | jungle | swamp | mountain |
underdark | volcanic | arctic | desert | wasteland | planar | ocean | lake | underwater
```
**Cross-donor validation**: Adventure Generator's `BiomeTypeEnum` defines 17 of these exact values. The two share terrain vocabulary — canonical `BiomeType` should be derived from this convergence.

### 2. HexCoordinate + WorldSettings
| Type | Shape |
|---|---|
| `HexCoordinate` | `{ q, r, s }` — cube coords; constraint: q+r+s=0 |
| `MapGenerationAlgorithm` | `'imperial' \| 'wilderness'` |
| Imperial params | playerCount (1–6), tier ('small' \| 'standard' \| 'large') |
| Wilderness params | radius, scale, waterLevel, moistureOffset, numRegions, theme, locationDensity, settlementDensity |

### 3. Era / Epoch Model
| Record | Shape |
|---|---|
| `Era` | `{ id: 0–6, name, icon }` |
| `EraStatus` | `'completed' \| 'current' \| 'locked' \| 'available'` |
| `EraUIState` | per-player per-era step progress (donor-specific) |
| `EraGoal` | `{ eraId, targetPercentage, tasks: { id, label, completed, count?, targetCount? }[] }` |
| `GameDurationPreview` | `{ totalYears, eraBreakdown: { era3, era4, era5, era6 } }` |
| `PlayerProgress` | `{ playerNumber, name, eras: Record<eraId, EraProgressDetail>, totalGamePercentage }` |

### 4. Faction (richer than Mythforge template)
Full fields: `name`, `race`, `symbolName`, `emoji`, `color`, `theme`, `description`, `leaderName`, `capitalName?`, `isNeighbor`, `neighborType?`, `industry?`, `industryDescription?`

Mythforge schema template has basic faction fields only. Mappa Imperium adds territory-political context (neighbor status, capital, industry).

### 5. Element Taxonomy — 9 Types
All nine `ElementCard.type` values are domain concepts:

| MI Type | Canonical Target |
|---|---|
| `Resource` | `EntityRecord` with `entity_kind = resource` |
| `Deity` | `EntityRecord` with `entity_kind = deity` |
| `Faction` | `EntityRecord` with `entity_kind = faction` |
| `Settlement` | `EntityRecord` with `entity_kind = settlement` |
| `Character` | `EntityRecord` with `entity_kind = character` |
| `Location` | `EntityRecord` + `LocationAttachment` |
| `Event` | `EventEnvelope` |
| `War` | `EventEnvelope` with composite participant refs |
| `Monument` | `EntityRecord` + `LocationAttachment` |

### 6. Collaborative Session Model
| Type | Shape |
|---|---|
| `Player` | `{ playerNumber, name, isOnline, isAi, aiPersonality?, playStyle? }` |
| `AIPersonality` | `{ openness, conscientiousness, extraversion, agreeableness, neuroticism: number, persona, biography }` |
| `GameState` | enum — 9 functional states |
| `GameRoom` | `{ id, hostId, players, maxPlayers, mapSettings, status }` |
| `LobbyState` | `{ roomId, isHost, players, chat, cursors, markers, notes }` |
| `ChronicleStats` | `{ totalYears, primeFactions, totalElements, elementCounts }` |

### 7. Node Graph Schema (Phase 7 behavioral capture; not trunk)
| Type | Description |
|---|---|
| `NodeDefinition` | `{ id, type: NodeType, position, data, inputs, outputs, config }` |
| `NodeType` | 35 values across element/logic/interactive/workflow categories |
| `PortDataType` | `elementData \| progressData \| number \| string \| boolean \| array \| object \| tableRow` |
| `ConnectionDefinition` | `{ id, sourceNodeId, sourcePortId, targetNodeId, targetPortId }` |
| `NodeEditorSchema` | `{ nodes, connections, version }` |
| `SavedEraGraph` | `{ id, eraId, name, schema, timestamp, version }` (persisted to IndexedDB) |

### 8. Collapse Event Table (authored game dataset)
14 collapse events mapped by 2d6 roll (3–16), each with name, description, AI prompt, elementType. Canonical value as an authored content dataset driving `CollapseEventEngine`.

---

## Provisional Concept-to-Canonical Mapping

| Mappa Imperium Concept | Provisional Canonical Target | Status |
|---|---|---|
| `BiomeType` (18 values) | `LocationAttachment.biome` vocabulary | candidate — confirm against AG |
| `HexCoordinate` | new `HexCoordinateAttachment` on `LocationAttachment` | candidate |
| `WorldSettings` | extension on `WorldRecord` | candidate |
| `Era` (0–6 structure) | new `EraRecord` | candidate |
| `EraStatus` | `EraRecord.status` enum | candidate |
| `Faction` (enriched) | `EntityRecord(entity_kind=faction)` enrichment | candidate |
| `Settlement` | `EntityRecord(entity_kind=settlement)` enrichment | candidate |
| `Player` + `AIPersonality` | `CollaborativeSessionAttachment` | candidate |
| `GameState` | `CollaborativeSessionAttachment.phase` | candidate |
| `ChronicleStats` | derived projection from `WorldRecord` | candidate |
| `War` | `EventEnvelope` with participant array | candidate |
| `NodeEditorSchema` | `NodeGraphAttachment` — Phase 7 only, not trunk | candidate |
| Collapse event table | authored `CollapseEventTable` dataset | candidate |

---

## UI Characterization Methodology

**Behavioral capture.** The full application is runnable:

1. `cd "to be merged/mappa imperium" && npm install && npm run dev`
2. Walk: game setup → player creation → all 6 eras → element creation per era → map interaction → node editor → chronicle lobby import
3. For WIP surfaces (realtime lobby, fog of war, era templates): record the scaffolded surface and mark it `basis: captured_stub`
4. Produce behavior matrix; all entries carry `basis: captured` or `basis: captured_stub` with registered waiver

---

## Registration Steps Required

1. Create `adapters/mappa-imperium/manifest.yaml`
2. Copy `src/types/`, `src/stores/storeTypes.ts`, `src/stores/slices/gameplaySlice.ts`, `src/stores/slices/sessionSlice.ts`, `src/stores/slices/elementEditorSlice.ts`, `src/data/eras.ts`, `src/data/factionTables.ts`, `src/data/collapseEvents.ts` (and sibling era event tables) into `source-snapshot/`
3. Create `adapters/mappa-imperium/mappings/concept-map.yaml`
4. Add concept families: `world-era`, `hex-spatial`, `element-taxonomy`, `collaborative-session`, `node-graph-authoring`
5. Promote `BiomeType`, `HexCoordinate`, `Era`, and nine-type `ElementCard` taxonomy into `contracts/promoted-schema/`

---

## Open Questions

- Is `Player.playStyle = 'Avatar'` a variant where each player controls a named character rather than a civilization? If so it requires a different `EntityRecord` ownership model.
- Does `ElementCard.owner` (playerNumber) map to a canonical `Player` concept, or is player identity always external to the canonical model?
- Does the `eraDrafts` auto-save pattern imply a canonical `DraftRecord` — a non-committed write that can be discarded?
- Is the Chronicle Lobby feed-import pattern a canonical serialization contract that `world-model` should own?
- `War.attackers` and `War.defenders` are `string[]` — are these faction IDs, player IDs, or labels? If faction IDs, should `War` be a `RelationRecord` rather than an `EventEnvelope`?
- Does `BiomeType.underdark` represent a separate vertical Z-layer on the hex map, or a surface biome tile?
- Are the five session sub-action slices (`roomActions`, `chatActions`, `mapActions`, `gameActions`, `importActions`) complete enough to recover as a design spec for the multiplayer system?
- Does `CollaborativeSessionAttachment` belong on `WorldRecord` or on a new `SessionRecord` top-level type?
- How should `ElementEditorSlice` (node graph) interact with `SchemaBindingRecord`? Are node-graph saves a form of schema binding?
- Is there a canonical meaning difference between Mappa Imperium's `Faction` and Mythforge's `Faction` template, or do they merge?

# Adventure Generator — Donor Specification (Full WIP Surface)

## Identity

| Field | Value |
|---|---|
| Donor Name | Adventure Generator |
| Class | **real app** |
| Adapter ID | `adventure-generator` |
| Manifest | `adapters/adventure-generator/manifest.yaml` |
| Source Root (full) | `to be merged/dungeon generator/` |
| Source Root (snapshot) | `adapters/adventure-generator/source-snapshot/` (21 files — subset) |
| Source Kind | TypeScript — React 19, Vite, Tauri, Python/FastAPI sidecar, Zod, Zustand, Dexie.js, Playwright, Stryker |
| Canonical Lane | workflow / adventure-authoring / location-spatial / npc / faction / encounter |
| Phase 7 Methodology | behavioral capture |
| Adapter Status | **registered** — snapshot registered; full-source promotion pending |
| Folder Name Warning | `to be merged/dungeon generator/` — folder name does not match app identity; recommend rename to `adventure-generator/` |

---

## What It Is

Adventure Generator is a full-featured TTRPG adventure authoring tool. The full source is available at `to be merged/dungeon generator/` (note folder name mismatch). The registered adapter snapshot at `adapters/adventure-generator/source-snapshot/` contains 21 schema files and two stores extracted from an earlier collection pass — the full application source including UI components, Tauri shell, and Python sidecar is now available.

The schema surface is extensive. It covers: AI provider configuration (10 providers), campaign-building, NPC stat blocks, dungeon delve generation, encounter tracking, loot generation, faction clock progression, an Oracle system, a tavern job board, and a compendium with visibility and importance tiers. Most of these systems have no corresponding component in the snapshot — they exist as complete typed schemas with **no confirmed UI**.

The previously documented framing ("workflow steps, checkpoints, location linkage") was accurate for the registered adapter surface, but greatly understated the donor's actual intended scope.

---

## Application Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Desktop shell | Tauri (cross-platform desktop wrapper) |
| Backend sidecar | Python/FastAPI (RAG — Retrieval Augmented Generation) |
| Schema | Zod (`z.object`, `z.enum`, etc.) throughout all schema files |
| State | Zustand (workflowStore, historyStore, and additional stores in full source) |
| Local DB | Dexie.js (IndexedDB wrapper for client-side persistence) |
| AI | 10 providers: gemini, ollama, claude, openai, lm-studio, grok, zai, perplexity, openrouter, dummy |
| Cost tracking | per-campaign `aiCostPer1kInput` / `aiCostPer1kOutput` |
| Tests | Playwright (E2E), Stryker (mutation) |
| Persistence | per-campaign: `SavedMonsterSchema`, `BiomeDataSchema`, `LoreEntrySchema` |

**Note on adapter snapshot:** The registered 21-file snapshot was extracted from the application's schema layer only. The snapshot does not reflect the full application including UI, Tauri bindings, Python sidecar, and complete store set. The snapshot remains valid as a canonical schema source but should be treated as a subset. Full-source promotion is pending.

---

## Confirmed Implemented Features

### 5-Step Adventure Generation Workflow
`workflowStore.ts` defines a linear pipeline with state:

| Step | Action | Output |
|---|---|---|
| 1 | `generateHooks` | `SimpleAdventure[]` — premise + origin + positioning + stakes |
| 2 | `refineHooks` | `DetailedAdventure` — title, plot_type, tags, hook, player_buy_in, starter_scene, gm_notes |
| 3 | `generateOutline` | outline with scenes, locations, npcs, factions |
| 4 | `generateFullOutline` | full outline with developed scene/NPC/location stubs |
| 5 | `develop` | per-entity development: scene / location / npc / faction / statblock |

`loadingState` tracks progress per field: `hooks`, `refining`, `outline`, `details`, plus per-entity: `scene`, `npc`, `location`, `faction`, `statblock`

### History Store
- `HISTORY_LIMIT` caps total stored snapshots
- Restore by type: `'hooks'` restores to hooks step; `'outline'` restores to outline step
- `GenerationHistory` discriminated union: `{ type: 'hooks', data: ... } | { type: 'outline', data: ... } | { type: 'scene' | 'npc' | 'location' | 'faction' | 'statblock', data: ... }`

### Adventure Schemas
- `SimpleAdventure`: `{ premise, origin, positioning, stakes }`
- `DetailedAdventure`: `{ title, plot_type, tags: string[], hook, player_buy_in, starter_scene, gm_notes }`
- `AdventureOutlineSchema`: scenes + locations + npcs + factions (id-linked)
- `DetailingEntity`: discriminated type for the develop step (scene / location / npc / faction / statblock)

### Campaign Configuration
`CampaignConfiguration` is the richest type in the snapshot:

| Field | Values |
|---|---|
| `language` | string (locale) |
| `genre` | string |
| `ruleset` | string (e.g. D&D 5e) |
| `crRange` | `{ min, max }` |
| `tone` | string |
| `complexity` | string |
| `artStyle` | string |
| `narrativeTechniques` | string[] |
| `worldInfo` | free text block |
| `playerInfo` | free text block |
| `npcInfo` | free text block |
| `aiProvider` | 10 values (see below) |
| `aiModel` | string |
| `aiCostPer1kInput` | number |
| `aiCostPer1kOutput` | number |
| `enabledDatabases` | string[] |
| `contentSources` | string[] |

**AI providers**: `gemini | ollama | claude | openai | lm-studio | grok | zai | perplexity | openrouter | dummy`

### NPC Schemas (three detail tiers)
| Type | Contents |
|---|---|
| `MinorNpcDetails` | full character sheet — name, race, class, background, alignment, personality traits, ideals, bonds, flaws, appearance, voice, motivation, secret |
| `MajorNpcDetails` | `MinorNpcDetails` + `backstory` + `personalityDetails` + `memorySummary` |
| `CreatureDetails` | full stat block — abilityScores, savingThrows, skills, senses, languages, challenge rating, legendary actions, special abilities |

**WIP note — `memorySummary`**: field is typed as "Consolidated narrative history and recent player interactions." No accumulation logic exists in the snapshot.

### Location Schemas (four subtypes)
`ManagedLocation` is the canonical map location:

| Field | Type |
|---|---|
| `id` | string |
| `name` | string |
| `locationType` | `LocationTypeEnum` |
| `biome` | `BiomeTypeEnum` (17 values) |
| `hexCoordinate` | `HexCoordinateSchema { q, r, s }` |
| `layerType` | `LayerTypeEnum` |
| `discoveryStatus` | `DiscoveryStatusEnum` |
| `dungeonRoomDetails?` | `DungeonRoomSchema` |
| `battlemapDetails?` | `BattlemapDetailsSchema` |
| `settlementDetails?` | `SettlementDetailsSchema` |

`LayerTypeEnum`: `surface | underdark | feywild | shadowfell | elemental | custom` — extends biome vocabulary beyond physical terrain

`DiscoveryStatusEnum`: `undiscovered | rumored | explored | mapped`

`SettlementDetailsSchema`: the most detailed location subtype — `overview, geography, society, economy, governance, culture`

### Faction Schema with Clock Progression
`FactionDetailsSchema`:
- Identity: `name, type, alignment, size, powerLevel`
- Goals: `shortTermGoal, midTermGoal, longTermGoal`
- Ideology: `ideology, areaOfOperation`
- Clocks: `FactionClockSchema[]`

`FactionClockSchema`:
- `objective`, `segments` (4–12), `progress`, `difficultyDC`
- `resolutionMethod`, `allies: string[]`, `enemies: string[]`
- `pcImpact: string` — how player characters affect this clock
- `events: string[]` — events that trigger segment fills

`FactionCategoryEnum` (11 values): `criminal | religious | political | merchant | military | arcane | druidic | revolutionary | diplomatic | scholarly | cultural`

### Scene Schema
- `SceneSchema`: `title`, `type: SceneTypeEnum`, `challenge`, `locationId`
- `SceneDetails`: `introduction`, `interactionPoints: string[]`, `npcs`, `dmNotes`
- `SceneTypeEnum`: `Exploration | Combat | NPC Interaction | Dungeon`

### Compendium / Lore System
`LoreEntrySchema`:
- `type`, `title`, `content`, `tags`
- `relatedLocationIds`, `relatedNpcIds`, `relatedFactionIds`
- `isPublicKnowledge: boolean`

`CompendiumEntrySchema` (richer):
- `category`, `title`, `content`, `summary`, `fullContent`
- `tags`, `relationships`, `visibility`, `importance`

### Encounter Tracker
`CombatantSchema`: `initiative`, `hp`, `maxHp`, `ac`, `conditions: ConditionEnum[]`

`ConditionEnum` (14 D&D conditions): `Blinded | Charmed | Deafened | Frightened | Grappled | Incapacitated | Invisible | Paralyzed | Petrified | Poisoned | Prone | Restrained | Stunned | Unconscious`

`EncounterMechanicsSchema`: encounter challenge, trap details, puzzle elements, treasure notes

`EncounterSensorySchema`: sound, smell, feel

### Common Vocabulary
`BiomeTypeEnum` (17 values): `forest | desert | mountain | coastal | grassland | swamp | tundra | jungle | urban | underground | planar | arctic | volcanic | wasteland | ocean | lake | hill`

`OriginContextSchema`: `worldInfo`, `playerInfo`, `npcInfo` — injection context for AI generation

`SessionStateV2Schema`: `{ version: 2, campaignState, locationState, compendiumState, generatorState }` — the full serialized session state shape

---

## Specified / Typed but NOT Implemented (WIP Surface)

### Delve / Dungeon Crawl System — **fully typed, no UI confirmed**
Complete schema without corresponding component:

`DelveSchema`: `theme: DelveThemeEnum`, `rooms: DelveRoomSchema[]`, `entryRoom`, `exitRoom`, sensory package reference

`DelveThemeEnum`: `crypt | ruin | cavern | tower | sewer | haunted_mansion`

`DelveRoomTypeEnum`: `guardian | puzzle | trick | climax | reward`

`SensoryPackageSchema` (per-room): `sound`, `smell`, `feel`

`MechanicsPackageSchema` (per-room): `encounter`, `trap`, `puzzle`, `treasure`

`DelveViewStateEnum`: `setup | concepts | hub | room-editor` — this enum implies a multi-screen UI; no component confirmed in snapshot.

### Loot Generator — **fully typed, no UI confirmed**
`LootDials`: `partyLevel`, `lootValue`, `magicDensity`, `rarityBias`, `tone`, `origin`, `sentienceChance`, `quirkChance`, `cursedChance`, `consumableRatio`, `storyWeight`

`LootSchema`: `gold: { gp, sp, cp }`, `items: { name, type, rarity, magic: boolean, quirks: string[], narrative }[]`

No generator function or workflow step references loot generation.

### Oracle / Tavern System — **fully typed, no workflow integration**
`OracleResponseSchema`: 3 outcome slots — each with `title`, `result`, `consequences`

`JobPostSchema`: `title`, `summary`, `complications: string[]`, `rewards: string[]`

No workflow step or store action references Oracle or tavern job board generation.

### Encounter Stage Workflow — **enum defined, no workflow**
`EncounterStageEnum`: `Setup | Approach | Twist | Challenge | Climax | Aftermath`

This is a distinct 6-stage encounter narrative workflow separate from the combat tracker. No store or workflow action drives these stages.

### NPC Memory Accumulation — **field typed, no logic**
`MajorNpcDetails.memorySummary` is "Consolidated narrative history and recent player interactions." No accumulation, update, or merge logic exists in the snapshot.

### Bestiary — **referenced, schema absent**
`CampaignStateExport` references `savedMonsters: SavedMonsterSchema[]`. The `SavedMonsterSchema` definition was not present in the snapshot. The field exists — the schema does not.

### Biome Data — **field referenced, schema absent**
`CampaignStateExport` references `biomeData: BiomeDataSchema`. Definition not in snapshot.

### `statblock` Loading State — **load state only**
`LoadingState.statblock: z.string().nullable()` tracks generation of a stat block. No statblock generation service is in snapshot.

### Missing Stores — **referenced in workflowStore, absent from snapshot**
`workflowStore.ts` imports from six stores not present in the snapshot:
- `campaignStore` — campaign configuration state
- `compendiumStore` — lore and compendium entry CRUD
- `generatorConfigStore` — per-entity AI generation config
- `adventureDataStore` — the generated adventure output
- `adventureHandlers` — service module wrapping AI calls
- `adventureGenerators` — generation logic per entity type

The workflow is fully typed around these stores. Their absence means the generation pipeline cannot be traced end-to-end from the snapshot alone.

### Missing Utilities — **referenced, absent**
`workflowStore.ts` also imports `workflowHelpers` and `outlineHelpers` — not in snapshot.

---

## Canonical Contribution Surface

### 1. Workflow Attachment Model
| Type | Shape |
|---|---|
| `WorkflowStep` | `generateHooks \| refineHooks \| generateOutline \| generateFullOutline \| develop` |
| `LoadingState` | per-field nullable string for generation in-progress states |
| `DetailingEntity` | discriminated union for which entity type is being developed |
| `GenerationHistory` | versioned snapshot of workflow output, restorable to a specific step |

### 2. BiomeType — 17-Value Vocabulary
`BiomeTypeEnum` confirms 17 terrain types that overlap with Mappa Imperium's 18 values. The two together define the canonical biome vocabulary.

Cross-donor convergence: `forest | desert | mountain | coastal | grassland | swamp | tundra | jungle | urban | underground | planar | arctic | volcanic | wasteland | ocean | lake | hill`

AG uses `hill` where MI uses `hill` — identical. AG uses `underground` where MI uses `underdark` — **naming conflict to resolve**. AG has `feywild | shadowfell | elemental` as `LayerType` values rather than biomes.

### 3. LayerType — Vertical World Layers
`LayerTypeEnum`: `surface | underdark | feywild | shadowfell | elemental | custom`

This extends the hex map Z-layer model beyond Mappa Imperium's `surface | underdark` binary. The adventure generator adds planar layers (feywild, shadowfell, elemental) which implies multi-layer map exploration as a canonical concept.

### 4. DiscoveryStatus
`DiscoveryStatusEnum`: `undiscovered | rumored | explored | mapped`

This 4-state discovery progression is canonical — it parallels Mappa Imperium's `ManagedLocation` discovery status (which uses the same 4-state model).

### 5. SettlementDetails — Rich Settlement Shape
`SettlementDetailsSchema`: `overview, geography, society, economy, governance, culture`

This extends `EntityRecord(entity_kind=settlement)` beyond Mappa Imperium's settlement with structured narrative fields.

### 6. FactionClock — Objective Progression Tracker
`FactionClockSchema`: segments (4–12), progress, difficultyDC, pcImpact, event triggers

No canonical equivalent exists. Faction clocks are a distinct relation model — they could be a `RelationRecord` attaching a `FactionClockAttachment` to a faction `EntityRecord`.

### 7. Encounter Model
| Type | Canonical Candidate |
|---|---|
| `CombatantSchema` | `CombatantRecord` with initiative/hp/ac/conditions |
| `ConditionEnum` (14) | canonical `D&D5eCondition` enum |
| `EncounterStageEnum` (6) | `EncounterStageAttachment` on `EventEnvelope` |

### 8. Loot / Treasure Model
`LootDials` + `LootSchema` — no canonical equivalent. Loot could be a `TreasureRecord` with a dial-configuration attachment.

### 9. Compendium Entry
`CompendiumEntrySchema`: category / title / content / visibility / importance / relationships

Canonical candidate: `CompendiumRecord` or a `LoreAttachment` on `EntityRecord`.

### 10. Campaign Configuration
`CampaignConfiguration` is the most comprehensive configuration type in any donor. Canonical candidate: `CampaignRecord` with AI provider + cost config + content flags.

---

## Provisional Concept-to-Canonical Mapping

| Adventure Generator Concept | Provisional Canonical Target | Status |
|---|---|---|
| `WorkflowAttachment` | new attachment — trunk workflow record | candidate (registered) |
| `BiomeTypeEnum` (17) | `LocationAttachment.biome` vocabulary (merge with MI) | candidate |
| `LayerTypeEnum` (6) | `LocationAttachment.layerType` | candidate |
| `DiscoveryStatusEnum` (4) | `LocationAttachment.discoveryStatus` | candidate |
| `HexCoordinate` | same as MI — confirm shared canonical | candidate |
| `ManagedLocation` | `LocationAttachment` (enriched with layer + discovery) | candidate |
| `SettlementDetailsSchema` | `EntityRecord(entity_kind=settlement)` enrichment | candidate |
| `FactionClockSchema` | `FactionClockAttachment` on faction `EntityRecord` | candidate — new record type |
| `CombatantSchema` | `CombatantRecord` | candidate |
| `ConditionEnum` (14) | canonical condition vocabulary | candidate |
| `EncounterStageEnum` (6) | `EncounterStageAttachment` on `EventEnvelope` | candidate |
| `LootSchema` + `LootDials` | `TreasureRecord` | candidate — new record type |
| `DelveSchema` | `DelveRecord` (dungeon layout) | candidate — new record type |
| `CompendiumEntrySchema` | `CompendiumRecord` or `LoreAttachment` | candidate |
| `CampaignConfiguration` | `CampaignRecord` | candidate — new record type |
| `OracleResponseSchema` | `OracleRecord` (oracle outcomes) | candidate — new record type |
| `JobPostSchema` | `JobPostRecord` (tavern board) | candidate — new record type |

---

## UI Characterization Methodology

**Intent reconstruction.** The application UI is not in the adapter snapshot. Phase 7 characterization:

1. Read all 21 files in `adapters/adventure-generator/source-snapshot/`
2. Reconstruct screens implied by `DelveViewStateEnum` (setup/concepts/hub/room-editor), workflow steps, and store action names
3. Cross-reference any surviving Next.js routing files or pages if present
4. Produce behavior matrix; all entries carry `basis: reconstructed` or `basis: inferred`

Pre-registered waivers:
- **AG-W01**: Donor UI not recoverable. Surface behavior for navigation/layout uses `basis: inferred`. Mitigation: cross-reference `.next/` build artifacts if present.
- **AG-W02**: Checkpoint and resume flow unverifiable from stores alone. Mitigation: treat `GenerationHistory` fields as authoritative contract.
- **AG-W03**: Delve UI, Loot UI, Oracle UI, and Encounter Stage UI are typed but not confirmed in snapshot. These surfaces carry `basis: inferred_from_schema`.

---

## Open Questions

- Does `historyStore.ts` imply persistent session history requiring a `WorkflowHistoryRecord`, or is it in-memory only?
- Is `LayerType` meant to be a separate Z-axis dimension of the same hex map (stack of layers) or does each layer have a fully separate hex grid?
- Should `FactionClockSchema` produce a `RelationRecord` (faction → clock → outcome chain) or just an attachment on the faction entity?
- `MajorNpcDetails.memorySummary` — is this intended to accumulate across session turns, or is it a one-time AI generation? The "consolidated narrative history" phrasing implies accumulation.
- Are the six missing stores (`campaignStore`, `compendiumStore`, etc.) in `to be merged/` somewhere outside the adapter snapshot?
- `BiomeTypeEnum` uses `underground` and MI uses `underdark` — should canonical resolution pick one name, or alias both as the same value?

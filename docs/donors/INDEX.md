# Donor Index

All donors to `world-model`. Each donor is a source of semantics, schemas, UI behavior, or domain concepts that were extracted or will be extracted into canonical form.

Source of truth for adapter manifests: `world-model/adapters/<donor>/manifest.yaml`
Source of truth for copy policy: `world-model/docs/adapters/ADAPTER_COPY_POLICY.md`
Source of truth for donor UI scope and boundaries: [DONOR_UI_SCOPE_AND_BOUNDARIES.md](DONOR_UI_SCOPE_AND_BOUNDARIES.md)

> **Spec status (April 2026):** Full 8-group inventory confirmed. Every donor group in `to be merged/` now has a spec doc, including the four-folder Encounter Balancer scaffold group. The inventory distinguishes unique donor groups from duplicate physical source roots. Historical references to `mechanical-sycophant` are not donor entries.

## Registered Donors

| Donor | Class | Canonical Lane | Adapter Manifest | Spec Doc |
|---|---|---|---|---|
| Mythforge | real app | trunk — WorldRecord, EntityRecord, EventEnvelope, RelationRecord, LocationAttachment | `adapters/mythforge/manifest.yaml` | [MYTHFORGE.md](MYTHFORGE.md) |
| Orbis | real app | planetary-simulation / biosphere / hex-spatial / simulation-event | `adapters/orbis/manifest.yaml` | [ORBIS.md](ORBIS.md) |
| Adventure Generator | **real app** | workflow / adventure-authoring / location-spatial / npc / faction / encounter | `adapters/adventure-generator/manifest.yaml` | [ADVENTURE_GENERATOR.md](ADVENTURE_GENERATOR.md) |

## Unregistered Donors (from `to be merged/`)

| Donor | Class | Candidate Canonical Lane | Source Root | Spec Doc |
|---|---|---|---|---|
| Mappa Imperium | real app | world-era, hex-spatial, element-taxonomy, collaborative-session, node-graph-authoring | `to be merged/mappa imperium/` | [MAPPA_IMPERIUM.md](MAPPA_IMPERIUM.md) |
| Dawn of Worlds | **real app** | world-object-taxonomy, world-turn, multiplayer-session | `to be merged/world-builder-ui/` | [DAWN_OF_WORLDS.md](DAWN_OF_WORLDS.md) |
| Sacred Sigil Generator (Faction-Image) | **real app** | asset-sigil, icon-discovery, layer-composition | `to be merged/faction-image/` | [FACTION_IMAGE.md](FACTION_IMAGE.md) |
| Watabou City | clean-room app donor | procedural-city-layout, street-district-structure | `to be merged/watabou-city-clean-room/2nd/` | [WATABOU_CITY.md](WATABOU_CITY.md) |
| Encounter Balancer Scaffold (×4) | scaffold-copy | encounter-balance, xp-budget (candidate) | `to be merged/apocalypse/` (+ identical copies in `character-creator/`, `deity creator/`, `genesis/`) | [ENCOUNTER_BALANCER_SCAFFOLD.md](ENCOUNTER_BALANCER_SCAFFOLD.md) |

> **Note on Dungeon Generator folder:** `to be merged/dungeon generator/` IS the Adventure Generator (`package.json: "name": "dnd-adventure-generator"`). See [DUNGEON_GENERATOR.md](DUNGEON_GENERATOR.md) for the folder identity correction. There is no separate "Dungeon Generator" donor.

## Donor Classes

- **real app** — runnable full application with its own UI, stores, routing, and domain model. Characterization methodology: behavioral capture from the running app.
- **fragment** — surviving source code from an app that is no longer fully runnable. Characterization methodology: intent reconstruction from source artifacts.
- **semantic-only** — source material providing domain contracts and semantics but no runnable UI. Characterization methodology: designed intent authoring from adapter snapshot and promoted schema.
- **clean-room app donor** — clean-room implementation with runnable UI that can be vendored and rehosted. Characterization methodology: behavioral capture from the clean-room app, with exact rehost parity required.
- **source-fragment (GPL)** — source code available under a copyleft license. Canonical contribution is concept and algorithm extraction only; no direct code copy. This is no longer the Watabou City class for Phase 9.

## Canonical Lane Assignments

| Lane | Owner | Canonical Records (confirmed + candidate) |
|---|---|---|
| trunk | Mythforge | WorldRecord, EntityRecord, SchemaBindingRecord, EventEnvelope, ProjectionRecord, RelationRecord, AssetRecord, LocationAttachment |
| planetary-simulation | Orbis | SimulationAttachment, WeatherAttachment, GeographyAttachment, SocialEventAttachment |
| session | Orbis | SessionType (6 values), SessionStatus (4 values), PromptContextAttachment |
| workflow | Adventure Generator | WorkflowAttachment, GenerationHistory, LoadingState, CampaignRecord |
| adventure-authoring | Adventure Generator | AdventureHook, AdventureOutline, DelveRecord (WIP), LootRecord (WIP), OracleRecord (WIP) |
| location-spatial | Adventure Generator + Mappa Imperium + Dawn of Worlds | LayerType (6), DiscoveryStatus (4), BiomeType (17), HexCoordinate (cube 3-axis) |
| npc / encounter | Adventure Generator | CombatantRecord, ConditionEnum (14), EncounterMechanics |
| world-era | Mappa Imperium | EraRecord, EraStatus, EraGoal, EraName (6 epochs): geography\|mythology\|factions\|exploration\|expansion\|events |
| element-taxonomy | Mappa Imperium | 9 ElementCard types mapped to EntityRecord + EventEnvelope |
| collaborative-session | Mappa Imperium | Player, AIPersonality, ChronicleStats, CollaborativeSessionAttachment |
| node-graph-authoring | Mappa Imperium | NodeEditorSchema, NodeType (35 values), SavedEraGraph |
| world-object-taxonomy | Dawn of Worlds | WorldKind (22 values), WorldObject, WorldTurnAttachment |
| world-turn | Dawn of Worlds | Age (1\|2\|3), TurnEvent, CombatSession, CombatModifier, WorldGenParams |
| multiplayer-session | Dawn of Worlds | RoomState, RoomPlayer, C2S/S2C protocol messages |
| asset-sigil | Sacred Sigil Generator | SigilAttachment, SigilLayerType (25), Layer, DomainPalette |
| icon-discovery | Sacred Sigil Generator | KeywordIndex, IconTag, IconSearchResult |
| procedural-city | Watabou City | CityLayoutAttachment (proposed) |
| encounter-balance | Encounter Balancer (scaffold) | XpBudget, CRTable (candidate — pending differentiation review) |

Candidate lanes are not yet promoted. They require a deliberate world-model change to register.

## Cross-Donor Convergence Points

| Concept | Donors | Resolution |
|---|---|---|
| `BiomeType` | Orbis (40+ SCREAMING_SNAKE), Mappa Imperium (17), Adventure Generator (17), Dawn of Worlds (WorldKind terrain subset) | **Resolved:** AG/MI 17-value lowercase vocabulary = canonical `BiomeType`. Orbis keeps its own in `SimulationDomainBiome`. DoW terrain values covered by `WorldKind`, not `BiomeType`. |
| `HexCoordinate` | Mappa Imperium `{q,r,s}`, Adventure Generator `{q,r,s}`, Dawn of Worlds `{q,r}` (offset) | **Resolved:** Canonical is 3-axis cube `{q, r, s}` where `q+r+s=0`. DoW adapter must derive `s = -q-r`. |
| `DiscoveryStatus` | Adventure Generator (`undiscovered\|rumored\|explored\|mapped`), Mappa Imperium (same), Orbis (different 4 states) | **Resolved:** AG/MI vocabulary wins. Orbis uses a donor-local mapping. |
| `LayerType` (spatial) | Adventure Generator (6: surface/underdark/feywild/shadowfell/elemental/custom), Mappa Imperium (surface/underdark) | **Resolved:** AG superset is canonical. MI subset maps without conflict. |
| `WorldKind` vs `EntityType` | Dawn of Worlds `WorldKind` (22 taxonomy values), Mythforge `EntityRecord.entityType` | **Open conflict — ADR needed.** DoW classification system is richer than Mythforge's. How does `WorldKind` relate to `entityType`? |
| `Age` vs `EraName` | Dawn of Worlds `Age` (1\|2\|3 ordinal), Mappa Imperium `EraName` (6 named epochs) | **Open conflict — ADR needed.** Different temporal models: ordinal turn era vs. named narrative era. |
| `MapSize` casing | Dawn of Worlds `SMALL\|STANDARD\|GRAND`, Mappa Imperium equivalent lowercase | **Open conflict — ADR needed.** SCREAMING_SNAKE vs. lowercase convention. |
| `SigilLayerType` | Sacred Sigil Generator (25 values) | No conflict. No other donor provides a sigil shape vocabulary. |
| `BlendMode` | Sacred Sigil Generator (12 CSS blend modes) | No conflict. Sigil-specific. |

## Registration Rules

A donor is registered when:
- a manifest exists at `adapters/<donor>/manifest.yaml`
- a source snapshot exists at `adapters/<donor>/source-snapshot/`
- a concept map exists at `adapters/<donor>/mappings/concept-map.yaml`
- the donor appears in `adapters/concept-family-registry.yaml` with at least one concept family

Unregistered donors must not be imported at runtime. Canonical promotion from unregistered donors requires an explicit registration step first.

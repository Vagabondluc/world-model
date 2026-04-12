# Orbis — Donor Specification (Full WIP Surface)

## Identity

| Field | Value |
|---|---|
| Donor Name | Orbis |
| Class | **semantic-only** |
| Adapter ID | `orbis` |
| Manifest | `adapters/orbis/manifest.yaml` |
| Source Root | `adapters/orbis/source-snapshot/` (23 TypeScript files) |
| Source Origin | `to be merged/true orbis/Orbis Spec 2.0/` |
| Source Kind | TypeScript — React + Vite + Zustand (Orbis 1.0 UI); pure TypeScript engine (Orbis 2.0) |
| Canonical Lane | planetary-simulation / biosphere / hex-spatial / simulation-event |
| Phase 7 Methodology | designed intent authoring |
| Adapter Status | **registered** |

---

## Correction Note

The prior adapter snapshot was erroneously sourced from `mechanical-sycophant/src/` — a separate RPG toolbox project not related to Orbis. The snapshot has been replaced with files from the true Orbis source. All documentation below reflects the actual Orbis codebase.

---

## What It Is

Orbis is a **deterministic planet-scale world simulation engine** — the most technically ambitious donor in the set. It is not a game, not a tabletop tool, not a form-based UI. It physically simulates a planet: tectonic plates, climate zones, hydrology, biosphere evolution, civilization emergence, and mythic narrative production, all driven from a single 64-bit deterministic seed.

The project exists in two generations:

- **Orbis 1.0** (`Orbis Spec 2.0/Orbis 1.0/`): React + Vite + Zustand frontend with a full interactive map, terraforming brush, multi-axis view modes, and Zod-schema domain engine layer. The sim runs domain-by-domain through a `Scheduler`; the UI drives it in real time. Was in active mid-development — several sim domains are fully typed, others are scaffolded with stub implementations.
- **Orbis 2.0** (`Orbis Spec 2.0/Orbis 2.0/`): A deterministic engine rewrite. Introduces: `GenesisKernel` (xxhash seed unpacking), `ChronosEngine` (Master Event Ledger with retroactive consistency and `InvalidationBubble`), `IdentityKernel` (actor IDs via xxhash64), and `CausalityTracer`. Five arc expansions planned (magic leyline, ecology, civilization-political, rpg-actor-agency, economic).

The frontend adapter snapshot draws from both generations.

---

## Application Stack (Orbis 1.0)

| Layer | Technology |
|---|---|
| Framework | React 18, TypeScript, Vite |
| State | Zustand (8 stores across world, sim, biosphere, civilization, planetary, UI, time domains) |
| Schema | Zod (all domain schemas are `z.object` with `.infer<>` TypeScript types) |
| Persistence | `storageSystem.ts` — `saveProjectToDB()` / `loadProjectFromDB()` |
| Generation | `aiService` (referenced in stores; impl not in snapshot) |
| Engine | `SimSystem.ts` singleton — schedules 19 domain engines via `Scheduler` |

---

## Confirmed Implemented Features

### Core Type System (`types.ts`)

The main enum file. All enums use string or numeric values.

**Multi-planar spatial model:**

| Enum | Values |
|---|---|
| `PlaneId` | `MATERIAL`, `FEYWILD`, `SHADOWFELL` |
| `StratumId` | `AERO` (sky/floating), `TERRA` (surface), `LITHO` (underground), `ABYSSAL` (deep core) |
| `DepthClass` | `SURFACE`, `CRUST`, `UNDERDARK`, `MANTLE`, `CORE` |
| `VerticalZone` | `ABYSSAL`, `OCEANIC`, `SHELF`, `STRAND`, `LOWLAND`, `HIGHLAND`, `MONTANE`, `SUMMIT` |

**BiomeType (40+ values):** Full planetary biome vocabulary — aquatic (`DEEP_OCEAN`, `CORAL_REEF`, `KELP_FOREST`), coastal (`MANGROVE`), arid (`SCORCHED`, `SALT_FLATS`), cold (`TUNDRA`, `TAIGA`, `ICE`), temperate/tropical (full range), and exotic multi-axial (`SKY_ISLAND`, `CRYSTAL_GROVE`, `FUNGAL_FOREST`, `MAGMA_FORGE`, `NECROPOLIS`, `VOID_OCEAN`, `PRIMORDIAL_SOUP`).

> **Cross-donor conflict:** Orbis defines 40+ SCREAMING_SNAKE biome values. Adventure Generator and Mappa Imperium define 17 lowercase values. **Resolution:** AG/MI 17-value vocabulary wins as canonical `BiomeType`. Orbis keeps its own as `SimulationDomainBiome` in the `SimulationAttachment`. See [INDEX.md](INDEX.md) convergence table.

**Other key enums:**

| Enum | Values |
|---|---|
| `PlanetType` | `TERRA`, `DESERT`, `OCEAN`, `ICE`, `LAVA` |
| `SettlementType` | `NONE`, `CAMP`, `VILLAGE`, `CITY`, `METROPOLIS` |
| `ResourceType` | `FOOD`, `WOOD`, `STONE`, `METALS`, `RARE_ELEMENTS` |
| `PlateType` | `OCEANIC`, `CONTINENTAL` |
| `CoastalFeature` | `NONE`, `BARRIER`, `LAGOON`, `INLET`, `FJORD` |
| `ViewMode` | `BIOME`, `ELEVATION`, `TEMPERATURE`, `MOISTURE`, `PLATES`, `RIVERS`, `ZONES`, `CIVILIZATION`, `ATMOSPHERE`, `SEMANTIC`, `TACTICAL` |
| `TerraformMode` | `SELECT`, `RAISE`, `LOWER`, `HEAT`, `COOL`, `MOISTEN`, `DRY` |
| `RegionLayer` | `GEOLOGY`, `HYDROLOGY`, `BIOME`, `STRUCTURE`, `REALM`, `GAMEPLAY` |
| `VoxelMaterial` | 24 values: `AIR(0)` through `MYCELIUM(23)`, `BEDROCK(99)`, `BUILDING(100)` |

**`HexData` interface** — the core hex cell:
| Field | Description |
|---|---|
| `id`, `uuid` | cell identifiers; uuid is deterministic |
| `center`, `vertices` | 3D coordinates |
| `neighbors` | adjacent hex IDs |
| `biome: BiomeType` | assigned biome |
| `plateId`, `plateType`, `plateVelocity` | tectonic plate membership |
| `verticalZone`, `coastalFeature` | elevation/coastal classification |
| `settlementType` | current settlement tier |
| `flowAccumulation`, `downstreamId` | river flow routing |
| `mouthId`, `basinId`, `soilMoisture`, `groundwater` | Hydrology 2.0 state |
| `habitabilityScore` | composite habitability |
| `resources: Partial<Record<ResourceType, number>>` | resource amounts per type |
| `biomeData: { height, temperature, moisture, continentalMask }` | normalized per-cell scalars |
| `atmosphere?: AtmosphereData` | pressure, windVector, airMassType, frontType, stormIntensity |
| `semanticTags?: string[]` | legacy string tags |
| `tags?: Uint32Array` | Phase 5 binary packed tags |

**`VoxelSemantic`**: `{ material, biome, depthClass, tags, tagIds, realm, hazard, movementCost, cover }` — used for tactical/D&D 5e overlay.

**`TerrainConfig`**: Full terrain generation config — `planetType`, `scale`, `seaLevel`, `elevationScale`, `subdivisions`, `plateCount`, `lacunarity`, `persistence`, `tempOffset`, `moistureOffset`, `orbital: OrbitalConfig`, `magnetosphere: MagnetosphereConfig`.

---

### Domain Clock System (`core/schemas/core.ts`)

**`DomainId` enum (16 domains):**

| Id | Domain |
|---|---|
| 0 | `CORE_TIME` |
| 10 | `PLANET_PHYSICS` |
| 20 | `CLIMATE` |
| 30 | `HYDROLOGY` |
| 40 | `BIOSPHERE_CAPACITY` |
| 50 | `TROPHIC_ENERGY` |
| 60 | `POP_DYNAMICS` |
| 70 | `EXTINCTION` |
| 80 | `REFUGIA_COLONIZATION` |
| 90 | `EVOLUTION_BRANCHING` |
| 100 | `CIVILIZATION_NEEDS` |
| 110 | `CIVILIZATION_BEHAVIOR` |
| 120 | `WARFARE` |
| 200 | `NARRATIVE_LOG` |
| 201 | `MYTHOS` |

**`SimEvent`**: `{ atTimeUs: AbsTime(bigint), id: EventId, payloadHash: number }`

`EventId` values: `ClimateChanged | SeaLevelChanged | TectonicsEpochChanged | CarbonChanged | MagnetosphereChanged | BiomeInvalidated | HydrologyInvalidated`

**`DomainMode`**: `Frozen | Step | HighRes | Regenerate`

---

### Biology Schema (`core/schemas/biology.ts`)

**`TrunkId`** — 7 evolutionary trunks: Bacteria, Archaea, Eukarya × 5 (Opisthokonta, Archaeplastida, SAR, Excavata, Amoebozoa)

**Genome module enums:**
- `MetabolismModule` (5): AnaerobicFerment, Chemosynthesis, OxygenicPhotosynthesis, AerobicRespiration, FacultativeSwitch
- `StructureModule` (6): Cytoskeleton through VascularTransport
- `NeuralModule` (6): ChemicalSignaling through Electroreception
- `ReproductionModule` (5): AsexualDivision through Parthenogenesis
- `AdaptationModule` (7): Thermotolerance through BurrowingCapability

**`TrophicRoleId`** (7): PrimaryProducer, Decomposer, Herbivore, Omnivore, Carnivore, ApexPredator, Parasite

**`SpeciesTemplate`** — full species definition with genome modules, trophic role, habitat constraints, referenced by `speciesId: S-[0-9A-Fa-f]{16}`.

---

### Civilization Schema (`core/schemas/civilization.ts`)

**Need-driven behavior system:**
- `EntityNeeds` — array of `NeedState { levelPPM, decayRatePPM, priorityWeightPPM }`
- `ActionDef` — per-entity action with `requiresTags`, `forbidsTags`, `preconditions`, `cost`, `cooldownTicks`, `needDeltaPPM`, `tagDeltaPPM`, `worldDelta`
- `DecisionExplain` — decision record with `dominantNeed`, `scoreTotal`

**Trade system:**
- `TradeNode`, `TradeEdge`, `EconomicTickState` (all Zod-typed)

---

### Climate Schema (`core/schemas/climate.ts`)

**4-level climate model** (`ClimateLevel`): `L1_0D` → `L4_1D_LatBands`

`ClimateParamsV1` — full parameterization: eccentricity, perihelion, albedo coefficients, ice thresholds, outgoing-radiation coefficient, diffusion, thermal inertia, altitude lapse, precipitation proxy fields (all PPM integers for deterministic math).

`ClimateInputs`: `SolarStrengthPPM`, `AxialTiltµdeg`, `yearPhasePPM`, `RotationRatePPM`, `SeaLevelcm`

---

### Hydrology Schema (`core/schemas/hydrology.ts`)

River graph model: `Mouth`, `Basin`, `RiverNode` (flow/width/depth PPM), `RiverGraph` (source nodes, node list).

`HydroParamsV1` — ABCD model parameters: `soilSaturation_b`, `rechargeRatio_c`, `baseflowRate_d`, mouth/coast/basin/slope params, waterfall drop/canyon thresholds (all PPM integers).

---

### Infrastructure Schema (`core/schemas/infrastructure.ts`)

**Unified parameter registry:**
- `ParameterDefinitionV1` — typed param with `bounds`, `flags: { affectsDeterminism, mutableAtRuntime, requiresRestart }`, `provenance: EARTH | GAMEPLAY | FITTED | SPECULATIVE`
- `DomainParameterStateV1` — runtime values by domain

**Snapshot system:**
- `RNGStateSnapshotV1`, `DomainStateSnapshotV1`, `SnapshotV1` — full deterministic save/load contract

---

### Narrative & Planetary Schemas

**`narrative.ts`:**
- `NarrativeArtifact` — `{ artifactId, eventId, narrativeKey, scope: local|regional|civilizational, tone: heroic|tragic|bureaucratic|propagandist|revisionist, heroes, villains, lesson, beliefShiftPPM, mythRetentionPPM, isMyth }`
- `NarrativeAdoptionState` — per population block adoption + polarization PPM

**`planetary.ts`:**
- `MagnetosphereState` — `{ health01, polarity: 1|-1, phase01, lastFlipTimeMs }`
- `BiosphereViewModel` — `{ vitality01, dominantTier: Sterile|Microbial|Simple|Complex|Advanced, collapseRisk: Low|Moderate|High }`

---

### Simulation Engine (`sim/SimSystem.ts`)

`SimEngine` — central singleton. Instantiates and schedules 19 domain engines:

| Phase | Engines |
|---|---|
| Planet Physics | `MagnetosphereDomain`, `EpochManager` |
| Climate | `EnergyBalanceModel (climate)`, `CarbonCycleDomain` |
| Hydrology | `ABCDHydrology` |
| Biosphere | `BiosphereCapacityDomain` |
| Life (Ph 8–10) | `LifeEngine`, `TrophicEnergyDomain`, `RefugiaDomain`, `PopulationDynamics`, `BestiarySystem`, `AdaptiveRadiation` |
| Civilization (Ph 11) | `TechTreeDomain`, `PressureSystem`, `FactionSystem` |
| Narrative (Ph 12) | `NarrativeEngine`, `MythEngine` |
| History/Core | `NeedEngine`, `RegimeManager` |

---

### Zustand Stores (Orbis 1.0)

| Store | State Shape |
|---|---|
| `useWorldStore` | `seed`, `config: TerrainConfig`, `hexes: HexData[]`, `plates: Plate[]`, `terraformMode`, `brushRadius/Intensity`, project CRUD, geology/civ sim state |
| `biosphereStore` | `speciesTemplates: Map<id, SpeciesTemplate>`, `populationData: Record<hexId, PopStateCell>`, `trophicCapacities: Record<TrophicLevel, number>` |
| `civilizationStore` | `needs: Record<entityId, EntityNeeds>`, `nodes: Map<id, TradeNode>`, `edges: Map<id, TradeEdge>`, `economy: EconomicTickState` |
| `planetaryStore` | `magnetosphere: MagnetosphereState`, `carbon: CarbonState` |
| `simulationStore` | `absTime: bigint`, `clocks: Record<domainId, DomainClockState>`, `events: SimEvent[]` |
| `worldSystemStore` | `parameters: DomainParameterStateV1[]`, `authority: AuthorityRegistryV1`, `lastSnapshot: SnapshotV1` |

---

### Orbis 2.0 Engine Kernels

**`GenesisKernel`** (`runtime/core/genesis.ts`): xxhash-wasm based deterministic seeding.

`unpackSeed(worldSeed: bigint)` → `{ geo: bigint, bio: bigint, civ: bigint, magic: bigint }` — each axis gets an independent 64-bit sub-seed from the world seed.

`generateInitEvent()` → produces the canonical `GENESIS_INIT` event at `atTimeUs = 0` (MEL Entry 0).

**`RuntimeEventEnvelopeV1<TPayload>`** (`runtime/core/eventEnvelope.ts`):
```
{ traceId, eventId, timestamp, tick, source, schemaVersion: 'runtime.event.v1', payload: TPayload }
```
Monotonic `eventId` generated by module-scoped sequence counter.

**`ChronosEngine`** (`v2/core/chronos.ts`): Master Event Ledger (MEL).
- `appendEvent(event)` — append + sort
- `injectRetroactiveEvent(event, affectedDomains)` → creates `InvalidationBubble { id, tPatch, affectedDomains, status: Active|Reconciling|Resolved }`
- Retroactive consistency: events can be injected into the past; downstream domains track bubble state for reconciliation.

**`IdentityKernel`** (`v2/core/identity.ts`): 
`generateActorId(worldSeed, birthHexId, birthTick, populationIndex, salt): bigint` — deterministic 64-bit actor ID.

**`CausalityTracer`** (`v2/core/causality.ts`): `CausalEvent { id, cause, effect, timestamp, parentId? }` — causal graph over sim events.

---

## WIP / Simulation Domains Not Yet Fully Implemented in 1.0

The `sim/` folder scaffold (`SimSystem.ts` imports them all), but individual engine files vary from fully functional to stub:

| Engine File | Status |
|---|---|
| `sim/physics/Magnetosphere.ts` | Referenced; not in snapshot |
| `sim/climate/EnergyBalanceModel.ts` | Referenced; not in snapshot |
| `sim/climate/CarbonCycle.ts` | Referenced; not in snapshot |
| `sim/biosphere/BiosphereCapacity.ts` | Referenced; not in snapshot |
| `sim/hydrology/ABCDHydrology.ts` | Referenced; not in snapshot |
| `sim/life/LifeEngine.ts` | File exists in `sim/life/`; not in snapshot |
| `sim/life/TrophicSystem.ts` | File exists; not in snapshot |
| `sim/life/RefugiaDomain.ts` | File exists; not in snapshot |
| `sim/life/PopulationDynamics.ts` | File exists; not in snapshot |
| `sim/life/BestiarySystem.ts` | File exists; not in snapshot |
| `sim/life/AdaptiveRadiation.ts` | File exists; not in snapshot |
| `sim/civilization/TechTree.ts` | File exists; not in snapshot |
| `sim/civilization/PressureSystem.ts` | File exists; not in snapshot |
| `sim/civilization/FactionSystem.ts` | File exists; not in snapshot |
| `sim/narrative/NarrativeEngine.ts` | File exists; not in snapshot |
| `sim/narrative/MythEngine.ts` | File exists; not in snapshot |
| `sim/geology/EpochManager.ts` | File exists; not in snapshot |

## WIP / Orbis 2.0 Arcs (Planned; Not Yet Implemented)

`Orbis 2.0/arcs/` contains 5 planned arc expansions with package stubs, no implementation yet:
- `arc1-magic-leyline/` — magic system integration into simulation
- `arc2-biological-ecological/` — ecological coupling beyond biosphere capacity
- `arc3-civilization-political/` — political faction simulation
- `arc4-rpg-actor-agency/` — RPG actor agency / player character hooks
- `arc5-technical-economic-temporal/` — economic simulation, temporal mechanics

## WIP / Unimplemented Orbis 2.0 Modules (src/)

| Module | Status |
|---|---|
| `src/civ/culture.ts`, `institution.ts`, `urban.ts` | Files exist; content unknown — not in snapshot |
| `src/ecology/evolution.ts` | File exists; not in snapshot |
| `src/economy/` | Not explored; likely stub |
| `src/world/climate.ts`, `voxel.ts` | Files exist in Orbis 2.0 src/world/ |

---

## Canonical Contribution Surface

### 1. BiomeType — Planet-Scale Biome Vocabulary (40+ values)

Orbis has the richest biome vocabulary of all donors. Its `BiomeType` covers aquatic, coastal, arid, cold, temperate, tropical, and fully exotic multi-axial biomes. Mappa Imperium has a separate (simpler, ~18-value) `BiomeType` using a different naming convention (lowercase strings vs Orbis's `SCREAMING_SNAKE_CASE`).

**Cross-donor conflict:** These two BiomeType definitions must be reconciled in the canonical layer. The canonical `BiomeType` should draw the full vocabulary from Orbis, with Mappa Imperium's values mapped as aliases or the subset.

### 2. HexData / HexCoordinate — Hex-Spatial Record

Orbis `HexData` uses `center: [number, number, number]` (3D) + `neighbors: string[]` + full sim state. Mappa Imperium uses `HexCoordinate { q, r, s }` (axial 2D). These are both hex-spatial systems but at different abstraction levels. Canonical: a `HexRecord` with required axial coordinate and optional 3D center + simulation fields as attachments.

### 3. PlanetType / SettlementType / ResourceType

Canonical candidates with no current equivalent in Mythforge:
- `PlanetType` — world-scale classification
- `SettlementType` (with tier progression: NONE→CAMP→VILLAGE→CITY→METROPOLIS) — canonical upgrade to Mythforge's free-text settlement description
- `ResourceType` (5 base resources) — canonical resource vocabulary

### 4. DomainId — Simulation Domain Registry

The complete set of simulation domains with tick scheduling. Canonical `SimulationDomainEnum`. Maps to the world-model's `WorldRecord` simulation attachment point.

### 5. SimEvent / RuntimeEventEnvelope — Event Log

`SimEvent { atTimeUs: bigint, id: EventId, payloadHash }` + `RuntimeEventEnvelopeV1<TPayload>` — canonical event representation for the world-model's `EventEnvelope.json` fixture.

### 6. NarrativeArtifact — Narrative / Myth Production

`tone: heroic|tragic|bureaucratic|propagandist|revisionist` + `scope: local|regional|civilizational` — rich narrative production model. No other donor has this. Canonical candidate for `NarrativeAttachment` on `EventEnvelope`.

### 7. GenesisKernel Seed Model

`worldSeed: bigint` → `{ geo, bio, civ, magic }` sub-seed axes. Canonical seed contract for any entity requiring deterministic world generation.

### 8. InvalidationBubble / Retroactive Consistency

`{ tPatch, affectedDomains, status: Active|Reconciling|Resolved }` — canonical model for handling retroactive sim corrections. No other donor has this concept.

### 9. Multi-Planar / Multi-Stratum Spatial Model

`PlaneId (MATERIAL|FEYWILD|SHADOWFELL)` × `StratumId (AERO|TERRA|LITHO|ABYSSAL)` × `DepthClass (SURFACE..CORE)` — the most complete vertical/planar spatial model in any donor. Canonical candidate for `SpatialPlaneAttachment`.

### 10. VoxelSemantic / RegionDeclaration

`VoxelSemantic { material, biome, depthClass, realm, hazard, movementCost, cover }` — the semantic overlay for tactical/D&D 5e gameplay. `RegionDeclaration { layer: RegionLayer, scope: RegionScope, effect: RegionEffect }` — canonical region system.

---

## Provisional Concept-to-Canonical Mapping

| Orbis Concept | Provisional Canonical Target | Status |
|---|---|---|
| `BiomeType` (40+ SCREAMING_SNAKE) | `BiomeEnum` — supersedes Mappa Imperium's 18-value lowercase set | **conflict — needs reconciliation** |
| `HexData` (3D center + sim fields) | `HexRecord` + `SimulationSpatialAttachment` | candidate |
| `PlanetType` | `WorldRecord.planetType` | new — no prior canonical |
| `SettlementType` (5-tier) | `SettlementRecord.tier` | candidate — maps to Mythforge Settlement |
| `ResourceType` (5 base) | `ResourceAttachment.type` | candidate |
| `DomainId` (16) | `SimulationDomainEnum` | new — canonical sim registry |
| `SimEvent` | `WorldRecord.EventEnvelope` payload | candidate |
| `RuntimeEventEnvelopeV1` | `EventEnvelope` canonical shape | superset of existing fixture |
| `NarrativeArtifact` | `NarrativeAttachment` on `EventEnvelope` | new — no prior canonical |
| `GenesisKernel` seed model | `WorldRecord.seed` + `GenesisContract` | new |
| `InvalidationBubble` | `SimulationConsistencyAttachment` | new |
| `PlaneId` × `StratumId` | `SpatialPlaneAttachment` | new |
| `VoxelSemantic` | `TacticalOverlayAttachment` | new |

---

## UI Characterization Methodology

**Designed intent authoring.** The Orbis 1.0 React component layer (`components/`) and Orbis 2.0 UI layer (`ui/`) are excluded from the adapter snapshot. Phase 7 characterization must be authored from:
1. Store shape + action signatures (in snapshot)
2. `useWorldStore` action names: `regenerateWorld`, `applyBrush`, `loadArchetype`, `loadPreset`, `saveWorld`, `loadWorld`, `driftPlates`, `assignPlates`
3. `ViewMode` enum (11 values) → 11 distinct map display modes to characterize
4. `TerraformMode` enum (7 values) → 7 brush operations to characterize
5. Domain clock modes (`Frozen | Step | HighRes | Regenerate`) → simulation speed controls

Pre-registered waivers:
- **Orbis-W01**: Component layer excluded. All surface requirements authored from designed intent. Anchor: store action signatures + domain schema contracts.
- **Orbis-W02**: 17 of 19 sim engine implementations not in snapshot (only `SimSystem.ts` import list and schema types available). Mitigation: document from header contract, not execution.
- **Orbis-W03**: Orbis 2.0 arc expansions not implemented. Five arcs are stubs only. Do not document as implemented features.
- **Orbis-W04**: `BiomeType` naming conflict with Mappa Imperium. Must resolve at canonical layer before Phase 7 surface specs are finalized for either donor.

---

## Open Questions

- Should the canonical `BiomeType` follow Orbis's SCREAMING_SNAKE or Mappa Imperium's lowercase convention?
- Is `VoxelSemantic.movementCost` (1 = normal terrain, 2 = difficult terrain in D&D 5e) intended as the canonical D&D terrain interface, or was that incidental?
- `spec-sources/orbis.toml` points to `Orbis 2.0/services/runtime/` as `included_paths: ["contracts", "kernel", "domains"]` — but `runtime/` has `core/`, `dice/`, `governance/`, `render/` instead. This mapping is stale. Should the spec-source be updated?

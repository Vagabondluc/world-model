# Orbis 1.0 Update - Detailed Changelog

**Version:** 1.0  
**Generated:** 2026-02-14  
**Project:** Orbis Spec 2.0 Migration Framework

---

## Table of Contents

1. [Version History](#version-history)
2. [Phase 1: Core Foundation](#phase-1-core-foundation)
3. [Phase 2: Simulation Clock](#phase-2-simulation-clock-scheduler)
4. [Phase 3: Planetary Solvers](#phase-3-planetary-solvers-physics-layer)
5. [Phase 4: Terrain & Hydrology](#phase-4-terrain--hydrology-realization-layer)
6. [Phase 5: Tag & Semantic System](#phase-5-tag--semantic-system)
7. [Phase 6: History & Civilization](#phase-6-history--civilization-social-layer)
8. [Phase 7: UI & Visualization](#phase-7-ui--visualization)
9. [Phase 8: State Hardening](#phase-8-data-validation--state-hardening)
10. [Phase 9: Tactical View](#phase-9-high-resolution-tactical-view)
11. [Phase 10: Narrative Engine](#phase-10-narrative-engine-expansion)
12. [Breaking Changes](#breaking-changes)
13. [Migration Guide](#migration-guide)

---

## Version History

### v1.0 (2026-02-14)

**Major Release: Orbis 2.0 Migration Framework**

- Added 273 specifications covering all Orbis 2.0 domains
- Added 273 TDD files with Orbis 1.0 compatibility sections
- Added 11 Zod validation schemas
- Added 5 Zustand state stores
- Added comprehensive compatibility layer
- Added migration documentation and guides

---

## Phase 1: Core Foundation

### Added

#### Core Types ([`zod/core.ts`](zod/core.ts))

- `AbsTime` - Absolute time in microseconds (bigint)
- `DomainId` - Domain enumeration (14 domains)
- `DomainMode` - Domain operation modes (Frozen, Step, HighRes, Regenerate)
- `DomainClockSpec` - Domain clock configuration
- `DomainClockState` - Domain clock runtime state
- `EventId` - Event enumeration (7 event types)
- `SimEvent` - Simulation event structure
- `PluginSpec` - Plugin specification
- `Digest64` - Deterministic digest type
- `DigestSalt` - Digest salt enumeration
- `MathPPM` - Parts-per-million numeric type
- `Fixed32Q16` - 32-bit fixed-point (Q16)
- `Fixed64Q32` - 64-bit fixed-point (Q32)
- `UnitFamilyV1` - Unit family enumeration

#### Specifications

- [`specs/00-data-types.md`](specs/00-data-types.md) - 476 type declarations
- [`specs/01-time-clock-system.md`](specs/01-time-clock-system.md) - Time system v1
- [`specs/02-metric-registry.md`](specs/02-metric-registry.md) - Metric registry
- [`specs/03-threshold-registry.md`](specs/03-threshold-registry.md) - Threshold registry
- [`specs/04-mvp-acceptance-gates.md`](specs/04-mvp-acceptance-gates.md) - MVP gates

#### TDD Files

- [`tdd/00-data-types.tdd.md`](tdd/00-data-types.tdd.md) - Data types tests
- [`tdd/01-time-clock-system.tdd.md`](tdd/01-time-clock-system.tdd.md) - Time system tests
- [`tdd/02-metric-registry.tdd.md`](tdd/02-metric-registry.tdd.md) - Metric registry tests
- [`tdd/03-threshold-registry.tdd.md`](tdd/03-threshold-registry.tdd.md) - Threshold registry tests
- [`tdd/04-mvp-acceptance-gates.tdd.md`](tdd/04-mvp-acceptance-gates.tdd.md) - MVP gates tests

### Changed

- **Time Representation**: Changed from multiple time units to single `AbsTime` in microseconds
- **Domain Organization**: Introduced hierarchical temporal tiers (T0-T6)
- **Numerical Precision**: Introduced fixed-point math for numerical stability

### Deprecated

- Legacy time units (seconds, minutes, hours, years)
- Floating-point probability calculations
- Non-deterministic random number generation

---

## Phase 2: Simulation Clock & Scheduler

### Added

#### Time Types ([`zod/core.ts`](zod/core.ts))

- `DomainClockSpec` - Complete domain clock specification
- `DomainClockState` - Domain clock runtime state
- `SimEvent` - Event structure with timestamp and payload hash

#### Specifications

- [`specs/01-time-clock-system.md`](specs/01-time-clock-system.md) - Complete time system spec
- [`specs/11-deterministic-event-ordering.md`](specs/11-deterministic-event-ordering.md) - Event ordering

#### TDD Files

- [`tdd/01-time-clock-system.tdd.md`](tdd/01-time-clock-system.tdd.md) - Time system tests
- [`tdd/11-deterministic-event-ordering.tdd.md`](tdd/11-deterministic-event-ordering.tdd.md) - Event ordering tests

### Changed

- **Scheduler Architecture**: Moved from per-domain schedulers to unified scheduler
- **Event Processing**: Introduced event queue with chronological ordering
- **Catch-up Logic**: Added max catch-up steps per domain

### Fixed

- Deterministic event ordering across domains
- Time synchronization between domains
- Event invalidation propagation

---

## Phase 3: Planetary Solvers

### Added

#### Planetary Types ([`zod/planetary.ts`](zod/planetary.ts))

- `MagnetosphereState` - Magnetosphere state with health, polarity, phase
- `MagnetosphereDrivers` - Magnetosphere driver parameters
- `BiosphereCapacity01` - Biosphere capacity (0..1)
- `BiosphereViewModel` - Biosphere view model for UI

#### Climate Types ([`zod/climate.ts`](zod/climate.ts))

- `ClimateState` - Climate system state
- `ClimateParams` - Climate solver parameters
- `ClimateBand` - Latitude band state

#### Carbon Types ([`zod/carbon.ts`](zod/carbon.ts))

- `CarbonState` - Carbon cycle state
- `CarbonParams` - Carbon cycle parameters
- `CO2Q` - CO2 quantity type

#### Specifications

- [`specs/02-magnetosphere.md`](specs/02-magnetosphere.md) - Magnetosphere spec
- [`specs/03-climate-system.md`](specs/03-climate-system.md) - Climate system spec
- [`specs/04-carbon-cycle.md`](specs/04-carbon-cycle.md) - Carbon cycle spec
- [`specs/05-biosphere-capacity.md`](specs/05-biosphere-capacity.md) - Biosphere capacity spec

#### TDD Files

- [`tdd/02-magnetosphere.tdd.md`](tdd/02-magnetosphere.tdd.md) - Magnetosphere tests
- [`tdd/03-climate-system.tdd.md`](tdd/03-climate-system.tdd.md) - Climate system tests
- [`tdd/04-carbon-cycle.tdd.md`](tdd/04-carbon-cycle.tdd.md) - Carbon cycle tests
- [`tdd/05-biosphere-capacity.tdd.md`](tdd/05-biosphere-capacity.tdd.md) - Biosphere capacity tests

### Changed

- **Magnetosphere**: Introduced oscillator-based flip logic
- **Climate**: Implemented 1D latitude band solver with zonal diffusion
- **Carbon**: Added weathering and outgassing source/sink terms
- **Biosphere**: Implemented multiplicative fitness model

---

## Phase 4: Terrain & Hydrology

### Added

#### Hydrology Types ([`zod/hydrology.ts`](zod/hydrology.ts))

- `HydroState` - Hydrology state
- `HydroParams` - ABCD model parameters
- `BasinId` - River basin identifier

#### Geomorphology Types ([`zod/geomorphology.ts`](zod/geomorphology.ts))

- `ErosionState` - Erosion state
- `ErosionParams` - Erosion parameters
- `LithologyClass` - Lithology classification

#### Specifications

- [`specs/20-hydrology-coupling.md`](specs/20-hydrology-coupling.md) - Hydrology coupling
- [`specs/26-erosion-sediment.md`](specs/26-erosion-sediment.md) - Erosion and sediment
- [`specs/19-biome-stability.md`](specs/19-biome-stability.md) - Biome stability

#### TDD Files

- [`tdd/26-erosion-sediment.tdd.md`](tdd/26-erosion-sediment.tdd.md) - Erosion tests
- [`tdd/19-biome-stability.tdd.md`](tdd/19-biome-stability.tdd.md) - Biome stability tests
- [`tdd/hydrology-erosion.tdd.md`](tdd/hydrology-erosion.tdd.md) - Hydrology erosion tests

### Changed

- **Hydrology**: Replaced kernel with 2-bucket ABCD model
- **River Graph**: Added `MouthId` and `BasinId` to `HexData`
- **Erosion**: Re-implemented with fixed-point `sqrtPPM` and `LithologyClass` thresholds
- **Biome Logic**: Replaced if/else with Whittaker Schmitt-Trigger logic

---

## Phase 5: Tag & Semantic System

### Added

#### Tag Types ([`zod/core.ts`](zod/core.ts))

- `TagId` - Tag identifier
- `TagSet` - Set of tags (uint32[])
- `TagInstance` - Tag instance with metadata

#### Specifications

- [`specs/33-universal-tag-system.md`](specs/33-universal-tag-system.md) - Universal tag system
- [`specs/38-unified-tag-system.md`](specs/38-unified-tag-system.md) - Unified tag system
- [`specs/41-tag-interaction-math.md`](specs/41-tag-interaction-math.md) - Tag interaction math

#### TDD Files

- [`tdd/semantic-tags.tdd.md`](tdd/semantic-tags.tdd.md) - Semantic tags tests
- [`tdd/33-universal-tag-system.tdd.md`](tdd/33-universal-tag-system.tdd.md) - Universal tag tests
- [`tdd/38-unified-tag-system.tdd.md`](tdd/38-unified-tag-system.tdd.md) - Unified tag tests

### Changed

- **Tag Registry**: Introduced `TagRegistryV1` with core namespaces
- **Semantic Resolver**: Updated to return `TagSet` (uint32[])
- **Spatial Query**: Implemented `SpatialQueryAPI` for fast tag-based hex lookups

---

## Phase 6: History & Civilization

### Added

#### Civilization Types ([`zod/civilization.ts`](zod/civilization.ts))

- `NeedState` - Need engine state
- `RegimeState` - Regime state
- `TechTreeState` - Tech tree state
- `FactionState` - Faction state

#### Regime Types ([`zod/regimes.ts`](zod/regimes.ts))

- `RegimeTriggerDefV1` - Regime trigger definition
- `RegimeStateMachineV1` - Regime state machine
- `RegimeTransitionV1` - Regime transition

#### Specifications

- [`specs/32-need-driven-behavior.md`](specs/32-need-driven-behavior.md) - Need-driven behavior
- [`specs/81-government-form-system.md`](specs/81-government-form-system.md) - Government forms
- [`specs/82-government-transition-system.md`](specs/82-government-transition-system.md) - Government transitions
- [`specs/128-institutional-differentiation-engine.md`](specs/128-institutional-differentiation-engine.md) - Institutions

#### TDD Files

- [`tdd/32-need-driven-behavior.tdd.md`](tdd/32-need-driven-behavior.tdd.md) - Need behavior tests
- [`tdd/81-government-form-system.tdd.md`](tdd/81-government-form-system.tdd.md) - Government tests
- [`tdd/82-government-transition-system.tdd.md`](tdd/82-government-transition-system.tdd.md) - Transition tests

### Changed

- **Need Engine**: Implemented `dominantNeedId` utility scoring
- **Tech Matrix**: Added `tech_lXX_YYY` impact coefficients
- **Regime Machine**: Implemented state machine for government transitions

---

## Phase 7: UI & Visualization

### Added

#### UI Specifications

- [`specs/05-narrative-dashboard-spec.md`](specs/05-narrative-dashboard-spec.md) - Narrative dashboard
- [`specs/11-planet-pulse-dashboard-spec.md`](specs/11-planet-pulse-dashboard-spec.md) - Planet pulse
- [`specs/12-atmosphere-console-spec.md`](specs/12-atmosphere-console-spec.md) - Atmosphere console
- [`specs/13-wind-weather-viewer-spec.md`](specs/13-wind-weather-viewer-spec.md) - Wind weather
- [`specs/14-ocean-currents-viewer-spec.md`](specs/14-ocean-currents-viewer-spec.md) - Ocean currents
- [`specs/15-biome-stability-atlas-spec.md`](specs/15-biome-stability-atlas-spec.md) - Biome atlas
- [`specs/16-species-viewer-spec.md`](specs/16-species-viewer-spec.md) - Species viewer
- [`specs/17-food-web-dashboard-spec.md`](specs/17-food-web-dashboard-spec.md) - Food web
- [`specs/18-invasive-disease-watch-spec.md`](specs/18-invasive-disease-watch-spec.md) - Disease watch
- [`specs/19-civilization-pulse-spec.md`](specs/19-civilization-pulse-spec.md) - Civilization pulse
- [`specs/20-settlement-viability-map-spec.md`](specs/20-settlement-viability-map-spec.md) - Settlement viability
- [`specs/21-trade-supply-lanes-spec.md`](specs/21-trade-supply-lanes-spec.md) - Trade lanes
- [`specs/22-conflict-forecast-board-spec.md`](specs/22-conflict-forecast-board-spec.md) - Conflict forecast
- [`specs/23-event-forge-v2-spec.md`](specs/23-event-forge-v2-spec.md) - Event forge v2
- [`specs/24-arc-composer-timeline-spec.md`](specs/24-arc-composer-timeline-spec.md) - Arc composer
- [`specs/25-region-story-cards-spec.md`](specs/25-region-story-cards-spec.md) - Story cards
- [`specs/26-solver-validity-monitor-spec.md`](specs/26-solver-validity-monitor-spec.md) - Validity monitor
- [`specs/27-determinism-replay-integrity-spec.md`](specs/27-determinism-replay-integrity-spec.md) - Determinism replay
- [`specs/28-benchmark-scenarios-panel-spec.md`](specs/28-benchmark-scenarios-panel-spec.md) - Benchmark scenarios
- [`specs/29-parameter-provenance-explorer-spec.md`](specs/29-parameter-provenance-explorer-spec.md) - Parameter explorer
- [`specs/30-tag-explorer-spec.md`](specs/30-tag-explorer-spec.md) - Tag explorer
- [`specs/31-simulator-dashboard.md`](specs/31-simulator-dashboard.md) - Simulator dashboard
- [`specs/31-world-compare-ab-spec.md`](specs/31-world-compare-ab-spec.md) - World compare
- [`specs/32-easy-win-dashboard-mockups.md`](specs/32-easy-win-dashboard-mockups.md) - Easy win mockups
- [`specs/33-ui-implied-contracts-spec.md`](specs/33-ui-implied-contracts-spec.md) - UI contracts
- [`specs/34-reusable-component-library-spec.md`](specs/34-reusable-component-library-spec.md) - Component library
- [`specs/35-dashboard-panel-definitions-spec.md`](specs/35-dashboard-panel-definitions-spec.md) - Panel definitions

#### TDD Files

- [`tdd/05-narrative-dashboard-spec.tdd.md`](tdd/05-narrative-dashboard-spec.tdd.md) - Narrative dashboard tests
- [`tdd/11-planet-pulse-dashboard-spec.tdd.md`](tdd/11-planet-pulse-dashboard-spec.tdd.md) - Planet pulse tests
- [`tdd/12-atmosphere-console-spec.tdd.md`](tdd/12-atmosphere-console-spec.tdd.md) - Atmosphere tests
- [`tdd/13-wind-weather-viewer-spec.tdd.md`](tdd/13-wind-weather-viewer-spec.tdd.md) - Wind tests
- [`tdd/14-ocean-currents-viewer-spec.tdd.md`](tdd/14-ocean-currents-viewer-spec.tdd.md) - Ocean tests
- [`tdd/15-biome-stability-atlas-spec.tdd.md`](tdd/15-biome-stability-atlas-spec.tdd.md) - Biome atlas tests
- [`tdd/16-species-viewer-spec.tdd.md`](tdd/16-species-viewer-spec.tdd.md) - Species viewer tests
- [`tdd/17-food-web-dashboard-spec.tdd.md`](tdd/17-food-web-dashboard-spec.tdd.md) - Food web tests
- [`tdd/18-invasive-disease-watch-spec.tdd.md`](tdd/18-invasive-disease-watch-spec.tdd.md) - Disease tests
- [`tdd/20-settlement-viability-map-spec.tdd.md`](tdd/20-settlement-viability-map-spec.tdd.md) - Settlement tests
- [`tdd/31-simulator-dashboard.tdd.md`](tdd/31-simulator-dashboard.tdd.md) - Simulator tests

### Changed

- **Dashboard Integration**: Connected simulation to frontend
- **Sim Orchestrator**: Implemented simulation orchestration
- **Visualization**: Added real-time visualization updates

---

## Phase 8: Data Validation & State Hardening

### Added

#### Zod Schemas

- [`zod/core.ts`](zod/core.ts) - Core validation schemas
- [`zod/planetary.ts`](zod/planetary.ts) - Planetary state schemas
- [`zod/biology.ts`](zod/biology.ts) - Biological schemas
- [`zod/climate.ts`](zod/climate.ts) - Climate system schemas
- [`zod/hydrology.ts`](zod/hydrology.ts) - Hydrology schemas
- [`zod/civilization.ts`](zod/civilization.ts) - Civilization schemas
- [`zod/geomorphology.ts`](zod/geomorphology.ts) - Terrain schemas
- [`zod/infrastructure.ts`](zod/infrastructure.ts) - Infrastructure schemas
- [`zod/fields.ts`](zod/fields.ts) - Field projection schemas
- [`zod/projection.ts`](zod/projection.ts) - Projection schemas
- [`zod/regimes.ts`](zod/regimes.ts) - Regime schemas
- [`zod/benchmarks.ts`](zod/benchmarks.ts) - Benchmark schemas
- [`zod/carbon.ts`](zod/carbon.ts) - Carbon cycle schemas

#### Zustand Stores

- [`zustand/simulationStore.ts`](zustand/simulationStore.ts) - Simulation state
- [`zustand/planetaryStore.ts`](zustand/planetaryStore.ts) - Planetary state
- [`zustand/biosphereStore.ts`](zustand/biosphereStore.ts) - Biosphere state
- [`zustand/civilizationStore.ts`](zustand/civilizationStore.ts) - Civilization state
- [`zustand/worldStore.ts`](zustand/worldStore.ts) - World state

#### Specifications

- [`specs/56-unified-parameter-registry-schema-contract.md`](specs/56-unified-parameter-registry-schema-contract.md) - Parameter registry
- [`specs/57-save-load-snapshot-contract.md`](specs/57-save-load-snapshot-contract.md) - Snapshot contract
- [`specs/58-state-authority-contract.md`](specs/58-state-authority-contract.md) - State authority
- [`specs/59-worlddelta-validation-invariant-enforcement.md`](specs/59-worlddelta-validation-invariant-enforcement.md) - Delta validation
- [`specs/68-numerical-stability-fixed-point-math-contract.md`](specs/68-numerical-stability-fixed-point-math-contract.md) - Numerical stability
- [`specs/69-deterministic-curve-lut-library.md`](specs/69-deterministic-curve-lut-library.md) - Curve LUTs
- [`specs/70-canonical-normalization-remapping.md`](specs/70-canonical-normalization-remapping.md) - Normalization

#### TDD Files

- [`tdd/56-unified-parameter-registry-schema-contract.tdd.md`](tdd/56-unified-parameter-registry-schema-contract.tdd.md) - Parameter tests
- [`tdd/57-save-load-snapshot-contract.tdd.md`](tdd/57-save-load-snapshot-contract.tdd.md) - Snapshot tests
- [`tdd/58-state-authority-contract.tdd.md`](tdd/58-state-authority-contract.tdd.md) - Authority tests
- [`tdd/59-worlddelta-validation-invariant-enforcement.tdd.md`](tdd/59-worlddelta-validation-invariant-enforcement.tdd.md) - Delta tests
- [`tdd/68-numerical-stability-fixed-point-math-contract.tdd.md`](tdd/68-numerical-stability-fixed-point-math-contract.tdd.md) - Numerical tests
- [`tdd/35-deterministic-rng.tdd.md`](tdd/35-deterministic-rng.tdd.md) - RNG tests

### Changed

- **Validation**: Enforced strict schema validation for all simulation state
- **State Management**: Migrated to Zustand stores
- **Type Safety**: Added comprehensive Zod validation

---

## Phase 9: High-Resolution Tactical View

### Added

#### Tactical Types

- Tactical grid projection types
- Pathfinding algorithms
- Sprite rendering types

#### Specifications

- [`specs/136-hierarchical-pathfinding-hpa.md`](specs/136-hierarchical-pathfinding-hpa.md) - HPA* pathfinding
- [`specs/144-zoom-dependent-spawning-contract.md`](specs/144-zoom-dependent-spawning-contract.md) - Zoom spawning

#### TDD Files

- [`tdd/136-hierarchical-pathfinding-hpa.tdd.md`](tdd/136-hierarchical-pathfinding-hpa.tdd.md) - Pathfinding tests
- [`tdd/144-zoom-dependent-spawning-contract.tdd.md`](tdd/144-zoom-dependent-spawning-contract.tdd.md) - Spawning tests

### Changed

- **Tactical Types**: Added 5ft grid projection types
- **Tactical Projector**: Implemented tactical projection
- **Store Integration**: Integrated with `useLocalStore`
- **Visualizer**: Updated for tactical view
- **Pathfinding**: Implemented HPA* algorithm
- **Sprites**: Added sprite and grid rendering

---

## Phase 10: Narrative Engine Expansion

### Added

#### Narrative Types

- Myth production types
- Cultural memory types
- Chronicle persistence types

#### Specifications

- [`specs/85-narrative-and-myth-production-engine.md`](specs/85-narrative-and-myth-production-engine.md) - Myth production
- [`specs/86-information-narrative-engine.md`](specs/86-information-narrative-engine.md) - Information narrative
- [`specs/87-collective-emotion-engine.md`](specs/87-collective-emotion-engine.md) - Collective emotion
- [`specs/97-chronicler-historiography-system.md`](specs/97-chronicler-historiography-system.md) - Chronicler
- [`specs/130-narrative-and-myth-production-engine.md`](specs/130-narrative-and-myth-production-engine.md) - Myth engine
- [`specs/140-narrative-ai-director.md`](specs/140-narrative-ai-director.md) - Narrative AI director
- [`specs/141-cultural-drift-and-social-structures.md`](specs/141-cultural-drift-and-social-structures.md) - Cultural drift

#### TDD Files

- [`tdd/85-narrative-and-myth-production-engine.tdd.md`](tdd/85-narrative-and-myth-production-engine.tdd.md) - Myth tests
- [`tdd/86-information-narrative-engine.tdd.md`](tdd/86-information-narrative-engine.tdd.md) - Information tests
- [`tdd/87-collective-emotion-engine.tdd.md`](tdd/87-collective-emotion-engine.tdd.md) - Emotion tests
- [`tdd/97-chronicler-historiography-system.tdd.md`](tdd/97-chronicler-historiography-system.tdd.md) - Chronicler tests
- [`tdd/140-narrative-ai-director.tdd.md`](tdd/140-narrative-ai-director.tdd.md) - Director tests

### Changed

- **Schema Definitions**: Added narrative schemas
- **Myth Engine**: Implemented myth production
- **Narrative UI**: Added narrative dashboard components
- **Chronicle Persistence**: Implemented narrative persistence

---

## Breaking Changes

### Type System Changes

#### BiomeType Enum

**Before (Orbis 1.0):**
```typescript
enum BiomeType {
  FOREST = 5,
  JUNGLE = 6,
  TAIGA = 10,
  SWAMP = 11,
  // ...
}
```

**After (Orbis 2.0):**
```typescript
enum BiomeType {
  TEMPERATE_FOREST = 5,   // Renamed from FOREST
  TROPICAL_RAINFOREST = 6, // Renamed from JUNGLE
  BOREAL_FOREST = 10,      // Renamed from TAIGA
  WETLAND = 11,           // Renamed from SWAMP
  // ...
}
```

#### VoxelMaterial Enum

**Before (Orbis 1.0):**
```typescript
enum VoxelMaterial {
  COAL = 14,
  IRON = 15,
  GOLD = 16,
  // ...
}
```

**After (Orbis 2.0):**
```typescript
enum VoxelMaterial {
  COAL_ORE = 14,  // Renamed from COAL
  IRON_ORE = 15,  // Renamed from IRON
  GOLD_ORE = 16,  // Renamed from GOLD
  // ...
}
```

#### WorldDelta Format

**Before (Orbis 1.0):**
```typescript
interface WorldDeltaV1 {
  h?: number;      // height
  t?: number;      // temperature
  m?: number;      // moisture
  s?: SettlementType;
  d?: string;      // description
}
```

**After (Orbis 2.0):**
```typescript
interface WorldDeltaV2 {
  height?: number;
  temperature?: number;
  moisture?: number;
  settlement?: SettlementType;
  description?: string;
  biomeId?: BiomeTypeId;
  materialId?: VoxelMaterialId;
  timestamp?: AbsTime;
  author?: string;
}
```

### Time Representation

**Before (Orbis 1.0):**
```typescript
type TimeInSeconds = number;
type TimeInMinutes = number;
type TimeInHours = number;
type TimeInDays = number;
```

**After (Orbis 2.0):**
```typescript
type AbsTime = bigint;  // microseconds
```

### Numerical Precision

**Before (Orbis 1.0):**
```typescript
type Probability = number;  // 0..1, floating-point
```

**After (Orbis 2.0):**
```typescript
type MathPPM = number;  // 0..1_000_000, parts-per-million
```

---

## Migration Guide

### Step 1: Update Type References

Replace old enum values with new names:

```typescript
// Before
const biome = BiomeType.FOREST;
const material = VoxelMaterial.COAL;

// After
const biome = BiomeType.TEMPERATE_FOREST;
const material = VoxelMaterial.COAL_ORE;
```

### Step 2: Update Time Calculations

Convert time units to microseconds:

```typescript
// Before
const timeInSeconds = 60;
const timeInDays = 7;

// After
const timeInUs = 60n * 1_000_000n;  // 60 seconds
const timeInUs = 7n * 86_400_000_000n;  // 7 days
```

### Step 3: Update WorldDelta Usage

Use new field names:

```typescript
// Before
const delta: WorldDeltaV1 = {
  h: 100,
  t: 25,
  m: 0.5,
  d: "Description"
};

// After
const delta: WorldDeltaV2 = {
  height: 100,
  temperature: 25,
  moisture: 0.5,
  description: "Description",
  timestamp: currentAbsTime
};
```

### Step 4: Update Numerical Calculations

Use fixed-point math:

```typescript
// Before
const probability = Math.random();
const result = value * probability;

// After
const probabilityPPM = rng.next() % 1_000_001;
const result = mulPPM(value, probabilityPPM);
```

### Step 5: Update State Management

Migrate to Zustand stores:

```typescript
// Before
const [time, setTime] = useState(0);

// After
const { absTime, setAbsTime } = useSimulationStore();
```

### Step 6: Add Validation

Add Zod validation:

```typescript
// Before
function processState(state: any) {
  // Process state
}

// After
import { ClimateStateSchema } from './zod/climate';

function processState(state: unknown) {
  const validated = ClimateStateSchema.parse(state);
  // Process validated state
}
```

---

## Compatibility Layer

### Type Mapping Utilities

```typescript
// Location: orbis-1.0-compatibility-layer.md
function mapBiomeTypeV1ToV2(v1: number): BiomeType {
  const mapping = {
    5: BiomeType.TEMPERATE_FOREST,
    6: BiomeType.TROPICAL_RAINFOREST,
    10: BiomeType.BOREAL_FOREST,
    11: BiomeType.WETLAND,
    // ...
  };
  return mapping[v1] ?? BiomeType.PLAINS;
}

function mapVoxelMaterialV1ToV2(v1: number): VoxelMaterial {
  const mapping = {
    14: VoxelMaterial.COAL_ORE,
    15: VoxelMaterial.IRON_ORE,
    16: VoxelMaterial.GOLD_ORE,
    // ...
  };
  return mapping[v1] ?? VoxelMaterial.STONE;
}
```

### WorldDelta Migration

```typescript
function migrateWorldDeltaV1ToV2(v1: WorldDeltaV1): WorldDeltaV2 {
  return {
    height: v1.h,
    temperature: v1.t,
    moisture: v1.m,
    settlement: v1.s,
    description: v1.d,
    biomeId: undefined,
    materialId: undefined,
    timestamp: undefined,
    author: undefined
  };
}
```

---

**End of Changelog**

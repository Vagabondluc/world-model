# Orbis 1.0 Update - Comprehensive Technical Documentation

**Version:** 1.0  
**Generated:** 2026-02-14  
**Project:** Orbis Spec 2.0 Migration Framework

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Type System](#core-type-system)
3. [Domain Architecture](#domain-architecture)
4. [Simulation Engine](#simulation-engine)
5. [State Management](#state-management)
6. [Validation Layer](#validation-layer)
7. [Compatibility Layer](#compatibility-layer)
8. [Solver Contracts](#solver-contracts)
9. [Event System](#event-system)
10. [Performance Considerations](#performance-considerations)

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Orbis 2.0 Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   UI Layer (React)                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │  Dashboard   │  │  Visualizer  │  │  Controls    │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  └───────────────────────┬─────────────────────────────────┘   │
│                          │                                      │
│  ┌───────────────────────▼─────────────────────────────────┐   │
│  │              State Management (Zustand)                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │  Simulation  │  │  Planetary   │  │  Civilization│ │   │
│  │  │    Store     │  │    Store     │  │     Store    │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  └───────────────────────┬─────────────────────────────────┘   │
│                          │                                      │
│  ┌───────────────────────▼─────────────────────────────────┐   │
│  │              Validation Layer (Zod)                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │  Core Schemas│  │  Domain      │  │  Field       │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  └───────────────────────┬─────────────────────────────────┘   │
│                          │                                      │
│  ┌───────────────────────▼─────────────────────────────────┐   │
│  │              Simulation Engine                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │   Scheduler  │  │   Event Bus  │  │   Solvers    │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  └───────────────────────┬─────────────────────────────────┘   │
│                          │                                      │
│  ┌───────────────────────▼─────────────────────────────────┐   │
│  │              Domain Solvers                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │  Magnetosphere│ │   Climate    │  │  Hydrology   │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │  Biosphere   │  │ Civilization│  │  Narrative   │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Determinism**: All simulation operations must be reproducible
2. **Type Safety**: Strong typing with Zod validation
3. **Fixed-Point Math**: Numerical stability with PPM (parts-per-million) precision
4. **Event-Driven**: Loose coupling through event bus
5. **Domain Isolation**: Each simulation domain operates independently
6. **Temporal Hierarchy**: Multiple time scales with hierarchical synchronization

---

## Core Type System

### Absolute Time

The canonical time representation for the entire simulation.

```typescript
// Location: zod/core.ts
type AbsTime = bigint;  // microseconds since epoch
```

**Invariants:**
- `t >= 0n`
- Monotonic increasing
- Never rewinds (except in replay sandbox)

**Unit Conversion:**
```typescript
const DND_TICK_US = 6_000_000n;      // 6 seconds
const OSR_TURN_US = 600_000_000n;    // 10 minutes
const DAY_US = 86_400_000_000n;      // 24 hours
const YEAR_US = 31_557_600_000_000n; // 365.25 days
```

### Domain IDs

Each simulation domain has a unique identifier.

```typescript
// Location: zod/core.ts
enum DomainId {
  CORE_TIME = 0,
  PLANET_PHYSICS = 10,
  CLIMATE = 20,
  HYDROLOGY = 30,
  BIOSPHERE_CAPACITY = 40,
  TROPHIC_ENERGY = 50,
  POP_DYNAMICS = 60,
  EXTINCTION = 70,
  REFUGIA_COLONIZATION = 80,
  EVOLUTION_BRANCHING = 90,
  CIVILIZATION_NEEDS = 100,
  CIVILIZATION_BEHAVIOR = 110,
  WARFARE = 120,
  NARRATIVE_LOG = 200
}
```

### Domain Modes

Each domain can operate in different temporal modes.

```typescript
// Location: zod/core.ts
enum DomainMode {
  Frozen,       // No updates; Sample() only (Zero-Order Hold)
  Step,         // AdvanceTo at domain stepUs
  HighRes,      // AdvanceTo at smaller quantumUs inside a window
  Regenerate    // Recompute state from parameters at target time
}
```

### Domain Clock Specification

```typescript
// Location: zod/core.ts
interface DomainClockSpec {
  domain: DomainId;
  quantumUs: AbsTime;        // Smallest resolution for that domain
  stepUs: AbsTime;           // Typical update step
  mode: DomainMode;
  maxCatchupSteps: number;   // Per scheduler call
}
```

### Numerical Primitives

Fixed-point math for numerical stability.

```typescript
// Location: zod/core.ts
type MathPPM = number;       // Nominal 0..1_000_000 (parts-per-million)
type Fixed32Q16 = number;    // value / 65536
type Fixed64Q32 = bigint;    // value / 2^32

enum UnitFamilyV1 {
  Meters,
  KelvinQ16,
  PPM,
  JoulesQ32,
  Count,
  Id,
  Boolean
}
```

---

## Domain Architecture

### Temporal Hierarchy

```
T0: Core Time (0)
    │
    ├─ T1: Planet Physics (10)
    │   └─ Magnetosphere
    │
    ├─ T2: Climate (20)
    │   ├─ Energy Balance Model
    │   └─ Carbon Cycle
    │
    ├─ T3: Hydrology (30)
    │   └─ ABCD Model
    │
    ├─ T4: Biosphere (40-90)
    │   ├─ Biosphere Capacity (40)
    │   ├─ Trophic Energy (50)
    │   ├─ Population Dynamics (60)
    │   ├─ Extinction (70)
    │   ├─ Refugia Colonization (80)
    │   └─ Evolution Branching (90)
    │
    ├─ T5: Civilization (100-120)
    │   ├─ Needs (100)
    │   ├─ Behavior (110)
    │   └─ Warfare (120)
    │
    └─ T6: Narrative (200)
        └─ Myth Production
```

### Domain Clock State

```typescript
// Location: zod/core.ts
interface DomainClockState {
  lastStepTimeUs: AbsTime;
}
```

### Event Types

```typescript
// Location: zod/core.ts
enum EventId {
  ClimateChanged,
  SeaLevelChanged,
  TectonicsEpochChanged,
  CarbonChanged,
  MagnetosphereChanged,
  BiomeInvalidated,
  HydrologyInvalidated
}
```

### Simulation Event

```typescript
// Location: zod/core.ts
interface SimEvent {
  atTimeUs: AbsTime;
  id: EventId;
  payloadHash: number;
}
```

---

## Simulation Engine

### Scheduler

The scheduler coordinates all domain updates.

```typescript
// Location: core/time/Scheduler.ts (planned)
class Scheduler {
  private absTime: AbsTime;
  private clocks: Map<DomainId, DomainClockState>;
  private eventQueue: SimEvent[];
  private plugins: PluginSpec[];

  advanceTo(targetTimeUs: AbsTime): void {
    // 1. Update absolute time
    // 2. Process domains in temporal order
    // 3. Emit events
    // 4. Handle invalidations
  }

  registerDomain(spec: DomainClockSpec): void;
  registerPlugin(plugin: PluginSpec): void;
  emitEvent(event: SimEvent): void;
}
```

### Plugin System

```typescript
// Location: zod/core.ts
interface PluginSpec {
  id: string;
  runsOn: DomainId[];
  reads: string[];
  writes: string[];
  deterministic: true;
}
```

### Deterministic RNG

```typescript
// Location: core/rng.ts (planned)
class DeterministicRNG {
  private state: bigint;

  constructor(seed: bigint) {
    this.state = seed;
  }

  next(): bigint {
    // SplitMix64 algorithm
    this.state = this.state + 0x9e3779b97f4a7c15n;
    let z = this.state;
    z = (z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n;
    z = (z ^ (z >> 27n)) * 0x94d049bb133111ebn;
    z = z ^ (z >> 31n);
    return z;
  }

  digest(salt: DigestSalt): Digest64 {
    // Compute deterministic digest
  }
}
```

---

## State Management

### Zustand Stores

#### Simulation Store

```typescript
// Location: zustand/simulationStore.ts
interface SimulationState {
  absTime: AbsTime;
  clocks: Record<string, DomainClockState>;
  events: SimEvent[];
  
  // Actions
  setAbsTime: (time: AbsTime) => void;
  updateClock: (domainId: string, state: DomainClockState) => void;
  addEvent: (event: SimEvent) => void;
  clearEvents: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  absTime: 0n,
  clocks: {},
  events: [],
  
  setAbsTime: (absTime) => set({ absTime }),
  updateClock: (domainId, state) => set((prev) => ({
    clocks: { ...prev.clocks, [domainId]: state }
  })),
  addEvent: (event) => set((prev) => ({
    events: [...prev.events, event]
  })),
  clearEvents: () => set({ events: [] })
}));
```

#### Planetary Store

```typescript
// Location: zustand/planetaryStore.ts (planned)
interface PlanetaryState {
  magnetosphere: MagnetosphereState;
  climate: ClimateState;
  hydrology: HydrologyState;
  // ... other planetary state
}
```

#### Biosphere Store

```typescript
// Location: zustand/biosphereStore.ts (planned)
interface BiosphereState {
  capacity: BiosphereCapacity01;
  species: SpeciesState[];
  populations: PopulationState[];
  // ... other biosphere state
}
```

#### Civilization Store

```typescript
// Location: zustand/civilizationStore.ts (planned)
interface CivilizationState {
  needs: NeedState;
  regimes: RegimeState;
  tech: TechTreeState;
  // ... other civilization state
}
```

---

## Validation Layer

### Zod Schemas

#### Core Schemas

```typescript
// Location: zod/core.ts
export const AbsTimeSchema = z.bigint().nonnegative();
export const DomainIdSchema = z.nativeEnum(DomainId);
export const DomainModeSchema = z.nativeEnum(DomainMode);
export const DomainClockSpecSchema = z.object({
  domain: DomainIdSchema,
  quantumUs: AbsTimeSchema,
  stepUs: AbsTimeSchema,
  mode: DomainModeSchema,
  maxCatchupSteps: z.number().int().nonnegative()
});
```

#### Planetary Schemas

```typescript
// Location: zod/planetary.ts
export const MagnetosphereStateSchema = z.object({
  health01: z.number().min(0).max(1),
  polarity: z.union([z.literal(1), z.literal(-1)]),
  phase01: z.number().min(0).max(1),
  lastFlipTimeMs: AbsTimeSchema
});

export const BiosphereCapacity01Schema = z.number().min(0).max(1);

export const BiosphereViewModelSchema = z.object({
  vitality01: z.number().min(0).max(1),
  dominantTier: z.enum(["Sterile", "Microbial", "Simple", "Complex", "Advanced"]),
  collapseRisk: z.enum(["Low", "Moderate", "High"])
});
```

#### Climate Schemas

```typescript
// Location: zod/climate.ts (planned)
export const ClimateStateSchema = z.object({
  temperature: z.number(),
  albedo: z.number().min(0).max(1),
  co2: z.number(),
  // ... other climate state
});
```

#### Hydrology Schemas

```typescript
// Location: zod/hydrology.ts (planned)
export const HydrologyStateSchema = z.object({
  waterTable: z.number(),
  runoff: z.number(),
  evaporation: z.number(),
  // ... other hydrology state
});
```

---

## Compatibility Layer

### BiomeType Mapping

```typescript
// Location: orbis-1.0-compatibility-layer.md
const BiomeTypeMapping: Record<number, string> = {
  0: 'DEEP_OCEAN',
  1: 'OCEAN',
  2: 'SHALLOW_OCEAN',
  3: 'BEACH',
  4: 'PLAINS',
  5: 'TEMPERATE_FOREST',      // Renamed from FOREST
  6: 'TROPICAL_RAINFOREST',    // Renamed from JUNGLE
  7: 'DESERT',
  8: 'SAVANNA',
  9: 'TUNDRA',
  10: 'BOREAL_FOREST',         // Renamed from TAIGA
  11: 'WETLAND',               // Renamed from SWAMP
  12: 'MOUNTAIN',
  13: 'ALPINE_MOUNTAIN',       // Renamed from SNOWY_MOUNTAIN
  14: 'ICE_SHELF',
  15: 'GLACIER',
  16: 'VOLCANIC',
  17: 'CORAL_REEF',
  18: 'MANGROVE',
  19: 'STEPPE',
  20: 'SHRUBLAND',
  21: 'CANYON',
  22: 'ALPINE_TUNDRA'          // Renamed from ALPINE
};
```

### VoxelMaterial Mapping

```typescript
// Location: orbis-1.0-compatibility-layer.md
const VoxelMaterialMapping: Record<number, string> = {
  0: 'AIR',
  1: 'WATER',
  2: 'SAND',
  3: 'DIRT',
  4: 'GRASS',
  5: 'STONE',
  6: 'GRANITE',
  7: 'BASALT',
  8: 'LIMESTONE',
  9: 'CLAY',
  10: 'SNOW',
  11: 'ICE',
  12: 'WOOD',
  13: 'LEAVES',
  14: 'COAL_ORE',              // Renamed from COAL
  15: 'IRON_ORE',              // Renamed from IRON
  16: 'GOLD_ORE',              // Renamed from GOLD
  17: 'OBSIDIAN',
  18: 'MARBLE',
  19: 'LAVA',
  20: 'BEDROCK',
  21: 'MAGMA'
};
```

### WorldDelta Migration

```typescript
// Location: orbis-1.0-compatibility-layer.md
function migrateWorldDeltaV1ToV2(v1: WorldDeltaV1): WorldDeltaV2 {
  return {
    height: v1.h,
    temperature: v1.t,
    moisture: v1.m,
    settlement: v1.s,
    description: v1.d,
    // New fields in V2:
    biomeId: undefined,
    materialId: undefined,
    timestamp: undefined,
    author: undefined
  };
}
```

---

## Solver Contracts

### Magnetosphere Solver

```typescript
// Location: specs/02-magnetosphere.md
interface MagnetosphereParams {
  coreHeat01: number;         // 0..1
  rotation01: number;         // 0..1
  tectonicHeatFlux01: number; // 0..1
}

interface MagnetosphereState {
  health01: number;           // 0..1
  polarity: 1 | -1;
  phase01: number;            // 0..1
  lastFlipTimeMs: AbsTime;
}

function stepMagnetosphere(
  params: MagnetosphereParams,
  state: MagnetosphereState,
  dtUs: AbsTime
): MagnetosphereState {
  // Oscillator-based flip logic
}
```

### Climate Solver (EBM)

```typescript
// Location: specs/03-climate-system.md
interface ClimateParams {
  solarConstant: number;
  albedoParams: AlbedoParams;
  bandCount: BandCount;
}

interface ClimateState {
  bands: ClimateBand[];
  globalTemperature: number;
}

interface ClimateBand {
  latitude: number;
  temperature: number;
  albedo: Albedo;
}

function stepClimate(
  params: ClimateParams,
  state: ClimateState,
  dtUs: AbsTime
): ClimateState {
  // 1D Latitude Band solver with zonal diffusion
}
```

### Carbon Cycle Solver

```typescript
// Location: specs/04-carbon-cycle.md
interface CarbonParams {
  weatheringRate: number;
  outgassingRate: number;
  photosynthesisRate: number;
  respirationRate: number;
}

interface CarbonState {
  atmosphere: CO2Q;
  ocean: CarbonUnit01;
  biosphere: CarbonUnit01;
  geosphere: CarbonUnit01;
}

function stepCarbonCycle(
  params: CarbonParams,
  state: CarbonState,
  dtUs: AbsTime
): CarbonState {
  // Add Weathering and Outgassing source/sink terms
}
```

### Biosphere Capacity Solver

```typescript
// Location: specs/05-biosphere-capacity.md
interface BiosphereCapacityParams {
  temperatureOptimum: number;
  temperatureTolerance: number;
  moistureOptimum: number;
  moistureTolerance: number;
}

function computeBiosphereCapacity(
  params: BiosphereCapacityParams,
  temperature: number,
  moisture: number
): BiosphereCapacity01 {
  // Multiplicative fitness model
  const tempFitness = computeFitness(
    temperature,
    params.temperatureOptimum,
    params.temperatureTolerance
  );
  const moistureFitness = computeFitness(
    moisture,
    params.moistureOptimum,
    params.moistureTolerance
  );
  return tempFitness * moistureFitness;
}
```

### Hydrology Solver (ABCD Model)

```typescript
// Location: specs/20-hydrology-coupling.md
interface HydroParams {
  // ABCD model parameters
  a: number;  // Fast storage coefficient
  b: number;  // Slow storage coefficient
  c: number;  // Percolation coefficient
  d: number;  // Baseflow coefficient
}

interface HydroState {
  fastStorage: number;
  slowStorage: number;
  runoff: number;
  baseflow: number;
}

function stepHydrology(
  params: HydroParams,
  state: HydroState,
  precipitation: number,
  dtUs: AbsTime
): HydroState {
  // 2-bucket ABCD model
}
```

---

## Event System

### Event Bus Architecture

```typescript
// Location: core/events/EventBus.ts (planned)
class EventBus {
  private eventQueue: SimEvent[];
  private subscribers: Map<EventId, Set<EventHandler>>;

  subscribe(eventId: EventId, handler: EventHandler): void {
    if (!this.subscribers.has(eventId)) {
      this.subscribers.set(eventId, new Set());
    }
    this.subscribers.get(eventId)!.add(handler);
  }

  unsubscribe(eventId: EventId, handler: EventHandler): void {
    this.subscribers.get(eventId)?.delete(handler);
  }

  emit(event: SimEvent): void {
    this.eventQueue.push(event);
    this.subscribers.get(event.id)?.forEach(handler => {
      handler(event);
    });
  }

  process(): void {
    // Process events in chronological order
    this.eventQueue.sort((a, b) => 
      Number(a.atTimeUs - b.atTimeUs)
    );
    // ... handle invalidations
  }
}
```

### Event Invalidation

```typescript
// Location: specs/01-time-clock-system.md
interface InvalidationRule {
  eventId: EventId;
  invalidates: DomainId[];
}

const InvalidationRules: InvalidationRule[] = [
  { eventId: EventId.ClimateChanged, invalidates: [DomainId.BIOSPHERE_CAPACITY] },
  { eventId: EventId.SeaLevelChanged, invalidates: [DomainId.HYDROLOGY] },
  { eventId: EventId.MagnetosphereChanged, invalidates: [DomainId.CLIMATE] },
  { eventId: EventId.BiomeInvalidated, invalidates: [DomainId.POP_DYNAMICS] },
  { eventId: EventId.HydrologyInvalidated, invalidates: [DomainId.TROPHIC_ENERGY] }
];
```

---

## Performance Considerations

### Numerical Stability

**Fixed-Point Math:**
- Use `MathPPM` for probabilities and ratios (0..1,000,000)
- Use `Fixed32Q16` for intermediate calculations
- Use `Fixed64Q32` for high-precision accumulation

**Avoid:**
- Floating-point accumulation errors
- Division by zero
- Overflow/underflow

### Temporal Efficiency

**Domain Scheduling:**
- Process domains in temporal order (T0 → T6)
- Use catch-up steps for lagging domains
- Minimize cross-domain dependencies

**Event Processing:**
- Batch events by time
- Use priority queue for event scheduling
- Minimize event propagation depth

### Memory Management

**State Storage:**
- Use compact representations (e.g., uint8 for enums)
- Pool frequently allocated objects
- Use typed arrays for large datasets

**Snapshot Management:**
- Compress historical states
- Use incremental snapshots
- Implement snapshot expiration

---

## Testing Strategy

### TDD Structure

Each TDD file contains:

1. **Core Functionality Tests**
   - Type definitions and schema validation
   - Registry initialization and lookup
   - Math primitives and numerical operations
   - Threshold registry and boundary checks

2. **Integration Tests**
   - Cross-component type safety
   - Registry query performance
   - Error propagation

3. **Performance Tests**
   - Operation performance benchmarks
   - Memory usage under load
   - Scalability with concurrent operations

4. **Orbis 1.0 Compatibility Tests**
   - Type mapping verification
   - Serialization format compatibility
   - Structure compatibility

5. **Edge Case Tests**
   - Boundary conditions
   - Invalid input handling
   - Concurrent access scenarios

### Test Coverage

- **Unit Tests**: Individual component testing
- **Integration Tests**: Cross-component interaction
- **Performance Tests**: Benchmarking and profiling
- **Compatibility Tests**: Orbis 1.0 migration verification

---

## Implementation Guidelines

### Code Organization

```
Orbis 1.0/
├── core/
│   ├── types.ts           # Core type definitions
│   ├── math.ts            # Fixed-point math primitives
│   ├── rng.ts             # Deterministic RNG
│   └── time/
│       ├── types.ts        # Time-related types
│       ├── Scheduler.ts    # Time scheduler
│       └── Constants.ts   # Domain constants
├── sim/
│   ├── physics/
│   │   └── Magnetosphere.ts
│   ├── climate/
│   │   ├── EnergyBalanceModel.ts
│   │   └── CarbonCycle.ts
│   ├── hydrology/
│   │   └── ABCDHydrology.ts
│   ├── biosphere/
│   │   └── BiosphereCapacity.ts
│   └── civilization/
│       ├── NeedEngine.ts
│       ├── RegimeManager.ts
│       └── TechTree.ts
├── services/
│   ├── semanticResolver.ts
│   ├── spatialQuery.ts
│   └── SnapshotService.ts
├── stores/
│   ├── simulationStore.ts
│   ├── planetaryStore.ts
│   ├── biosphereStore.ts
│   └── civilizationStore.ts
├── components/
│   ├── dashboard/
│   │   └── SimulationDashboard.tsx
│   └── visualizer/
│       └── VoxelVisualizer.tsx
└── update/
    ├── zod/               # Validation schemas
    ├── zustand/           # State stores
    ├── specs/             # Specifications
    └── tdd/               # Test definitions
```

### Coding Standards

1. **Type Safety**: Always use TypeScript with strict mode
2. **Validation**: Validate all inputs with Zod schemas
3. **Determinism**: Never use `Math.random()`, use deterministic RNG
4. **Documentation**: Document all public APIs
5. **Testing**: Write tests before implementation (TDD)
6. **Performance**: Profile critical paths before optimization

### Migration Checklist

For each Orbis 1.0 component:

1. [ ] Identify equivalent Orbis 2.0 types
2. [ ] Map Orbis 1.0 enum values to Orbis 2.0
3. [ ] Update data structures to use new types
4. [ ] Replace floating-point with fixed-point math
5. [ ] Add Zod validation
6. [ ] Integrate with Zustand stores
7. [ ] Write TDD tests
8. [ ] Verify compatibility layer
9. [ ] Update documentation
10. [ ] Run integration tests

---

## References

### Key Documents

- [`STATUS_SUMMARY.md`](STATUS_SUMMARY.md) - Project status overview
- [`checklist.md`](checklist.md) - Implementation checklist
- [`MANUAL_UPDATE_GUIDE.md`](MANUAL_UPDATE_GUIDE.md) - TDD update procedures
- [`orbis-1.0-compatibility-layer.md`](orbis-1.0-compatibility-layer.md) - Type mappings
- [`spec-migration-log.txt`](spec-migration-log.txt) - Migration history
- [`todo.md`](todo.md) - Roadmap and phase tracking

### Specification Categories

- **Core Foundation**: Types, time, math, RNG
- **World Generation**: Magnetosphere, climate, hydrology, geology
- **Life & Ecology**: Biosphere, species, evolution
- **Civilization**: Needs, regimes, tech, warfare
- **Runtime Determinism**: Events, validation, reproducibility
- **UI/UX**: Dashboards, visualizers, controls

### External Dependencies

- **Zod**: Runtime type validation
- **Zustand**: State management
- **TypeScript**: Type safety
- **React**: UI framework

---

**End of Technical Documentation**

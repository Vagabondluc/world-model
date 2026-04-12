# Orbis 1.0 Update - Code References and Structure

**Version:** 1.0  
**Generated:** 2026-02-14  
**Project:** Orbis Spec 2.0 Migration Framework

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Core Type References](#core-type-references)
3. [Zod Schema References](#zod-schema-references)
4. [Zustand Store References](#zustand-store-references)
5. [Specification References](#specification-references)
6. [TDD File References](#tdd-file-references)
7. [File Dependencies](#file-dependencies)
8. [Import/Export Patterns](#importexport-patterns)

---

## Directory Structure

### Project Root

```
Orbis 1.0/
├── core/                    # Core types and utilities
│   ├── types.ts            # Core type definitions
│   ├── math.ts             # Fixed-point math primitives
│   ├── rng.ts              # Deterministic RNG
│   └── time/              # Time system
│       ├── types.ts        # Time-related types
│       ├── Scheduler.ts    # Time scheduler
│       └── Constants.ts   # Domain constants
├── sim/                    # Simulation engines
│   ├── physics/            # Physics solvers
│   ├── climate/            # Climate system
│   ├── hydrology/          # Hydrology system
│   ├── biosphere/          # Biosphere system
│   └── civilization/      # Civilization system
├── services/               # Shared services
│   ├── semanticResolver.ts
│   ├── spatialQuery.ts
│   └── SnapshotService.ts
├── stores/                 # Zustand stores
│   ├── simulationStore.ts
│   ├── planetaryStore.ts
│   ├── biosphereStore.ts
│   └── civilizationStore.ts
├── components/             # React components
│   ├── dashboard/
│   └── visualizer/
├── update/                 # Migration framework
│   ├── zod/               # Validation schemas
│   ├── zustand/           # State stores
│   ├── specs/             # Specifications
│   └── tdd/               # Test definitions
└── docs/                  # Documentation
```

### Update Directory

```
Orbis 1.0/update/
├── checklist.md                    # Implementation checklist
├── MANUAL_UPDATE_GUIDE.md           # TDD update procedures
├── orbis-1.0-compatibility-layer.md # Type mappings
├── spec-migration-log.txt           # Migration history
├── todo.md                         # Roadmap
├── STATUS_SUMMARY.md              # Status summary (NEW)
├── TECHNICAL_DOCUMENTATION.md      # Technical docs (NEW)
├── CHANGELOG.md                   # Changelog (NEW)
├── IMPLEMENTATION_GUIDE.md        # Implementation guide (NEW)
├── SPECS_COMPARISON.md            # Specs comparison (NEW)
├── CODE_REFERENCES.md             # Code references (NEW)
├── specs/                         # 273 specifications
├── tdd/                           # 273 TDD files
├── tdd-updated/                   # Updated TDD files (28)
├── zod/                           # 11 validation schemas
└── zustand/                       # 5 state stores
```

---

## Core Type References

### [`core/types.ts`](core/types.ts)

**Exports:**
- `AbsTime` - Absolute time in microseconds (bigint)
- `TagId` - Tag identifier (number)
- `MathPPM` - Parts-per-million numeric type (number)
- `Fixed32Q16` - 32-bit fixed-point (Q16) (number)
- `Fixed64Q32` - 64-bit fixed-point (Q32) (bigint)
- `UnitFamilyV1` - Unit family enumeration

**Usage:**
```typescript
import { AbsTime, MathPPM } from './core/types';

const currentTime: AbsTime = 1000000n;
const probability: MathPPM = 500000;
```

### [`core/math.ts`](core/math.ts)

**Exports:**
- `mulPPM(a: MathPPM, b: MathPPM): MathPPM` - Multiply PPM values
- `divPPM(a: MathPPM, b: MathPPM): MathPPM` - Divide PPM values
- `sqrtPPM(x: MathPPM): MathPPM` - Square root of PPM value
- `powPPM(base: MathPPM, exponent: number): MathPPM` - Power of PPM value

**Usage:**
```typescript
import { mulPPM, sqrtPPM } from './core/math';

const result = mulPPM(500000, 500000); // 250000
const root = sqrtPPM(250000); // 500000
```

### [`core/rng.ts`](core/rng.ts)

**Exports:**
- `DeterministicRNG` - Deterministic random number generator class

**Methods:**
- `constructor(seed: bigint)` - Initialize with seed
- `next(): bigint` - Generate next random 64-bit value
- `nextInt(max: number): number` - Generate random value in range [0, max)
- `digest(salt: DigestSalt): Digest64` - Compute deterministic digest

**Usage:**
```typescript
import { DeterministicRNG } from './core/rng';

const rng = new DeterministicRNG(123456789n);
const randomValue = rng.nextInt(1000);
```

### [`core/time/types.ts`](core/time/types.ts)

**Exports:**
- `DomainId` - Domain enumeration (14 domains)
- `DomainMode` - Domain operation modes (Frozen, Step, HighRes, Regenerate)
- `DomainClockSpec` - Domain clock configuration
- `DomainClockState` - Domain clock runtime state
- `EventId` - Event enumeration (7 event types)
- `SimEvent` - Simulation event structure
- `PluginSpec` - Plugin specification

**Usage:**
```typescript
import { DomainId, DomainMode, SimEvent } from './core/time/types';

const event: SimEvent = {
  atTimeUs: 1000000n,
  id: EventId.ClimateChanged,
  payloadHash: 12345
};
```

### [`core/time/Scheduler.ts`](core/time/Scheduler.ts)

**Exports:**
- `Scheduler` - Simulation scheduler class

**Methods:**
- `advanceTo(targetTimeUs: AbsTime): void` - Advance simulation to target time
- `registerPlugin(plugin: PluginSpec): void` - Register a plugin
- `emitEvent(event: SimEvent): void` - Emit an event
- `getCurrentTime(): AbsTime` - Get current absolute time
- `getDomainClock(domainId: DomainId): DomainClockState | undefined` - Get domain clock state

**Usage:**
```typescript
import { Scheduler } from './core/time/Scheduler';

const scheduler = new Scheduler();
scheduler.advanceTo(86400000000n); // Advance 1 day
```

### [`core/time/Constants.ts`](core/time/Constants.ts)

**Exports:**
- `SECOND_US` - Microseconds in one second (1_000_000n)
- `MINUTE_US` - Microseconds in one minute (60_000_000n)
- `HOUR_US` - Microseconds in one hour (3_600_000_000n)
- `DAY_US` - Microseconds in one day (86_400_000_000n)
- `YEAR_US` - Microseconds in one year (31_557_600_000_000n)
- `DOMAIN_CLOCKS` - Domain clock specifications

**Usage:**
```typescript
import { DAY_US, DOMAIN_CLOCKS } from './core/time/Constants';

const oneDay = DAY_US;
const climateSpec = DOMAIN_CLOCKS[DomainId.CLIMATE];
```

---

## Zod Schema References

### [`update/zod/core.ts`](update/zod/core.ts)

**Exports:**
- `AbsTimeSchema` - Absolute time schema
- `DomainIdSchema` - Domain ID schema
- `DomainModeSchema` - Domain mode schema
- `DomainClockSpecSchema` - Domain clock spec schema
- `DomainClockStateSchema` - Domain clock state schema
- `EventIdSchema` - Event ID schema
- `SimEventSchema` - Simulation event schema
- `PluginSpecSchema` - Plugin spec schema
- `Digest64Schema` - Digest schema
- `DigestSaltSchema` - Digest salt schema
- `MathPPMSchema` - Math PPM schema
- `Fixed32Q16Schema` - Fixed32 Q16 schema
- `Fixed64Q32Schema` - Fixed64 Q32 schema
- `UnitFamilyV1Schema` - Unit family schema

**Usage:**
```typescript
import { AbsTimeSchema, SimEventSchema } from '../update/zod/core';

const time = AbsTimeSchema.parse(1000000n);
const event = SimEventSchema.parse({
  atTimeUs: 1000000n,
  id: EventId.ClimateChanged,
  payloadHash: 12345
});
```

### [`update/zod/planetary.ts`](update/zod/planetary.ts)

**Exports:**
- `MagnetosphereStateSchema` - Magnetosphere state schema
- `MagnetosphereDriversSchema` - Magnetosphere drivers schema
- `BiosphereCapacity01Schema` - Biosphere capacity schema
- `BiosphereViewModelSchema` - Biosphere view model schema

**Usage:**
```typescript
import { MagnetosphereStateSchema } from '../update/zod/planetary';

const magState = MagnetosphereStateSchema.parse({
  health01: 0.8,
  polarity: 1,
  phase01: 0.5,
  lastFlipTimeMs: 1000000n
});
```

### [`update/zod/climate.ts`](update/zod/climate.ts)

**Exports:**
- `ClimateStateSchema` - Climate state schema
- `ClimateParamsSchema` - Climate params schema
- `ClimateBandSchema` - Climate band schema

### [`update/zod/hydrology.ts`](update/zod/hydrology.ts)

**Exports:**
- `HydroStateSchema` - Hydrology state schema
- `HydroParamsSchema` - Hydrology params schema

### [`update/zod/civilization.ts`](update/zod/civilization.ts)

**Exports:**
- `NeedStateSchema` - Need state schema
- `RegimeStateSchema` - Regime state schema
- `TechTreeStateSchema` - Tech tree state schema
- `FactionStateSchema` - Faction state schema

### [`update/zod/biology.ts`](update/zod/biology.ts)

**Exports:**
- `SpeciesStateSchema` - Species state schema
- `PopulationStateSchema` - Population state schema

### [`update/zod/geomorphology.ts`](update/zod/geomorphology.ts)

**Exports:**
- `ErosionStateSchema` - Erosion state schema
- `ErosionParamsSchema` - Erosion params schema

### [`update/zod/infrastructure.ts`](update/zod/infrastructure.ts)

**Exports:**
- `InfrastructureStateSchema` - Infrastructure state schema

### [`update/zod/fields.ts`](update/zod/fields.ts)

**Exports:**
- `FieldStateSchema` - Field state schema
- `FieldParamsSchema` - Field params schema

### [`update/zod/projection.ts`](update/zod/projection.ts)

**Exports:**
- `ProjectionStateSchema` - Projection state schema
- `ProjectionParamsSchema` - Projection params schema

### [`update/zod/regimes.ts`](update/zod/regimes.ts)

**Exports:**
- `RegimeTriggerDefV1Schema` - Regime trigger schema
- `RegimeStateMachineV1Schema` - Regime state machine schema
- `RegimeTransitionV1Schema` - Regime transition schema

### [`update/zod/benchmarks.ts`](update/zod/benchmarks.ts)

**Exports:**
- `BenchmarkStateSchema` - Benchmark state schema
- `BenchmarkParamsSchema` - Benchmark params schema

### [`update/zod/carbon.ts`](update/zod/carbon.ts)

**Exports:**
- `CarbonStateSchema` - Carbon state schema
- `CarbonParamsSchema` - Carbon params schema
- `CO2QSchema` - CO2 quantity schema

---

## Zustand Store References

### [`update/zustand/simulationStore.ts`](update/zustand/simulationStore.ts)

**Exports:**
- `useSimulationStore` - Simulation state store hook

**State Interface:**
```typescript
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
```

**Usage:**
```typescript
import { useSimulationStore } from '../update/zustand/simulationStore';

const { absTime, setAbsTime, addEvent } = useSimulationStore();

setAbsTime(1000000n);
addEvent({
  atTimeUs: 1000000n,
  id: EventId.ClimateChanged,
  payloadHash: 12345
});
```

### [`update/zustand/planetaryStore.ts`](update/zustand/planetaryStore.ts)

**Exports:**
- `usePlanetaryStore` - Planetary state store hook

**State Interface:**
```typescript
interface PlanetaryState {
  magnetosphere: MagnetosphereState;
  climate: ClimateState;
  hydrology: HydroState;
  // ... other planetary state
  
  // Actions
  updateMagnetosphere: (state: MagnetosphereState) => void;
  updateClimate: (state: ClimateState) => void;
  updateHydrology: (state: HydroState) => void;
}
```

### [`update/zustand/biosphereStore.ts`](update/zustand/biosphereStore.ts)

**Exports:**
- `useBiosphereStore` - Biosphere state store hook

**State Interface:**
```typescript
interface BiosphereState {
  capacity: BiosphereCapacity01;
  species: SpeciesState[];
  populations: PopulationState[];
  
  // Actions
  updateCapacity: (capacity: BiosphereCapacity01) => void;
  updateSpecies: (species: SpeciesState[]) => void;
  updatePopulations: (populations: PopulationState[]) => void;
}
```

### [`update/zustand/civilizationStore.ts`](update/zustand/civilizationStore.ts)

**Exports:**
- `useCivilizationStore` - Civilization state store hook

**State Interface:**
```typescript
interface CivilizationState {
  needs: NeedState;
  regimes: RegimeState;
  tech: TechTreeState;
  factions: FactionState[];
  
  // Actions
  updateNeeds: (needs: NeedState) => void;
  updateRegimes: (regimes: RegimeState) => void;
  updateTech: (tech: TechTreeState) => void;
}
```

### [`update/zustand/worldStore.ts`](update/zustand/worldStore.ts)

**Exports:**
- `useWorldStore` - World state store hook

**State Interface:**
```typescript
interface WorldState {
  hexes: HexData[];
  settlements: SettlementData[];
  // ... other world state
  
  // Actions
  updateHex: (hexId: string, data: HexData) => void;
  updateSettlement: (settlementId: string, data: SettlementData) => void;
}
```

---

## Specification References

### Core Foundation Specs

| File | Description | Key Types |
|------|-------------|------------|
| [`specs/00-data-types.md`](specs/00-data-types.md) | Data type catalog (476 types) | All canonical types |
| [`specs/01-time-clock-system.md`](specs/01-time-clock-system.md) | Time system v1 | AbsTime, DomainId, SimEvent |
| [`specs/02-metric-registry.md`](specs/02-metric-registry.md) | Metric registry | MetricId, MetricValue |
| [`specs/03-threshold-registry.md`](specs/03-threshold-registry.md) | Threshold registry | ThresholdId, ThresholdValue |
| [`specs/04-mvp-acceptance-gates.md`](specs/04-mvp-acceptance-gates.md) | MVP acceptance gates | GateId, GateStatus |

### World Generation Specs

| File | Description | Key Types |
|------|-------------|------------|
| [`specs/02-magnetosphere.md`](specs/02-magnetosphere.md) | Magnetosphere spec | MagnetosphereState |
| [`specs/03-climate-system.md`](specs/03-climate-system.md) | Climate system spec | ClimateState, ClimateParams |
| [`specs/04-carbon-cycle.md`](specs/04-carbon-cycle.md) | Carbon cycle spec | CarbonState, CarbonParams |
| [`specs/20-hydrology-coupling.md`](specs/20-hydrology-coupling.md) | Hydrology coupling | HydroState, HydroParams |
| [`specs/26-erosion-sediment.md`](specs/26-erosion-sediment.md) | Erosion and sediment | ErosionState |
| [`specs/19-biome-stability.md`](specs/19-biome-stability.md) | Biome stability | BiomeState |

### Life & Ecology Specs

| File | Description | Key Types |
|------|-------------|------------|
| [`specs/05-biosphere-capacity.md`](specs/05-biosphere-capacity.md) | Biosphere capacity | BiosphereCapacity01 |
| [`specs/06-species-archetypes.md`](specs/06-species-archetypes.md) | Species archetypes | SpeciesArchetype |
| [`specs/07-species-modules.md`](specs/07-species-modules.md) | Species modules | SpeciesModule |
| [`specs/10-life-engine.md`](specs/10-life-engine.md) | Life engine | LifeEngineState |
| [`specs/12-trophic-energy.md`](specs/12-trophic-energy.md) | Trophic energy | TrophicState |
| [`specs/13-population-dynamics.md`](specs/13-population-dynamics.md) | Population dynamics | PopulationState |
| [`specs/14-mass-extinction.md`](specs/14-mass-extinction.md) | Mass extinction | ExtinctionEvent |
| [`specs/15-adaptive-radiation.md`](specs/15-adaptive-radiation.md) | Adaptive radiation | RadiationEvent |
| [`specs/16-refugia-colonization.md`](specs/16-refugia-colonization.md) | Refugia colonization | RefugiaState |
| [`specs/17-bestiary.md`](specs/17-bestiary.md) | Bestiary | CreatureSpec |

### Civilization Specs

| File | Description | Key Types |
|------|-------------|------------|
| [`specs/32-need-driven-behavior.md`](specs/32-need-driven-behavior.md) | Need-driven behavior | NeedState, NeedId |
| [`specs/81-government-form-system.md`](specs/81-government-form-system.md) | Government forms | GovernmentForm |
| [`specs/82-government-transition-system.md`](specs/82-government-transition-system.md) | Government transitions | RegimeState, Transition |
| [`specs/128-institutional-differentiation-engine.md`](specs/128-institutional-differentiation-engine.md) | Institutions | InstitutionSpec |

### Runtime Determinism Specs

| File | Description | Key Types |
|------|-------------|------------|
| [`specs/30-cross-scale-tick-synchronization.md`](specs/30-cross-scale-tick-synchronization.md) | Cross-scale sync | SyncPolicy |
| [`specs/32-need-driven-behavior.md`](specs/32-need-driven-behavior.md) | Need-driven behavior | NeedState |
| [`specs/33-universal-tag-system.md`](specs/33-universal-tag-system.md) | Universal tag system | TagId, TagSet |
| [`specs/34-deterministic-models.md`](specs/34-deterministic-models.md) | Deterministic models | ModelSpec |
| [`specs/35-deterministic-rng.md`](specs/35-deterministic-rng.md) | Deterministic RNG | RNGState, Digest64 |
| [`specs/38-unified-tag-system.md`](specs/38-unified-tag-system.md) | Unified tag system | TagRegistryV1 |
| [`specs/39-deterministic-utility-decision.md`](specs/39-deterministic-utility-decision.md) | Utility decision | DecisionEngine |
| [`specs/40-action-resolution-world-delta.md`](specs/40-action-resolution-world-delta.md) | World delta resolution | WorldDelta |
| [`specs/41-tag-interaction-math.md`](specs/41-tag-interaction-math.md) | Tag interaction math | TagInteraction |
| [`specs/56-unified-parameter-registry-schema-contract.md`](specs/56-unified-parameter-registry-schema-contract.md) | Parameter registry | ParameterRegistryV1 |
| [`specs/57-save-load-snapshot-contract.md`](specs/57-save-load-snapshot-contract.md) | Snapshot contract | SnapshotV1 |
| [`specs/58-state-authority-contract.md`](specs/58-state-authority-contract.md) | State authority | AuthorityRegistryV1 |
| [`specs/59-worlddelta-validation-invariant-enforcement.md`](specs/59-worlddelta-validation-invariant-enforcement.md) | Delta validation | InvariantDefV1 |
| [`specs/68-numerical-stability-fixed-point-math-contract.md`](specs/68-numerical-stability-fixed-point-math-contract.md) | Numerical stability | MathPPM, Fixed32Q16 |

---

## TDD File References

### TDD File Structure

Each TDD file follows this structure:

```markdown
# TDD Twin: [Spec Name]

## 1. Core Functionality Tests
- [ ] Test 1
- [ ] Test 2
- [ ] Test 3

## 2. Integration Tests
- [ ] Test 1
- [ ] Test 2
- [ ] Test 3

## 3. Performance Tests
- [ ] Benchmark 1
- [ ] Benchmark 2
- [ ] Benchmark 3

## 4. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum
- [ ] Verify WorldDelta format compatibility
- [ ] Test serialization format compatibility (Little Endian)
- [ ] Verify RefinedHexHeader structure compatibility

## 5. Edge Case Tests
- [ ] Edge case 1
- [ ] Edge case 2
- [ ] Edge case 3
```

### Key TDD Files

| File | Description | Test Count |
|------|-------------|-------------|
| [`tdd/00-data-types.tdd.md`](tdd/00-data-types.tdd.md) | Data types tests | 15 |
| [`tdd/01-time-clock-system.tdd.md`](tdd/01-time-clock-system.tdd.md) | Time system tests | 15 |
| [`tdd/02-magnetosphere.tdd.md`](tdd/02-magnetosphere.tdd.md) | Magnetosphere tests | 15 |
| [`tdd/03-climate-system.tdd.md`](tdd/03-climate-system.tdd.md) | Climate system tests | 15 |
| [`tdd/04-carbon-cycle.tdd.md`](tdd/04-carbon-cycle.tdd.md) | Carbon cycle tests | 15 |
| [`tdd/05-biosphere-capacity.tdd.md`](tdd/05-biosphere-capacity.tdd.md) | Biosphere capacity tests | 15 |
| [`tdd/12-trophic-energy.tdd.md`](tdd/12-trophic-energy.tdd.md) | Trophic energy tests | 15 |
| [`tdd/13-population-dynamics.tdd.md`](tdd/13-population-dynamics.tdd.md) | Population dynamics tests | 15 |
| [`tdd/14-mass-extinction.tdd.md`](tdd/14-mass-extinction.tdd.md) | Mass extinction tests | 15 |
| [`tdd/15-adaptive-radiation.tdd.md`](tdd/15-adaptive-radiation.tdd.md) | Adaptive radiation tests | 15 |
| [`tdd/16-refugia-colonization.tdd.md`](tdd/16-refugia-colonization.tdd.md) | Refugia colonization tests | 15 |
| [`tdd/17-bestiary.tdd.md`](tdd/17-bestiary.tdd.md) | Bestiary tests | 15 |
| [`tdd/19-biome-stability.tdd.md`](tdd/19-biome-stability.tdd.md) | Biome stability tests | 15 |
| [`tdd/26-erosion-sediment.tdd.md`](tdd/26-erosion-sediment.tdd.md) | Erosion tests | 15 |
| [`tdd/31-simulator-dashboard.tdd.md`](tdd/31-simulator-dashboard.tdd.md) | Simulator dashboard tests | 15 |
| [`tdd/32-need-driven-behavior.tdd.md`](tdd/32-need-driven-behavior.tdd.md) | Need behavior tests | 15 |
| [`tdd/35-deterministic-rng.tdd.md`](tdd/35-deterministic-rng.tdd.md) | RNG tests | 15 |
| [`tdd/39-deterministic-utility-decision.tdd.md`](tdd/39-deterministic-utility-decision.tdd.md) | Utility decision tests | 15 |
| [`tdd/49-climate-solver-contract-ebm.tdd.md`](tdd/49-climate-solver-contract-ebm.tdd.md) | Climate solver tests | 15 |
| [`tdd/50-hydrology-solver-contract.tdd.md`](tdd/50-hydrology-solver-contract.tdd.md) | Hydrology solver tests | 15 |
| [`tdd/52-population-dynamics-predator-prey-stability.tdd.md`](tdd/52-population-dynamics-predator-prey-stability.tdd.md) | Predator-prey tests | 15 |
| [`tdd/56-unified-parameter-registry-schema-contract.tdd.md`](tdd/56-unified-parameter-registry-schema-contract.tdd.md) | Parameter registry tests | 15 |
| [`tdd/57-save-load-snapshot-contract.tdd.md`](tdd/57-save-load-snapshot-contract.tdd.md) | Snapshot contract tests | 15 |
| [`tdd/58-state-authority-contract.tdd.md`](tdd/58-state-authority-contract.tdd.md) | State authority tests | 15 |
| [`tdd/59-worlddelta-validation-invariant-enforcement.tdd.md`](tdd/59-worlddelta-validation-invariant-enforcement.tdd.md) | Delta validation tests | 15 |
| [`tdd/68-numerical-stability-fixed-point-math-contract.tdd.md`](tdd/68-numerical-stability-fixed-point-math-contract.tdd.md) | Numerical stability tests | 15 |

---

## File Dependencies

### Core Dependencies

```
core/types.ts
├── zod (for validation)
└── No other dependencies

core/math.ts
├── core/types.ts (MathPPM, Fixed32Q16, Fixed64Q32)
└── No other dependencies

core/rng.ts
├── core/types.ts (Digest64, DigestSalt)
└── No other dependencies

core/time/types.ts
├── core/types.ts (AbsTime)
└── No other dependencies

core/time/Scheduler.ts
├── core/time/types.ts (all time types)
├── core/time/Constants.ts (DOMAIN_CLOCKS)
└── No other dependencies

core/time/Constants.ts
├── core/time/types.ts (DomainId, DomainMode)
└── No other dependencies
```

### Zod Dependencies

```
update/zod/core.ts
├── zod (validation library)
└── No other dependencies

update/zod/planetary.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/climate.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/hydrology.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/civilization.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/biology.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/geomorphology.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/infrastructure.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/fields.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/projection.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/regimes.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/benchmarks.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)

update/zod/carbon.ts
├── zod (validation library)
└── update/zod/core.ts (AbsTime, etc.)
```

### Zustand Dependencies

```
update/zustand/simulationStore.ts
├── zustand (state management)
└── update/zod/core.ts (AbsTime, DomainClockState, SimEvent)

update/zustand/planetaryStore.ts
├── zustand (state management)
└── update/zod/planetary.ts (MagnetosphereState, etc.)

update/zustand/biosphereStore.ts
├── zustand (state management)
└── update/zod/biology.ts (SpeciesState, etc.)

update/zustand/civilizationStore.ts
├── zustand (state management)
└── update/zod/civilization.ts (NeedState, etc.)

update/zustand/worldStore.ts
├── zustand (state management)
└── update/zod/geomorphology.ts (HexData, etc.)
```

---

## Import/Export Patterns

### Core Type Imports

```typescript
// Import core types
import { AbsTime, MathPPM, TagId } from './core/types';

// Import math primitives
import { mulPPM, divPPM, sqrtPPM, powPPM } from './core/math';

// Import RNG
import { DeterministicRNG } from './core/rng';

// Import time types
import { DomainId, DomainMode, SimEvent } from './core/time/types';

// Import scheduler
import { Scheduler } from './core/time/Scheduler';

// Import constants
import { DAY_US, YEAR_US, DOMAIN_CLOCKS } from './core/time/Constants';
```

### Zod Schema Imports

```typescript
// Import core schemas
import { AbsTimeSchema, SimEventSchema } from '../update/zod/core';

// Import planetary schemas
import { MagnetosphereStateSchema } from '../update/zod/planetary';

// Import climate schemas
import { ClimateStateSchema } from '../update/zod/climate';

// Import all schemas
import * as Schemas from '../update/zod/core';
```

### Zustand Store Imports

```typescript
// Import store hooks
import { useSimulationStore } from '../update/zustand/simulationStore';
import { usePlanetaryStore } from '../update/zustand/planetaryStore';
import { useBiosphereStore } from '../update/zustand/biosphereStore';
import { useCivilizationStore } from '../update/zustand/civilizationStore';
import { useWorldStore } from '../update/zustand/worldStore';

// Use in components
function MyComponent() {
  const { absTime, setAbsTime } = useSimulationStore();
  const { magnetosphere } = usePlanetaryStore();
  const { capacity } = useBiosphereStore();
  
  // ... component logic
}
```

### Type Inference

```typescript
// Infer types from Zod schemas
import { AbsTimeSchema } from '../update/zod/core';
type AbsTime = z.infer<typeof AbsTimeSchema>;

// Infer types from Zustand stores
import { useSimulationStore } from '../update/zustand/simulationStore';
type SimulationState = ReturnType<typeof useSimulationStore.getState>;
```

---

## File Naming Conventions

### Core Files
- `types.ts` - Core type definitions
- `math.ts` - Math primitives
- `rng.ts` - Random number generator
- `Scheduler.ts` - Scheduler class (PascalCase for classes)

### Zod Schema Files
- `core.ts` - Core schemas
- `planetary.ts` - Planetary schemas
- `climate.ts` - Climate schemas
- `hydrology.ts` - Hydrology schemas
- `civilization.ts` - Civilization schemas
- `biology.ts` - Biological schemas
- `geomorphology.ts` - Geomorphology schemas
- `infrastructure.ts` - Infrastructure schemas
- `fields.ts` - Field schemas
- `projection.ts` - Projection schemas
- `regimes.ts` - Regime schemas
- `benchmarks.ts` - Benchmark schemas
- `carbon.ts` - Carbon schemas

### Zustand Store Files
- `simulationStore.ts` - Simulation store
- `planetaryStore.ts` - Planetary store
- `biosphereStore.ts` - Biosphere store
- `civilizationStore.ts` - Civilization store
- `worldStore.ts` - World store

### Specification Files
- `00-data-types.md` - Data types
- `01-time-clock-system.md` - Time system
- `02-magnetosphere.md` - Magnetosphere
- `03-climate-system.md` - Climate system
- `04-carbon-cycle.md` - Carbon cycle
- `05-biosphere-capacity.md` - Biosphere capacity
- `06-species-archetypes.md` - Species archetypes
- `07-species-modules.md` - Species modules
- `10-life-engine.md` - Life engine
- `12-trophic-energy.md` - Trophic energy
- `13-population-dynamics.md` - Population dynamics
- `14-mass-extinction.md` - Mass extinction
- `15-adaptive-radiation.md` - Adaptive radiation
- `16-refugia-colonization.md` - Refugia colonization
- `17-bestiary.md` - Bestiary
- `19-biome-stability.md` - Biome stability
- `20-hydrology-coupling.md` - Hydrology coupling
- `26-erosion-sediment.md` - Erosion and sediment
- `32-need-driven-behavior.md` - Need-driven behavior
- `35-deterministic-rng.md` - Deterministic RNG
- `39-deterministic-utility-decision.md` - Utility decision
- `49-climate-solver-contract-ebm.md` - Climate solver contract
- `50-hydrology-solver-contract.md` - Hydrology solver contract
- `52-population-dynamics-predator-prey-stability.md` - Predator-prey stability
- `56-unified-parameter-registry-schema-contract.md` - Parameter registry
- `57-save-load-snapshot-contract.md` - Snapshot contract
- `58-state-authority-contract.md` - State authority
- `59-worlddelta-validation-invariant-enforcement.md` - Delta validation
- `68-numerical-stability-fixed-point-math-contract.md` - Numerical stability

### TDD Files
- `00-data-types.tdd.md` - Data types TDD
- `01-time-clock-system.tdd.md` - Time system TDD
- `02-magnetosphere.tdd.md` - Magnetosphere TDD
- `03-climate-system.tdd.md` - Climate system TDD
- `04-carbon-cycle.tdd.md` - Carbon cycle TDD
- `05-biosphere-capacity.tdd.md` - Biosphere capacity TDD
- `12-trophic-energy.tdd.md` - Trophic energy TDD
- `13-population-dynamics.tdd.md` - Population dynamics TDD
- `14-mass-extinction.tdd.md` - Mass extinction TDD
- `15-adaptive-radiation.tdd.md` - Adaptive radiation TDD
- `16-refugia-colonization.tdd.md` - Refugia colonization TDD
- `17-bestiary.tdd.md` - Bestiary TDD
- `19-biome-stability.tdd.md` - Biome stability TDD
- `26-erosion-sediment.tdd.md` - Erosion TDD
- `31-simulator-dashboard.tdd.md` - Simulator dashboard TDD
- `32-need-driven-behavior.tdd.md` - Need behavior TDD
- `35-deterministic-rng.tdd.md` - RNG TDD
- `39-deterministic-utility-decision.tdd.md` - Utility decision TDD
- `49-climate-solver-contract-ebm.tdd.md` - Climate solver TDD
- `50-hydrology-solver-contract.tdd.md` - Hydrology solver TDD
- `52-population-dynamics-predator-prey-stability.tdd.md` - Predator-prey TDD
- `56-unified-parameter-registry-schema-contract.tdd.md` - Parameter registry TDD
- `57-save-load-snapshot-contract.tdd.md` - Snapshot contract TDD
- `58-state-authority-contract.tdd.md` - State authority TDD
- `59-worlddelta-validation-invariant-enforcement.tdd.md` - Delta validation TDD
- `68-numerical-stability-fixed-point-math-contract.tdd.md` - Numerical stability TDD

---

**End of Code References and Structure**

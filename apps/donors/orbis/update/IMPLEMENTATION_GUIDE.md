# Orbis 1.0 Update - Implementation Guide

**Version:** 1.0  
**Generated:** 2026-02-14  
**Project:** Orbis Spec 2.0 Migration Framework

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Development Environment Setup](#development-environment-setup)
3. [Phase-by-Phase Implementation](#phase-by-phase-implementation)
4. [Testing Strategy](#testing-strategy)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## Quick Start

### Prerequisites

- Node.js 18+ 
- TypeScript 5+
- pnpm or npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Orbis\ 1.0

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### First Steps

1. Read [`STATUS_SUMMARY.md`](STATUS_SUMMARY.md) for project overview
2. Review [`TECHNICAL_DOCUMENTATION.md`](TECHNICAL_DOCUMENTATION.md) for architecture
3. Check [`CHANGELOG.md`](CHANGELOG.md) for breaking changes
4. Follow this guide for implementation

---

## Development Environment Setup

### Project Structure

```
Orbis 1.0/
├── core/                    # Core types and utilities
│   ├── types.ts            # Type definitions
│   ├── math.ts             # Fixed-point math
│   ├── rng.ts              # Deterministic RNG
│   └── time/              # Time system
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

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

### Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "zod": "^3.22.0",
    "three": "^0.158.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "@types/react": "^18.2.0"
  }
}
```

---

## Phase-by-Phase Implementation

### Phase 1: Core Foundation

#### 1.1 Create Core Types

**File:** `core/types.ts`

```typescript
import { z } from 'zod';

// Absolute Time
export const AbsTimeSchema = z.bigint().nonnegative();
export type AbsTime = z.infer<typeof AbsTimeSchema>;

// Tag ID
export const TagIdSchema = z.number().int().nonnegative();
export type TagId = z.infer<typeof TagIdSchema>;

// Math PPM (Parts Per Million)
export const MathPPMSchema = z.number().int().min(0).max(1_000_000);
export type MathPPM = z.infer<typeof MathPPMSchema>;
```

#### 1.2 Create Math Primitives

**File:** `core/math.ts`

```typescript
/**
 * Multiply two PPM values
 * @param a - First PPM value (0..1_000_000)
 * @param b - Second PPM value (0..1_000_000)
 * @returns Product as PPM value (0..1_000_000)
 */
export function mulPPM(a: MathPPM, b: MathPPM): MathPPM {
  const result = (a * b) / 1_000_000;
  return Math.round(result);
}

/**
 * Divide two PPM values
 * @param a - Numerator PPM value
 * @param b - Denominator PPM value (non-zero)
 * @returns Quotient as PPM value
 */
export function divPPM(a: MathPPM, b: MathPPM): MathPPM {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  const result = (a * 1_000_000) / b;
  return Math.round(result);
}

/**
 * Square root of PPM value
 * @param x - PPM value (0..1_000_000)
 * @returns Square root as PPM value
 */
export function sqrtPPM(x: MathPPM): MathPPM {
  if (x < 0) {
    throw new Error('Square root of negative number');
  }
  const result = Math.sqrt(x / 1_000_000) * 1_000_000;
  return Math.round(result);
}

/**
 * Power of PPM value
 * @param base - Base PPM value
 * @param exponent - Exponent (integer)
 * @returns Result as PPM value
 */
export function powPPM(base: MathPPM, exponent: number): MathPPM {
  if (base < 0 && !Number.isInteger(exponent)) {
    throw new Error('Negative base with non-integer exponent');
  }
  const result = Math.pow(base / 1_000_000, exponent) * 1_000_000;
  return Math.round(result);
}
```

#### 1.3 Create Deterministic RNG

**File:** `core/rng.ts`

```typescript
import { Digest64, DigestSalt } from './types';

/**
 * SplitMix64 - A fast, high-quality 64-bit PRNG
 */
export class DeterministicRNG {
  private state: bigint;

  constructor(seed: bigint) {
    this.state = seed;
  }

  /**
   * Generate next random 64-bit value
   * @returns Random 64-bit value
   */
  next(): bigint {
    this.state = this.state + 0x9e3779b97f4a7c15n;
    let z = this.state;
    z = (z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n;
    z = (z ^ (z >> 27n)) * 0x94d049bb133111ebn;
    z = z ^ (z >> 31n);
    return z;
  }

  /**
   * Generate random value in range [0, max)
   * @param max - Upper bound (exclusive)
   * @returns Random value in range
   */
  nextInt(max: number): number {
    const value = Number(this.next() % BigInt(max));
    return Math.abs(value);
  }

  /**
   * Generate deterministic digest
   * @param salt - Digest salt
   * @returns Deterministic digest
   */
  digest(salt: DigestSalt): Digest64 {
    const salted = this.state ^ BigInt(salt);
    return this.computeHash(salted);
  }

  private computeHash(value: bigint): Digest64 {
    // Simple hash function for demonstration
    let hash = value;
    hash = (hash ^ (hash >> 30n)) * 0xbf58476d1ce4e5b9n;
    hash = (hash ^ (hash >> 27n)) * 0x94d049bb133111ebn;
    hash = hash ^ (hash >> 31n);
    return hash;
  }
}
```

#### 1.4 Write Tests

**File:** `tests/core/math.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { mulPPM, divPPM, sqrtPPM, powPPM } from '../../core/math';

describe('Math Primitives', () => {
  describe('mulPPM', () => {
    it('should multiply two PPM values correctly', () => {
      expect(mulPPM(500_000, 500_000)).toBe(250_000); // 0.5 * 0.5 = 0.25
    });

    it('should handle edge cases', () => {
      expect(mulPPM(0, 1_000_000)).toBe(0);
      expect(mulPPM(1_000_000, 1_000_000)).toBe(1_000_000);
    });
  });

  describe('sqrtPPM', () => {
    it('should compute square root correctly', () => {
      expect(sqrtPPM(250_000)).toBe(500_000); // sqrt(0.25) = 0.5
    });

    it('should throw on negative input', () => {
      expect(() => sqrtPPM(-1)).toThrow();
    });
  });
});
```

---

### Phase 2: Simulation Clock & Scheduler

#### 2.1 Create Time Types

**File:** `core/time/types.ts`

```typescript
import { AbsTime } from '../types';

export enum DomainId {
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

export enum DomainMode {
  Frozen = 'Frozen',
  Step = 'Step',
  HighRes = 'HighRes',
  Regenerate = 'Regenerate'
}

export interface DomainClockSpec {
  domain: DomainId;
  quantumUs: AbsTime;
  stepUs: AbsTime;
  mode: DomainMode;
  maxCatchupSteps: number;
}

export interface DomainClockState {
  lastStepTimeUs: AbsTime;
}

export enum EventId {
  ClimateChanged,
  SeaLevelChanged,
  TectonicsEpochChanged,
  CarbonChanged,
  MagnetosphereChanged,
  BiomeInvalidated,
  HydrologyInvalidated
}

export interface SimEvent {
  atTimeUs: AbsTime;
  id: EventId;
  payloadHash: number;
}

export interface PluginSpec {
  id: string;
  runsOn: DomainId[];
  reads: string[];
  writes: string[];
  deterministic: true;
}
```

#### 2.2 Create Constants

**File:** `core/time/Constants.ts`

```typescript
import { AbsTime, DomainClockSpec, DomainId, DomainMode } from './types';

// Time constants
export const SECOND_US: AbsTime = 1_000_000n;
export const MINUTE_US: AbsTime = 60n * SECOND_US;
export const HOUR_US: AbsTime = 60n * MINUTE_US;
export const DAY_US: AbsTime = 24n * HOUR_US;
export const YEAR_US: AbsTime = 365n * DAY_US + 6n * HOUR_US; // 365.25 days

// Domain clock specifications
export const DOMAIN_CLOCKS: Record<DomainId, DomainClockSpec> = {
  [DomainId.CORE_TIME]: {
    domain: DomainId.CORE_TIME,
    quantumUs: 1n,
    stepUs: 1n,
    mode: DomainMode.Step,
    maxCatchupSteps: 1_000_000
  },
  [DomainId.PLANET_PHYSICS]: {
    domain: DomainId.PLANET_PHYSICS,
    quantumUs: MINUTE_US,
    stepUs: HOUR_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 24
  },
  [DomainId.CLIMATE]: {
    domain: DomainId.CLIMATE,
    quantumUs: HOUR_US,
    stepUs: DAY_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 30
  },
  [DomainId.HYDROLOGY]: {
    domain: DomainId.HYDROLOGY,
    quantumUs: HOUR_US,
    stepUs: DAY_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 30
  },
  [DomainId.BIOSPHERE_CAPACITY]: {
    domain: DomainId.BIOSPHERE_CAPACITY,
    quantumUs: DAY_US,
    stepUs: 7n * DAY_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 52
  },
  [DomainId.TROPHIC_ENERGY]: {
    domain: DomainId.TROPHIC_ENERGY,
    quantumUs: DAY_US,
    stepUs: 7n * DAY_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 52
  },
  [DomainId.POP_DYNAMICS]: {
    domain: DomainId.POP_DYNAMICS,
    quantumUs: DAY_US,
    stepUs: 30n * DAY_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 12
  },
  [DomainId.EXTINCTION]: {
    domain: DomainId.EXTINCTION,
    quantumUs: DAY_US,
    stepUs: 90n * DAY_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 4
  },
  [DomainId.REFUGIA_COLONIZATION]: {
    domain: DomainId.REFUGIA_COLONIZATION,
    quantumUs: DAY_US,
    stepUs: YEAR_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 10
  },
  [DomainId.EVOLUTION_BRANCHING]: {
    domain: DomainId.EVOLUTION_BRANCHING,
    quantumUs: YEAR_US,
    stepUs: 10n * YEAR_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 10
  },
  [DomainId.CIVILIZATION_NEEDS]: {
    domain: DomainId.CIVILIZATION_NEEDS,
    quantumUs: DAY_US,
    stepUs: 7n * DAY_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 52
  },
  [DomainId.CIVILIZATION_BEHAVIOR]: {
    domain: DomainId.CIVILIZATION_BEHAVIOR,
    quantumUs: DAY_US,
    stepUs: 30n * DAY_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 12
  },
  [DomainId.WARFARE]: {
    domain: DomainId.WARFARE,
    quantumUs: DAY_US,
    stepUs: 7n * DAY_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 52
  },
  [DomainId.NARRATIVE_LOG]: {
    domain: DomainId.NARRATIVE_LOG,
    quantumUs: DAY_US,
    stepUs: DAY_US,
    mode: DomainMode.Step,
    maxCatchupSteps: 365
  }
};
```

#### 2.3 Create Scheduler

**File:** `core/time/Scheduler.ts`

```typescript
import { AbsTime, DomainId, DomainClockState, SimEvent, PluginSpec } from './types';
import { DOMAIN_CLOCKS } from './Constants';

export class Scheduler {
  private absTime: AbsTime = 0n;
  private clocks: Map<DomainId, DomainClockState> = new Map();
  private eventQueue: SimEvent[] = [];
  private plugins: Map<DomainId, PluginSpec[]> = new Map();

  constructor() {
    this.initializeClocks();
  }

  private initializeClocks(): void {
    Object.values(DOMAIN_CLOCKS).forEach(spec => {
      this.clocks.set(spec.domain, {
        lastStepTimeUs: 0n
      });
    });
  }

  /**
   * Advance simulation to target time
   * @param targetTimeUs - Target absolute time
   */
  advanceTo(targetTimeUs: AbsTime): void {
    if (targetTimeUs < this.absTime) {
      throw new Error('Cannot advance backwards in time');
    }

    // Update absolute time
    this.absTime = targetTimeUs;

    // Process domains in temporal order
    this.processDomains();

    // Process events
    this.processEvents();
  }

  private processDomains(): void {
    const domains = Array.from(DOMAIN_CLOCKS.values())
      .sort((a, b) => Number(a.domain - b.domain));

    for (const spec of domains) {
      const clock = this.clocks.get(spec.domain)!;
      this.advanceDomain(spec, clock);
    }
  }

  private advanceDomain(
    spec: PluginSpec,
    clock: DomainClockState
  ): void {
    if (spec.mode === 'Frozen') {
      return; // Don't advance frozen domains
    }

    const targetTime = this.absTime;
    const steps = this.calculateCatchupSteps(spec, clock, targetTime);

    for (let i = 0; i < steps; i++) {
      const stepTime = clock.lastStepTimeUs + spec.stepUs;
      if (stepTime > targetTime) break;

      // Run plugins for this domain
      this.runPlugins(spec.domain, stepTime);

      clock.lastStepTimeUs = stepTime;
    }
  }

  private calculateCatchupSteps(
    spec: PluginSpec,
    clock: DomainClockState,
    targetTime: AbsTime
  ): number {
    const timeDiff = targetTime - clock.lastStepTimeUs;
    const steps = Number(timeDiff / spec.stepUs);
    return Math.min(steps, spec.maxCatchupSteps);
  }

  private runPlugins(domainId: DomainId, atTime: AbsTime): void {
    const plugins = this.plugins.get(domainId) || [];
    for (const plugin of plugins) {
      // Execute plugin (implementation depends on plugin system)
      // plugin.execute(atTime);
    }
  }

  /**
   * Register a plugin for specific domains
   * @param plugin - Plugin specification
   */
  registerPlugin(plugin: PluginSpec): void {
    for (const domainId of plugin.runsOn) {
      if (!this.plugins.has(domainId)) {
        this.plugins.set(domainId, []);
      }
      this.plugins.get(domainId)!.push(plugin);
    }
  }

  /**
   * Emit an event
   * @param event - Event to emit
   */
  emitEvent(event: SimEvent): void {
    this.eventQueue.push(event);
  }

  private processEvents(): void {
    // Sort events by time
    this.eventQueue.sort((a, b) => 
      Number(a.atTimeUs - b.atTimeUs)
    );

    // Process events
    for (const event of this.eventQueue) {
      this.handleEvent(event);
    }

    // Clear processed events
    this.eventQueue = [];
  }

  private handleEvent(event: SimEvent): void {
    // Handle invalidations based on event type
    // Implementation depends on invalidation rules
  }

  /**
   * Get current absolute time
   * @returns Current absolute time
   */
  getCurrentTime(): AbsTime {
    return this.absTime;
  }

  /**
   * Get domain clock state
   * @param domainId - Domain identifier
   * @returns Domain clock state
   */
  getDomainClock(domainId: DomainId): DomainClockState | undefined {
    return this.clocks.get(domainId);
  }
}
```

---

### Phase 3: Planetary Solvers

#### 3.1 Magnetosphere Solver

**File:** `sim/physics/Magnetosphere.ts`

```typescript
import { AbsTime } from '../../core/types';

export interface MagnetosphereParams {
  coreHeat01: number;         // 0..1
  rotation01: number;         // 0..1
  tectonicHeatFlux01: number; // 0..1
}

export interface MagnetosphereState {
  health01: number;           // 0..1
  polarity: 1 | -1;
  phase01: number;            // 0..1
  lastFlipTimeMs: AbsTime;
}

export class MagnetosphereSolver {
  /**
   * Step magnetosphere simulation
   * @param params - Magnetosphere parameters
   * @param state - Current state
   * @param dtUs - Time delta in microseconds
   * @returns New state
   */
  step(
    params: MagnetosphereParams,
    state: MagnetosphereState,
    dtUs: AbsTime
  ): MagnetosphereState {
    const dtMs = Number(dtUs / 1000n); // Convert to milliseconds

    // Calculate flip probability based on drivers
    const flipProbability = this.calculateFlipProbability(params);

    // Update phase
    const phaseSpeed = 0.001 * (1 + params.rotation01);
    const newPhase = (state.phase01 + phaseSpeed * dtMs) % 1;

    // Check for flip
    const shouldFlip = Math.random() < flipProbability * dtMs / 1000;

    if (shouldFlip) {
      return {
        health01: this.calculateHealth(params),
        polarity: -state.polarity,
        phase01: newPhase,
        lastFlipTimeMs: state.lastFlipTimeMs + dtUs
      };
    }

    return {
      ...state,
      health01: this.calculateHealth(params),
      phase01: newPhase
    };
  }

  private calculateFlipProbability(params: MagnetosphereParams): number {
    // Higher core heat and rotation increase flip probability
    const baseProbability = 0.000001; // Base probability per millisecond
    const heatMultiplier = 1 + params.coreHeat01 * 10;
    const rotationMultiplier = 1 + params.rotation01 * 5;
    return baseProbability * heatMultiplier * rotationMultiplier;
  }

  private calculateHealth(params: MagnetosphereParams): number {
    // Health depends on core heat and rotation
    const idealHeat = 0.5;
    const idealRotation = 0.5;
    
    const heatScore = 1 - Math.abs(params.coreHeat01 - idealHeat) * 2;
    const rotationScore = 1 - Math.abs(params.rotation01 - idealRotation) * 2;
    
    return Math.max(0, Math.min(1, (heatScore + rotationScore) / 2));
  }
}
```

#### 3.2 Climate Solver (EBM)

**File:** `sim/climate/EnergyBalanceModel.ts`

```typescript
import { AbsTime } from '../../core/types';

export interface ClimateParams {
  solarConstant: number;       // W/m²
  albedoParams: AlbedoParams;
  bandCount: number;
}

export interface AlbedoParams {
  iceAlbedo: number;
  oceanAlbedo: number;
  landAlbedo: number;
  vegetationAlbedo: number;
}

export interface ClimateState {
  bands: ClimateBand[];
  globalTemperature: number;
}

export interface ClimateBand {
  latitude: number;          // degrees
  temperature: number;       // Kelvin
  albedo: number;
}

export class EnergyBalanceModel {
  private readonly STEFAN_BOLTZMANN = 5.67e-8; // W/m²/K⁴

  step(
    params: ClimateParams,
    state: ClimateState,
    dtUs: AbsTime
  ): ClimateState {
    const dtYears = Number(dtUs) / Number(31_557_600_000_000n); // Convert to years

    const newBands = state.bands.map((band, index) => {
      return this.stepBand(params, band, dtYears, index, state.bands);
    });

    const globalTemp = this.calculateGlobalTemperature(newBands);

    return {
      bands: newBands,
      globalTemperature: globalTemp
    };
  }

  private stepBand(
    params: ClimateParams,
    band: ClimateBand,
    dtYears: number,
    index: number,
    allBands: ClimateBand[]
  ): ClimateBand {
    // Calculate incoming solar radiation
    const incomingSolar = this.calculateIncomingSolar(params.solarConstant, band.latitude);

    // Calculate outgoing longwave radiation
    const outgoingLW = this.calculateOutgoingLW(band.temperature);

    // Calculate heat transport (diffusion)
    const transport = this.calculateHeatTransport(band, allBands, index);

    // Calculate albedo
    const albedo = this.calculateAlbedo(params, band.temperature);

    // Calculate temperature change
    const energyBalance = incomingSolar * (1 - albedo) - outgoingLW + transport;
    const temperatureChange = energyBalance * dtYears / 1000; // Simplified heat capacity

    return {
      ...band,
      temperature: band.temperature + temperatureChange,
      albedo: albedo
    };
  }

  private calculateIncomingSolar(solarConstant: number, latitude: number): number {
    // Simplified solar insolation calculation
    const latRad = (latitude * Math.PI) / 180;
    return solarConstant * Math.cos(latRad);
  }

  private calculateOutgoingLW(temperature: number): number {
    return this.STEFAN_BOLTZMANN * Math.pow(temperature, 4);
  }

  private calculateHeatTransport(
    band: ClimateBand,
    allBands: ClimateBand[],
    index: number
  ): number {
    // Simple diffusion model
    const diffusionRate = 0.1;
    let transport = 0;

    if (index > 0) {
      transport += diffusionRate * (allBands[index - 1].temperature - band.temperature);
    }
    if (index < allBands.length - 1) {
      transport += diffusionRate * (allBands[index + 1].temperature - band.temperature);
    }

    return transport;
  }

  private calculateAlbedo(params: AlbedoParams, temperature: number): number {
    // Albedo depends on temperature (ice vs water vs land)
    if (temperature < 273.15) {
      return params.iceAlbedo;
    } else if (temperature < 283.15) {
      return params.oceanAlbedo;
    } else {
      return params.landAlbedo;
    }
  }

  private calculateGlobalTemperature(bands: ClimateBand[]): number {
    const sum = bands.reduce((acc, band) => acc + band.temperature, 0);
    return sum / bands.length;
  }
}
```

---

### Phase 4: Terrain & Hydrology

#### 4.1 Hydrology Solver (ABCD Model)

**File:** `sim/hydrology/ABCDHydrology.ts`

```typescript
import { AbsTime } from '../../core/types';

export interface HydroParams {
  a: number;  // Fast storage coefficient
  b: number;  // Slow storage coefficient
  c: number;  // Percolation coefficient
  d: number;  // Baseflow coefficient
}

export interface HydroState {
  fastStorage: number;  // mm
  slowStorage: number;  // mm
  runoff: number;        // mm/day
  baseflow: number;      // mm/day
}

export class ABCDHydrology {
  step(
    params: HydroParams,
    state: HydroState,
    precipitation: number,
    dtUs: AbsTime
  ): HydroState {
    const dtDays = Number(dtUs) / Number(86_400_000_000n); // Convert to days

    // Calculate effective precipitation
    const effectiveP = precipitation * dtDays;

    // Calculate fast storage changes
    const fastStorageChange = effectiveP - params.a * state.fastStorage;
    const newFastStorage = Math.max(0, state.fastStorage + fastStorageChange);

    // Calculate percolation to slow storage
    const percolation = params.c * state.fastStorage * dtDays;
    const newSlowStorage = Math.max(0, state.slowStorage + percolation);

    // Calculate runoff
    const runoff = params.a * state.fastStorage;

    // Calculate baseflow
    const baseflow = params.d * state.slowStorage;

    return {
      fastStorage: newFastStorage,
      slowStorage: newSlowStorage,
      runoff: runoff,
      baseflow: baseflow
    };
  }
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// tests/core/math.test.ts
import { describe, it, expect } from 'vitest';
import { mulPPM, divPPM, sqrtPPM } from '../../core/math';

describe('Math Primitives', () => {
  it('should multiply PPM values correctly', () => {
    expect(mulPPM(500_000, 500_000)).toBe(250_000);
  });

  it('should divide PPM values correctly', () => {
    expect(divPPM(500_000, 2)).toBe(250_000);
  });

  it('should compute square root correctly', () => {
    expect(sqrtPPM(250_000)).toBe(500_000);
  });
});
```

### Integration Tests

```typescript
// tests/simulation/scheduler.test.ts
import { describe, it, expect } from 'vitest';
import { Scheduler } from '../../core/time/Scheduler';

describe('Scheduler Integration', () => {
  it('should advance all domains correctly', () => {
    const scheduler = new Scheduler();
    const targetTime = 24n * 60n * 60n * 1_000_000n; // 1 day

    scheduler.advanceTo(targetTime);

    expect(scheduler.getCurrentTime()).toBe(targetTime);
  });

  it('should process events in order', () => {
    const scheduler = new Scheduler();
    // Test event ordering
  });
});
```

### Performance Tests

```typescript
// tests/performance/math.bench.ts
import { describe, bench } from 'vitest';
import { mulPPM, sqrtPPM } from '../../core/math';

describe('Math Performance', () => {
  bench('mulPPM', () => {
    mulPPM(500_000, 500_000);
  });

  bench('sqrtPPM', () => {
    sqrtPPM(250_000);
  });
});
```

---

## Common Patterns

### Pattern 1: Fixed-Point Calculations

```typescript
// Instead of floating-point
const probability = 0.5;
const result = value * probability;

// Use fixed-point PPM
const probabilityPPM = 500_000; // 0.5 in PPM
const result = mulPPM(value, probabilityPPM);
```

### Pattern 2: Deterministic Random

```typescript
// Instead of Math.random()
const randomValue = Math.random();

// Use deterministic RNG
const rng = new DeterministicRNG(seed);
const randomValue = rng.nextInt(1_000_001);
```

### Pattern 3: State Validation

```typescript
// Always validate state with Zod
import { ClimateStateSchema } from '../zod/climate';

function processClimate(state: unknown) {
  const validated = ClimateStateSchema.parse(state);
  // Process validated state
}
```

### Pattern 4: Time Conversion

```typescript
// Convert time units consistently
const SECONDS_US = 1_000_000n;
const MINUTES_US = 60n * SECONDS_US;
const HOURS_US = 60n * MINUTES_US;
const DAYS_US = 24n * HOURS_US;

const timeInUs = 5n * MINUTES_US; // 5 minutes
```

---

## Troubleshooting

### Issue: Time Synchronization Problems

**Symptoms:** Domains not advancing in sync

**Solutions:**
1. Check domain clock specifications in [`core/time/Constants.ts`](core/time/Constants.ts)
2. Verify scheduler catch-up logic
3. Ensure events are processed in chronological order

### Issue: Numerical Instability

**Symptoms:** Floating-point accumulation errors

**Solutions:**
1. Use fixed-point math (PPM) for all calculations
2. Avoid repeated division operations
3. Use `sqrtPPM` instead of `Math.sqrt`

### Issue: State Validation Errors

**Symptoms:** Zod validation failures

**Solutions:**
1. Check schema definitions in [`update/zod/`](update/zod/)
2. Verify data types match schema expectations
3. Add debug logging to identify invalid fields

### Issue: Performance Degradation

**Symptoms:** Slow simulation performance

**Solutions:**
1. Profile with browser dev tools
2. Optimize hot paths
3. Use typed arrays for large datasets
4. Implement object pooling

---

## Best Practices

### 1. Always Use Deterministic RNG

```typescript
// Good
const rng = new DeterministicRNG(seed);
const value = rng.nextInt(max);

// Bad
const value = Math.random() * max;
```

### 2. Validate All External Inputs

```typescript
// Good
function processInput(input: unknown) {
  const validated = Schema.parse(input);
  // Process validated input
}

// Bad
function processInput(input: any) {
  // Process input without validation
}
```

### 3. Use Fixed-Point Math for Probabilities

```typescript
// Good
const probabilityPPM = 500_000; // 0.5
const result = mulPPM(value, probabilityPPM);

// Bad
const probability = 0.5;
const result = value * probability;
```

### 4. Write Tests Before Implementation

```typescript
// Write test first
describe('Feature', () => {
  it('should work correctly', () => {
    // Test implementation
  });
});

// Then implement feature
function feature() {
  // Implementation
}
```

### 5. Document All Public APIs

```typescript
/**
 * Calculate biosphere capacity
 * @param temperature - Temperature in Kelvin
 * @param moisture - Moisture level (0..1)
 * @returns Biosphere capacity (0..1)
 */
function calculateBiosphereCapacity(
  temperature: number,
  moisture: number
): number {
  // Implementation
}
```

---

**End of Implementation Guide**

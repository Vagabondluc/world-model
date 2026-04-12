
# Orbis 1.0 to 2.0 Gradual Update Plan

This document outlines the step-by-step transition from the voxel-centric Orbis 1.0 to the deep-time planetary simulation framework of Orbis 2.0.

## Progress Tracking
- [in_progress] Phase 1: Core Foundation (The Fixed-Point Root)
- [pending] Phase 2: Simulation Clock & Scheduler
- [pending] Phase 3: Planetary Solvers (Physics Layer)
- [pending] Phase 4: Terrain & Hydrology (Realization Layer)
- [pending] Phase 5: Tag & Semantic System
- [pending] Phase 6: History & Civilization (Social Layer)
- [pending] Phase 7: UI & Visualization

---

## Phase 1: Core Foundation (The Fixed-Point Root)
**Goal:** Establish deterministic math and RNG primitives before migrating any logic.
**Spec References:** `docs/68-numerical-stability-fixed-point-math-contract.md`, `docs/35-deterministic-rng.md`

- [ ] **1.1 Primitive Types**
  - Create `core/types.ts`.
  - Define `AbsTime` (uint64), `MathPPM` (int32), `DomainId` (enum).
  - Define `Fixed32Q16` and `Fixed64Q32` aliases.

- [ ] **1.2 Fixed-Point Math Engine**
  - Create `core/math.ts`.
  - Implement `mulPPM(a, b)`: `(a * b) / 1_000_000` with rounding.
  - Implement `divPPM(a, b)`: `(a * 1_000_000) / b` with rounding.
  - Implement `clampPPM`, `lerpPPM`, `sqrtPPM`.
  - Add `compliance-test.ts` matching `update/tdd/numerical-stability.tdd.md`.

- [ ] **1.3 Deterministic RNG**
  - Create `core/rng.ts`.
  - Implement `SplitMix64` or `Mulberry32` as the backing hasher.
  - Implement `hash64(seed, domain, tick, entityId)` stateless wrapper.
  - Verify bit-identity across two test runs.

---

## Phase 2: Simulation Clock & Scheduler
**Goal:** Replace the monolithic `useTimeStore` with a multi-domain scheduler.
**Spec References:** `docs/01-time-clock-system.md`

- [ ] **2.1 Clock Data Structures**
  - Create `core/time/types.ts`.
  - Define `DomainClockSpec` and `DomainClockState`.
  - Define `SimEvent` envelope.

- [ ] **2.2 The Scheduler Loop**
  - Create `core/time/Scheduler.ts`.
  - Implement `tick(dt)`:
    - Increment `AbsTime`.
    - Loop through registered domains.
    - Calculate `dueSteps`.
    - Trigger `step()` or `regenerateTo()` based on catch-up policy.

- [ ] **2.3 Registry & Defaults**
  - Register `DomainId.CLIMATE`, `DomainId.TECTONICS`, `DomainId.CIVILIZATION`.
  - Set default quantums (e.g., Climate = 30 days, Tectonics = 10k years).

---

## Phase 3: Planetary Solvers (Physics Layer)
**Goal:** Port physics logic to use the new `core/math` and `core/time`.

- [ ] **3.1 Magnetosphere (v2)**
  - Port `components/globe/AuroraRing.tsx` logic to `sim/physics/Magnetosphere.ts`.
  - Use `MathPPM` for `health01` decay.
  - Implement `PolarityReversal` without `Math.random()`.

- [ ] **3.2 Climate (EBM)**
  - Implement `sim/climate/EnergyBalanceModel.ts`.
  - Create `1D_LatBands` structure.
  - Wire `Insolation` to `OrbitalConfig` using fixed-point trig.

- [ ] **3.3 Carbon Cycle**
  - Implement `sim/climate/CarbonCycle.ts`.
  - Connect `Volcanism` (Source) and `Weathering` (Sink).

---

## Phase 4: Terrain & Hydrology (Realization Layer)
**Goal:** Update the map generation to use the new simulation outputs.

- [ ] **4.1 Hydrology Refactor**
  - Update `services/terrain/hydrology.ts` to consume `PrecipitationBand` from Climate.
  - Implement `ABCD` 2-bucket model for soil moisture.

- [ ] **4.2 Erosion Kernel**
  - Rewrite `performGeologicStep` to use `Fixed64Q32` intermediates for Stream Power Law.

---

## Phase 5: Tag & Semantic System
**Goal:** Implement the "Spatial Filesystem" for region-based overrides.

- [ ] Define `TagId` registry.
- [ ] Implement `SpatialQuery` for hex lookups.
- [ ] Implement `SemanticResolver` for merging region layers.

---

## Phase 6: History & Civilization
**Goal:** Implement the deterministic decision engine.

- [ ] Implement `Need` hierarchy (Energy, Safety, Expansion).
- [ ] Implement `Action` scoring using utility curves.

---

**Status Tracking**:
- Foundation: [ ] 0%
- Physics: [ ] 0%
- World: [ ] 0%
- Life: [ ] 0%
- History: [ ] 0%
- Governance: [ ] 0%
- UI/UX: [ ] 0%

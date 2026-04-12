# Orbis 1.0 to 2.0 Implementation Checklist

## Phase 1: Core Foundation (The Fixed-Point Root)
- [ ] **Standardize Types**: Define `AbsTime`, `TagId`, and `MathPPM` in a new `core/types.ts`.
- [ ] **Numerical Primitives**: Implement `mulPPM`, `divPPM`, `sqrtPPM`, and `powPPM` in `core/math.ts`.
- [ ] **Deterministic RNG**: Port `hash64` (SplitMix64) to `core/rng.ts`.
- [x] **Unit Tests**: Pass all tests in `update/tdd/numerical-stability.tdd.md`. (Specifications Ready)

## Phase 2: Simulation Clock & Scheduler
- [ ] **Clock Store**: Replace `useTimeStore.ts` with a 2.0-compliant scheduler.
- [ ] **Domain Registry**: Define `DomainId` and `DomainClockSpec` for all 2.0 domains.
- [ ] **Event Bus**: Implement `SimEvent` queue and invalidation logic.
- [x] **Unit Tests**: Pass all tests in `update/tdd/time-clock-system.tdd.md`. (Specifications Ready)

## Phase 3: Planetary Solvers (Physics Layer)
- [ ] **Magnetosphere**: Implement `Oscillator`-based flip logic.
- [ ] **Climate (EBM)**: Implement 1D Latitude Band solver with zonal diffusion.
- [ ] **Carbon Cycle**: Add `Weathering` and `Outgassing` source/sink terms.
- [ ] **Biosphere Capacity**: Implement the multiplicative fitness model.

## Phase 4: Terrain & Hydrology (Realization Layer)
- [ ] **ABCD Model**: Replace `applyHydrology` kernel with 2-bucket ABCD model.
- [ ] **River Graph**: Refactor `HexData` to store `MouthId` and `BasinId`.
- [ ] **Erosion**: Re-implement `performGeologicStep` using fixed-point `sqrtPPM` and `LithologyClass` thresholds.
- [ ] **Biome Logic**: Replace `determineBiome` if/else with Whittaker Schmitt-Trigger logic.
- [x] **Unit Tests**: Pass all tests in `update/tdd/hydrology-erosion.tdd.md`. (Specifications Ready)

## Phase 5: Tag & Semantic System
- [ ] **Tag Registry**: Initialize `TagRegistryV1` with core simulate/gameplay namespaces.
- [ ] **Semantic Resolver**: Update `resolvePointSemantic` to return `TagSet` (uint32[]).
- [ ] **Spatial Query**: Implement `SpatialQueryAPI` for fast tag-based hex lookups.
- [x] **Unit Tests**: Pass all tests in `update/tdd/semantic-tags.tdd.md`. (Specifications Ready)

## Phase 6: History & Civilization (Social Layer)
- [ ] **Need Engine**: Implement the `dominantNeedId` utility scoring.
- [ ] **Tech Matrix**: Load `tech_lXX_YYY` impact coefficients.
- [ ] **Regime Machine**: Implement the state machine for government transitions.

## Phase 7: UI & Visualization
- [ ] **Situation Room**: Build the summary dashboard for interpreted signals.
- [ ] **Causal Trace**: Implement the `OutcomeDriverTrace` for player explainability.

# 158 Multi-Scale Temporal Simulation (Hierarchical Ticking)

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/135-typescript-simulation-architecture.md`, `docs/brainstorm/143-ecological-causality-kernels.md`]
- `Owns`: [`temporal hierarchy`, `statistical fast-forward model`, `state-jump triggers`]
- `Writes`: [`multi-scale tick events`, `aggregated state updates`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/158-multi-scale-temporal-simulation.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define an architecture for simulating systems at vastly different timescales (e.g., Geology vs. Tactical AI) and providing a "cheap" statistical fast-forward for thousands of years.

## 1. Temporal Tiers
The simulation loop is partitioned into tiers with decreasing update frequencies.

| Tier | Name | Cadence (Ticks) | Scope | Mechanism |
|---|---|---|---|---|
| **T0** | Tactical | 1 | Unit Move, Combat | Discrete ECS |
| **T1** | Civilizational | 10 - 100 | Economy, Unrest, Tech | Propagation Engine (80) |
| **T2** | Ecological | 1,000 | Life Cycles, Biome Drift | Statistical/Logistic (143) |
| **T3** | Geological | 10,000+ | Tectonics, Atmosphere | State-Jump / Generation |

## 2. Statistical Fast-Forward (Time Passed = Change)
To simulate long durations (e.g., world generation or "Deep History" skips), the system uses a **Poisson-Poisson Markov (PPM)** process.

### 2.1 Starting Point + Probability of Change
`State_Final = State_Start + Σ (Event_Prob(i) * Avg_Impact(i) * Number_of_Events)`
- **Event Count**: `Number_of_Events = PoissonSample(λ * Delta_Time)`.
- **λ (Lambda)**: The average rate of a specific change (e.g., `volcanic_eruption_rate`).
- **Cumulative Drift**: For continuous values (`MeanTempK`), use a **Markov Chain** transition matrix to determine the most probable future state.

## 3. Portion-of-Tick Execution (Interleaved)
To avoid CPU spikes, heavy Tier 3 updates are "Smeared" across Tier 0 ticks.
- **Example**: A Geological update that takes 100ms is broken into 1ms chunks executed over 100 tactical ticks.
- **State Locking**: Atomics are used to ensure T0 systems read a stable "Last Complete" version of T3 data.

## 4. Lifecycle Simulation (Cheap Mode)
Biological life cycles (Birth/Death/Evolution) use the **Logistic Fast-Forward**:
- Instead of simulating 1,000 births, the system applies the integral of the Logistic Growth curve over the skipped time interval `Δt`.
- **Inheritance**: Mean traits are drifted by `Δt * Mutation_Rate` (Spec 146).

## 5. Performance Benchmarks
- **Skip 1,000 Years**: Target < 500ms execution time.
- **Background Geology**: Target < 0.1ms per T0 tick overhead.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

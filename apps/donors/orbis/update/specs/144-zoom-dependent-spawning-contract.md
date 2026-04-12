# 144 Zoom Dependent Spawning Contract

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/106-scale-genre-matrix.md`, `docs/brainstorm/108-multi-resolution-data-architecture.md`, `docs/brainstorm/143-ecological-causality-kernels.md`]
- `Owns`: [`spawning thresholds`, `entity instantiation lifecycle`]
- `Writes`: [`spawn events`, `despawn signals`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/144-zoom-dependent-spawning-contract.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define the triggers and state-handoff rules for transitioning between statistical macro-simulation and discrete agent-based micro-simulation based on map scale.

## 1. Threshold Definitions
The simulation state exists in two modes: **Dormant (Macro)** and **Active (Micro)**.

| Scale | Resolution | Mode | Ecosystem Simulation | Actor Spawning |
|---|---|---|---|---|
| > 60 mi/hex | Global | Macro | Statistical GPP (Spec 143) | Aggregated Factions Only |
| 60 - 24 mi/hex | Regional | Macro | Logistic Population (Spec 143) | Faction Hubs Only |
| **< 24 mi/hex** | Local | **Micro** | **Full Agent Loop** | **Discrete Individual Actors** |

## 2. Instantiation Lifecycle (The "Bloom")
When zooming below the **24 mi/hex** threshold:

1. **Trigger**: Viewport enters hex boundary at threshold zoom.
2. **Probability Sampling**: Use local macro-state (`N` from Logistic Eq) to determine discrete agent counts.
3. **Seeded Placement**: Use a deterministic noise function (seeded by `worldSeed + hexId`) to place actors.
4. **Combat Handoff**: If the hex is contested (Hostile units present), initialize the `147-tactical-combat-resolution` engine for this hex immediately.
5. **Handoff**: Macro-simulation for that hex is paused; the discrete loop takes over.

## 3. Hibernation Lifecycle (The "Compress")
When zooming out above the **24 mi/hex** threshold:

1. **Aggregation**: Discrete agent states are averaged (health, wealth, number).
2. **Update Macro**: The averaged values update the Logistic `N` and `r` variables.
3. **Culling**: Discrete entity IDs are removed from the active Sim-Worker ECS memory.
4. **Resume Macro**: The statistical simulation resumes using the updated baseline.

## 4. Determinism & Integrity
- **Persistence**: Any "Historical Actor" (Legendary leader, key unit) is **NEVER** culled. They remain persistent across all scales as high-priority ECS entities.
- **Perfect Replay**: Spawning must be 100% deterministic based on seed. A player zooming in/out/in on the same hex must see identical initial placements.

## 5. Performance (Cheap Scale)
- **Viewport Culling**: Only hexes within the frustum + 1 hex buffer are instantiated.
- **Budget**: Max 500 agents instantiated per frame during a zoom-in event to prevent CPU spikes.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

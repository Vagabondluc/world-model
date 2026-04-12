# 90 Project & Production Management (Extensive Draft)

SpecTier: Brainstorm

## Purpose
Define the deterministic queue-based system for city-scale improvements, unit batches, and planetary-scale wonders.

## Spec Header
- `Version`: `v0.1-brainstorm`
- `DependsOn`: 
    - [`00-data-types.md`](../specs/00-core-foundation/00-data-types.md) (`uint32`, `uint64`)
    - [`68-numerical-stability-fixed-point-math-contract.md`](../specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md) (`mulPPM`, `divFloor64`)
    - [`40-action-resolution-world-delta.md`](../specs/30-runtime-determinism/40-action-resolution-world-delta.md) (Outputs)
    - [`84-institution-elite-layer.md`](./84-institution-elite-layer.md) (Inertia & Efficiency)
- `Owns`: [`ProjectQueueV1`, `ProductionStateV1`]
- `Writes`: [`WorldDelta` (Systemic changes)]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/90-project-production-management.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## 1. Project Schema
A project is a time-bound investment of population effort.

```ts
interface ProjectV1 {
  id: string
  name: string
  totalWorkRequiredPPM: uint64
  requirements: TagQuery
  onComplete: WorldDelta[]
  priorityWeight: uint32
}
```

## 2. Progress Formula
The work performed per tick is influenced by population assignment and institutional friction.

### 2.1 Basic Work
```text
WorkPerTick = mulPPM(AssignedPopPPM, EfficiencyPPM)
```

### 2.2 Inertia Multiplier
Large projects face exponential resistance to starting.
```text
InertiaFactor = (TotalWorkRequired / SCALE_CONSTANT) * institution.inertiaPPM
EffectiveWork = WorkPerTick / (1,000,000 + InertiaFactor)
```

## 3. Production Queue State
```ts
interface ProjectInstanceV1 {
  projectId: string
  accumulatedWorkPPM: uint64
  status: "active" | "paused" | "completed"
}

interface ProductionStateV1 {
  ownerId: string
  queue: ProjectInstanceV1[]
  overflowPPM: uint32 // Leftover work from last tick
}
```

## 4. Completion Rules
1.  **Work Threshold**: When `accumulatedWorkPPM >= totalWorkRequiredPPM`.
2.  **Commit Phase**: The `onComplete` deltas are queued for the global Event Bus (Phase B).
3.  **Overflow**: Extra work points are added to the next project in the queue.

## 5. Maintenance Mode
Completed buildings or infrastructure emit a **Maintenance Need**.
- If `MaintenanceResource < threshold`, the project's `WorldDelta` effects are scaled down by `50%`.
- This ensures that a civilization cannot grow infinitely without a proportional resource base.

## 6. Determinism Rules
- **Acyclic Queues**: Projects cannot have themselves as prerequisites.
- **Stable Sort**: Queues must be processed in the exact order the player/AI defined them.
- **Integer Math**: Use `divFloor64` for all progress divisions.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

# 91 Population Task Assignment (Extensive Draft)

SpecTier: Brainstorm

## Purpose
Define the deterministic allocation of population percentages to simulation roles, driving resources, research, and social pressure.

## Spec Header
- `Version`: `v0.1-brainstorm`
- `DependsOn`: 
    - [`00-data-types.md`](../specs/00-core-foundation/00-data-types.md) (`uint32`, `uint64`)
    - [`68-numerical-stability-fixed-point-math-contract.md`](../specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md) (`mulPPM`)
    - [`32-need-driven-behavior.md`](../specs/30-runtime-determinism/32-need-driven-behavior.md) (Need Loops)
    - [`83-faction-interest-group-generator.md`](./83-faction-interest-group-generator.md) (Conflict)
- `Owns`: [`RoleBucketV1`, `AssignmentMapV1`]
- `Writes`: [`ResourceDelta`, `KnowledgeDelta`, `NeedDelta`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/91-population-task-assignment.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## 1. Role Buckets
Population effort is partitioned into discrete functional categories.

| Role | Primary Output | Need Feedback |
| :--- | :--- | :--- |
| **Extraction** | `ResourcePPM` (Raw) | Reduces `EnergyNeed` |
| **Production** | `WorkPPM` (Projects) | Reduces `StabilityNeed` |
| **Science** | `KnowledgePPM` (Tech) | Reduces `KnowledgeNeed` |
| **Defense** | `SecurityPPM` (Military) | Reduces `SafetyNeed` |
| **Social** | `CohesionPPM` (Culture) | Reduces `SocialNeed` |

## 2. Assignment Algorithm
The state maintains an `AssignmentMapV1`.

```ts
type RoleId = "extract" | "prod" | "sci" | "def" | "social"

interface AssignmentMapV1 {
  allocations: Record<RoleId, uint32> // Sum must equal 1,000,000 PPM
}
```

### 2.1 Efficiency Calculation
```text
RoleOutput = mulPPM(PopulationCount, allocationPPM) * SkillMultiplierPPM
```

## 3. Need-Driven Feedback Loop
Population assignment directly impacts the **Need State** (Spec 32):
- **Shortage**: If `allocation(extract)` < `consumptionThreshold`, then `EnergyNeed` increases by `10,000 PPM` per tick.
- **Surplus**: If `allocation(sci)` > `averagePeerAllocation`, then `KnowledgeNeed` decreases.

## 4. Faction Conflict
Assignments generate **Ideological Mismatch** (Spec 83):
- A `Pacifist` faction (Spec 83) gains `RadicalizationPPM` if `allocation(def) > 300,000 PPM` (30%).
- An `Industrialist` faction gains `LoyaltyPPM` if `allocation(prod)` is high.

## 5. The "Draft" Mechanism (High Stakes)
Players can force-shift population using an **Emergency Power** (Spec 87):
- **Effect**: Instantly move `X%` from `Social` to `Defense`.
- **Cost**: `LegitimacyPPM` drops `-50,000` per tick while active.
- **Risk**: High probability of `RevolutionEvent` if sustained.

## 6. Determinism Rules
- **Conservation of Pop**: The sum of allocations must always be exactly `1,000,000 PPM`.
- **Topological Order**: Assignment resolution must happen **before** Project Progress (Spec 90) but **after** Population Dynamics (Spec 13).
- **No Float Weighting**: Use integer `priorityWeight` for auto-balancing algorithms.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

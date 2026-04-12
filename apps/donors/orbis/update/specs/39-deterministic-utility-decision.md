# 🔒 DETERMINISTIC UTILITY & DECISION ENGINE SPEC v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`
- `Baseline`: `v1-implementation` (`LockedOn: 2026-02-12`)

---
## 🔒 Implementation Baseline Lock
This file is frozen as part of the **v1 implementation baseline**.

Lock rules:
1. No semantic changes without explicit version bump (`v2+`).
2. Additive clarifications are allowed only if they do not change behavior.
3. Any non-additive change requires updating baseline status in project reports.

---

## Overview

Given an entity (individual / tribe / civilization / species cluster) at time `t`, choose actions deterministically such that:
- actions reduce unmet needs
- constraints and feasibility are respected
- behavior is explainable in dashboards
- decisions are stable under parallelism
- no hidden randomness / no stateful RNG

## Core Entities

```typescript
type EntityId = uint64
type ActionId = uint32
type NeedTagId = TagId
// AbsTime comes from 01-time-clock-system.md
```

Each entity has:
- tag set (sorted)
- needs as tag intensities (PPM)
- resource snapshot (optional)
- situation snapshot (threats, opportunities)
- decision cooldown table (small)

## Inputs to Decision

Decision reads only:
1. `EntityStateSnapshot(entityId, time)`
2. `WorldSnapshot(time)` (quantized)
3. `LocalContext(entityId, time)` (biome/region)
4. `ActionCatalog(domain)` (static)
5. `TagInteractionTables` (static)
6. RNG hash primitive (stateless)

No other sources allowed.

## Action Definition

```typescript
interface ActionDef {
  actionId: ActionId
  domain: DomainId

  // Requirements
  requiresTags?: TagQuery
  forbidsTags?: TagQuery

  // Feasibility
  preconditions: Condition[]     // quantized checks only
  cost: CostVector               // resources + risk
  cooldownTicks: uint32          // per entity clock

  // Effects
  needDeltaPPM: Partial<Record<NeedTagId, int32>> // negative reduces need
  tagDeltaPPM: TagDelta[]         // optional behavior/culture tags
  worldDelta: WorldDelta[]        // queued as events (not immediate)
}
```

**Important:**
- Effects are deltas, not direct state mutation.
- All effects become events for Phase B commit.

## Decision Step (High-Level)

For an entity at time `t`:
1. Build candidate action list from ActionCatalog
2. Filter by feasibility (tags + preconditions + cooldown)
3. Score each candidate using Utility function
4. Pick best action by deterministic tie-break
5. Emit `ACTION_SELECTED` event + action effects as proposed events

No mutation during selection.

## Candidate Filtering

### TagQuery

TagQuery is a boolean expression over tags:
- AND / OR / NOT
- threshold check on intensityPPM

**Example:**
- requires `Sapient >= 600k`
- forbids `Pacifist >= 500k`

All tag intensities are quantized.

### Preconditions

Only quantized comparisons:
- `foodStockPPM > X`
- `threatPPM < Y`
- `climateStabilityPPM > Z`

No float comparisons.

### Cooldowns

Entity stores:

```typescript
cooldownUntilTick[actionId] = uint64
```

All computed in entity's domain clock.

## Utility Function

Utility is computed as:

```
U(action) =
  Σ_i (NeedPressure_i * ActionNeedRelief_i)
+ Σ_j (TagAffinity_j * ActionTagAlignment_j)
- CostPenalty
- RiskPenalty
- InstabilityPenalty
+ OpportunityBonus
```

All terms are deterministic and quantized.

## 🔒 Locked v1 Scoring Contract

Authoritative integer formula:

```
scoreRaw =
  NeedTerm
  + TagTerm
  - CostPenalty
  - RiskPenalty
  - InstabilityPenalty
  + OpportunityBonus
```

Clamp and saturation behavior:
1. Intermediate terms: signed `int64`.
2. `scoreRaw` clamp: `[-9_000_000_000_000, 9_000_000_000_000]`.
3. If clamped, emit reason code `610301` (`UTILITY_SCORE_CLAMPED`).
4. Invalid precondition arithmetic emits `610302` (`UTILITY_INPUT_INVALID`) and action is excluded.

Tie-break order (hard rule):
1. higher `scoreRaw`
2. higher relief of dominant need
3. lower `riskPPM`
4. lower `costPPM`
5. smaller `actionId`
6. final deterministic hash `hash(seed, entityId, tick, actionId)`

### NeedPressure (PPM)

Need pressure comes from Need tags:

```
NeedPressure_i = needPPM_i / 1_000_000
```

But avoid floats by using PPM directly:

```
NeedContribution_i = needPPM_i * reliefPPM_i
```

Where `reliefPPM_i` is `-needDeltaPPM_i` clamped ≥ 0.

So:

```
NeedTerm = Σ (needPPM_i * reliefPPM_i)
```

This is integer math.

### TagAffinity (Bias / Culture)

Certain tags modify preference.

**Example tags:**
- Militaristic
- Spiritual
- Expansionist
- RiskAverse

Each tag has a weight table:

```typescript
TagActionAffinity[tagId][actionId] = int32  // can be negative
```

Then:

```
TagTerm = Σ (tagPPM * affinity)
```

### CostPenalty (Resources)

CostVector is quantized.

```
CostPenalty = Σ_k (costPPM_k * scarcityWeightPPM_k)
```

ScarcityWeight derived from current stocks.

### RiskPenalty

Risk is PPM. Risk tolerance is a tag.

```
RiskPenalty = riskPPM * (1_000_000 - riskTolerancePPM)
```

So risk-averse entities avoid risky actions deterministically.

### InstabilityPenalty

If world/biome stability is low, penalize actions that require coordination.

```
InstabilityPenalty =
  actionCoordinationPPM * (1_000_000 - stabilityPPM)
```

### OpportunityBonus

If niche gaps / resource surpluses exist:

```
OpportunityBonus =
  actionOpportunityPPM * opportunityPPM
```

**Example:** Colonize is boosted when `nicheGapPPM` is high.

## Final Score Type

All terms are int64.

```
score: int64
```

No floats.

## Deterministic Tie-Break

If multiple actions have equal score:

Tie-break key:
1. higher `relief of dominantNeed`
2. lower `riskPPM`
3. lower `costPPM`
4. smaller `actionId`
5. final stable hash: `hash(seed, entityId, tick, actionId)`

This is deterministic and replayable.

## 🔒 Compliance Vector (v1)

Input:
- `needPPM = { FoodNeed: 800_000, SafetyNeed: 400_000 }`
- Candidate A:
  - `reliefPPM = { FoodNeed: 300_000, SafetyNeed: 50_000 }`
  - `TagTerm = 20_000_000`
  - `CostPenalty = 40_000_000`
  - `RiskPenalty = 10_000_000`
  - `InstabilityPenalty = 5_000_000`
  - `OpportunityBonus = 0`
- Candidate B:
  - `reliefPPM = { FoodNeed: 250_000, SafetyNeed: 200_000 }`
  - `TagTerm = 15_000_000`
  - `CostPenalty = 35_000_000`
  - `RiskPenalty = 15_000_000`
  - `InstabilityPenalty = 2_000_000`
  - `OpportunityBonus = 5_000_000`

Calculation:
1. `NeedTerm(A) = 800000*300000 + 400000*50000 = 260000000000`
2. `NeedTerm(B) = 800000*250000 + 400000*200000 = 280000000000`
3. `scoreRaw(A) = 260000000000 + 20000000 - 40000000 - 10000000 - 5000000 + 0 = 259965000000`
4. `scoreRaw(B) = 280000000000 + 15000000 - 35000000 - 15000000 - 2000000 + 5000000 = 279968000000`

Expected:
- Winner: **Candidate B**
- Reason code trace includes `610100` (`ACTION_SELECTED`) for B.

## Action Execution Model

Selected action does not instantly mutate.

It emits:
- `ACTION_SELECTED(entityId, actionId, time)`
- `NEED_DELTA(entityId, needId, deltaPPM)`
- `TAG_DELTA(entityId, tagId, deltaPPM)`
- `WORLD_DELTA(...)` (e.g., deforestation, pollution, war)

These are committed in Phase B using the Event Ordering Spec.

## Decision Frequency (By Scale)

Decision is evaluated at the entity's clock:
- Individual: daily
- Tribe: weekly/monthly
- Civilization: monthly/yearly
- Species cluster: yearly/decadal

During DnD windows:
- player-facing entities can be HighRes (6 sec / turn)
- others Frozen

Policy is enforced by Domain Mode rules.

## Explainability Contract

For every chosen action, store a compact "score breakdown":

```typescript
interface DecisionExplain {
  time: AbsTime
  entityId: uint64
  actionId: uint32
  dominantNeed: NeedTagId
  scoreTotal: int64
  topNeedTerms: [NeedTagId, int64][]
  topTagTerms: [TagId, int64][]
  penalties: { cost: int64; risk: int64; instability: int64 }
}
```

Keep only last N (e.g., 64) per entity unless debugging mode.

This enables onboarding + "why did they do that?"

## Modding Hooks

Mods may add:
- new actions
- new tag affinities
- new preconditions
- new world deltas

But must:
- define quantized cost/benefit
- define tag queries
- register stable ActionId
- remain deterministic

## Hard Prohibitions

- No LLM deciding actions directly.
- No stochastic "personality noise."
- No floating point scoring.
- No iterating unordered containers.
- No action effects applied outside event commit.

LLM can be used only to *describe* decisions after the fact (narrative layer), reading DecisionExplain.

## Result

You now have a deterministic, explainable, mod-friendly decision engine that:
- uses Needs as tags
- uses Culture/Bias as tags
- produces stable behaviors
- integrates perfectly with your scheduler + event ordering
- supports real-time tactical windows without breaking deep-time sim

# 🔒 TAG INTERACTION MATH CONTRACT v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Overview

Define how tags alter math in the simulation as:
- deterministic
- quantized (PPM / fixed-point)
- composable (stackable effects)
- bounded (no runaway multipliers)
- explainable (dashboard breakdown)
- mod-safe (validators + caps)

Tags must never directly "do logic."
They only adjust coefficients used by systems.

## Quantized Numeric Standard (Hard Rule)

All tag math uses integers:
- intensity: `0..1_000_000` (PPM)
- multipliers: `0..2_000_000` where `1_000_000 = 1.0x`
- additive offsets: signed `int32` in PPM
- final coefficients: `int64` internal, clamped to `int32` output

No floats.

## Canonical Tag Effect Types (LOCKED)

A tag can contribute via one of these effect channels:

```typescript
enum EffectOp {
  Mul,        // multiply a coefficient
  Add,        // add to a coefficient
  ClampMin,   // raise minimum bound
  ClampMax,   // lower maximum bound
  Gate        // enables/disables an action/system feature via threshold
}
```

"Gate" is still numeric: it's a threshold check, not free logic.

## Effect Targets (Where Tags Can Apply)

Tags can affect only defined targets:

```typescript
enum EffectTarget {
  // Population & ecology
  PopGrowthRate,
  PopMortalityRate,
  CarryingCapacity,

  PredatorEfficiency,
  PreyEvasion,
  TrophicTransfer,

  MutationRate,
  BranchingRate,

  ColonizationPotential,
  RefugiaSurvival,

  // Climate coupling proxies
  AlbedoEffect,
  CO2Effect,
  WaterRetention,

  // Civilization & behavior
  NeedDecayRate,
  ActionAffinity,
  RiskTolerance,
  CoordinationCost,

  // Action resolution
  DeltaMultiplier,      // scales specific delta kinds
  DeltaCapMultiplier,   // scales caps for specific delta kinds
}
```

No other target is allowed without extending the enum + version bump.

## TagEffect Record (Static Registry)

Each TagId maps to 0..N effects:

```typescript
interface TagEffect {
  tagId: TagId
  target: EffectTarget
  op: EffectOp

  // optional scoping
  domain?: DomainId
  actionId?: ActionId
  deltaKind?: uint32
  biomeTagQuery?: TagQuery

  // numeric strength
  strengthPPM: int32         // for Add
  multiplierPPM: uint32      // for Mul (1_000_000 = 1.0x)
  thresholdPPM?: uint32      // for Gate
}
```

## Intensity Mapping Function (LOCKED)

Tag intensity modulates effect strength via a deterministic curve.

**Default curve (linear):**

```
appliedMultiplierPPM =
  1_000_000 + ( (tagIntensityPPM * (multiplierPPM - 1_000_000)) / 1_000_000 )
```

**Additive:**

```
appliedAddPPM =
  (tagIntensityPPM * strengthPPM) / 1_000_000
```

No exponentials by default.
If you later add non-linear curves, they must be enumerated and versioned.

## Combining Multiple Tags on Same Target (LOCKED)

### Multipliers combine multiplicatively (fixed-point)

For a target coefficient `C`:

```
C' = C
C' = (C' * M1) / 1_000_000
C' = (C' * M2) / 1_000_000
...
```

Order must be deterministic:
- tags sorted by tagId ascending

### Additions combine by sum

```
C'' = C' + Σ Add_i
```

Then clamped.

## Global Safety Caps (Hard Rule)

After all tag effects:
- multiplier cap: `0.10x .. 10.0x`
  - `100_000 .. 10_000_000`
- additive cap per target: configurable but bounded (default ±500k PPM)
- final coefficient clamp per target (domain-defined)

If you hit caps, emit:

```
TAG_EFFECT_CLAMPED(target, entityId, time)
```

## Pairwise Tag Interactions (Optional but Locked Format)

Some effects depend on combinations (e.g., ColdAdapted + HeatAdapted).

We support this via an interaction table, not custom logic:

```typescript
interface TagPairEffect {
  a: TagId
  b: TagId
  target: EffectTarget
  op: EffectOp
  multiplierPPM?: uint32
  strengthPPM?: int32
}
```

**Application rule:**
- only if both tags present above threshold (default 200k PPM)
- apply after single-tag effects
- deterministic order: (min(a,b), max(a,b)) ascending

Keep this sparse and rare.

## Gate Effects (Feature Unlock)

Gate is evaluated as:

```
enabled = tagIntensityPPM >= thresholdPPM
```

**Uses:**
- unlock actions (ToolUser → Study)
- unlock domains (Sapient → Civilization behavior layer)
- unlock narrative weights (MythMaking → Myth tags)

Gates must emit trace:

```
FEATURE_ENABLED(featureId, entityId, time)
FEATURE_DISABLED(...)
```

## Where Tag Math Is Applied (Integration Points)

### Decision Engine

- ActionAffinity
- NeedDecayRate
- RiskTolerance
- CoordinationCost

### Action Resolution

- DeltaMultiplier for specific delta kinds
  Example: Industrial → CO2Proxy delta x1.5

### Ecology

- PopGrowthRate, MortalityRate, CarryingCapacity
- PredatorEfficiency, TrophicTransfer

### Evolution & Colonization

- MutationRate, BranchingRate
- ColonizationPotential, RefugiaSurvival

### Climate Coupling

- AlbedoEffect, WaterRetention, CO2Effect

Tags never directly set temperature.
They only adjust coefficients used by that domain.

## Explainability Contract (Dashboard)

Every time you compute a coefficient for a target, you must be able to return:

```typescript
interface EffectBreakdown {
  baseValuePPM: int32
  appliedMultipliers: Array<{tagId: TagId, mPPM: uint32, contrib: int32}>
  appliedAdds: Array<{tagId: TagId, addPPM: int32}>
  pairEffects: Array<{a: TagId, b: TagId, op: EffectOp, valuePPM: int32}>
  finalValuePPM: int32
}
```

Store only on demand or last N computations to stay cheap.

## Modding Rules (Hard)

Mods may add:
- new tags
- new TagEffect records
- new TagPairEffect records

But must:
- declare target + op
- declare numeric strengths
- pass caps + validators
- use stable TagIds
- be versioned

If a mod violates caps repeatedly, the engine can auto-disable that mod's effects (deterministically) with an event log.

## Determinism Hazards Prevented

This contract prevents:
- "if tag then special-case logic"
- float drift
- hidden order dependence
- runaway multipliers
- mods breaking conservation
- tags overriding physics

## 🔒 Compliance Test Vector

To ensure cross-platform parity, an implementation must pass this calculation test:

**Inputs:**
- Base Coefficient `C`: `100_000`
- Tag 1: `ID: 50`, `MultiplierPPM: 1_200_000`, `Intensity: 1_000_000` (1.2x)
- Tag 2: `ID: 10`, `MultiplierPPM: 800_000`, `Intensity: 500_000`   (0.9x effective)
- Tag 3: `ID: 30`, `AddPPM: 5_000`, `Intensity: 1_000_000`

**Step-by-Step Calculation (Sorted by ID: 10, 30, 50):**
1. **Tag 10 (Mul):** Intensity 500k converts 0.8x to 0.9x.
   `C' = (100_000 * 900_000) / 1_000_000 = 90_000`
2. **Tag 50 (Mul):** Intensity 1M is full 1.2x.
   `C'' = (90_000 * 1_200_000) / 1_000_000 = 108_000`
3. **Tag 30 (Add):** Intensity 1M is full +5k.
   `C_final = 108_000 + 5_000 = 113_000`

**Expected Result:** `113_000`

Note: Multipliers must be applied in tagId ascending order before additions.

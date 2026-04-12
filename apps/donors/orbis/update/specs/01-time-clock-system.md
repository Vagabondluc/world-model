# ðŸ”’ TIME & CLOCK SYSTEM v1 â€” FROZEN SPEC

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: [`AbsTime`, `DomainId`, `DomainMode`, `DomainClockSpec`, `DomainClockState`, `EventId`, `SimEvent`, `PluginSpec`]
- `Writes`: `[]`

---

## ðŸ”’ Authority: TIME & SCHEDULING
**SPEC_OWNER:** `docs/01-time-clock-system.md`  
**CANONICAL_TYPES:** `AbsTime`, `DomainId`, `DomainMode`, `DomainClockSpec`, `DomainClockState`, `EventId`, `SimEvent`, `PluginSpec`

---

(Absolute time â€¢ Domain clocks â€¢ Catch-up â€¢ Regeneration â€¢ Plugins)

## 0ï¸âƒ£ Core Principle

There is **one** canonical time variable.
Everything else is a view or schedule on top of it.

Time only goes up. Forever.

---

## 1ï¸âƒ£ Absolute Time

### Type

```ts
type AbsTime = uint64
```

### Unit (LOCKED)

**AbsTime is measured in microseconds.**

Reasons:

* D&D 6s tick = 6_000_000 us exactly
* OSR turn (10 min) = 600_000_000 us exactly
* Single canonical unit across all domain clocks prevents unit drift

### Invariants

* `tNow >= 0`
* `tNow` is monotonic increasing
* No rewinds (unless you run a separate "replay sim" sandbox, not part of main sim)

---

## 2ï¸âƒ£ Domain Clock Model

Every subsystem is a **Domain**. Domains are organized into **Hierarchical Temporal Tiers** (T0-T3) as defined in `docs/specs/00-core-foundation/89-hierarchical-temporal-tiers.md`.

### Domain ID (LOCKED set)

```ts
enum DomainId {
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
```

### Domain Clock Spec

```ts
enum DomainMode {
  Frozen,       // no updates; Sample() only (ZOH)
  Step,         // AdvanceTo at domain stepUs
  HighRes,      // AdvanceTo at smaller quantumUs inside a window
  Regenerate    // recompute state from parameters at target time
}

interface DomainClockSpec {
  domain: DomainId
  quantumUs: AbsTime        // smallest resolution for that domain
  stepUs: AbsTime           // typical update step
  mode: DomainMode
  maxCatchupSteps: number   // per scheduler call
}
```

### Domain State Record (stored)

```ts
interface DomainClockState {
  lastStepTimeUs: AbsTime
}
```

---

## 3ï¸âƒ£ Scheduler Algorithm (LOCKED)

Given:

* `tNowUs: AbsTime`
* `state.lastStepTimeUs`

Compute due steps:

```
due = (tNowUs - lastStepTimeUs) / stepUs   // integer division
steps = min(Number(due), maxCatchupSteps)
```

Then:

* If `steps == 0` â†’ domain does nothing
* Else domain runs `steps` updates deterministically
* Update:

  ```
  lastStepTimeUs += stepUs * steps
  ```

If `due > maxCatchupSteps`:

* handle overflow by domain mode (see below)

---

## 4ï¸âƒ£ Catch-up Overflow Policy (LOCKED)

When the domain is behind by too much:

### Frozen

* do not advance this domain
* use committed snapshots via `Sample(domain, time)` (ZOH)

### Regenerate

* ignore step simulation
* run `regenerateTo(tNowUs)`
* set `lastStepTimeUs = tNowUs` (snaps)

### Step / HighRes

* run up to `maxCatchupSteps`
* if lag remains above threshold, escalate to `Regenerate`

Threshold (LOCKED):

```
if due > maxCatchupSteps â†’ treat as "lag large"
```

No other heuristics.

---

## 5ï¸âƒ£ Domain Clock Table (LOCKED DEFAULTS)

These are the defaults; you can override per world, but must remain integer us.

| Domain        | quantum                       | Mode       | maxCatchupSteps | Notes                                 |
| ------------- | ----------------------------- | ---------- | --------------- | ------------------------------------- |
| dnd6s         | 6,000,000 us                  | Step       | 60              | 6 minutes catch-up max                |
| osrTurn       | 600,000,000 us                | Step       | 12              | 2 hours max                           |
| weatherLocal  | 3,600,000,000 us (1h)         | Step       | 168             | sim â‰¤ 1 week else regen               |
| climateBands  | 2,592,000,000,000 us (30d)    | Step       | 240             | sim â‰¤ 20y else solve/regenerate       |
| carbon        | 31,536,000,000,000 us (365d)  | Step       | 500             | sim â‰¤ 500y else regenerate (optional) |
| hydrology     | 31,536,000,000,000 us (1y)    | Regenerate | 1               | rebuild rivers when climate changes   |
| biomes        | 31,536,000,000,000 us (1y)    | Regenerate | 1               | rebuild stable biome map              |
| civilization  | 31,536,000,000,000 us (1y)    | Step       | 200             | sim â‰¤ 200y else regen polity          |
| biosphere     | 31,536,000,000,000 us (1y)    | Step       | 500             | sim â‰¤ 500y else regen ecology         |
| tectonics     | 3,153,600,000,000,000 us (100k y) | Regenerate | 1               | epoch step                            |
| magnetosphere | 315,360,000,000,000 us (10k y) | Step       | 200             | sim â‰¤ 2M y else regen                 |

**Important:** hydrology/biomes are **regenerate** by default (your stated preference).

---

## 6ï¸âƒ£ Regeneration Contract (LOCKED)

A regenerate domain must implement:

```ts
regenerateTo(tNowUs: AbsTime): void
```

Rules:

* Must be deterministic
* Must be a pure function of:

  * upstream states *as of tNowUs*
  * its own stored state (if any)
* Must write full outputs (not partial diffs)
* Must not call RNG

---

## 7ï¸âƒ£ Hybrid Contract (LOCKED)

Hybrid domains implement both:

```ts
step(): void
regenerateTo(tNowUs: AbsTime): void
```

Scheduler chooses per overflow policy.

---

## 8ï¸âƒ£ Event Bus (LOCKED)

To avoid polling everything, we use deterministic invalidation events.

### Event Type

```ts
type EventId =
  | "ClimateChanged"
  | "SeaLevelChanged"
  | "TectonicsEpochChanged"
  | "CarbonChanged"
  | "MagnetosphereChanged"
  | "BiomeInvalidated"
  | "HydrologyInvalidated"
```

### Event Record

```ts
interface SimEvent {
  atTimeUs: AbsTime
  id: EventId
  payloadHash: number // small deterministic hash only
}
```

### Event Rules (LOCKED)

* Events are append-only
* Ordered by `atTimeUs`, tie-break by insertion order
* Domains may subscribe to specific events
* A regenerate domain may run only when invalidated

**Key invalidation triggers (LOCKED):**

* If climateBands runs and `meanTemp` or `meanPrecip` changes beyond epsilon â†’ emit `ClimateChanged`
* `ClimateChanged` â‡’ invalidate hydrology + biomes (emit HydrologyInvalidated + BiomeInvalidated)
* `TectonicsEpochChanged` â‡’ invalidate carbon source term and terrain-dependent masks

Epsilon thresholds (LOCKED):

* `Î”meanTemp > 0.25 K` OR
* `Î”meanPrecip > 0.02`

---

## 9ï¸âƒ£ Plugin Contract (Minigames)

A plugin must declare:

```ts
interface PluginSpec {
  id: string
  runsOn: DomainId[]     // e.g. ["dnd6s"] or ["osrTurn"]
  reads: string[]        // data channels
  writes: string[]       // allowed outputs
  deterministic: true
}
```

Rules:

* Plugins cannot mutate core sim state directly
* They can only write via allowed channels (e.g., "civilization actions" queue)
* Plugin time is scheduled via its domain clocks, not by "real time"

This supports:

* D&D 6-second tick client
* OSR exploration turns
* slow planetary sim in background (conceptually) without mixing clocks

---

# ðŸ”’ MAGNETOSPHERE v1 â€” FROZEN SPEC

(Max-scale habitability permit)

Canonical source for magnetosphere data contracts:
`docs/02-magnetosphere.md` (`MagnetosphereState`, `MagnetosphereDrivers`).

This file references those types for scheduler integration only.

## 3ï¸âƒ£ Update Frequency

Domain clock:

* `stepUs = 10,000 years` (as above)

## 4ï¸âƒ£ Health Evolution (LOCKED)

Per step (10k years):

```
d = +kDynamo * coreHeat01 * rotation01
    -kDecay
    -kInstability * (1 - tectonicHeatFlux01)

health01 = clamp01(health01 + d)
```

Defaults (LOCKED):

* `kDynamo = 0.030`
* `kDecay = 0.010`
* `kInstability = 0.015`

These are sized for 10k-year steps.

## 5ï¸âƒ£ Polarity Reversal Oscillator (LOCKED, no RNG)

Per step:

```
flipRate = baseFlipRate * (1 + flipChaos*(1 - health01))
phase01 += flipRate
if phase01 >= 1:
  phase01 -= 1
  polarity *= -1
  lastFlipTimeUs = tNowUs
```

Defaults (LOCKED):

* `baseFlipRate = 0.015`   // ~66 steps per flip at full health (~660k years)
* `flipChaos = 2.0`

## 6ï¸âƒ£ Radiation Stress Output (LOCKED)

Derived:

```
radiationStress01 = clamp01((0.25 - health01) / 0.25)
```

Classification (LOCKED):

* `health01 < 0.25` weak
* `health01 < 0.10` critical

This does not instantly delete life; it raises extinction pressure.

Emit event if stress changes meaningfully:

* `Î”radiationStress > 0.05` â‡’ `MagnetosphereChanged`

---

# âœ… AUDIT: WHAT THIS LOCK ADDS

You now have:

* one infinite monotonic time
* many clocks with explicit quantums
* catch-up rules that prevent death spirals
* regeneration as first-class behavior
* an event invalidation model
* plugin time integration for 6s + OSR turns
* magnetosphere as the max-scale life permit

This is the missing architectural glue.

---

## ðŸ”’ BIOSPHERE GATING CONTRACT

How radiationStress, climate, and oceans gate:

* origin probability
* biodiversity capacity
* extinction pressure
* "life stage" transitions




## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

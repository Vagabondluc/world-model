# 🔒 GEOLOGICAL EPOCH TIMELINE SYSTEM SPEC v1.0

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Deterministic • Turn-Compatible • Supports Fast-Forward + Live Evolution)

This is the **time backbone** that schedules: impacts, tectonics, volcanism, erosion, climate, hydrology, resources—without circular chaos.

---

## 0️⃣ Goals

Must:

* Support **3 modes**: generate-once, fast-forward, turn-stepped
* Keep determinism across saves/mods
* Provide a stable event ordering contract
* Control complexity (no infinite feedback loops)
* Allow "planet age slider" and "history playback"

---

## 1️⃣ Time Model

### 1.1 Canonical Time Unit

We use a normalized geological time:

```
t ∈ [0, 1]
```

* t=0: formation
* t=1: present state for current generation

You can map to years later, but simulation uses normalized time.

### 1.2 Discrete Steps

Timeline consists of fixed steps:

```
stepCount = S   // locked per planet resolution tier
stepIndex i ∈ [0..S-1]
t_i = i / (S-1)
```

No variable dt. Determinism depends on fixed step count.

---

## 2️⃣ Modes (Locked)

### Mode A — Static Generation

Compute final state directly using epoch-weighted formulas, no stepping.

Use when:

* fast planet generation for gameplay

### Mode B — Fast-Forward

Simulate steps 0..S-1 quickly, accumulating events.

Use when:

* you want believable history (crater density, resurfacing, sediment build-up)

### Mode C — Turn-Stepped Evolution

Each game turn advances time by Δ steps (e.g. 1–4 steps).

Use when:

* civ game evolving climate, rivers, hazards

All three modes must produce consistent outputs when aligned (within tolerances).

---

## 3️⃣ Epoch Definition

Epochs are named intervals with enabled systems + multipliers.

```ts
type Epoch = {
  name: string
  tStart: number
  tEnd: number
  enabled: {
    impacts: boolean
    tectonics: boolean
    volcanism: boolean
    climate: boolean
    hydrology: boolean
    erosion: boolean
  }
  multipliers: {
    impactRate: number
    volcanicResurfacingRate: number
    erosionStrength: number
    tectonicUplift: number
  }
}
```

---

## 4️⃣ Default Epoch Set (Must-Haves)

These come straight from your referenced content (bombardment → resurfacing → hydrology era).

### E0 — Accretion / Heavy Bombardment

* High impact rate
* Weak climate/hydrology relevance (optional)
* Sets baseline crater density

### E1 — Stabilization

* Impacts drop
* Tectonics dominate uplift patterns
* Volcanism moderate

### E2 — Resurfacing Pulses

* Volcanism creates maria / basalt plains
* Resets surface age in patches
* Erases old small craters

### E3 — Hydrological Era

* Climate + hydrology fully active
* Rivers carve, sediment builds deltas
* Erosion passes

### E4 — Late Stability

* Low impacts
* Slow erosion
* Seasonal climate optional

---

## 5️⃣ Global Simulation Order Per Step (Immutable)

Within each time step `i`, compute in this exact order:

1. **Event Scheduling** (generate deterministic event list for this step)
2. **Plate Field Update** (if tectonics enabled)
3. **Volcanic Resurfacing Events** (apply as layer events)
4. **Impact Events** (apply as layer events)
5. **Surface Age Update** (from resurfacing + impacts)
6. **Elevation Evaluation** (apply feature priority hierarchy)
7. **Climate Transport** (temperature, wind, precipitation)
8. **Hydrology** (flowDir, accumulation, basins, rivers)
9. **Erosion & Sediment** (incision, diffusion, deposition)
10. **Resource Recompute** (optional every N steps; locked cadence)

This avoids circular dependencies (rivers depend on climate/elevation; erosion depends on rivers; next step elevation uses stored erosion fields).

---

## 6️⃣ Event Scheduling Spec (Deterministic)

Events are generated from seed + stepIndex:

```
stepSeed = hash(planetSeed, i)
```

### 6.1 Impacts

Number of impacts this step:

```
count = PoissonLikeDeterministic(rate(t_i) * impactRateMultiplier(epoch))
```

No true Poisson RNG. Use a deterministic sampler:

* hash-based uniform values
* convert to counts via precomputed CDF

### 6.2 Volcanism

Generate resurfacing patches based on:

* divergent boundaries
* hotspots (seeded)
* crust thinness
* epoch multiplier

All patch placement deterministic from stepSeed.

### 6.3 Tectonics

Plates can be:

* static (preferred for gameplay)
* or slowly moved (optional v2)

For v1, we lock:

* plate angular velocities constant through time
* stress fields can evolve via step-based smoothing if desired

---

## 7️⃣ Resurfacing Contract

Resurfacing events must output:

```
ResurfaceMask(cell) ∈ {0..1}
ResurfaceTimestamp(cell) = t_i
ResurfacePriority = volcanic > largeImpact > other
```

This feeds SurfaceAge and crater erasure rules.

---

## 8️⃣ Recompute Cadence (Performance Lock)

To prevent heavy recomputation each step:

* Climate: every step if turn-stepped; else seasonal samples per epoch
* Hydrology: every step in fast-forward; every turn in game mode
* Resources: every `R` steps (locked, e.g. R=4) unless user requests full recompute

All cadences deterministic.

---

## 9️⃣ Savegame + Diff Requirements (Timeline-Compatible)

A save must store:

* Current stepIndex
* Event cursor indices (if streaming events)
* Any player edits as overlays (separate layer, higher priority than geology)
* Immutable planetSeed and locked spec version tags

Never store derived layers unless caching explicitly enabled.

---

## 🔟 Spec Versioning Contract (Must-Have)

Every planet save includes:

```
specVersion = {
  surface: "1.0"
  tectonics: "1.0"
  hydrology: "1.0"
  impacts: "1.0"
  erosion: "1.0"
  climate: "1.0"
  epochs: "1.0"
}
```

If any differs, you must either:

* migrate deterministically
* or mark as incompatible

This prevents silent drift.

---

## 1️⃣1️⃣ Determinism Guarantees

* Fixed S steps
* Fixed per-step order
* StepSeed derived from planetSeed + i
* No runtime RNG
* Stable iteration ordering by cellId

Same planetSeed + same specVersion → identical results.
---

## ✅ **Geological Epoch Timeline System is now LOCKED.**

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

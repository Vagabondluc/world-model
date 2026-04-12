# 🔒 POPULATION DYNAMICS MODEL (Predator–Prey Stability) SPEC v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## 0) Goal

A deterministic, cheap, typed population model that:

* evolves species populations per **Cell** (sparse) and optionally per **Biome/Region**
* respects **trophic constraints** (energy limits)
* avoids chaotic blowups (numerical stability)
* supports predator–prey cycles, collapse, and recovery
* integrates with:

  * Refugia & Colonization
  * Trophic Web Math (next/previous)
  * Species gameplay profile (aggression, reproduction, etc.)

No individuals. No continuous floats.

---

# 1) Where It Runs (Basis & Cadence)

* Basis: **CellSpace authoritative**, with optional **Biome-aggregated caches**
* Cadence: **BioTick** (e.g., monthly / seasonal / yearly — domain-configurable)
* Storage: **Sparse OccupancyLayer(speciesId)**

We explicitly support cross-scale ticks:

* BioTick is absolute sim time
* D&D 6s tick is gameplay overlay only

---

# 2) Data Types

```ts
// Canonical source: docs/18-nomenclature.md
// Use canonical SpeciesId from nomenclature spec.
type CellId = uint32

interface PopStateCell {
  densityPPM: uint32            // 0..1e6 relative to capacity
  biomassPPM: uint32            // optional; derived
  lastTick: AbsTime
}

interface SpeciesBioParamsV1 {
  rGrowthPPM: uint32            // intrinsic growth per BioTick
  mortalityPPM: uint32          // baseline mortality per BioTick
  dispersalPPM: uint32          // used by colonization solver
  assimilationPPM: uint32       // energy efficiency (0..1e6)
  predationEfficiencyPPM: uint32// hunting conversion efficiency
  attackRatePPM: uint32         // predator pressure scaling
  handlingPPM: uint32           // saturation control (prevents runaway)
  minViablePPM: uint32          // local extinction threshold
  panicSensitivityPPM: uint32   // prey collapse sensitivity
}
```

Trophic roles:

* Producer
* Herbivore
* Carnivore
* Omnivore
* Decomposer (optional v1)

---

# 3) Canonical State Variables per Cell

We model densities as fractions of carrying capacity.

For each cell:

* `K_cell` = CarryingCapacityCell[cell]
  * **Rule:** `K_cell` is recomputed each epoch from the `GPP/NPP` output of the Trophic Web Energy Model.
* For each species present:

  * `N` = densityPPM (0..1e6) representing `population / K_cell`

Additionally, we track a cell-level energy budget later (trophic web spec). For v1 predator-prey, we can operate on densities with implicit energy via K.

---

# 4) Stability-First Update Rule (Hard)

We do updates with:

* clamped deltas
* fixed-point integer math
* bounded functional responses

No raw Lotka–Volterra (too unstable).

---

# 5) Producers (Logistic Growth)

For Producer species:

```
ΔN = r * N * (1 - N)  - m * N
```

Where:

* N is PPM fraction
* rGrowthPPM is per tick
* mortalityPPM is per tick

Implementation (PPM math):

* `N` in 0..1e6
* `(1 - N)` => `1e6 - N`
* multiply in int64, divide by 1e6 as needed

Clamp:

* `ΔN` limited to ±deltaMaxPPM per tick

---

# 6) Consumer Food Intake (Bounded Functional Response)

For Herbivores/Carnivores, we compute "intake" using a saturating function so predators don't explode.

We use a Holling Type II style bounded term (fixed-point):

### FoodAvailable

For herbivore:

* `Food = Σ producerN * preferenceWeight`

For carnivore:

* `Food = Σ preyN * preferenceWeight`

All PPM.

### Intake

```
Intake = (attackRate * Food) / (handling + Food)
```

All in PPM space.

This saturates as Food grows.

---

# 7) Consumer Growth & Mortality

Consumer density update:

```
ΔN = (assimilation * Intake * N) - (mortality * N) - (starvationPenalty)
```

Starvation penalty:

* if Food is too low, add extra mortality

Optional "panic" effect for prey under heavy predation:

* prey mortality rises nonlinearly if predator pressure exceeds threshold

---

# 8) Predation Pressure (Coupled Dynamics)

Prey loss is proportional to predator intake, but bounded:

For each predator p and prey q:

```
PreyLoss_q += predationEfficiency_p * Intake_p * PredatorN
```

Then prey update includes:

* `-PreyLoss_q`

We cap total prey loss per tick:

* cannot remove more than `preyN * maxKillFracPPM`

This prevents instant extinction due to spikes.

---

# 9) Multi-Species Network (Graph-Based)

We represent feeding links as a **TrophicGraph** (typed):

```ts
interface FeedingEdge {
  predator: SpeciesId
  prey: SpeciesId
  weightPPM: uint32      // preference
}
```

Per cell, we only evaluate edges for species present (sparse join).

---

# 10) Ordering & Deterministic Integration

To avoid "order matters" bugs:

### Two-phase update (Hard)

1. Read old densities N(t)
2. Compute all deltas ΔN for all species in cell
3. Apply all ΔN simultaneously to get N(t+1)

This guarantees determinism regardless of iteration order.

Stable iteration order still enforced:

* speciesIds sorted ascending
* edges sorted `(predator, prey)`

---

# 11) Extinction & Persistence Rules

Local extinction:

* if `N < minViablePPM` for `X` consecutive ticks → remove from cell

Persistence:

* refugia solver may "pin" minimal populations if cell is a refugium core

  * (as a separate event-based rule)

No spontaneous reappearance: colonization solver controls spread.

---

# 12) Parameter Table v1 (Global Safety Limits)

```ts
interface PopDynamicsGlobalsV1 {
  // Ecological Linkage
  nppToCarryingCapacityPPM: uint32 // Scale factor from energy model

  deltaMaxPPM: uint32          // max abs density change per tick
  maxKillFracPPM: uint32       // prey max % removed per tick
  starvationFoodMinPPM: uint32 // below this, extra mortality
  starvationMortalityPPM: uint32
  panicPredPressurePPM: uint32
  panicExtraMortalityPPM: uint32
}
```

These globals are your "numerical guardrails."

---

# 13) Outputs to Fields / Stores

Primary output is occupancy layers.

But we also emit useful derived fields:

* `BiodiversityPressureCell` (4003) as:

  * number of species present, weighted by trophic level
* optional `PredationPressureCell` (new FieldId 4006)
* optional `HerbivoryPressureCell` (new FieldId 4007)

Reserve IDs now:

| FieldId | Name                  | Basis | Unit |
| ------: | --------------------- | ----- | ---- |
|    4006 | PredationPressureCell | Cell  | PPM  |
|    4007 | HerbivoryPressureCell | Cell  | PPM  |

---

# 14) Dashboard Requirements

Population dashboard must show:

* per species:

  * occupied area over time
  * mean density over time
  * extinction events list
* per biome/region:

  * trophic pyramid bars (biomass by trophic level)
  * stability indicator (oscillation vs collapse)
* per cell overlay:

  * predator pressure
  * herbivory pressure

Onboarding explains:

* why saturation prevents runaway
* why two-phase update avoids order bugs
* what "carrying capacity" means

---

# 15) What This Spec Does NOT Do (Explicit)

* genetics
* mutation
* speciation
* individual agents
* detailed disease dynamics

Those hook in via:

* Adaptive Radiation spec
* Tag interaction math
* Event system

---

## ✅ Result

You get predator–prey cycles that:

* feel plausible
* don't explode numerically
* integrate deterministically with your colonization/refugia history
* remain cheap enough to run with many species as sparse layers

---

Next lock that this depends on (and you already asked for):

🔒 **Trophic Web Math (Energy Flow Constraints) Spec**

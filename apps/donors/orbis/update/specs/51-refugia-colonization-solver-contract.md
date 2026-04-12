# 🔒 REFUGIA & COLONIZATION SOLVER CONTRACT v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## 0) Goal

A deterministic solver that explains:

* how species **survive collapses** (refugia)
* how they **re-expand** (colonization fronts)
* how geography/climate/hydrology constrain spread
* how this feeds biodiversity, adaptive radiation, and later civilizations

This is not agent simulation. It's a **front propagation + viability filter**.

Runs in **CellSpace** and uses your spatial query contract.

---

## 0.1 Anchor Flow

```text
collapse signal
-> refugia selection
-> occupancy compression
-> frontier initialization
-> diffusion frontier step
-> recolonization events
-> recovery completion (biodiversity + GPP lag)
```

---

# 1) Inputs / Outputs

## Inputs (read-only)

* Spatial layer:

  * neighbors[cellId]
  * regionId / biomeTypeId per cell
  * tags per BiomeCell
* Climate caches:

  * TempCell, PrecipCell, IceFracCell
* Hydrology:

  * RiverFlowCell, LakeMaskCell, WaterMaskCell
* Ecology fields:

  * CarryingCapacityCell (4002)
  * BiomassCell (4000)
* SpeciesTemplate + SpeciesGameplayProfile (for habitat prefs, mobility, etc.)

## Outputs (authoritative biosphere artifacts)

* `OccupancyLayer(speciesId): sparse cell -> densityPPM`
* `RefugiumSet(speciesId): Refugium[]`
* `ColonizationFront(speciesId): FrontierState`
* Events:

  * `REFUGIUM_ESTABLISHED`
  * `LOCAL_EXTINCTION`
  * `RECOLONIZED`
  * `RANGE_EXPANDED/CONTRACTED`

No direct mutation of climate/hydrology.

---

# 2) Core Data Types

```ts
type RefugiumId = uint32

interface Refugium {
  refugiumId: RefugiumId
  speciesId: SpeciesId
  coreCellId: uint32
  radius: uint16
  stabilityPPM: uint32
  capacityPPM: uint32
  lastSurvivedTick: AbsTime
}

interface FrontierState {
  speciesId: SpeciesId
  activeCells: uint32[]          // frontier ring
  lastTick: AbsTime
}
```

Occupancy is sparse:

* store only cells with density > threshold

---

# 3) Determinism (Hard)

For a given:

* worldSeed
* time tick
* speciesId
* field state

Result must match.

Tie-break rules:

* when two candidate cells are equal, pick smallest cellId
* ordering stable, always sorted

---

# 4) Habitat Suitability Function (Typed)

We compute `SuitabilityPPM(speciesId, cellId)` deterministically from:

* SpeciesTemplate habitatPrefs (tag queries + weights)
* Local biome tags
* Temp/Precip within tolerance bands
* Water requirement tags (Aquatic, Amphibious, etc.)
* River corridor bonus (optional)
* IceFrac penalty

Output:

* 0..1_000_000

No floats. Table-driven.

---

# 5) Collapse Detection (When Refugia Matter)

At each BioTick, for each species, detect range stress:

* mean suitability falls
* carrying capacity falls
* occupancy density drops below survival threshold

If collapse triggers:

* we compute refugia.

Collapse triggers are deterministic thresholds, e.g.:

* `globalOccupancyArea < minAreaPPM`
* `medianSuitability < survivalSuitPPM`
* `consecutiveBadTicks >= N`

---

# 6) Refugia Selection Algorithm (LOCKED)

Refugia are **top-K stable pockets**.

### Step 1 — Candidate cells

Candidates are cells with:

* SuitabilityPPM ≥ `refugiumSuitMinPPM`
* CarryingCapacity ≥ `refugiumCapMinPPM`
* Not ice-locked (IceFracCell < threshold)

### Step 2 — Stability scoring

Stability uses:

* climate stabilityPPM (from biome cell)
* variance of temp/precip over last M ticks (if stored)
* hydrology stability (near rivers/lakes helps)

Score:

```
StabilityScore = Suitability * Stability * Capacity  (scaled)
```

### Step 3 — Select K with spacing

Pick top candidates but enforce minimum distance (avoid clustering):

* after picking one refugium, exclude candidates within `minRefugiumSpacing`

Deterministic.

### Step 4 — Create refugium blobs

Each refugium has radius determined by:

* local suitability gradient
* minimum viable area

Store:

* coreCellId
* radius
* stabilityPPM
* capacityPPM

Emit `REFUGIUM_ESTABLISHED`.

---

# 7) Colonization Front Propagation (LOCKED)

Once conditions improve, spread outward.

We use a BFS-like wave:

### Step 1 — Initialize frontier

Frontier starts from each refugium core blob boundary.

### Step 2 — Expansion rule

A frontier cell can colonize neighbor cell if:

* Suitability(neighbor) ≥ `colonizeSuitMinPPM`
* neighbor not already occupied
* dispersal cost affordable

### Step 3 — Dispersal cost

Depends on species mobility + tags:

* base step cost
* penalty for hostile biomes
* bonus for river corridors (if species likes them)
* penalty for mountains (slope)
* penalty for crossing ocean unless Amphibious/Aquatic

If cost too high → blocked.

### Step 4 — Colonization speed

Speed is "cells per BioTick" determined by:

* mobilityPPM
* reproductionRatePPM
* dispersal tags

But deterministic: we simply limit expansions per tick.

### Step 5 — Optional weighted diffusion kernel (equivalent deterministic form)

Implementations may use this kernel form instead of explicit BFS queue if output parity is preserved:

```
FrontierNext[cell] =
  clampPPM(
    FrontierCurrent[cell]
    + mulPPM(kExpandPPM, NeighborInfluxPPM[cell])
    - mulPPM(kDecayPPM, FrontierCurrent[cell])
  )
```

Where:
* `NeighborInfluxPPM[cell] = sum( mulPPM(FrontierCurrent[n], ConnectivityPPM[n->cell]) )`
* `ConnectivityPPM` is deterministic and derived from suitability + dispersal costs.
* colonization requires `FrontierNext[cell] >= colonizeFrontierMinPPM`.

---

# 8) Density Update (Cheap Population Proxy)

We do not simulate individuals.

We update occupancy density per cell:

```
densityPPM_next =
  clamp( densityPPM + growthPPM - mortalityPPM )
```

Growth depends on:

* suitability
* carrying capacity
* trophic pressure (later)

Mortality depends on:

* low suitability
* predation pressure (if available)
* climate shock events

Density is quantized.

Below `extinctionThresholdPPM` → remove cell from sparse occupancy.

Emit `LOCAL_EXTINCTION` if a cell drops out.

---

# 9) Adaptive Radiation Hook

Refugia + colonization create isolated pockets.

When a species has:

* multiple separated refugia
* sustained isolation for N ticks

Emit:

* `ISOLATION_CLUSTER_FORMED(speciesId, clusterId)`

This event becomes the trigger for:
🔒 Adaptive Radiation & Branching (already planned)

So this solver is the *input* to branching.

---

# 10) Interaction with Civilization

When civilization emerges:

* humans (or player species) can:

  * create corridors (roads)
  * fragment habitat
  * domesticate species
  * cause invasions

This is expressed by:

* modifying suitability inputs via land cover + tags
* not special-case logic

---

# 11) Parameter Table v1

```ts
interface RefugiaParamsV1 {
  refugiumK: uint8
  refugiumSuitMinPPM: uint32
  refugiumCapMinPPM: uint32
  minRefugiumSpacingCells: uint16

  colonizeSuitMinPPM: uint32
  colonizeFrontierMinPPM: uint32
  maxExpansionsPerTick: uint32

  extinctionThresholdPPM: uint32
  survivalAreaMinPPM: uint32
  consecutiveBadTicksToCollapse: uint8

  riverCorridorBonusPPM: uint32
  mountainPenaltyPPM: uint32
  iceBlockThresholdPPM: uint32
  kExpandPPM: uint32
  kDecayPPM: uint32

  biodiversityRecoveryGatePPM: uint32
  gppRecoveryGatePPM: uint32
}
```

Recovery gate defaults (v1):
* `biodiversityRecoveryGatePPM = 800_000`
* `gppRecoveryGatePPM = 700_000`

---

# 12) Dashboard Requirements

Refugia dashboard must show:

* current range map per species (sparse overlay)
* refugia markers + radii
* colonization frontier ring
* time-series:

  * occupied area
  * mean suitability
  * number of refugia
* event trace list:

  * collapse → refugia → re-expand

Onboarding explains:

* why refugia happen
* why rivers matter
* why mountains split
* why snowball events create bottlenecks

---

## ✅ Result

You can now tell believable planet-life history:

* climate shock happens
* most of a species dies out
* a few pockets survive
* the planet warms
* species spreads back
* isolated pockets split lineages
* biodiversity rebounds
* civilizations eventually show up

All deterministic, all typed, all cheap.

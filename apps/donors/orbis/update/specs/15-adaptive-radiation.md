# Adaptive Radiation & Evolutionary Branching v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

This layer is where your species set **changes shape** over deep time, but we keep it cheap and deterministic.

No genomes. No mutations.
Only **module swaps + branching rules** driven by **niche opportunity** and **environmental pressure**.

---

## Purpose

When the planet changes (or niches open), the biosphere should:

* diversify (radiation)
* specialize (branching)
* converge on stable strategies
* sometimes simplify after collapses

All without simulating individuals.

---

## 1. Timebase

Runs on the **biosphere domain clock** (default: yearly) but only *triggers* on events.

### Trigger events (LOCKED)

* `MassExtinctionEvent`
* `BiomeInvalidated`
* `HydrologyInvalidated`
* `MagnetosphereChanged` (if severity high)
* `TectonicsEpochChanged`

---

## 2. Core Concept: Niche Slots

A "niche" is a tuple:

```ts
type Niche = {
  biome: BiomeId
  trophic: TrophicLevel
  habitat: Habitat   // Ocean | Coast | Land | Subsurface | Sky
}
```

For each niche we compute:

```ts
nicheCapacity01  // energy-derived cap for that niche
nicheOccupancy01 // sum of populations of species assigned to that niche
nicheGap01 = clamp01(nicheCapacity01 - nicheOccupancy01)
```

---

## 3. Radiation Conditions (When branching happens)

Adaptive radiation can occur only if:

```
nicheGap01 > 0.10
```

and either:

* a dominant species is removed (extinction)
* biome map shifts significantly
* new habitat becomes available (e.g., land colonization)

### 3.1 Branch Event Envelope (LOCKED)

```ts
type LineageId = uint32
type BranchId = uint32

interface BranchEvent {
  branchId: BranchId
  parentId: SpeciesId
  childId: SpeciesId
  trigger: "Isolation" | "VacantNiche" | "EnvironmentalShift" | "FounderEvent"
  reasonCodes: uint16[]
  seed: uint64
  tick: AbsTime
  anchorCellId: uint32
}
```

### 3.2 Isolation Candidate Contract

```ts
interface IsolationCluster {
  clusterId: uint32
  speciesId: SpeciesId
  coreCells: uint32[]
  separationDistanceCells: uint16
  persistenceTicks: uint16
}
```

Eligible candidate:

* `persistenceTicks >= isolateTicksMin`
* `separationDistanceCells >= isolateDistMinCells`

---

## 4. Candidate Parent Selection

For each niche with gap:
Pick up to `K=2` parents from the closest niches by:

Score (LOCKED):

```
parentScore =
  (population01) *
  (adaptability01) *
  (climateMatch01)
```

Tie-break: stable sort by `SpeciesId`.

No randomness.

---

## 5. Branch Operation (Deterministic)

A branch creates a new species genome by applying **exactly one** of these operations:

```ts
enum BranchOp {
  AddModule,
  SwapModule,
  ShiftHabitat,
  ShiftRole
}
```

Selection rule (LOCKED order):

1. If niche requires missing adaptation → `AddModule`
2. Else if competition high → `SwapModule`
3. Else if habitat mismatch → `ShiftHabitat`
4. Else → `ShiftRole`

---

### 5.1 Module Mutation Rules

#### AddModule

* Add 1 module that directly improves niche fit
* Must respect module prerequisites
* Must keep total modules ≤ 8 (hard cap)
* If cap exceeded, demote by removing weakest module (see §6)

#### SwapModule

* Replace 1 module with a better-fit module
* Must not violate prerequisites of remaining modules

---

### 5.2 Habitat Shift Rules

Allowed habitat transitions (LOCKED):

* Ocean → Coast
* Coast → Land
* Land → Sky (only if FlightCapability possible)
* Any → Subsurface (if BurrowingCapability possible)

This creates your "land colonization" arc naturally when conditions allow.

---

### 5.3 Role Shift Rules

Role transitions allowed only within trophic adjacency (LOCKED):

* Producer ↔ Producer (specialize)
* PrimaryConsumer ↔ PrimaryConsumer
* SecondaryConsumer ↔ SecondaryConsumer
* SecondaryConsumer → Apex (rare)
* Decomposer stays Decomposer

No Producer → Apex nonsense.

---

## 6. Genome Simplification (Anti-bloat)

When environment worsens, specialization is punished.

If:

```
EnvironmentalShiftSeverity01 > 0.5
```

Then species undergo deterministic pruning:

* remove 1 highest-cost module (flight, centralized brain, mineralization first)
* unless it is required for survival in that habitat

Priority removal (LOCKED):

1. FlightCapability
2. CentralizedBrain
3. MineralizedSupport
4. Exoskeleton
5. VascularTransport
6. anything else non-required

This keeps the system from exploding into overfit snowflakes.

---

## 7. Speciation Budget (Performance Lock)

Per trigger event, you can create at most:

```
maxNewSpecies = 12
```

And per niche:

```
maxNewSpeciesPerNiche = 2
```

This prevents runaway branching.

### 7.1 Lineage Core Constraints

```ts
interface LineageCore {
  lineageId: LineageId
  rootSpeciesId: SpeciesId
  lockedTagMask: TagMask
  morphSpaceId: uint16
}
```

Lineages constrain trait/module variation space while preserving core identity.

### 7.2 Per-Lineage Cooldown (LOCKED)

In addition to global quota and per-niche limits:

```
minTicksBetweenBranchesSameLineage
```

must be enforced to prevent lineage spam.

---

## 8. Population Seeding for New Species

New species starts small, taking only from the niche gap:

```
seedPop = min(0.02, nicheGap01 * 0.3)
```

Parent population is reduced accordingly:

```
parentPop -= seedPop
childPop = seedPop
```

This conserves occupancy and avoids artificial creation of biomass.

### 8.1 Local Viability Test (LOCKED)

Before child species is finalized, run a bounded local viability simulation:

* radius: `localTestRadiusCells`
* duration: `localTestTicks`
* model: existing population + trophic constraints only

Child species is instantiated only if:

* habitat support exists near anchor
* energy support exists for its trophic role
* density remains above minimum viable threshold after local test

All inputs are deterministic, so pass/fail is deterministic.

---

## 9. Convergence Rule (Speciation Merge)

If two species become near-identical (same trunk + same module set + same niche):

Merge them deterministically:

* keep the one with lower SpeciesId
* sum populations
* archive merged id as alias

This prevents duplicate clutter.

---

## 10. Extinction Pressure Coupling

Species extinction risk increases when:

* energy deficit at its trophic level persists
* climate mismatch persists
* radiationStress exceeds tolerance

This is already covered by your population model; here we add:

If a niche has persistent deficit:

```
noRadiationInThatNiche = true
```

i.e., no new speciation there until stability returns.

---

## 11. Outputs

This system outputs only:

* new species records (module + tag deltas)
* updated SpeciesClusters (population reallocation)
* updated Bestiary entries (new names)
* archived merges/extinctions

No direct changes to climate/hydro.

### 11.1 Evolution Parameter Table v1

```ts
interface EvolutionParamsV1 {
  isolateTicksMin: uint16
  isolateDistMinCells: uint16
  deltaBudgetPPM: uint32
  founderDensityPPM: uint32
  minHabitatAreaPPM: uint32
  localTestRadiusCells: uint8
  localTestTicks: uint8
  maxNewSpeciesPerBioTick: uint16
  minTicksBetweenBranchesSameLineage: uint16
  nicheVacancyThresholdPPM: uint32
}
```

---

## 12. Determinism Guarantee

No RNG. Ever.

All selection uses:

* sorted lists
* fixed thresholds
* fixed op priority
* stable hashing for naming

Given same world + AbsTime: identical tree.

---

## What you now have

* Energy constraints (trophic)
* Stable population dynamics
* Deterministic branching + radiation
* Land/ocean transitions
* Specialization vs simplification
* Merge to prevent bloat
* Performance caps

This is enough to generate:

* Cambrian-like radiations
* post-extinction rebounds
* colonization arcs
* fantasy "lineage bursts" after cataclysms

---

## Integration

This system integrates with:

* **Mass Extinction Engine** - Recovery window boosts branching budget
* **Refugia & Colonization** - Founder effects increase divergence potential
* **Population Dynamics** - Population seeding and competition
* **Trophic Energy Model** - Niche capacity computation
* **Bestiary** - New species entries and naming
* **Nomenclature** - Scientific names for new species

---

## Performance

O(Nniches × Kparents) per trigger event.
Trigger events are rare (geologic scale).
Negligible overhead.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

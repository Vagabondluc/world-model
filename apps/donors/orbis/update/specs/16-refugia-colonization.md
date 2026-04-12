# Refugia & Colonization System v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

This is the final missing ecological mechanic.

Without refugia, extinction is total wipe.
Without colonization, radiation has no spatial logic.

We lock it clean and deterministic.

---

## Purpose

After a mass extinction or biome collapse:

* Some regions act as survival pockets.
* Species persist there.
* They later recolonize empty biomes.
* Radiation emerges from refugia, not everywhere.

No agent movement.
No map pathfinding.
Pure biome-level diffusion.

---

## 0.1 Anchor Flow (O(1) View)

```text
extinction handoff
-> refugia detection
-> compression phase
-> expansion gate open
-> diffusion frontier update
-> recolonization events
-> recovery completion check (biodiversity + GPP lag)
```

---

## Core Concept

Each biome has:

```ts
interface RefugiaBiomeState {
  stability01: number
  productivity01: number
  radiation01: number
  waterAvailability01: number
}
```

Refugia form where:

* mortality multipliers were lowest
* environmental stability remains > threshold

---

## 1. Refugia Detection (LOCKED)

After extinction event:

For each biome:

```
refugiaScore =
  stability01 *
  (1 - radiation01) *
  waterAvailability01 *
  productivity01
```

If:

```
refugiaScore > 0.6
```

Biome becomes refugium.

Store:

```ts
refugiaBiomes: BiomeId[]
```

---

## 2. Species Survival Mapping

For each species:

Check:

```
speciesSurvival01 =
  Σ (populationInBiome * refugiaFlag)
```

If survival > 0.01:

Species survives in refugia only.

Else:

Species extinct.

---

## 3. Refugia Population Compression

Surviving species are compressed:

```
population01 = min(population01, 0.05)
```

Concentrated but not dominant.

This prevents immediate bounce-back.

Compression phase semantics:
* Duration: until `globalStability01 > 0.5` or explicit niche-gap trigger (see section 4).
* During compression, no outward colonization is allowed.

---

## 4. Colonization Trigger

Colonization begins when:

```
globalStability01 > 0.5
AND
recoveryWindowActive
```

Or when:

```
nicheGap01 > 0.15
```

Expansion phase starts only after one trigger condition is true.

---

## 5. Colonization Spread Model (Deterministic Diffusion)

Each epoch:

For each surviving species:

```
colonizationPotential =
  adaptability01 *
  (climateMatch01) *
  (1 - competitionPressure01)
```

If:

```
colonizationPotential > 0.4
```

Then:

Species expands into one adjacent suitable biome.

Adjacency defined by:

* Ocean ↔ Coast
* Coast ↔ Land
* Land ↔ Sky
* Land ↔ Subsurface

No diagonals.

### 5.1 Migration Frontier Diffusion Kernel (LOCKED)

At biome level, spread uses deterministic weighted frontier update:

```
FrontierNext[b] =
  clamp01(
    FrontierCurrent[b]
    + k_expand * sum(FrontierCurrent[n] * ConnectivityPPM[n->b])
    - k_decay * FrontierCurrent[b]
  )
```

Where:
* `b` is target biome.
* `n` are adjacent source biomes under the locked adjacency graph.
* `ConnectivityPPM` includes habitat compatibility and barrier penalties.
* `k_expand` and `k_decay` are locked fixed-point constants.

Colonization into biome `b` is allowed only if:

```
FrontierNext[b] >= 0.4
AND colonizationPotential[b] > 0.4
```

---

## 6. Spread Amount

Per epoch expansion:

```
deltaPop = min(0.03, nicheGap01 * 0.5)
```

Add to new biome population.
Subtract from refugia proportionally.

---

## 7. Founder Effect Modifier

Newly colonized biome gets:

```
adaptability01 += 0.05
divergencePotential01 += 0.1
```

This increases chance of adaptive radiation.

Automatically integrates with branching system.

---

## 8. Competitive Exclusion Rule

If two species attempt colonization into same niche:

Winner = highest:

```
colonizationScore =
  adaptability01 *
  metabolicEfficiency *
  priorPopulationShare
```

Loser cannot retry that niche for 5 epochs.

Deterministic.

---

## 9. Reforestation / Producer Priority Rule

Producers always colonize first.

If producerCoverage01 < 0.2:

Colonization attempts by consumers are blocked.

Food chain rebuilds bottom-up.

---

## 10. Subsurface and Ocean Refugia Special Rule

These habitats are:

* lowest mortality during radiation
* highest refugia probability

Thus deep ocean and caves act as long-term biodiversity banks.

This mirrors real-world survival patterns.

---

## 11. End of Recovery

Recovery window ends when:

```
globalBiodiversity01 >= preExtinctionLevel * 0.8
```

At that point:

* stabilityFactor returns to normal
* radiationBoost removed
* colonization rate reduced

And ecological function lag gate must be satisfied:

```
GPP01 >= preExtinctionGPP01 * 0.7
```

This enforces slower ecosystem function recovery than taxonomic rebound.

---

## What This Achieves

* Realistic survival pockets
* Deep-ocean life persistence
* Land recolonization arcs
* Cambrian-style bursts
* Founder effects
* Geographic memory
* Stable regrowth patterns

Without spatial simulation.

---

## Integration

This system integrates with:

* **Mass Extinction Engine** - Provides extinction events that trigger refugia formation
* **Adaptive Radiation** - Founder effects increase branching potential
* **Population Dynamics** - Population compression and spread
* **Trophic Energy Model** - Producer priority rule enforcement

---

## Performance

O(Nspecies × Nbiomes) per epoch.
Refugia detection is O(Nbiomes) per extinction event.
Colonization is O(NsurvivingSpecies) per epoch.

Negligible overhead.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

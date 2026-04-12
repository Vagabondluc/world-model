# Trophic Web Energy Model v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

This is **energy flow only**.
Population dynamics come later.

---

## Purpose

Without this, ecosystems are cosmetic.
With this, they become constrained systems.

We keep it:

* Deterministic
* Lightweight
* Stable at planetary scale
* Not agent-based

---

## 1. Core Principle

Energy flows one direction:

```
Star → Producers → Consumers → Apex → Decomposers → Nutrient Recycling
```

Energy is **not conserved perfectly** across trophic levels.

We apply the ecological 10% rule.

---

## 2. Global Primary Productivity (GPP)

We derive total available biosphere energy.

### 2.1 Biome NPP/GPP Mapping (Annual Benchmarks)

Energy budgets (PPM) are scaled based on the following benchmark NPP values ($g\ C\ m^{-2}\ yr^{-1}$):

| Biome | Benchmark NPP | PPM Scale (1M = 2200) |
| :--- | :--- | :--- |
| **Tropical Forest** | 2200 | 1,000,000 |
| **Savanna** | 900 | 409,091 |
| **Temperate Forest** | 1250 | 568,182 |
| **Boreal Forest** | 800 | 363,636 |
| **Grassland** | 600 | 272,727 |
| **Tundra** | 140 | 63,636 |
| **Ocean (Open)** | 125 | 56,818 |
| **Desert** | 90 | 40,909 |
| **Polar Ice** | 10 | 4,545 |

### 2.2 Conversion to Carrying Capacity (K)

```ts
// Dry Biomass Conversion Ratio (approx 2.5x carbon)
const NPP_TO_BIOMASS_PPM: uint32 = 2_500_000 

K_raw = Σ (BiomeArea[i] * BiomeNPP[i])
K_biomass = (K_raw * NPP_TO_BIOMASS_PPM) / 1_000_000
GPP = K_biomass * temperatureFitness * radiationStress
```

---

## 3. Trophic Levels (Locked)

We compress all life into 5 tiers:

```ts
enum TrophicLevel {
  Producer,
  PrimaryConsumer,
  SecondaryConsumer,
  Apex,
  Decomposer
}
```

Species assigned automatically from role.

---

## 4. Energy Transfer Efficiency

We lock transfer efficiency:

```
TRANSFER_EFFICIENCY = 0.1   // 10%
```

Energy budget:

```
Level 0 (Producers) = GPP
Level 1 = GPP * 0.1
Level 2 = GPP * 0.01
Level 3 = GPP * 0.001
```

Hard cap. No exceptions.

### 4.1 Typed Efficiency Table (LOCKED)

```ts
interface TrophicEfficiencyV1 {
  producerToHerbivorePPM: uint32
  herbivoreToCarnivorePPM: uint32
  carnivoreToApexPPM: uint32
  decomposerReturnPPM: uint32
}
```

Defaults:

* producer -> herbivore: `100_000`
* herbivore -> carnivore: `100_000`
* carnivore -> apex: `100_000`
* decomposer return: `300_000`

### 4.2 Global Trophic Parameters (LOCKED)

```ts
interface TrophicGlobalsV1 {
  k0PPM: uint32
  k1PPM: uint32
  k2PPM: uint32
  minEnergyPPM: uint32
  maxScaleDownPPM: uint32
}
```

---

## 5. Level Capacity Constraint

Each trophic level has a maximum total population capacity:

```ts
levelCapacity01 = energyAtLevel
```

All species at that trophic level must sum to ≤ capacity.

If exceeded → automatic starvation pressure.

### 5.1 Cell-Level Pyramid Caps (LOCKED)

For each cell/biome projection:

```
B0_max = min(CarryingCapacity, k0 * E_in)
B1_max = min(CarryingCapacity, k1 * E_in * eff01)
B2_max = min(CarryingCapacity, k2 * E_in * eff01 * eff12)
```

Where:

* `E_in` is effective productivity budget
* `eff01`, `eff12` are transfer efficiencies
* `k*` are scaling constants from `TrophicGlobalsV1`

Population updates must clamp to these caps before final write.

---

## 6. Species Energy Demand

Each species has metabolic cost:

```ts
metabolicCost01 =
  baseCost *
  complexityMultiplier *
  activityMultiplier
```

Where:

* Producers → low cost
* Apex predators → high cost
* CentralizedBrain increases cost
* Flight increases cost

---

## 7. Population Ceiling Rule

For each species:

```
maxPopulation01 =
  (energyAvailableAtLevel / totalDemandAtLevel) * currentShare
```

If population exceeds ceiling:

```
population01 -= starvationFactor
```

Deterministic shrink.

### 7.1 Deterministic Demand/Supply Normalization (LOCKED)

Within each cell:

1. Compute predator demand per prey pool
2. Compute available supply per prey pool
3. If demand exceeds supply, downscale all predator intakes proportionally

```
scalePPM = min(1_000_000, (supplyPPM * 1_000_000) / demandPPM)
intake_i = (intake_i * scalePPM) / 1_000_000
```

This prevents free-energy bugs and keeps intake order-independent.

### 7.2 Omnivore Dual-Pool Constraint

Omnivores draw from plant and prey pools independently.
If one pool is under-supplied, total intake is reduced.
No implicit substitution unless explicitly enabled by tag tables.

---

## 8. Decomposer Recycling Loop

Decomposers receive:

```
deadBiomass = totalPopulationLossAcrossLevels
```

They convert it to:

```
nutrientReturn01
```

Which increases next tick GPP slightly:

```
GPP += nutrientReturn01 * recyclingEfficiency
```

Default:

```
recyclingEfficiency = 0.05
```

### 8.1 Optional Detritus Scalar (Reserved)

Reserve cell field:

* `DetritusPoolCell` (PPM)

Deterministic rule:

* mortality adds to detritus
* decomposers consume detritus
* consumed detritus returns a fraction to next-tick productivity budget

---

## 9. Collapse Conditions

If:

```
Producer population < 0.1
```

Then:

* All higher levels decay exponentially.

If:

```
Apex > energy cap for 3 epochs
```

Predator crash event triggered.

---

## 10. Stability Modifier

Biodiversity increases resilience.

If number of species at level > 3:

```
stabilityBonus = +0.05 to level capacity
```

Encourages diversification.

---

## 11. Magnetosphere Interaction

If radiation spike:

* Producers lose efficiency first.
* Apex lose population second.

Radiation multiplies:

```
GPP *= (1 - radiationStress01)
```

Direct link between space weather and food web.

### 11.1 Climate/Water Effective Energy Multiplier

Use quantized habitat multipliers before trophic allocation:

```
E_effective =
  E_in
  * HabitabilityTempPPM
  * HabitabilityPrecipPPM
  * (1_000_000 - IceFracPPM)
  / 1_000_000^2
```

All multipliers must be table-driven by quantized climate bands.

---

## 12. Snowball Scenario

If temperatureFitness < 0.3:

```
GPP *= 0.2
```

Only microbial producers survive.

Higher trophic levels collapse.

---

## 13. Energy Accounting Integrity Rule

At end of epoch:

```
Σ populationEnergyDemand ≤ Σ availableEnergy
```

If not:

Auto-scale down populations proportionally.

This guarantees no runaway growth.

If violation remains after clamps:

* emit `ENERGY_LIMITED`
* apply proportional downscale capped by `maxScaleDownPPM`

---

## What This Gives You

* Real ecological constraint
* Automatic apex rarity
* Energy pyramids
* Natural extinction cascades
* Recovery after collapse
* Producer importance
* No per-agent simulation

---

## Performance

Only per-trophic-level aggregation required.

No N² species interactions.

O(n) per level.

Extremely light.

---

## Engine Status

You now have:

* Climate physics
* Magnetosphere gating
* Carbon cycling
* Biosphere capacity
* Species archetypes
* Naming system
* Bestiary projection
* Trophic energy constraints

This is now a real planet-scale life simulator.

---

## Integration

This system integrates with:

* **Population Dynamics** - Carrying capacity and energy constraints
* **Adaptive Radiation** - Niche capacity computation
* **Mass Extinction Engine** - Producer collapse cascades
* **Refugia & Colonization** - Producer priority rule
* **Bestiary** - Trophic level assignment

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

# Population Dynamics Model v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

This sits **on top of** the Trophic Energy Model.

It controls:

* oscillations
* predator–prey stability
* extinction cascades
* recovery

But it must remain:

* deterministic
* aggregate (no individuals)
* stable at planetary scale
* cheap

We do NOT implement raw Lotka–Volterra equations directly (they explode numerically).
We implement a **bounded LV-inspired system**.

## 0. Terminology Alignment (Scientific)

This model consumes outputs from the **Trophic Web Energy Model** (`docs/12-trophic-energy.md`).

*   **Carrying Capacity ($K$):** The biomass equivalent of the available energy budget (GPP) computed in the energy layer.
  * **Handoff Clause:** $K$ MUST be derived from the authoritative NPP benchmarks defined in [`docs/12-trophic-energy.md`](./12-trophic-energy.md#21-biome-nppgpp-mapping-annual-benchmarks).
*   **Population ($P$):** The realized numerical density of a species, expressed as a fraction ($0..1$) of its share of the current trophic level's $K$.

---

## 1. Core Representation

Each species has:

```ts
population01: number      // normalized share 0..1
growthRate: number        // intrinsic
predationPressure01: number
competitionPressure01: number
```

No raw counts.
Everything normalized relative to trophic capacity.

---

## 2. Intrinsic Growth

Base logistic growth:

```
dP = r * P * (1 - P / carryingCapacity)
```

Where:

* `r` = intrinsic growth rate
* `carryingCapacity` = from trophic energy model

We clamp:

```
r ∈ [0.01, 0.2] per epoch
```

Producers have highest r.
Apex lowest r.

---

## 3. Predator–Prey Coupling

For each predator species:

```
predationGain =
  attackRate *
  predatorPopulation *
  preyPopulation
```

Prey loss:

```
preyLoss = predationGain
```

Predator benefit:

```
predatorGrowth += predationGain * efficiency
```

Where:

```
efficiency = 0.1   // same 10% transfer
```

This mirrors trophic transfer.

---

## 4. Stability Dampening (Critical)

To avoid chaotic oscillations:

We apply a damping term:

```
dP *= stabilityFactor
```

Where:

```
stabilityFactor = 1 - ecosystemStress01
```

And:

```
ecosystemStress01 =
  abs(totalDemand - totalEnergyAvailable)
```

This prevents runaway cycles.

---

## 5. Competition Model (Same Trophic Level)

Species at same level compete for energy.

Competition pressure:

```
competitionPressure =
  overlapFactor *
  (P_i / totalLevelPopulation)
```

OverlapFactor derived from:

* habitat similarity
* role similarity

If overlap > 0.7 → high competition.

---

## 6. Extinction Rule

If:

```
population01 < 0.01
```

For 3 consecutive epochs:

→ species extinct.

Add fossil record entry.

---

## 7. Recovery Rule

If:

* predator extinct
* prey energy surplus

Prey receives temporary growth bonus:

```
reboundBoost = 0.05
```

Decay over 5 epochs.

---

## 8. Oscillation Control

We enforce bounded oscillation:

```
maxPopulationChangePerEpoch = 0.2
```

Clamp all updates.

No explosive swings.

---

## 9. Environmental Shock Coupling

EnvironmentalShiftSeverity01 multiplies:

```
effectiveGrowthRate = r * (1 - severity)
```

Radiation spike:

* reduces prey first
* predators starve next

Snowball:

* producers drop
* cascade upward

---

## 10. Sophont Override Rule

If species tier == Sophont:

They partially decouple from trophic constraints:

```
foodEfficiencyBonus = +0.05
```

They can:

* domesticate prey
* stabilize population

This is civilization hook.

---

## 11. Epoch Update Order (Locked)

Each epoch:

1. Apply environmental modifiers
2. Apply logistic growth
3. Apply predation transfer
4. Apply competition pressure
5. Apply trophic energy clamp
6. Apply extinction checks
7. Normalize level totals

Order matters. Fixed.

---

## 12. Determinism Guarantee

No randomness.

All outcomes pure function of:

```
previousState + planetState
```

Replayable.

---

## What This Gives You

* Predator–prey cycles
* Energy constraint compliance
* Extinction cascades
* Recovery dynamics
* Niche competition
* Stable long-term simulation

Without chaotic math.

---

## Current Engine Depth

You now have:

Planet physics
→ Climate
→ Biosphere capacity
→ Species generation
→ Trophic energy
→ Population oscillation

This is approaching ecosystem simulator territory.

---

## Integration

This system integrates with:

* **Trophic Energy Model** - Carrying capacity and energy constraints
* **Adaptive Radiation** - Population seeding for new species
* **Mass Extinction Engine** - Mortality application and stability penalties
* **Bestiary** - Population status and conservation status
* **Refugia & Colonization** - Population compression and spread

---

## Performance

O(Nspecies) per epoch.
No N² interactions.
Lightweight.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

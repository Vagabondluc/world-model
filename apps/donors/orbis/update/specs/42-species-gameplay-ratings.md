# 🔒 Species Gameplay Ratings System v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Overview

The Species Gameplay Ratings System is a **read-only projection layer** that computes deterministic gameplay profiles from [`SpeciesTemplate`](docs/08-species-template-procedural-biology.md:284) data. It provides actionable ratings used by:

* Bestiary UI
* Encounter generation
* Resource/harvest systems
* Domestication & mounts
* Hazards & disease-like risks
* Narrative importance
* D&D 6-second tick and OSR turn play

This system is a **projection layer** that:
* Must not mutate core simulation
* Must be reproducible
* Must explain itself

---

## 1. SpeciesGameplayProfile Interface

The core output of the ratings system:

```ts
interface SpeciesGameplayProfile {
  speciesId: SpeciesId
  time: AbsTime
  biomeId?: uint64

  // Core ratings 0..1_000_000
  threatPPM: uint32
  nuisancePPM: uint32
  usefulnessPPM: uint32
  domesticationPPM: uint32
  rarityPPM: uint32

  // Encounter tuning
  encounter: {
    aggressionPPM: uint32
    lethalityPPM: uint32
    pursuitPPM: uint32
    stealthPPM: uint32
    groupTendencyPPM: uint32
    territorialPPM: uint32
  }

  // Loot / interaction
  yield: {
    foodPPM: uint32
    materialPPM: uint32
    medicinePPM: uint32
    toxinPPM: uint32
  }

  // Soft flags for content generation (tags, not text)
  gameplayTags: TagInstance[]   // e.g., BossCandidate, PackHunter, Pest, Sacred
  breakdownHash64: uint64
  ratingVersion: uint16
}
```

All values are **quantized**. No floats are used.

---

## 2. Rating Version

```ts
RATING_VERSION = 1
```

Bump this version if formulas change. This ensures reproducibility and allows for version migration.

---

## 3. Input Contract (Hard Rule)

Ratings depend only on:

* [`SpeciesTemplate`](docs/08-species-template-procedural-biology.md:284) (tags, params, trophic role, habitat prefs)
* WorldSnapshot(time) (quantized)
* LocalContext (biomeId, regionId, seasonId) (quantized)
* NAMING_VERSION / RATING_VERSION
* Stateless RNG hash for *selection* only (not scoring)

**No hidden sources** are allowed. All inputs must be explicit and traceable.

---

## 4. Core Derived Factors

We define normalized factors (0..1_000_000) derived from the [`SpeciesTemplate`](docs/08-species-template-procedural-biology.md:284):

| Factor | Source | Description |
|--------|--------|-------------|
| `Size` | `bodySizePPM` | Physical mass and scale |
| `Mobility` | `mobilityPPM` | Movement capability |
| `Aggro` | `aggressionPPM` | Base aggression level |
| `Intel` | `intelligencePPM` | Cognitive capability |
| `Social` | `socialityPPM` | Social behavior tendency |
| `Resilience` | `resiliencePPM` | Durability and survivability |
| `Role` | `trophicRole` | Ecological role (via mapping table) |

### Tag-Derived Boosts

Additional factors come from tags using the **Tag Interaction Math Contract** (see [`docs/41-tag-interaction-math.md`](docs/41-tag-interaction-math.md)):

* Venom
* PackHunter
* Ambush
* Flight
* Burrowing
* Armor
* Camouflage
* DiseaseVector
* And more...

These boosts are computed using ActionAffinity-style tables but for rating targets.

---

## 5. Threat Rating (LOCKED FORMULA)

Threat is a function of:
* Ability to harm
* Ability to reach
* Ability to survive
* Intent/trigger likelihood

### Calculation Steps

```ts
// Step 1: Compute CombatPower
CombatPower =
  wS*Size + wM*Mobility + wA*Aggro + wR*Resilience
  + tagBoosts(venom, armor, pack, ambush)

// Step 2: Compute Reach
Reach =
  Mobility + tagBoosts(flight, aquaticSpeed, burrow)

// Step 3: Compute Intent
Intent =
  Aggro + Territorial + HungerPressureProxy

// Step 4: Compute final threat
threatPPM = clampPPM(
  (CombatPower * Reach) / 1_000_000
  * (500_000 + Intent/2) / 1_000_000
)
```

### Weight Constants

All weights `w*` are PPM constants defined in a table:

```ts
const THREAT_WEIGHTS = {
  size: 200_000,        // wS
  mobility: 150_000,    // wM
  aggression: 300_000,  // wA
  resilience: 250_000   // wR
}
```

**Threat is always deterministic.** No random factors are involved.

---

## 6. Nuisance Rating

Nuisance = how likely it is to disrupt settlements without being a "fight."

### Input Factors

* Scavenger behavior
* Reproduction rate
* Disease/toxin tags
* Crop damage tags
* Stealth/infiltration traits

### Formula

```ts
nuisancePPM =
  f(reproductionRate, stealth, diseaseVector, omnivore, urbanTolerance)
```

Use additive/multipliers, then clamp to 0..1_000_000.

### Example Implementation

```ts
nuisancePPM = clampPPM(
  reproductionRate * 0.4
  + stealth * 0.3
  + diseaseVectorTag * 0.2
  + urbanTolerance * 0.1
)
```

---

## 7. Usefulness Rating

Usefulness depends on yields + ease of access:

```ts
usefulnessPPM =
  YieldValue(food, material, medicine)
  * (1_000_000 - dangerPenalty)
  * accessibility(biome proximity, activity cycle)
```

### YieldValue Calculation

YieldValue is computed from tags:

* Fatty
* Edible
* LeatherHide
* Horn
* Bone
* Fiber
* Resin
* AntivenomSource
* And more...

### Danger Penalty

```ts
dangerPenalty = threatPPM * 0.5 + toxinPPM * 0.5
```

### Accessibility Factor

```ts
accessibility = biomeProximity * activityCycleMatch
```

---

## 8. Domestication Rating

Domestication requires:

* Sociality
* Manageable aggression
* Reasonable size/mobility
* Compatible diet
* Low panic/flightiness
* Breeding feasibility (reproduction rate not too low)

### Formula

```ts
domesticationPPM =
  Social * (1_000_000 - Aggro)
  * (1_000_000 - FlightinessTag)
  * dietCompatibility
  * juvenileBondingTagBoost
```

### Tag Modifiers

If tags include:

| Tag | Effect |
|-----|--------|
| `PackHunter` | Increases or decreases depending on `Trainable` tag |
| `Trainable` | Boosts domestication rating |
| `Solitary` | Reduces domestication rating |

This is **table-driven** and fully configurable.

---

## 9. Rarity Rating (Encounter Frequency)

Rarity is computed from simulation signals, not random assignment.

### Input Factors (from Ecology Domain)

* Population density in biome
* Habitat suitability
* Recent extinction pressure
* Refugia status

### Formula

```ts
rarityPPM = clampPPM(
  1_000_000 - abundancePPMAdjusted
)
```

Where `abundancePPMAdjusted` is derived from:

```ts
abundancePPMAdjusted =
  populationDensity * habitatSuitability
  * (1_000_000 - extinctionPressure)
  * refugiaBoost
```

**Rarity is not "random."** It's an interpretation of population state.

---

## 10. Encounter Parameters (D&D/OSR Friendly)

These parameters provide tuning knobs for encounter generation without hardcoding Challenge Rating (CR).

### aggressionPPM

```ts
aggressionPPM = baseAggression + territorialBoost + hungerPressure(season)
```

### lethalityPPM

```ts
lethalityPPM = threatPPM * humanoidSusceptibilityModifier
```

Where `humanoidSusceptibilityModifier` is based on tags like:
* `ManEater` (high multiplier)
* `NonPredatory` (low multiplier)

### pursuitPPM

```ts
pursuitPPM = mobility + enduranceTags
```

### stealthPPM

```ts
stealthPPM = camouflage + nocturnal + burrow
```

### groupTendencyPPM

```ts
groupTendencyPPM = sociality + packTags
```

### territorialPPM

```ts
territorialPPM = territoryNeed + nestingTags
```

**All parameters are derived deterministically.**

---

## 11. Yield System

The yield system defines what resources can be harvested from a species:

```ts
yield: {
  foodPPM: uint32
  materialPPM: uint32
  medicinePPM: uint32
  toxinPPM: uint32
}
```

### Yield Tag Mapping

| Yield Type | Contributing Tags |
|------------|-------------------|
| `foodPPM` | Edible, Fatty, Meaty, Nutritious, Sweet |
| `materialPPM` | LeatherHide, Horn, Bone, Fiber, Resin, Shell |
| `medicinePPM` | AntivenomSource, HealingSalve, MedicinalPlant |
| `toxinPPM` | Venom, Poisonous, Toxic, Irritant |

Each tag contributes additively to the yield rating.

---

## 12. Gameplay Tags (Projection Tags)

These are tags in the **Narrative/Gameplay namespace**, not biology tags.

### Tag Assignment

Gameplay tags are assigned by thresholds on the computed ratings + specific traits:

| Tag | Assignment Rule |
|-----|-----------------|
| `BossCandidate` | threatPPM > 900_000 AND size > 800_000 |
| `PackHunter` | groupTendencyPPM > 700_000 AND aggressionPPM > 600_000 |
| `Pest` | nuisancePPM > 700_000 AND threatPPM < 300_000 |
| `MountCandidate` | domesticationPPM > 600_000 AND mobility > 500_000 |
| `Sacred` | rarityPPM > 800_000 AND usefulnessPPM > 700_000 |
| `Invasive` | reproductionRate > 800_000 AND urbanTolerance > 700_000 |
| `ApexThreat` | threatPPM > 850_000 AND Role == ApexPredator |
| `EasyPrey` | threatPPM < 200_000 AND foodPPM > 600_000 |
| `ValuableHide` | materialPPM > 800_000 AND LeatherHide tag |
| `ToxicHazard` | toxinPPM > 700_000 |
| `DiseaseRisk` | diseaseVectorTag present AND nuisancePPM > 500_000 |

### Trace Logging

All assignments emit trace in logs (optional):

```
GAMEPLAY_TAG_ASSIGNED(speciesId, tagId, reason, time)
```

---

## 13. Contextual Modifiers (Biome/Season)

A species' profile changes in context:

* Winter increases hunger pressure
* Breeding season increases aggression
* Drought increases settlement proximity

### Modifier Requirements

These modifiers must be:
* Quantized
* Table-driven per biome tag + season id
* Applied after base ratings

### No Freehand Logic

```ts
interface ContextModifier {
  biomeTag: TagId
  seasonId: SeasonId
  rating: keyof SpeciesGameplayProfile
  modifierPPM: int32
  multiplierPPM: uint32  // 1_000_000 = 1.0x
}
```

### Example Modifier Table

```ts
const SEASON_MODIFIERS: ContextModifier[] = [
  {
    biomeTag: Tundra,
    seasonId: Winter,
    rating: 'aggressionPPM',
    modifierPPM: 200_000,
    multiplierPPM: 1_000_000
  },
  {
    biomeTag: TemperateForest,
    seasonId: Spring,
    rating: 'reproductionRate',
    modifierPPM: 150_000,
    multiplierPPM: 1_000_000
  }
]
```

---

## 14. Encounter Selection (Uses RNG but Deterministic)

When generating an encounter list:

1. Filter by habitat suitability
2. Weight by abundance (inverse rarity)
3. Select using stateless RNG hash

### Selection Algorithm

```ts
pick = hash(seed, biomeId, timeTick, encounterIndex)
```

This ensures that **encounter composition is reproducible** given the same seed and inputs.

### Encounter Weighting

```ts
encounterWeight = (1_000_000 - rarityPPM) * habitatSuitability
```

---

## 15. Explainability Contract

Profile must support breakdown for dashboard display:

* Top contributing tags
* Top contributing params
* Context modifiers applied

### Storage

```ts
// Always stored
breakdownHash64: uint64

// Optional - keep for dashboards
breakdown?: RatingBreakdown
```

### Breakdown Structure

```ts
interface RatingBreakdown {
  rating: keyof SpeciesGameplayProfile
  baseValue: uint32
  tagContributions: Array<{
    tagId: TagId
    contributionPPM: int32
  }>
  paramContributions: Array<{
    param: string
    contributionPPM: int32
  }>
  contextModifiers: Array<{
    source: string
    modifierPPM: int32
  }>
  finalValue: uint32
}
```

---

## 16. Modding Contract

Mods may:

* Add yield tags
* Add new gameplay projection tags
* Tweak rating weights via versioned tables
* Add biome/season modifier tables

Mods must respect:

* Caps
* Deterministic tables
* No new hidden state

### Mod Validation

```ts
interface ModRatingConfig {
  version: uint16
  threatWeights?: Partial<typeof THREAT_WEIGHTS>
  tagEffects?: TagEffect[]
  contextModifiers?: ContextModifier[]
  gameplayTagRules?: GameplayTagRule[]
}
```

If a mod violates caps repeatedly, the engine can auto-disable that mod's effects (deterministically) with an event log.

---

## 17. Integration Points

This system integrates with:

* **Bestiary** - Displays ratings in UI ([`docs/17-bestiary.md`](docs/17-bestiary.md))
* **Tag Interaction Math** - Computes tag effects ([`docs/41-tag-interaction-math.md`](docs/41-tag-interaction-math.md))
* **Species Template** - Source of species data ([`docs/08-species-template-procedural-biology.md`](docs/08-species-template-procedural-biology.md))
* **Deterministic RNG** - For encounter selection ([`docs/35-deterministic-rng.md`](docs/35-deterministic-rng.md))
* **Population Dynamics** - For rarity calculation ([`docs/13-population-dynamics.md`](docs/13-population-dynamics.md))

---

## 18. Example Calculation

Let's walk through a complete example for a hypothetical species.

### Species Template

```ts
const species: SpeciesTemplate = {
  bodySizePPM: 600_000,
  mobilityPPM: 700_000,
  aggressionPPM: 500_000,
  intelligencePPM: 400_000,
  socialityPPM: 300_000,
  resiliencePPM: 550_000,
  tags: [
    { tagId: PackHunter, intensity: 800_000 },
    { tagId: Camouflage, intensity: 600_000 },
    { tagId: Edible, intensity: 400_000 },
    { tagId: LeatherHide, intensity: 500_000 }
  ]
}
```

### Threat Calculation

```ts
CombatPower =
  200_000 * 600_000 + 150_000 * 700_000 + 300_000 * 500_000 + 250_000 * 550_000
  + packHunterBoost(800_000)
= 447_500_000 + 200_000
= 447_700_000

Reach =
  700_000 + 0
= 700_000

Intent =
  500_000 + 100_000 + 50_000
= 650_000

threatPPM = clampPPM(
  (447_700_000 * 700_000) / 1_000_000
  * (500_000 + 650_000/2) / 1_000_000
)
= clampPPM(313_390 * 825_000 / 1_000_000)
= clampPPM(258,546)
= 258_546
```

### Usefulness Calculation

```ts
YieldValue =
  400_000 (Edible) + 500_000 (LeatherHide)
= 900_000

dangerPenalty =
  258_546 * 0.5 + 0
= 129_273

usefulnessPPM =
  900_000 * (1_000_000 - 129_273) / 1_000_000
= 900_000 * 870_727 / 1_000_000
= 783,654
```

### Gameplay Tag Assignment

```ts
// PackHunter check
groupTendencyPPM = 300_000 + 800_000 (PackHunter) = 1_100_000
// 1_100_000 > 700_000 AND 500_000 > 600_000 = FALSE

// EasyPrey check
// 258_546 < 200_000 = FALSE

// ValuableHide check
// materialPPM = 500_000
// 500_000 > 800_000 = FALSE

// No gameplay tags assigned in this example
```

---

## 19. Performance Considerations

* Ratings are computed **on-demand** and cached
* No per-creature simulation required
* All calculations use integer arithmetic (PPM)
* Breakdown records are optional and only stored for dashboard display
* Encounter selection uses stateless hashing for reproducibility

---

## 20. Summary

With this system, your bestiary is now actionable:

* **"What is it?"** → SpeciesTemplate + BestiaryEntry
* **"How dangerous?"** → threatPPM + encounter parameters
* **"What's it good for?"** → usefulnessPPM + yield system
* **"Can we tame it?"** → domesticationPPM + gameplay tags
* **"How often do we see it here?"** → rarityPPM + contextual modifiers
* **"How does winter change it?"** → seasonal modifiers

And it stays perfectly **deterministic** and **dashboard-explainable**.

---

## Related Documentation

* [`docs/17-bestiary.md`](docs/17-bestiary.md) - Bestiary system and species display
* [`docs/41-tag-interaction-math.md`](docs/41-tag-interaction-math.md) - Tag effect calculations
* [`docs/08-species-template-procedural-biology.md`](docs/08-species-template-procedural-biology.md) - Species template structure
* [`docs/35-deterministic-rng.md`](docs/35-deterministic-rng.md) - Deterministic random number generation
* [`docs/13-population-dynamics.md`](docs/13-population-dynamics.md) - Population and rarity calculations

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

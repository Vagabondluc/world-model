# Bestiary System v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

This is not a monster manual.

This is a **planetary biodiversity index**.

---

## Purpose

The Bestiary is a **read-only projection layer** over SpeciesClusters.

It does NOT store biology.

It renders species state into:

* identity
* ecology
* threat level
* rarity
* lore hooks

---

## 1. Bestiary Entry Data Structure

```ts
interface BestiaryEntry {
  id: SpeciesId
  scientificName: string
  commonName: string
  trunk: TrunkId
  tier: LifeTier
  role: Role

  habitat: Habitat[]
  population01: number
  conservationStatus: ConservationStatus

  adaptability01: number
  radiationTolerance01: number
  climateRange: ClimateEnvelope

  interactionProfile: InteractionProfile
}
```

---

## 2. Life Tier Mapping (Locked)

Derived from modules.

| Tier      | Rule                          |
| --------- | ----------------------------- |
| Microbial | ≤2 modules                    |
| Simple    | 3–4 modules                   |
| Complex   | 5–6 modules                   |
| Sophont   | CentralizedBrain + ≥6 modules |

---

## 3. Conservation Status System

Derived from population trend.

```ts
enum ConservationStatus {
  Dominant,
  Stable,
  Vulnerable,
  Endangered,
  Collapsing,
  Extinct
}
```

Rules:

```
population01 > 0.6 → Dominant
0.3–0.6 → Stable
0.15–0.3 → Vulnerable
0.05–0.15 → Endangered
<0.05 and declining → Collapsing
0 → Extinct
```

Deterministic. No randomness.

---

## 4. Interaction Profile (Gameplay Layer)

```ts
interface InteractionProfile {
  aggression01: number
  domestication01: number
  ecologicalImpact01: number
  civilizationPotential01: number
}
```

Derived from modules:

Example:

* Carnivore + CentralizedBrain → aggression high
* Herbivore + Multicellular → low aggression
* Fungal + MycelialNetwork → high ecological impact
* CentralizedBrain + Social flag → civilizationPotential high

---

## 5. Climate Envelope

Each species has:

```ts
interface ClimateEnvelope {
  minTempK: number
  maxTempK: number
  minPrecip: number
  maxRadiation: number
}
```

Derived from adaptation modules.

Example:

* Cryotolerance → minTemp lowered
* RadiationShielding → maxRadiation increased
* AquaticRespiration → restricted to ocean biomes

---

## 6. Procedural Common Name Generator (Bestiary Flavor)

Format:

```
[Adjective] + [BiomeWord] + [RoleWord]
```

Example dictionaries:

Adjectives:

* Iron
* Crimson
* Silver
* Deep
* Pale
* Thorned

BiomeWord:

* Marsh
* Reef
* Tundra
* Grove
* Dune
* Abyss

RoleWord:

* Stalker
* Grazer
* Titan
* Creeper
* Sentinel
* Swimmer

Generated example:

```
Silver Reef Stalker
Ironroot Sentinel
Crimson Dune Grazer
```

Scientific name stays deterministic:

```
Theron ferox
Floron solaris
```

---

## 7. Ecological Graph Hook

Bestiary integrates with trophic graph.

Each entry includes:

```ts
preysOn: SpeciesId[]
predators: SpeciesId[]
symbiosis: SpeciesId[]
```

Auto-generated from role compatibility.

---

## 8. Extinction Archive

Extinct entries remain stored.

```ts
interface ExtinctRecord {
  id: SpeciesId
  extinctionCause: string
  extinctionEpoch: number
}
```

Displayed in fossil layer.

---

## 9. Civilization Integration

If:

```
tier == Sophont
```

Bestiary entry expands with:

```ts
interface CivilizationProfile {
  techLevel: number
  territorialSpread01: number
  culturalStability01: number
}
```

Still derived from species genome.

No new biology system required.

---

## 10. Species Gameplay Profile

The Bestiary extends with a comprehensive gameplay rating system that transforms species biology into actionable gameplay metrics.

Canonical source: `docs/42-species-gameplay-ratings.md` (`SpeciesGameplayProfile`).

All ratings are quantized to PPM (parts per million, 0..1_000_000). No floating-point values.

---

## 11. Core Gameplay Ratings

### Threat Rating

Threat is a function of:

* ability to harm
* ability to reach
* ability to survive
* intent/trigger likelihood

Derived from species parameters:

```
CombatPower =
  wS*Size + wM*Mobility + wA*Aggro + wR*Resilience
  + tagBoosts(venom, armor, pack, ambush)

Reach =
  Mobility + tagBoosts(flight, aquaticSpeed, burrow)

Intent =
  Aggro + Territorial + HungerPressureProxy

threatPPM = clampPPM(
  (CombatPower * Reach) / 1_000_000
  * (500_000 + Intent/2) / 1_000_000
)
```

### Nuisance Rating

Nuisance = how likely it is to disrupt settlements without being a "fight."

Inputs:

* scavenger behavior
* reproduction rate
* disease/toxin tags
* crop damage tags
* stealth/infiltration traits

```
nuisancePPM =
  f(reproductionRate, stealth, diseaseVector, omnivore, urbanTolerance)
```

### Usefulness Rating

Usefulness depends on yields + ease of access:

```
usefulnessPPM =
  YieldValue(food, material, medicine)
  * (1_000_000 - dangerPenalty)
  * accessibility(biome proximity, activity cycle)
```

### Domestication Rating

Domestication requires:

* sociality
* manageable aggression
* reasonable size/mobility
* compatible diet
* low panic/flightiness
* breeding feasibility

```
domesticationPPM =
  Social * (1_000_000 - Aggro)
  * (1_000_000 - FlightinessTag)
  * dietCompatibility
  * juvenileBondingTagBoost
```

### Rarity Rating (Encounter Frequency)

Rarity is computed from simulation signals:

* population density in biome
* habitat suitability
* recent extinction pressure
* refugia status

```
rarityPPM = clampPPM(
  1_000_000 - abundancePPMAdjusted
)
```

> **Note:** For detailed rating formulas and weight tables, see [`docs/42-species-gameplay-ratings.md`](docs/42-species-gameplay-ratings.md).

---

## 12. Encounter Parameters

These parameters provide D&D/OSR-friendly knobs for encounter generation. They do not hardcode CR (Challenge Rating) but give systems the data to compute it.

### aggressionPPM

Base aggression + territorial boost + hunger pressure (season).

Example calculation:

```
aggressionPPM = baseAggressionPPM
              + territorialBoost(biomeId, seasonId)
              + hungerPressure(seasonId, foodAvailability)
```

### lethalityPPM

ThreatPPM adjusted by "target = humanoid" susceptibility tags.

```
lethalityPPM = threatPPM * humanoidSusceptibilityMultiplier
```

### pursuitPPM

Mobility + endurance tags.

```
pursuitPPM = mobilityPPM + enduranceTagBoost
```

### stealthPPM

Camouflage + nocturnal + burrow.

```
stealthPPM = camouflagePPM + nocturnalTagBoost + burrowTagBoost
```

### groupTendencyPPM

Sociality + pack tags.

```
groupTendencyPPM = socialityPPM + packHunterTagBoost
```

### territorialPPM

TerritoryNeed + nesting tags.

```
territorialPPM = territoryNeedPPM + nestingTagBoost
```

All parameters are derived deterministically from species biology and context.

---

## 13. Yield System

Yields represent what players can obtain from interacting with a species through harvesting, hunting, or domestication.

```ts
interface YieldProfile {
  foodPPM: uint32      // Edible meat, eggs, etc.
  materialPPM: uint32  // Leather, bone, fiber, etc.
  medicinePPM: uint32 // Antivenom, medicinal compounds
  toxinPPM: uint32     // Poisonous/venomous potential
}
```

Yield values are computed from species tags:

* **FoodPPM**: Fatty, Edible, EggLayer, etc.
* **MaterialPPM**: LeatherHide, Horn, Bone, Fiber, Resin, etc.
* **MedicinePPM**: AntivenomSource, MedicinalCompound, etc.
* **ToxinPPM**: Venomous, Poisonous, ContactToxin, etc.

---

## 14. Gameplay Tags (Projection Tags)

These are tags in the **Narrative/Gameplay namespace**, not biology tags. They are assigned by thresholds on the computed ratings + specific traits.

### Tag Categories

#### Encounter Tags
* `BossCandidate` - High threat + unique traits + low rarity
* `PackHunter` - Group tendency + sociality + carnivore
* `ApexThreat` - High threat + top trophic level
* `EasyPrey` - Low threat + herbivore + low defense

#### Utility Tags
* `MountCandidate` - Moderate size + mobility + domesticatable
* `Pest` - High nuisance + reproduction rate + urban tolerance
* `ValuableHide` - High material yield + rarity
* `ToxicHazard` - High toxin yield + aggression

#### Narrative Tags
* `Sacred` - Cultural significance + low threat + rarity
* `Invasive` - High reproduction + adaptability + non-native
* `DiseaseRisk` - DiseaseVector tag + settlement proximity
* `OmenSpecies` - Rarity + seasonal behavior + cultural hooks

### Tag Assignment Rules

All assignments emit trace in logs (optional) for debugging and explainability.

Example threshold rules:

```
BossCandidate: threatPPM > 800_000 && rarityPPM > 700_000
PackHunter: groupTendencyPPM > 600_000 && carnivore
Pest: nuisancePPM > 600_000 && reproductionRate > 500_000
MountCandidate: domesticationPPM > 600_000 && mobilityPPM > 500_000
```

---

## 15. Contextual Modifiers (Biome/Season)

A species' profile changes in context. These modifiers must be:

* quantized
* table-driven per biome tag + season id
* applied after base ratings

### Modifier Types

| Modifier | Effect | Example |
|----------|--------|---------|
| Winter | Increases hunger pressure | +30% aggression, +20% pursuit |
| Breeding Season | Increases aggression | +25% aggression, +15% territorial |
| Drought | Increases settlement proximity | +40% nuisance, -20% rarity |
| Monsoon | Reduces stealth | -20% stealth, +10% food yield |
| Migration | Alters abundance | Temporary rarity changes |

### Modifier Table Structure

```ts
interface ContextualModifierTable {
  biomeId: uint64
  seasonId: uint64
  modifiers: {
    aggressionDelta: int32
    lethalityDelta: int32
    pursuitDelta: int32
    stealthDelta: int32
    groupTendencyDelta: int32
    territorialDelta: int32
    yield: {
      foodDelta: int32
      materialDelta: int32
      medicineDelta: int32
      toxinDelta: int32
    }
  }
}
```

No freehand logic. All modifiers are table-driven and deterministic.

---

## 16. Explainability Contract

The gameplay profile must support breakdown for debugging and player-facing tooltips.

### Breakdown Hash

```ts
breakdownHash64: uint64
```

A hash of the complete rating calculation, used for:
* Caching invalidation
* Reproducibility verification
* Cross-platform consistency

### Optional Breakdown Record

For dashboards and detailed tooltips:

Canonical source: `docs/42-species-gameplay-ratings.md` (`RatingBreakdown`).

### Breakdown Contents

* **Top contributing tags** - Tags that most influenced each rating
* **Top contributing parameters** - Species parameters with highest impact
* **Context modifiers applied** - All biome/season adjustments

This enables:
* Player-facing tooltips explaining "why is this dangerous?"
* Dev dashboard debugging of rating calculations
* Modder visibility into how their changes affect ratings

---

## 17. Encounter Selection (Deterministic RNG)

When generating an encounter list:

1. Filter by habitat suitability
2. Weight by abundance (inverse rarity)
3. Select using stateless RNG hash:

```ts
pick = hash(seed, biomeId, timeTick, encounterIndex)
```

This ensures encounter composition is reproducible across:
* Different game sessions
* Different platforms
* Different save/load cycles

---

## 18. Modding Contract

Mods may:

* Add yield tags
* Add new gameplay projection tags
* Tweak rating weights via versioned tables
* Add biome/season modifier tables

Must respect:

* Caps (no infinite scaling)
* Deterministic tables
* No new hidden state

---

## 19. Dashboard Projection

Each Bestiary entry renders:

* Population bar
* Habitat map overlay
* Climate tolerance ring
* Risk status color
* Lineage tree mini view

---

## Performance Rules

* Bestiary only reads SpeciesCluster state.
* No per-creature simulation.
* Updates only on epoch ticks.
* Cached between climate ticks.

Memory footprint minimal.

---

## What You Now Have

* Life trunks
* Genome modules
* Archetypes
* Naming system
* Species generation
* Biodiversity projection
* Extinction history
* Civilization hook
* **Gameplay rating system** - Threat, nuisance, usefulness, domestication, rarity
* **Encounter parameters** - Aggression, lethality, pursuit, stealth, group tendency, territorial
* **Yield system** - Food, material, medicine, toxin values
* **Gameplay tags** - BossCandidate, PackHunter, Pest, MountCandidate, Sacred, etc.
* **Contextual modifiers** - Biome/season-driven rating adjustments
* **Explainability contract** - Breakdown hash and optional detailed breakdown

This is now a **planetary biosphere engine** with actionable gameplay metrics, not just a toy ecosystem.

---

## Integration

This system integrates with:

* **Species Nomenclature** - Scientific and common names
* **Population Dynamics** - Conservation status from population trends
* **Trophic Energy Model** - Trophic level assignment
* **Adaptive Radiation** - New species entries
* **Mass Extinction Engine** - Extinction records
* **Refugia & Colonization** - Population tracking
* **Species Gameplay Ratings** - Detailed rating formulas and weight tables (see [`docs/42-species-gameplay-ratings.md`](docs/42-species-gameplay-ratings.md))
* **Encounter Packaging Plugin** - Encounter generation using gameplay profiles (see [`docs/43-encounter-packaging-plugin.md`](docs/43-encounter-packaging-plugin.md))
* **Universal Tag System** - Tag-based gameplay classification (see [`docs/33-universal-tag-system.md`](docs/33-universal-tag-system.md))

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

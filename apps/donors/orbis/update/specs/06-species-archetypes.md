# 🔒 EARTH SPECIES ARCHETYPE SYSTEM (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

We do **not** store thousands of real species.

We store **archetypes** that represent evolutionary solutions.

Earth becomes:

* A parameterized evolutionary template
* Not a dataset

---

## 1️⃣ Minimal Earth Archetype Set

You only need ~20–30 canonical archetypes.

Each represents a stable evolutionary strategy.

### Example Core Set

#### Microbial

* Cyanobacteria-like (oxygenic photosynthesizer)
* Methanogen-like (anaerobic archaea)
* Extremophile thermophile
* Nitrogen-fixer

#### Aquatic Multicellular

* Simple filter feeder
* Predator swimmer
* Reef builder (coral analog)
* Kelp-like macroalgae

#### Terrestrial Plants

* Moss-like pioneer
* Fern-like vascular
* Tree-like woody
* Desert succulent

#### Terrestrial Animals

* Arthropod analog
* Amphibian analog
* Reptile analog
* Mammal analog
* Avian analog

#### Fungal

* Decomposer mycelial
* Parasitic fungus
* Symbiotic lichen analog

That's enough to generate Earth-like biodiversity behavior.

You do not need real species names.

---

## 2️⃣ Deterministic Archetype Generator

Each archetype is defined by:

```ts
interface ArchetypeSeed {
  trunk: TrunkId
  ecologicalRole: Role
  complexityTier: number
  preferredClimate: ClimateProfile
  radiationTolerance: number
}
```

Where:

```ts
type Role =
  | "PrimaryProducer"
  | "Decomposer"
  | "Herbivore"
  | "Carnivore"
  | "Omnivore"
  | "FilterFeeder"
  | "Parasite"
  | "Symbiont"
```

You generate genome modules based on this role.

---

## 3️⃣ Procedural Module Assignment Rules

Example:

If Role = PrimaryProducer:

* Must include:

  * OxygenicPhotosynthesis OR Chemosynthesis
* If terrestrial:

  * VascularTransport
* If complex:

  * MulticellularAdhesion

If Role = Carnivore:

* Must include:

  * AerobicRespiration
  * CentralizedBrain OR SimpleGanglia
* If aerial:

  * FlightCapability

All derived deterministically from seed.

No mutation simulation needed.

---

## 4️⃣ Earth Mode = Parameter Preset

Earth preset:

```
meanTemp = 288K
O2Rich
oceanCoverage = 0.7
radiationStress = low
tectonics = moderate
```

The generator produces:

* Stable trophic web
* Radiation-sensitive surface species
* Marine-first diversity
* Terrestrial radiation post-oxygenation

No static database required.

---

## 5️⃣ Performance Strategy

We do NOT simulate per-individual species.

We simulate per-archetype population cluster.

```ts
interface SpeciesCluster {
  genome: SpeciesGenome
  population01: number
  biomeDistribution: Map<BiomeId, number>
}
```

Population01 is normalized.

Memory footprint stays tiny.

---

## 6️⃣ Why This Is Better Than Pre-Stored Earth Data

Pre-generating real species:

* Bloats memory
* Adds no gameplay value
* Hard to integrate with alien planets
* Requires complex taxonomic tables

Procedural archetypes:

* Cost almost nothing
* Automatically adapt to planet parameters
* Work for alien and Earth worlds
* Deterministic via seed

---

## 7️⃣ Caching Rule (Important)

At epoch boundaries:

```
speciesSet = GenerateSpecies(seed, planetState)
cache(seedHash, speciesSet)
```

If planet state identical → reuse cache.

No overhead at runtime.

---

## 8️⃣ Optional: Earth Authentic Mode

If you want educational realism:

Add label overlay:

```
"Arthropod Analog (Earth: Beetle-like)"
```

But internally it's still archetype-based.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

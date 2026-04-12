# Species Nomenclature System v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: [`SpeciesId`, `SpeciesNames`, `PhonemePack`, `DescriptorLexicon`]
- `Writes`: `[]`

---

## 🔒 Authority: IDENTITY & NOMENCLATURE
**SPEC_OWNER:** `docs/18-nomenclature.md`  
**CANONICAL_TYPES:** `SpeciesId`, `SpeciesNames`, `PhonemePack`, `DescriptorLexicon`

---

Naming is not flavor text — it is a deterministic identity layer.

If you don't lock it, you will get:

* inconsistent naming
* LLM drift
* duplicate species names
* unstable save files
* broken cross-references

We lock it now.

---

## Core Goals

Generate names that are:

* **Deterministic** — same speciesId ⇒ same name
* **Stable** across versions (unless you bump naming version)
* **Cheap** — no huge corpora required
* **Configurable** per setting (Earthlike vs Fantasy)
* **Multi-layered**:
  * Scientific name (binomial)
  * Common name (player-facing)
  * Culture name (civilization-specific)
  * Optional alias list for narrative

---

## Purpose

Goal:

* Deterministic
* Lightweight
* Biologically inspired
* Supports Earth mode + Alien mode + Fantasy mode
* No LLM required at runtime
* Zero string entropy drift

---

## Naming Inputs (Hard Rule)

Names are derived only from:

* `worldSeed`
* `speciesId`
* `trunkId`
* Key tags (sorted TagIds)
* Optional `regionId` / `biomeId` for local common names
* `NAMING_VERSION`

**No wall clock. No external randomness.**

---

## Output Contract

```ts
interface SpeciesNames {
  scientific: { genus: string; species: string; full: string } // "Genus species"
  common: string                                              // "glassback river-hunter"
  culture?: Record<CivId, string>                             // optional exonyms/endonyms
  aliases?: string[]                                          // optional narrative
  namingVersion: uint16
}
```

---

## Two Naming Modes (LOCKED)

### Mode A — Pseudo-Linnaean (Earthlike)

* Binomial "Genus species"
* Latin-ish phonotactics
* Genus tied to trunk + key morphology tags
* Species epithet tied to habitat/diet/feature

### Mode B — Fantasy Taxonomy

* Still deterministic, but not Latin
* Uses setting language packs (dwarven, draconic, etc.)
* Can emit:
  * "House-name" style
  * "Spirit-name" style
  * "Old tongue" compound

Both modes share the same pipeline; only phonotactics differ.

---

## 1. Identity Structure

Every species has two names:

1. **Canonical ID Name** (stable, mechanical)
2. **Display Name** (player-facing)

---

## 1.1 Canonical ID (Non-Human-Readable)

```ts
type SpeciesId = string
```

Format:

```
TRK-ROLE-TIER-HASH
```

Example:

```
OPI-CAR-3-A7F2
ARC-PRO-2-91C1
SAR-FIL-2-7DD4
```

Where:

* TRK = trunk short code
* ROLE = ecological role
* TIER = complexity tier
* HASH = deterministic short seed hash

Never shown to player.

Used for:

* saves
* cross-system references
* diplomacy
* extinction logs

---

## 2. Scientific-Style Name Generator

Inspired by Linnaean binomial naming.

Format:

```
Genus species
```

Always two words.

Always deterministic.

---

## 2.1 Name Components

We generate:

* Genus: from trunk root
* Species: from ecological trait

---

## 3. Trunk Root Dictionary (LOCKED)

```ts
const trunkRoots = {
  Eukarya_Opisthokonta: ["Theron", "Animor", "Hominor", "Bestion"],
  Eukarya_Archaeplastida: ["Floron", "Sylvar", "Lignora", "Viridon"],
  Eukarya_SAR: ["Maris", "Pelagon", "Nerith", "Aqualis"],
  Eukarya_Amoebozoa: ["Gelum", "Plasmor", "Amorphis"],
  Eukarya_Excavata: ["Flagellor", "Crypton", "Spiralis"],
  Bacteria: ["Microbion", "Bacteron"],
  Archaea: ["Archeon", "Thermion"]
}
```

These are not real Latin.
They are pseudo-Latin roots.

Small list → low overhead.

---

## 4. Trait Modifier Dictionary (LOCKED)

Based on dominant module or biome.

```ts
const traitModifiers = {
  PrimaryProducer: ["viridis", "luminis", "solaris"],
  Carnivore: ["ferox", "raptor", "venator"],
  Herbivore: ["pascens", "herbalis"],
  Decomposer: ["fungalis", "putris"],
  Aquatic: ["marinus", "pelagicus"],
  Terrestrial: ["terranis", "silvaticus"],
  FlightCapability: ["volans"],
  Cryotolerance: ["glacialis"],
  RadiationShielding: ["radiatus"]
}
```

Selection rule:
Pick one dominant trait.

---

## 5. Name Assembly Algorithm (Deterministic)

```ts
genus = trunkRoot[ trunk ][ seedIndex1 ]
species = traitModifier[ dominantTrait ][ seedIndex2 ]

displayName = genus + " " + species
```

Example:

Opisthokont carnivore tier 3:

```
Theron ferox
Animor raptor
```

Plant analog:

```
Floron solaris
Lignora silvaticus
```

Aquatic SAR predator:

```
Maris venator
Pelagon pelagicus
```

---

## Genus Construction Rules (LOCKED)

Genus is primarily determined by:

* `trunkId` (plant/animal/fungi/etc.)
* 1–3 "morphology tags" (e.g., Aquatic, Exoskeleton, Flight)

Mapping:

* Trunk selects base phoneme set
* Morphology selects suffix style

Example suffix families:

* Animal-ish: `-thera`, `-cera`, `-poda`, `-saurus` (optional)
* Plant-ish: `-flora`, `-phyta`, `-dendron`
* Fungi-ish: `-myces`, `-spora`

**Note:** You're not obligated to mimic real taxonomy—just be consistent.

---

## Species Epithet Rules (LOCKED)

Epithet derived from:

* Habitat: polar / desert / abyssal
* Behavior: nocturnal / burrowing / migratory
* Color/material vibe (from biome palette tags)
* Trophic role: predator / grazer / decomposer

Epithet can be:

* Adjective: `nocturna`, `glacialis`, `rubra`
* Noun-genitive-ish: `montis`, `silvae` (optional)
* Compound: `longicauda` style (optional)

We keep this **small** and procedural.

---

## Common Name Contract (Player-Facing)

Common name is:

* Descriptive, readable
* Derived from salient tags
* Localized per language pack later

Template:

```
[descriptor] [habitat noun] [role noun]
```

Examples:

* "ice-shelled marsh grazer"
* "amber-wing cliff hunter"
* "brine-burrowing spore-eater"

Deterministic selection:

* Descriptor from 1–2 strongest tags (intensity)
* Habitat noun from biome tags
* Role noun from trophic role

---

## Culture Names (Exonyms/Endonyms)

When civilizations exist, they can name species.

Culture naming depends on:

* Civ language pack
* Civ tags (Spiritual, Militaristic, etc.)
* Relationship tags (Sacred, Pest, Mount, Enemy)

Contract:

```ts
CultureName = Format(civLanguagePack, speciesSalientTraits, relationship)
```

Generated at:

* First contact event
* Domestication event
* Myth event

All evented + logged.

---

## Naming Versioning (Hard Rule)

Changing phoneme inventories or templates changes names.

So we lock:

```
NAMING_VERSION = 1
```

If you change algorithm:

* Bump version
* Old saves keep their version for stable display

---

## Minimal Data Packs (Small, Must-Have)

You only need:

### PhonemePack (per mode)

```ts
interface PhonemePack {
  consonants: string[]      // 20–40 consonants
  vowels: string[]          // 10–20 vowels
  onsetClusters: string[]   // 10–30 onset clusters
  suffixes: string[]        // 20–60 suffixes
  bannedSequences: string[] // Small list of banned sequences
}
```

### DescriptorLexicon (common names)

```ts
interface DescriptorLexicon {
  descriptors: string[]   // 30–100 descriptors total
  habitatNouns: string[] // 20–80 habitat nouns
  roleNouns: string[]    // 20–60 role nouns
}
```

Very small; mod-friendly.

---

## Determinism & Uniqueness Rules

* Scientific name must be stable for a given speciesId
* If two species collide to same binomial (rare):
  * Append deterministic disambiguator suffix:
    * `-a`, `-b`, `-c` based on nicheSignature hash

No random renaming.

---

## Dashboard Integration

Naming panel must show:

* Scientific name
* Common name
* Tag-to-name explanation:
  * Which tags influenced descriptor/suffix
* "Rename override" (optional) as a mod layer:
  * Override is an event and stored as display-only alias
  * Does not change speciesId

---

## Modding Contract

Mods can add:

* New phoneme packs
* New descriptor lexicons
* New suffix families
* New culture language packs

Must be:

* Versioned
* Deterministic
* Registry-backed

---

## 6. Fantasy Naming Layer (Optional Override)

If world has fantasy flag:

Add cultural prefix/suffix:

```
High Theron ferox
Deep Floron glacialis
Elder Maris pelagicus
```

Or create vernacular name:

```
Common Name: Silverwood Stalker
Scientific Name: Theron ferox
```

Vernacular generator:

```ts
Adjective + Habitat + RoleWord
```

Example:

* Red Marsh Hunter
* Crystal Reef Grazer
* Ironroot Giant

This is separate from canonical scientific name.

---

## 7. Extinction Log Naming

When extinct:

```
† Theron ferox
```

If radiation event:

```
† Theron ferox (Radiation Collapse)
```

---

## 8. Epoch Naming Stability Rule

Once generated:

* Species name is immutable.
* Speciation creates new binomial.
* Parent name never reused.

Deterministic seed ensures repeatability.

---

## 9. Alien World Flavor Rule

For non-Earth worlds:

Swap dictionary root set.

Example:

```ts
XenonRoots = ["Zyther", "Vorlax", "Myrr", "Kaelor"]
```

Same system.

Different flavor.

No change in logic.

---

## 10. Memory Cost

You store:

* 1 trunk code
* 1 role code
* 2 small dictionary indexes
* 1 short hash

Total string cost minimal.

No database.

---

## Why This Works

* Looks scientific
* Works for Earth
* Works for alien
* Works for fantasy
* Deterministic
* No LLM needed
* No runtime grammar generation

---

## Result

You can now:

* Pre-generate Earthlike species with consistent binomials
* Generate fantasy species names without huge datasets
* Generate readable common names for gameplay
* Generate culture-dependent names for narrative weight
* Keep names stable across replays and years
* Handle name collisions with deterministic disambiguators
* Support modding with versioned phoneme and descriptor packs
* Integrate naming with dashboard for transparency

---

## You now have

* Evolution engine
* Species archetypes
* Complete naming spec with type definitions
* Identity stability
* Two naming modes (Pseudo-Linnaean and Fantasy Taxonomy)
* Culture naming system
* Version control for algorithm changes
* Minimal data packs for modding

This is a real simulation architecture now.

---

## Integration

This system integrates with:

* **Bestiary** - Scientific and common name display
* **Adaptive Radiation** - New species naming
* **Mass Extinction Engine** - Extinction log naming
* **Population Dynamics** - Species identification
* **Refugia & Colonization** - Species tracking
* **Simulator Dashboard** - Tag-to-name explanation and rename override
* **Universal Tag System** - Tag-based name generation
* **Civilization System** - Culture-specific species names

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

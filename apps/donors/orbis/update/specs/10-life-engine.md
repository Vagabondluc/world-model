# 🔒 LIFE ENGINE v1 — Core Lineages + Fantasy-Race-Friendly Genetics

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## 0) What we're borrowing from Earth (deep history anchors)

We treat Earth-life as "one tree" that starts from a common ancestor (LUCA) and splits into major trunks (Bacteria / Archaea / Eukarya).

We use two big "gate events" that matter for gameplay:

* **Oxygenation** (cyanobacteria → Great Oxidation Event) enabling energetic metabolisms.
* **Eukaryogenesis via endosymbiosis** (mitochondria, plastids), enabling complex cells and later multicellularity.

We also keep the modern "supergroup" idea as a compact way to represent eukaryote diversity.

---

## 1) Data types you lock first

### 1.1 Lineage trunks (small, stable set)

```ts
enum TrunkId {
  Bacteria,
  Archaea,
  Eukarya_Opisthokonta,     // animals + fungi relatives
  Eukarya_Archaeplastida,   // plants + algae
  Eukarya_SAR,              // broad "protist" megaclade
  Eukarya_Excavata,         // flagellate-style oddballs
  Eukarya_Amoebozoa,        // amoeboid lineages
}
```

Why these: they're enough to make fantasy races feel "rooted" while staying tiny.

### 1.2 Environment gates (life feasibility)

```ts
type OxState = "Anoxic" | "LowO2" | "O2Rich"
type CellComplexity = "ProkaryoteLike" | "EukaryoteLike"
type BodyPlan = "Unicellular" | "Colonial" | "Multicellular"
```

### 1.3 "Genome modules" (your core genetic lines become mixable parts)

These are not real genomes — they're **typed capability bundles**.

```ts
enum GenomeModule {
  CoreTranslation,     // universal code/ribosome/ATP-ish baseline
  OxygenicPhotosyn,    // drives oxygenation gate
  AerobicRespiration,  // energy jump; ties to mitochondria ancestry
  EndosymbiontMito,    // eukaryote enabling step
  EndosymbiontPlastid, // plant-like line
  MulticellToolkit,    // adhesion/signaling/development proxy
  NervousToolkit,      // "animal-like complexity" proxy
  MycelialToolkit,     // "fungal-like complexity" proxy
  LigninAnalog,        // "woody" / tree-body proxy
  MineralizedSupport,  // shells/bones/armor proxy
}
```

---

## 2) The Earth-inspired progression (but cheap)

### 2.1 LUCA bootstrap (single event)

If planet passes your habitability gates (magnetosphere + atmosphere + stable liquid water), you spawn **one** root population with `CoreTranslation`.

LUCA as "shared universal machinery" is anchor for "one tree."

### 2.2 Oxygenation gate

If `OxygenicPhotosyn` emerges and persists, your world shifts from `Anoxic → LowO2 → O2Rich`.

This mirrors oxygenation as a major transition.

### 2.3 Eukaryote gate via endosymbiosis

When a lineage gains `EndosymbiontMito`, it upgrades to `EukaryoteLike` (big capability unlock).

Endosymbiosis is keystone event for mitochondria/plastids.

---

## 3) The "Core Genetic Lines" mapping to fantasy races

You want fewer trunks than Earth, but still expressive. Here's canonical mapping table:

| Trunk                  | What it represents                                                    | Fantasy race families it supports                                                       |
| ---------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Eukarya_Opisthokonta   | **Animal-like + fungi-like** relatives (close clade) ([Wikipedia][6]) | humans, elves, dwarves, orcs, goblinoids **and** fungal folk (myconids), "spore druids" |
| Eukarya_Archaeplastida | plant/algae-like line                                                 | ents, dryads, leshy, plant-people                                                       |
| Eukarya_Amoebozoa      | amoeboid / plasmoid life                                              | slimes, oozes, shapeshifters                                                            |
| Eukarya_SAR            | huge "weird euk" bucket                                               | insectoid empires, kelp-like sea sophonts, glass-shelled plankton cities                |
| Eukarya_Excavata       | flagellate-style oddballs                                             | parasitic intelligences, gut-symbiont sapients, "mirror-water" organisms                |
| Bacteria / Archaea     | prokaryote-like                                                       | planet-wide microbiomes, symbionts, plagues, "living rocks" (archaea vibe)              |

Note: Opisthokonta as a shared umbrella for animals + fungi is a real relationship, which makes "fungal humanoids" feel grounded.

---

## 4) How a "Race" is generated (typed recipe)

Canonical source for `SpeciesId`: `docs/18-nomenclature.md`.

Canonical source for `SpeciesGenome`: `docs/07-species-modules.md`.

Deterministic rule:

* The same planet state + same time ⇒ same canonical species genome set.

You can keep it light by limiting:

* max modules per species: 6–10
* max species per epoch: small (e.g., 50–200)

---

## 5) "Core line" evolution without full biology

Instead of mutation soup, you do **module acquisition** + **speciation splits** at epoch boundaries.

### 5.1 Acquisition gates (examples)

* `AerobicRespiration` only if `OxState != Anoxic`
* `MulticellToolkit` requires `EukaryoteLike`
* `EndosymbiontPlastid` only if `EndosymbiontMito` exists (pragmatic rule; mirrors plastid-bearing eukaryotes arising after eukaryote complexity)

### 5.2 Speciation as branching

A branch event is just:

* copy parent genome
* add/remove 1–2 modules (bounded)
* shift habitat niche

No need for gene frequencies.

---

## 6) Minimal "deep history" timeline hooks (for your epochs)

Use these as named phases with scientific "wait-time" gates:

1. **Microbial World** (LUCA → 0 Ga)
2. **Oxygenation Crisis** (~2.4 Ga / Great Oxidation Event)
3. **Complex Cells** (~1.5 Ga wait from life; Eukaryogenesis)
4. **Multicellular Experiments** (~1.0 Ga wait from Eukaryogenesis)
5. **Body Plan Radiation** (Cambrian-analog; post-oceanic oxygenation)
6. **Land Colonization** (~450 Ma analog)

---

## 7) What I'd "deep-search add" next (only if you want)

To make this feel *really* Earth-rooted, next sources to fold in are:

* a clean, modern summary of eukaryote supergroup relationships (Burki-style)
* endosymbiosis evidence details (mitochondria/plastid traits)
* oxygenation dynamics and its ecological consequences
* Cambrian explosion triggers (environmental vs biological factors)

---

## Where We Stop

We now have:

* Core trunks (real Earth logic)
* Module catalog (game-usable)
* Fantasy race templates
* Evolution mechanics
* Fitness model
* Civilization unlock gate

This is enough to generate:

* Earthlike worlds
* Fungal empires
* Aquatic-first civilizations
* Radiation-hardened underground races
* Snowball survivors

Without full evolutionary biology.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

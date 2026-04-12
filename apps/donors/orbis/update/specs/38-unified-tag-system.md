# 🔒 UNIFIED TAG SYSTEM CONTRACT v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: [`TagId`, `TagInstance`, `TagDefinitionV1`, `TagRegistryV1`, `TagPropagationRuleV1`, `TagStatus`, `PropagationEdge`]
- `Writes`: `[]`
- `Baseline`: `v1-implementation` (`LockedOn: 2026-02-12`)

---
## 🔒 Implementation Baseline Lock
This file is frozen as part of the **v1 implementation baseline**.

Lock rules:
1. No semantic changes without explicit version bump (`v2+`).
2. Additive clarifications are allowed only if they do not change behavior.
3. Any non-additive change requires updating baseline status in project reports.

---

## 0️⃣ Tag Registry Contract (v1)

To ensure simulation stability, all tags must be registered in a canonical registry.

```typescript
enum TagStatus {
  Active,      // Authoritative and in use
  Legacy,      // Retained for historical replay; do not use for new entities
  MergedStub   // Redirects to a new TagId (see mapping table)
}

interface TagDefinitionV1 {
  id: TagId
  name: string         // Tooling/debug only
  namespace: uint16    // Namespace partition
  status: TagStatus
  version: uint16
}

interface TagRegistryV1 {
  registryVersion: uint32
  tags: TagDefinitionV1[]
}

type PropagationEdge = "species_to_civ" | "biome_to_species" | "civ_to_narrative"

interface TagPropagationRuleV1 {
  ruleId: uint32
  edge: PropagationEdge
  sourceTagId: TagId
  targetTagId: TagId
  riseThresholdPPM: uint32
  fallThresholdPPM: uint32
  cadenceTicks: uint32
  minSupportPPM: uint32
  reasonCode: uint32
}
```

### 0.1 TagId Specification
- **Width**: `uint32` (Hard Rule).
- **Policy**: Append-only. Once an ID is assigned, it can never be repurposed.
- **De-duplication**: Registry must pass uniqueness checks on `id` and `name`.

### 0.2 Reserved Ranges
- `0x00000000 - 0x3FFFFFFF`: **Core** (authoritative engine tags).
- `0x40000000 - 0x5FFFFFFF`: **Experimental** (engine-internal pre-freeze tags).
- `0x60000000 - 0x6FFFFFFF`: **Deprecated** (legacy aliases and merged stubs only).
- `0x70000000 - 0xFFFFFFFF`: **Mod** (third-party tags).

Append-only rule:
1. Assigned `TagId` values are immutable forever.
2. Deprecation is done by status + alias mapping, never ID reuse.
3. Registry version increments only when new entries are appended or statuses are changed.

---

## Overview

A tag is:

> A compact, typed, deterministic semantic modifier.

Tags:
- describe structure
- encode behavior bias
- influence equations
- propagate upward
- generate narrative
- cost almost no memory

They are not text labels. They are numeric IDs with defined mathematical meaning.

## Tag Structure

```typescript
type TagId = uint32

interface TagInstance {
  tagId: TagId
  intensityPPM: uint32    // 0..1_000_000
  origin: OriginId        // optional, for traceability
}
```

Intensity is quantized. No floats.

## Tag Scope Hierarchy

Tags may exist on:
- Species
- Population cluster
- Individual (optional, lightweight)
- Civilization
- Biome
- Planet
- Narrative record

All share same TagId namespace.

## Tag Categories

### Biological Structure Tags

**Examples:**
- Eukaryotic
- Multicellular
- Endothermic
- Exoskeleton
- Photosynthetic
- Aquatic
- Terrestrial
- Aerial
- Burrowing
- ApexPredator
- RStrategist
- KStrategist

These affect:
- population dynamics equations
- trophic efficiency
- mutation probabilities
- survival thresholds

### Environmental Adaptation Tags

- ColdAdapted
- HeatAdapted
- HighRadiationTolerance
- LowOxygenTolerance
- HighSalinityTolerance
- DeepWaterPressureAdapted

These modify survival curves.

### Behavioral Need Tags (The Sims Layer)

Each entity (species or civilization) has Need tags:

- FoodNeed
- SafetyNeed
- ReproductionNeed
- TerritoryNeed
- KnowledgeNeed
- SocialNeed
- DominanceNeed
- ExplorationNeed
- StabilityNeed
- SpiritualNeed

Each need is just:

```
NeedTag + intensityPPM
```

Needs drive deterministic scoring functions.

### Civilization System Tags

- Militaristic
- Agricultural
- Nomadic
- Industrial
- Maritime
- Theocratic
- Technocratic
- Expansionist
- Isolationist
- TradeOriented
- ExtractionBased

These influence:
- decision weights
- resource allocation
- event probabilities

### Cognitive / Consciousness Tags

- Sapient
- ToolUser
- LanguageCapable
- SymbolicThought
- LongTermPlanning
- EthicalFramework
- MythMaking

These unlock narrative domain.

### Narrative Weight Tags

These do not affect physics. They affect:
- logging
- storytelling emphasis
- dashboard highlighting

**Examples:**
- ExtinctionEvent
- GoldenAge
- CollapseEra
- FoundingSpecies
- FirstLandColonizer
- SurvivorLineage
- CulturalTrauma

## Tag Propagation Rules

Tags propagate upward deterministically.

### Species → Civilization (Locked Equation)

```
supportPPM =
  (populationSharePPM * sourceTagIntensityPPM) / 1_000_000
```

Assign target tag if:
```
supportPPM >= riseThresholdPPM
```
Remove target tag if:
```
supportPPM <= fallThresholdPPM
```

Hard defaults:
- `riseThresholdPPM = 700_000`
- `fallThresholdPPM = 600_000`
- `cadenceTicks = 120`
- `reasonCode = 600100`

### Biome → Species (Locked Equation)

```
exposurePPM =
  (habitatOccupancyPPM * biomeStressTagPPM) / 1_000_000
```

Adaptation target assignment:
```
if exposurePPM >= riseThresholdPPM for >= 3 cadence windows
```
Removal:
```
if exposurePPM <= fallThresholdPPM for >= 3 cadence windows
```

Hard defaults:
- `riseThresholdPPM = 650_000`
- `fallThresholdPPM = 500_000`
- `cadenceTicks = 240`
- `reasonCode = 600200`

### Civilization → Narrative (Locked Equation)

```
narrativePressurePPM =
  (
    warEventRatePPM * warWeightPPM
    + scarcityPPM * scarcityWeightPPM
    + instabilityPPM * instabilityWeightPPM
  ) / 1_000_000
```

Assign target narrative tag if:
```
narrativePressurePPM >= riseThresholdPPM
```
Remove if:
```
narrativePressurePPM <= fallThresholdPPM
```

Hard defaults:
- `riseThresholdPPM = 700_000`
- `fallThresholdPPM = 550_000`
- `cadenceTicks = 60`
- `reasonCode = 600300`

All propagation must be:
- rule-based
- quantized
- event-driven
- logged

## Tag Interaction Model

Tags are not strings. Each tag has defined interaction coefficients.

**Example:**
```
ColdAdapted + HeatAdapted → instability penalty
ApexPredator + RStrategist → population volatility increase
Militaristic + HighResourceScarcity → war risk multiplier
```

These coefficients are stored in tables:

```typescript
TagInteractionMatrix[TagA][TagB] = effect
```

Sparse matrix preferred.

## Tag Aggregation Rules

For a civilization:

Aggregate species tags using:
- weighted average by population
- threshold conversion to civ tag

**Example:**
If 70% population has NomadicTrait > 600k PPM → Civ gets Nomadic tag.

## Determinism Boundary for Tags

Tags must never:
- mutate randomly
- appear without logged origin
- depend on floating comparisons

All tag changes emit:

```
TAG_ADDED(entityId, tagId, intensityPPM)
TAG_REMOVED(entityId, tagId)
TAG_MODIFIED(entityId, tagId, oldPPM, newPPM)
```

## Storage Efficiency

Tags are stored as:
- sorted small arrays
- no string names at runtime
- ID lookup via static registry

Typical species:
- 8–20 tags
- Memory negligible.

## Need Resolution Engine (Deterministic AI Core)

Each entity runs:

```
Utility(action) = Σ (NeedWeight * ActionEffectOnNeed)
```

NeedWeight derived from Tag intensity.

No randomness required.

Tie-breaking:
- use deterministic RNG hash(seed, entityId, tick)

## Narrative Generation Hook

Narrative domain reads tag transitions.

**Example:**
If ExtinctionEvent + SurvivorLineage + RefugiaRecovery:

Narrative entry:
"After the Great Collapse, Lineage X emerged from polar refugia."

Narrative is generated from tag deltas, not ad-hoc logic.

## Modding Contract

Mods can:
- define new TagId
- define interaction coefficients
- define propagation rules
- define narrative templates

Must be versioned and registered.

## Determinism & Tie-Breaking

Tie-breaking in tag-driven logic (such as Need Resolution) must be bit-identical across platforms.

### Tie-Break Contract
1. **Primary Sort**: Highest calculated score (e.g., Utility).
2. **Secondary Sort**: Lowest `TagId` value (ascending).
3. **Tertiary Sort**: Deterministic RNG hash.
   - **Hash Key**: `hash64(seed, entityId, tick, contextId)`
   - **Reference**: `docs/35-deterministic-rng.md`

## Modding Policy (Hard Constraints)

Mods extending the tag system must adhere to these rules to prevent simulation drift:

1. **ID Isolation**: Must use IDs within the `0x80000000 - 0xFFFFFFFF` range.
2. **Manifest Requirement**: All modded tags must be defined in a versioned JSON manifest.
3. **No Redefinition**: Mods cannot modify the `strengthPPM` or `multiplierPPM` of Core tags.
4. **Collision Check**: Mod loaders must run a collision check against the active `TagRegistryV1` before initialization.
5. **Versioning**: Mod manifests must declare a `registryVersion` target and a deterministic migration path for tag-id remapping if necessary.

---

## Dashboard Integration

Each dashboard must show:
- active tags
- intensity graph over time
- tag propagation history
- interaction effects

## Hard Constraints

Tags must not:
- contain free text
- embed logic
- directly mutate other systems
- override physics

They only influence equations.

## Result

You now have:

Species
→ Needs
→ Civilization
→ Narrative

All on one unified ontology.

Everything:
- deterministic
- compact
- auditable
- modifiable
- extensible

You now have the skeleton of a world engine that can simulate:
- Earth-like biology
- Fantasy species
- Cultural evolution
- Civilizational collapse
- Myth emergence

All through one coherent tag layer.

# UNIVERSAL TAG SYSTEM v1 (LEGACY / DEPRECATED)

SpecTier: Executable Contract

## ⚠️ DEPRECATION NOTICE
This specification is **LEGACY** and retained for historical concept context only. 
**DO NOT IMPLEMENT.**

Canonical implementation contract: [`docs/38-unified-tag-system.md`](./38-unified-tag-system.md)
Tag interaction math: [`docs/41-tag-interaction-math.md`](./41-tag-interaction-math.md)

## Overview

The Universal Tag System is a **Semantic Tag Engine** that serves as the connective tissue of the entire simulation. Tags are deterministic, typed, queryable, inherited, lightweight, and immutable unless state-derived.

## Tag Properties

Tags are:
- **Deterministic** - Same input produces same output
- **Typed** - Structured identifiers, not strings
- **Queryable** - Efficient lookup and filtering
- **Inherited** - Propagate through entity hierarchies
- **Lightweight** - Minimal memory footprint
- **Immutable** - Unless state-derived

## Tag Structure

```typescript
interface Tag {
  domain: TagDomain
  id: number
}
```

```typescript
enum TagDomain {
  Biology,
  Ecology,
  Behavior,
  Civilization,
  Climate,
  Event,
  Culture,
  Technology,
  Trait
}
```

Each domain has its own registry. No free-text tags.

## Biological Tag Integration

Every `SpeciesGenome` automatically generates tags.

### Example Mappings

If `trunk == Eukarya_Opisthokonta`:
```
Biology:Opisthokont
```

If module includes:
- `CentralizedBrain` → `Biology:NeuralComplex`
- `FlightCapability` → `Biology:Aerial`
- `RadiationShielding` → `Biology:RadiationResistant`

These tags drive:
- Behavior modifiers
- Colonization potential
- Cultural development bias
- Event vulnerability

## Ecological Tags

Assigned from role + habitat.

- **Producer** → `Ecology:PrimaryProducer`
- **Apex** → `Ecology:ApexPredator`
- **Aquatic habitat** → `Ecology:Marine`
- **Subsurface** → `Ecology:RefugiaStable`

Used in:
- Extinction selectivity
- Trophic resolution
- Colonization filters

## Need System Tags

Needs generate tags dynamically:

- If `Safety need > 0.7` → `Behavior:Crisis`
- If `Knowledge > 0.6` → `Behavior:CuriosityDriven`

These tags alter behavior selection priority.

## Civilization Tags

Derived from accumulated behaviors:

- Frequent `Raid` behavior → `Civilization:Militaristic`
- Frequent `Study` behavior → `Civilization:Scholarly`
- Frequent `Ritual` behavior → `Culture:Spiritual`

Tags decay over time unless reinforced.

## Climate Tags

Biomes automatically generate:
- `Climate:Arid`
- `Climate:Glacial`
- `Climate:Tropical`
- `Climate:Volcanic`

Species inherit environmental tags if majority population resides there.

## Event Tags

Mass extinction generates:
- `Event:Extinction`
- `Event:RadiationSpike`
- `Event:AnoxicCrisis`

Entities exposed to events gain:
- `Culture:Traumatized`
- `Behavior:RiskAverse`

If severity is high.

## Tag Inheritance Rules

Tags propagate through layers:

```
Planet → Biome → Species → Civilization
```

### Example

Planet has `Climate:HighRadiation`.

Species with `Biology:RadiationSensitive` automatically gets `Behavior:SurvivalStress`.

No manual logic required.

## Tag Query Engine

All systems use tag queries instead of condition trees.

### Instead of:
```typescript
if species.hasFlight and biome.isArid
```

### We do:
```typescript
if hasTag(Biology:Aerial) AND hasTag(Climate:Arid)
```

This keeps systems decoupled.

## Gameplay Explosion Mechanism

Tags enable emergent narrative.

### Example

**Species:**
- `Biology:NeuralComplex`
- `Ecology:ApexPredator`
- `Climate:Arid`
- `Event:ExtinctionSurvivor`

**Civilization:**
- `Behavior:Crisis`
- `Culture:Spiritual`
- `Civilization:Militaristic`

This becomes: "Desert warrior culture descended from extinction-resistant predators."

No scripted lore required.

## Storage Efficiency

Each entity stores:

```typescript
Uint32Array tagBitset
```

Bitmask representation for fast query and tiny memory footprint.

## Design Rationale

Tags are the glue because:
- Species modules map to tags
- Tags drive behavior
- Behavior creates civilization tags
- Civilization alters planet
- Planet modifies climate tags
- Climate alters species

Without tags, you hardcode condition trees. With tags, you compose systems.

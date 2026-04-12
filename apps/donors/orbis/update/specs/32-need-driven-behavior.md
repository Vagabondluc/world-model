# 🔒 NEED-DRIVEN BEHAVIOR SYSTEM v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Overview

The Need-Driven Behavior System is an **Entity-Level Motivational Engine** that simulates pressure resolution rather than psychology. It scales across multiple entity types and integrates cleanly with the deterministic planetary simulation.

## Core Principle

An entity does not act randomly. It acts to reduce the **highest weighted unmet need**.

## Core Data Structure

```typescript
type NeedId = uint32 // Enum index

interface NeedState {
  levelPPM: uint32      // 0..1_000_000 (0 = satisfied, 1M = critical)
  decayRatePPM: uint32  // per tick
  priorityWeightPPM: uint32
}

interface EntityNeeds {
  needs: NeedState[] // Index matches NeedId
}
```

**Important:** Needs are pressures, not resources.

---

## Behavior Selection Rule (Deterministic)

Each tick:

```typescript
// Score = (levelPPM * priorityWeightPPM) / 1_000_000
dominantNeedId = argmax(score)
```

The entity chooses a behavior that reduces that need. No randomness is used. Stable sorting by `NeedId` handles ties.

---

## 🔒 Compliance Test Vector

To ensure cross-platform parity, an implementation must pass this test:

**Inputs:**
- Need 1 (Energy): `level: 800_000`, `weight: 500_000`
- Need 2 (Safety): `level: 500_000`, `weight: 900_000`

**Calculation:**
1. `Energy Score = (800k * 500k) / 1M = 400_000`
2. `Safety Score = (500k * 900k) / 1M = 450_000`

**Result:** `dominantNeedId` = 2 (Safety)

## Behavior Definition

```typescript
interface Behavior {
  id: string
  targetNeed: NeedId
  effectStrength: number
  environmentalCost: number
  risk01: number
}
```

### Example Behaviors

**Energy:**
- Hunt
- Farm
- Raid
- Trade

**Safety:**
- BuildWalls
- Migrate
- Ally
- Arm

**Knowledge:**
- Study
- Explore
- Innovate

**Expansion:**
- Colonize
- Conquer

**Belief:**
- Ritual
- CulturalReform

## Need Satisfaction Formula

When behavior is executed:

```
need.level01 -= effectStrength
```

Side effects modify other needs.

### Example: Raid

- Reduces Energy
- Increases Power
- Increases Risk
- Increases Safety temporarily

## Integration With Planet System

Needs must read from simulation state.

### Energy Need Pressure

Influenced by:
- `localGPP`
- `populationDensity`
- `climateStability`

### Safety Need

Influenced by:
- `radiationStress`
- `predatorPresence`
- `warThreat`

### Expansion

Influenced by:
- `nicheGap`
- `unusedBiomes`

### Belief

Influenced by:
- `massExtinctionEvents`
- `astronomicalEvents`

## Scale Interpretation

### Individual

- Energy = hunger
- Safety = survival
- Social = companionship
- Knowledge = curiosity

### Tribe

- Energy = food supply
- Safety = defense
- Social = cohesion
- Knowledge = tool development
- Expansion = territory

### Civilization

- Energy = economic production
- Safety = geopolitical stability
- Knowledge = science
- Power = dominance
- Belief = ideology
- Expansion = empire

## Storage Efficiency

Each entity stores only:
- 8 needs
- 8 floats
- Behavior cooldowns

Very lightweight with no memory explosion.

## Feedback Loop With Biosphere

Civilization behaviors modify the planet:

- Overhunt → species population decreases
- Deforestation → `producerCoverage01` decreases
- Industrialization → carbon increases
- Nuclear war → radiation spike

The planet reacts, needs change again. Closed loop.

## Optional Advanced Layer: Cultural Memory

Add:

```typescript
historicalTrauma01
```

Increases Safety `priorityWeight` for N epochs after extinction or war. Deterministic.

## Design Benefits

- Scales from NPC to empire
- Deterministic
- Planet-reactive
- Generates emergent narratives
- Minimal CPU overhead
- Plug-and-play with D&D 6-second tick
- Works at geological scale

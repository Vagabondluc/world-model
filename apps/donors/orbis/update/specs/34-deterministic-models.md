# 🔒 DUAL-LAYER DETERMINISM MODEL (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Overview

The deterministic architecture splits reality into two layers: a fully deterministic **Physical Layer** and a weighted, minimal **Interpretive Layer** for narrative weight.

## Dual-Layer Architecture

### 1. Physical Layer (Immutable Determinism)

Everything in this layer is pure simulation:

- Climate
- Magnetosphere
- Carbon
- Biosphere capacity
- Species population
- Energy flow
- Extinction triggers
- Colonization
- Tag inheritance

No randomness, no narrative drift. Pure function of state + time.

This layer is the ground truth.

### 2. Interpretive Layer (Cheap Narrative Weight)

This is where:
- Consciousness
- AI decisions
- Beliefs
- Culture
- Myth
- Political drift

live.

This layer NEVER alters physical laws directly. It only:
- Selects behaviors
- Adjusts need weights
- Changes tag priorities
- Influences action selection

## Narrative Bias Storage

We do not store stories. We store only:

```typescript
interface NarrativeBias {
  axis: BiasAxis
  value: number   // -1..1
}
```

### Bias Axes

```typescript
enum BiasAxis {
  RiskTolerance,
  Expansionism,
  Spirituality,
  Rationalism,
  Aggression,
  Conservatism,
  Adaptability,
  Isolationism
}
```

Each civilization stores maybe 8 floats. No lore database.

## Deterministic AI Decision Formula

Behavior selection becomes:

```
score =
  needPressure *
  tagCompatibility *
  biasModifier *
  environmentalFeasibility
```

Where:

```
biasModifier = 1 + (biasValue * behaviorBiasAlignment)
```

All numbers, no randomness. Given identical state → identical decisions.

## Narrative Weight Without Randomness

Narrative weight emerges from:
- Rare events (mass extinction)
- Tag combinations
- Bias drift after trauma
- Consciousness reacting to pressure

Not from RNG.

### Example

Extinction event triggers:

```
Spirituality += 0.2
RiskTolerance -= 0.1
```

This biases future decisions. Memory stored as 2 float changes.

## Consciousness and Determinism

AI does not "decide freely." It runs deterministic evaluation on:
- Needs
- Tags
- Biases
- Planet state

This guarantees: Same initial state + same time → same history. Replayable universes.

## Narrative Emergence

Narrative emerges from interaction of:
- Refugia survivors
- Predator lineage
- Radiation-resistant traits
- Civilization bias
- Environmental collapse

The math produces the story.

## Storage Cost

### Civilization

- 8 needs
- 8 biases
- Tag bitset

### Species

- Genome modules
- Tag bitset

No event history log required for behavior. Only for archive display.

## Mythic Drift Option (Optional)

If fantasy emergence is desired, add:

```
MythicIntensity
```

When high:
- Bias effects amplified
- Belief-driven behaviors stronger
- Supernatural tag unlocked

Still deterministic. No chaos.

## Final Rule

Only two things can alter the world physically:
- Environmental systems
- Entity behaviors chosen deterministically

No hidden story layer.

## Deterministic Gameplay Model

### Definition

Gameplay = `State_t+1 = F(State_t)`

Where F includes:
- Physics
- Ecology
- Need resolution
- AI decisions
- Civilization behavior
- Tag propagation

No external entropy, no dice rolls.

### Autonomous Gameplay

You can:
- Start a planet
- Set seed
- Press run
- Watch millions of years unfold

The system will:
- Generate species
- Trigger extinctions
- Produce civilizations
- Cause wars
- Collapse ecosystems
- Create mythic cultures

Without player input.

### Player Role (Optional)

If a player exists, they do NOT inject randomness. They inject:

```
Action ΔState
```

Which then flows through the same deterministic engine.

Examples:
- Increase tectonics
- Introduce invasive species
- Collapse magnetosphere
- Boost knowledge need

From that point forward: still deterministic.

### Emergence Without Randomness

Randomness is not required for emergence. Complex nonlinear feedback is enough:

- Extinction → refugia → radiation
- Radiation → predator rise → prey collapse
- Collapse → cultural trauma → militarism
- Militarism → overhunt → biosphere drop
- Drop → extinction → restart

It feels chaotic. It isn't.

### Determinism Requirements

To maintain determinism:
- Avoid floating-point drift inconsistencies
- Fix tick order permanently
- Never allow unordered iteration
- Use stable sorting everywhere

If done correctly, you can run 1 billion years twice and get identical results.

### Important Caveat

Deterministic does NOT mean static. Sensitivity to initial conditions still applies.

Small differences in:
- Rotation speed
- Solar flux
- Core heat
- First oxygenation timing

will produce radically different worlds. But each world is internally stable.

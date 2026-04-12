# 141 Cultural Drift & Social Structures

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/82-sociological-ideology-tree.md`, `docs/brainstorm/85-elite-actor-character-engine.md`]
- `Owns`: [`cultural value dimensions`, `social structure aggregation`]
- `Writes`: [`ideology drift`, `faction alignment updates`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/141-cultural-drift-and-social-structures.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Model how individual character actions (Elite Actors) and faction pressures aggregate into long-term cultural shifts and changing social structures.

## 1. Value Dimensions
The simulation tracks `M` cultural dimensions (e.g., Collectivism vs Individualism, Tradition vs Innovation).
- These serve as the "Anchor Points" for the Ideology Tree (Spec 82).

## 2. Aggregation: Top-Down & Bottom-Up
- **Bottom-Up**: Successful actions by `Elite Actors` (Spec 85) apply a small drift to their parent `Faction` values.
- **Top-Down**: State policies (Spec 94) and "Narrative Control" (Spec 131) apply drift to the `Population Blocks`.

## 3. Structural Shifts
When a cultural dimension exceeds a threshold (e.g., Innovation > 800,000 PPM), it can unlock new "Social Structures."
- **Example**: High Innovation + High Individualism -> Unlocks "Academic Meritocracy."
- **Mechanical Effect**: Changes the `NeedWeight` values for the entire civilization (Spec 138).

## 4. Cultural Friction
- Divergence between `Elite` values and `Popular` values creates `population.unrest`.
- Institutions (Spec 84) act as "Stabilizers," resisting cultural drift until they reach a "Breaking Point" (Collapse).

## 5. Deterministic Evaluation
- Drift is calculated once per `EraTick` or after 100 `CivTicks` to represent slow-moving cultural changes.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

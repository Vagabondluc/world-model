# 126 Surplus Population And Tech Affordance

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/000-brainstorm-shared-clauses.md`, `docs/brainstorm/124-evolution-to-civilization-bridge.md`, `docs/brainstorm/80-impact-propagation-engine.md`]
- `Owns`: [`SurplusCapacityV1`, `PopulationStressV1`, `TechAffordanceBiasV1`]
- `Writes`: [`material precondition outputs for civ emergence`]

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/126-surplus-population-and-tech-affordance.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define material preconditions that transform cognition into sustained civilization complexity.

## Ecology -> Surplus Contract

```ts
interface SurplusCapacityV1 {
  surplusCapacityPPM: uint32
  resourcePredictabilityPPM: uint32
  mobilityConstraintPPM: uint32
  hazardPressurePPM: uint32
}
```

## Rules

- No durable institutional complexity without positive surplus capacity.
- Low predictability reduces specialization persistence.
- High mobility constraint reduces state-scale cohesion but can increase local autonomy.
- High hazard pressure amplifies centralization demand.

## Population -> Political Stress Contract

```ts
interface PopulationStressV1 {
  inequalityPressurePPM: uint32
  migrationPressurePPM: uint32
  urbanizationPressurePPM: uint32
  laborTensionPPM: uint32
}
```

These feed directly into the main pressure engine.

## Physiology -> Tech Affordance Bias

```ts
interface TechAffordanceBiasV1 {
  metallurgyBiasPPM: int32
  navigationBiasPPM: int32
  automationBiasPPM: int32
  informationBiasPPM: int32
  bioengineeringBiasPPM: int32
}
```

## Example Deterministic Biases

- Low fine manipulation -> metallurgy penalty
- Aquatic adaptation -> navigation bonus
- Hive cognition -> coordination/automation bonus, internal unrest damping
- Short lifespan -> weaker long-memory institutions unless compensated by transmission efficiency

## Energy Regime Coupling

Civilization acceleration is constrained by access to:
- biomass
- fossil/chemical
- geothermal
- magical/other setting-specific regime

No high-complexity industrial phase is allowed without sufficient energy surplus.

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

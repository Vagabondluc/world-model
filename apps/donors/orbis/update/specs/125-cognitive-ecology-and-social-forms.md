# 125 Cognitive Ecology And Social Forms

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/000-brainstorm-shared-clauses.md`, `docs/brainstorm/124-evolution-to-civilization-bridge.md`]
- `Owns`: [`SpeciesCognitiveInputsV1`, `CognitiveProfileV1`, `SocialFormTendencyV1`]
- `Writes`: [`cognitive profile outputs`, `social-form tendency outputs`]

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/125-cognitive-ecology-and-social-forms.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Specify how species traits become political and institutional tendencies.

## Input Contract

```ts
interface SpeciesCognitiveInputsV1 {
  symbolicReasoningPPM: uint32
  longTermPlanningPPM: uint32
  toolManipulationPPM: uint32
  communicationBandwidthPPM: uint32
  theoryOfMindPPM: uint32
  socialTolerancePPM: uint32
  learningTransmissionPPM: uint32
  environmentalMasteryPPM: uint32
}
```

## Derived Profile

```ts
interface CognitiveProfileV1 {
  abstractionPPM: uint32
  cooperationPPM: uint32
  aggressionPPM: uint32
  innovationRatePPM: uint32
  memoryDepthPPM: uint32
}
```

## Deterministic Mapping Rules

- `abstractionPPM` from symbolic reasoning + long-term planning
- `cooperationPPM` from social tolerance + theory of mind + communication bandwidth
- `innovationRatePPM` from abstraction + learning transmission + tool manipulation
- `memoryDepthPPM` from learning transmission + long-term planning
- `aggressionPPM` from inverse social tolerance and hazard pressure coupling

All mappings use fixed-point weighted sums and clamps.

## Social Form Tendencies

```ts
interface SocialFormTendencyV1 {
  federationBiasPPM: uint32
  hierarchyBiasPPM: uint32
  traditionBiasPPM: uint32
  scienceBiasPPM: uint32
}
```

## Example Tendencies

- High cooperation -> higher federation bias
- High dominance/aggression -> higher hierarchy bias
- High memory depth -> higher tradition bias
- High abstraction + innovation -> higher science bias

These are tendencies, not hard government locks.

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

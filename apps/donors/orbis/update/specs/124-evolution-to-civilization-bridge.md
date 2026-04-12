# 124 Evolution To Civilization Bridge

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/000-brainstorm-shared-clauses.md`, `docs/brainstorm/125-cognitive-ecology-and-social-forms.md`, `docs/brainstorm/126-surplus-population-and-tech-affordance.md`, `docs/brainstorm/127-civilization-emergence-trigger-engine.md`]
- `Owns`: [`bridge causality chain`, `Bridge output set requirements`]
- `Writes`: [`integration requirements for evolution->civilization pipeline`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/124-evolution-to-civilization-bridge.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define the missing causal bridge so civilization emerges from biology and ecology, not scripted spawning.

## Core Causality Chain

```text
species
-> cognition
-> social organization
-> material culture
-> technology
-> civilization
```

## Design Rule
Civilization systems MUST consume derived biological and ecological signals.  
No direct "spawn civilization" step is allowed in authoritative mode.

## Mandatory Bridge Outputs

- `CognitiveProfileV1`
- `SocialFormTendencyV1`
- `SurplusCapacityV1`
- `PopulationStressV1`
- `TechAffordanceBiasV1`
- `CivilizationEmergenceScoreV1`

## Minimum v1 Bridge (Practical)

Use this order:

1. Surplus capacity
2. Cognitive profile
3. Population pressure
4. Tech bias

This is enough to generate non-scripted divergence.

## Failure Mode To Avoid

```text
planet sim runs
-> time gate reached
-> civ actor appears
```

If this exists, the bridge is not implemented.

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

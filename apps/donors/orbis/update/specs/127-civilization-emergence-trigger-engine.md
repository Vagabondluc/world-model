# 127 Civilization Emergence Trigger Engine

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/000-brainstorm-shared-clauses.md`, `docs/brainstorm/124-evolution-to-civilization-bridge.md`, `docs/brainstorm/125-cognitive-ecology-and-social-forms.md`, `docs/brainstorm/126-surplus-population-and-tech-affordance.md`]
- `Owns`: [`CivilizationEmergenceScoreV1`, `emergence trigger thresholds`, `proto-institution seed trigger`]
- `Writes`: [`civilization emergence events`, `emergence blockers/accelerants`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/127-civilization-emergence-trigger-engine.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Purpose
Define the deterministic ignition point where pre-civil species transition into institutional history.

## Core Principle
Civilization is modeled as a phase transition:

```text
cognitive capacity
+ population density
+ surplus
+ communication reach
+ environmental pressure
-> institutionalization
```

No scripted "year X civilization appears" path is allowed in authoritative mode.

## Preconditions (Hard Gates)

If any hard gate fails, emergence is blocked.

- Intelligence threshold: symbolic planning capacity present
- Knowledge transmission threshold: language/imitation/memory continuity present
- Tool leverage threshold: stable environment-modification ability present

## Structural Drivers (Soft Pressures)

These pressures raise or lower emergence inevitability:

- Surplus production
- Population concentration
- Resource competition
- Environmental instability

## Inputs

- `CognitiveProfileV1`
- `SocialFormTendencyV1`
- `SurplusCapacityV1`
- `PopulationStressV1`
- `TechAffordanceBiasV1`
- `GeographyCohesionPPM`
- `InformationBandwidthPPM`

## Derived Score Contract

```ts
interface CivilizationEmergenceScoreV1 {
  scorePPM: uint32
  blockers: uint32[]      // reason codes
  accelerants: uint32[]   // reason codes
}
```

Conceptual score skeleton:

```text
emergence_score =
  cognition_weight
+ surplus_weight
+ density_weight
+ stress_weight
+ communication_weight
```

## Trigger Rule (v1)

Eligibility requires all hard gates plus minimum structural viability:

- `surplusCapacityPPM >= SURPLUS_MIN`
- `cooperationPPM >= COOP_MIN`
- `innovationRatePPM >= INNOVATION_MIN`
- `resourcePredictabilityPPM >= PREDICTABILITY_MIN`
- `GeographyCohesionPPM >= COHESION_MIN`

Trigger:

- if `scorePPM >= EMERGENCE_THRESHOLD_HIGH`, emit `CIV_EMERGENCE_TRIGGERED`
- else emit highest-priority blocker reason code

## First-Form Outputs (Proto-Institutions)

On trigger, initial outputs are proto-institutional rather than full state forms:

- Ritual/legitimacy authority
- Elder/council arbitration
- Redistribution and storage control
- Conflict mediation structures

These become seeds for later institutional differentiation.

## Lock-In Rule

Civilization lock-in is reached when modeled return-cost to small-group autonomy exceeds institutional maintenance cost for a sustained window.

## Species Flavor Mapping

Emergence flavor must be derived from biology/cognition:

- higher aggression -> warlord/martial first forms
- higher memory depth -> priesthood/tradition-first forms
- higher exchange bias -> merchant coordination forms
- hive cognition -> administrative swarm forms

## Geography Bias Mapping

- river-basin dominance -> bureaucratic coordination bias
- island fragmentation -> maritime federation bias
- steppe/open mobility -> mobile hierarchy bias

## Failure States

Proto-civilization collapse is valid and must be modeled:

- ecological overshoot
- epidemic collapse
- internal conflict cascade
- abrupt climate shift

On collapse, emit ruin/legacy records for later historical layers.

## Multi-Origin Rule

Independent ignition in multiple regions is allowed in the same world:

- origin A and B can emerge separately
- then interact by trade, conflict, diffusion, assimilation

## Post-Ignition Unlock Contract

Only after `CIV_EMERGENCE_TRIGGERED`:

- formal politics
- class/economic stratification
- infrastructure planning
- doctrine/government branching
- recorded-history pipelines

## Stability Guardrails

- No single-tick ignition.
- Require persistence window `N` ticks above rise threshold.
- Use hysteresis: `EMERGENCE_THRESHOLD_HIGH > EMERGENCE_THRESHOLD_LOW`.
- Deterministic tie-breaks use `hash(seed, tick, originId)`.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

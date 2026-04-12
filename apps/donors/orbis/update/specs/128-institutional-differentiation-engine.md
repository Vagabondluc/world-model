# 128 Institutional Differentiation Engine

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/000-brainstorm-shared-clauses.md`, `docs/brainstorm/127-civilization-emergence-trigger-engine.md`]
- `Owns`: [`InstitutionalDifferentiationInputsV1`, `InstitutionSeedV1`, `InstitutionalGenomeV1`]
- `Writes`: [`institution seed outputs`, `autonomy/rivalry transition signals`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/128-institutional-differentiation-engine.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Purpose
Define how early unified authority splits into specialized institutions (military, religion, trade, science, administration).

## Context
This engine runs after civilization ignition (`127`) and transforms proto-institution seeds into durable power structures.

## Prime Causal Chain

```text
coordination
-> delegation
-> specialization
-> independence
-> power
-> politics
```

## Input Contract

```ts
interface InstitutionalDifferentiationInputsV1 {
  socialForm: SocialFormTendencyV1
  populationStress: PopulationStressV1
  surplus: SurplusCapacityV1
  narrativeCohesionPPM: uint32
  conflictPressurePPM: uint32
  knowledgeAccumulationPPM: uint32
  tradeComplexityPPM: uint32
}
```

## Output Contract

```ts
interface InstitutionSeedV1 {
  institutionType: "military" | "religious" | "trade" | "scientific" | "administrative"
  initialPowerPPM: uint32
  legitimacySource: uint32   // reason-code keyed source category
  captureRiskPPM: uint32
}
```

## Universal Differentiation Pressures

- scale pressure (population and territory size)
- information load pressure (decision volume)
- technical complexity pressure (expertise requirement)
- conflict pressure (coercive continuity requirement)

When these pressures rise, unified authority must split.

## First Branches (v1 Baseline)

The first institutional categories expected in most runs:

- coercion and defense
- belief and legitimacy
- resource management
- knowledge and record-keeping

They may begin fused but must be allowed to separate.

## Institutional Genome

Each institution should be tracked using:

```ts
interface InstitutionalGenomeV1 {
  purposeKey: uint32
  powerBaseKey: uint32
  resourceDependencyKey: uint32
  loyaltyStructureKey: uint32
  knowledgeControlKey: uint32
  violenceAccessKey: uint32
}
```

## Differentiation Triggers

- Rising conflict pressure -> military specialization
- Rising narrative cohesion + memory depth -> religious/tradition specialization
- Rising surplus + exchange complexity -> trade specialization
- Rising abstraction + knowledge accumulation -> scientific specialization
- Rising territory/coordination complexity -> administrative specialization

## Deterministic Rule

For each institution type:

```text
activation_score(type) =
  driver_weights(type) . input_vector
```

- Activate when `activation_score(type) >= TYPE_THRESHOLD`
- Seed power by normalized overflow above threshold
- Enforce bounded number of simultaneous early institutions in v1

## Autonomy Growth Rule

Institution autonomy rises when it has:

- direct resource control
- scarce expertise monopoly
- independent loyalty base
- veto/blocking capacity over central decisions

Above autonomy threshold, institution is treated as a political actor.

## Conflict and Competition

Institutions compete for:

- legitimacy
- budget/resource capture
- policy influence

Competition outputs feed pressure loops and actor generation layers.

Competition channels:

- budget contest
- narrative contest
- succession influence contest
- jurisdiction overlap contest

## Failure and Drift

- Failed institutions can be absorbed, fragmented, or captured.
- Surviving institutions persist through regime changes unless explicitly dismantled.

## Capture and Fragmentation

- individual actors may capture institutions when network power exceeds institutional safeguards
- over-fragmentation can trigger governance paralysis and forced re-centralization cycles

## Biology and Species Flavor

Differentiation profile must remain species-sensitive:

- hive cognition -> lower differentiation tendency
- long-lived species -> stronger institutional inertia
- high aggression species -> stronger coercive branch weight
- high abstraction species -> stronger science-record branch weight

## Cross-Scale Visibility Contract

- local scale: institution represented by physical sites and operational units
- mid scale: institution represented by agencies/blocs and influence maps
- macro scale: institution represented by power indices and legitimacy vectors

## Why This Matters

This is where authority becomes politics: once functions split, conflicts of mandate become systemic rather than event-scripted.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

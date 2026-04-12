# 🔒 NARRATIVE AND MYTH PRODUCTION ENGINE SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/00-core-foundation/02-metric-registry.md`, `docs/specs/00-core-foundation/03-threshold-registry.md`, `docs/specs/70-governance-benchmarks/84-legitimacy-and-authority-engine.md`, `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`]
- `Owns`: [`NarrativeArtifactIdV1`, `ActorIdV1`, `EventIdV1`, `NarrativePopulationBlockIdV1`, `NarrativeInputsV1`, `NarrativeArtifactV1`, `NarrativeAdoptionStateV1`]
- `Writes`: [`narrative artifacts`, `adoption/polarization outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/specs/70-governance-benchmarks/85-narrative-and-myth-production-engine.md`
- `STATUS`: `FROZEN`

## Unit Policy
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedUnitPolicyClauseV1); numeric authority follows `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`.

## Reason Code Integration
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedReasonCodeIntegrationClauseV1); reason-code authority follows `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`.

## Deterministic Conformance
- Ordering/tie-break conformance follows `docs/specs/30-runtime-determinism/139-deterministic-rule-conformance.md` (DeterministicOrderingConformanceRuleV1).
- Clamp/saturation conformance follows `docs/specs/30-runtime-determinism/139-deterministic-rule-conformance.md` (DeterministicClampConformanceRuleV1).
## Purpose
Define how raw events become beliefs, myths, and identity commitments that recursively shape political behavior.

## Non-Ownership
- This file owns narrative artifact production and adoption dynamics.
- Divergence metric bounds are owned by `docs/specs/00-core-foundation/02-metric-registry.md`.
- Threshold trigger definitions are owned by `docs/specs/00-core-foundation/03-threshold-registry.md`.

## Context
This engine follows `129-legitimacy-and-authority-engine.md` and supplies the cultural-meaning layer that modulates authority, compliance, and conflict.

## Core Principle

Behavior follows interpreted reality, not raw reality.

```text
event -> narrative -> belief -> political behavior -> new events
```

## Inputs (Raw Event Layer)

Facts come from canonical ledger/chronicler systems (`97`) and are interpretation-neutral:

- famine
- war loss/victory
- assassination
- scientific breakthrough
- migration wave
- reform/crackdown

## Actor Competition (Meaning Layer)

Narrative framers:

- rulers
- rebels
- clergy
- merchants
- intellectuals
- foreign influence actors

Each source proposes a causal frame for the same event.

## Contracts

```ts
type NarrativeArtifactIdV1 = string
type ActorIdV1 = string
type EventIdV1 = string
type NarrativePopulationBlockIdV1 = string

interface NarrativeInputsV1 {
  objectiveEventIds: EventIdV1[]
  sourceTrustPPM: PpmInt
  sourceReachPPM: PpmInt
  institutionalBiasPPM: SignedPpmInt
  identityAffinityPPM: PpmInt
  censorshipIntensityPPM: PpmInt
  crisisIntensityPPM: PpmInt
}

interface NarrativeArtifactV1 {
  artifactId: NarrativeArtifactIdV1
  sourceActorId: ActorIdV1
  eventId: EventIdV1
  narrativeKey: string
  scope: "local" | "regional" | "civilizational"
  tone: "heroic" | "tragic" | "bureaucratic" | "propagandist" | "revisionist"
  assignedHeroes: ActorIdV1[]
  assignedVillains: ActorIdV1[]
  assignedLessons: string[]
  beliefShiftPPM: SignedPpmInt
  mythRetentionPPM: PpmInt
}

interface NarrativeAdoptionStateV1 {
  populationBlockId: NarrativePopulationBlockIdV1
  artifactId: NarrativeArtifactIdV1
  adoptionPPM: PpmInt
  polarizationPPM: PpmInt
}
```

## Narrative Construction Requirements

Every narrative artifact should encode:

- heroes
- villains
- causal explanation
- moral lesson
- future obligation

## Narrative Source Classes

- state institutions
- religious institutions
- market/media institutions
- academic archives
- underground/counter-power networks
- external actors

Each source has independent trust and reach curves by population block.

## Adoption Mechanism

Adoption is computed per population block by:

- trust in source
- compatibility with existing myths
- emotional resonance
- material self-interest
- repetition/media saturation

This guarantees uneven belief spread.

## Institutionalization

When adoption persists above threshold, narrative hardens into:

- doctrine
- ritual
- educational canon
- taboo

Institutionalized narratives gain inertia and affect policy tolerance.

## Myth Hardening Rules

Narratives become myths when:

- repetition persistence is high
- identity affinity is high
- contradiction cost is high
- institutional reinforcement is continuous

Myths then become slow-moving priors in legitimacy calculations.

Hardening effects:

- detail compression
- symbolic amplification
- contradiction suppression

## Competing Truth Systems And Polarization

Parallel narratives can coexist.

When major narratives diverge beyond tolerance:

- contested legitimacy increases
- authority fragmentation pressure increases
- civil conflict probability increases

## Myth vs Material Reality

If lived material reality contradicts dominant myth beyond tolerance window:

- trust shock increases
- legitimacy collapses or narrative reform attempts trigger
- regime crisis probability increases

## Crisis Dynamics

During crisis:

- narrative volatility increases
- trust can reallocate rapidly between sources
- myth creation speed increases

## Elite Manipulation Constraints

Institutions can amplify/suppress/rewrite/manufacture narratives, but credibility and lived-condition constraints cap durable effect.

## Decay, Revision, Drift, Rediscovery

Narrative artifacts must support:

- decay (fading salience)
- revision (reinterpretation under new regimes)
- archive recovery (rediscovery shocks)

Generational drift must be modeled:

- heroes can invert to villains
- defeats can transform into martyr myths
- obligations can weaken or radicalize

Geographic divergence must be modeled:

- different regions can stabilize incompatible memory traditions from same event chain

## Cross-Layer Outputs

Feeds:

- `129` legitimacy weighting
- `96` fragmentation escalation
- `97` chronicler historiography variants
- `87` player-facing explainability

## Why This Matters

Without this layer, civilization is a mechanical timeline.  
With this layer, civilization has memory, identity, and contested meaning that drives future history.

## Compliance Vector (v1)
Input:
- `artifactId = "nar_001"`
- `adoptionPPM = 750_000` sustained for persistence window
- `identityAffinityPPM = 700_000`
- `institutionalReinforcement = active`

Expected:
- Myth hardening condition passes.
- Institutionalization output set (`doctrine/ritual/canon` eligible).
- `system.myth_adoption` threshold maps to reason code `970201` when crossing registered trigger.

## Promotion Notes
- Supersedes: `docs/brainstorm/86-information-narrative-engine.md` (narrative production scope).



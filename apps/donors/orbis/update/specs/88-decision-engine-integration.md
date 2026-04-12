# 🔒 DECISION ENGINE INTEGRATION SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/70-governance-benchmarks/84-legitimacy-and-authority-engine.md`, `docs/specs/70-governance-benchmarks/85-narrative-and-myth-production-engine.md`, `docs/specs/70-governance-benchmarks/86-information-control-and-media-engine.md`, `docs/specs/70-governance-benchmarks/87-collective-emotion-engine.md`, `docs/specs/30-runtime-determinism/39-deterministic-utility-decision.md`]
- `Owns`: [`DecisionMetricKeyV1`, `DecisionResourceKeyV1`, `DecisionAsabiyaPPM`, `DecisionCloutPPM`, `DecisionContextV1`, `GoalProfileV1`]
- `Writes`: [`actor decisions`, `action selection events`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/specs/70-governance-benchmarks/88-decision-engine-integration.md`
- `STATUS`: `FROZEN`

## Purpose
Connect pressures, institutions, legitimacy, narratives, information flow, and emotions into one actionable behavior engine.

## Core Principle

Actors do not act on raw truth. They act on perceived state:

```text
perceived reality
-> goal filter
-> capability constraints
-> emotional and ideological weighting
-> action choice
```

This produces situational rationality, not global optimality.

## Decision Actors

All actor classes should use the same decision interface:

- leaders
- institutions
- factions
- civilizations
- external powers
- higher-order entities (future layers)

## Standard Decision Context Contract

```ts
type DecisionMetricKeyV1 = string
type DecisionResourceKeyV1 = string
type DecisionAsabiyaPPM = PpmInt // 0..1_000_000
type DecisionCloutPPM = PpmInt // 0..1_000_000

interface DecisionContextV1 {
  pressures: Record<DecisionMetricKeyV1, SignedPpmInt>
  legitimacy: Record<DecisionMetricKeyV1, PpmInt>
  factionClout: Record<string, DecisionCloutPPM> // factionId -> clout share, expected sum = 1_000_000
  systemAsabiyaPPM: DecisionAsabiyaPPM
  emotionalState: EmotionStateV1
  narrativeAlignment: Record<string, SignedPpmInt>
  resourcePosition: Record<DecisionResourceKeyV1, number>
  threatEstimate: Record<string, PpmInt>
  opportunityMap: Record<string, PpmInt>
}
```

Conformance note:
- `factionClout` must be normalized using the shared rule block in `docs/specs/70-governance-benchmarks/84-legitimacy-and-authority-engine.md` ("Cross-Spec Conformance: Shared Clout Normalization Rule (v1)").

Uniform context allows one framework across all scales.

## Goal Model

```ts
interface GoalProfileV1 {
  remainInPowerPPM: PpmInt
  economicGrowthPPM: PpmInt
  ideologicalPurityPPM: PpmInt
  territorialSecurityPPM: PpmInt
  institutionalAutonomyPPM: PpmInt
}
```

Goal weight divergence is a primary conflict source.

## Capability Filter

An action is only eligible if capability constraints pass.

Examples:

- no naval capacity -> no naval invasion action
- low legitimacy + high stress -> reform action risk multiplier
- low treasury -> infrastructure expansion blocked

## Perception Model Integration

Decision logic must consume perceived state, not objective state, where applicable:

- narrative systems (`130`) shape interpretation
- media systems (`131`) shape visibility and confidence
- trust systems (`129`) shape source weighting

## Emotion Modifiers

Emotion fields from `132` modify risk and time preference:

- fear high -> risk aversion increases
- anger high -> confrontational actions weighted upward
- humiliation high -> radical/revenge actions weighted upward
- hope high -> reform and long-horizon investments weighted upward

## Action Library Contract

Finite action vocabulary in v1:

- reform
- repress
- negotiate
- invade
- propagandize
- invest
- purge
- decentralize

All actions reference canonical action definitions (`90`).

## Utility Estimation

For each candidate action:

```text
utility =
  expected_goal_gain
  - expected_cost
  - expected_risk
```

Then apply:

- ideology bias
- institutional bias
- emotion bias
- horizon weighting
- clout/asabiya mobilization weighting

### Clout/Asabiya Mobilization Weight

```text
mobilizationWeightPPM = mulPPM(dominantSupportCloutPPM, systemAsabiyaPPM)
utilityAdjusted = utilityBase + mulPPM(utilityBase, mobilizationWeightPPM)
```

Bounds:
- `dominantSupportCloutPPM`: `0..1_000_000`
- `systemAsabiyaPPM`: `0..1_000_000`
- `mobilizationWeightPPM`: `0..1_000_000`

## Time Horizon

Actors must carry horizon profile:

- short
- medium
- long

Horizon changes action preference and tolerance for near-term pain.

## Institutional Bias

Default directional bias examples:

- military institutions prefer coercive and security actions
- religious institutions prefer legitimacy and moral-order actions
- trade institutions prefer stability and growth actions
- scientific institutions prefer knowledge and system-upgrade actions

## Internal Politics Gate

Before commit, actor must pass internal support gate:

- coalition support check
- veto check
- legitimacy tolerance check

If gate fails, emit blocked/failed action event and optional instability increase.

## Commit Path

Chosen action must be injected as ledger event:

```text
decision -> action_event -> downstream system reactions
```

This closes simulation recursion.

## Determinism Rules

- identical decision context + identical actor profile -> identical selected action
- seeded tie-break randomness allowed only through deterministic hash path
- tie-break source and score contributions must be explainable

## Cross-Scale Rule

Local and macro actors share the same framework; only context granularity and action subset differ.

## Feedback Loop

```text
decision
-> consequence
-> emotion update
-> legitimacy update
-> narrative/media update
-> next decision
```

## Why This Matters

Without this integration, prior systems remain descriptive.  
With this integration, systems become behavioral and history self-propels.

## Unit Policy
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedUnitPolicyClauseV1); numeric authority follows `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`.

## Reason Code Integration
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedReasonCodeIntegrationClauseV1); reason-code authority follows `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`.

## Deterministic Conformance
- Ordering/tie-break conformance follows `docs/specs/30-runtime-determinism/139-deterministic-rule-conformance.md` (DeterministicOrderingConformanceRuleV1).
- Clamp/saturation conformance follows `docs/specs/30-runtime-determinism/139-deterministic-rule-conformance.md` (DeterministicClampConformanceRuleV1).
- Clout normalization conformance follows `docs/specs/30-runtime-determinism/139-deterministic-rule-conformance.md` (DeterministicNormalizationConformanceRuleV1).

## Compliance Vector (v1)
Input:
- two eligible actions: `reform`, `repress`
- base utility:
  - `reform = 500_000`
  - `repress = 520_000`
- support clout:
  - reform coalition `dominantSupportCloutPPM = 650_000`
  - repress coalition `dominantSupportCloutPPM = 300_000`
- `systemAsabiyaPPM = 700_000`

Expected:
- reform:
  - `mobilizationWeightPPM = mulPPM(650_000, 700_000) = 455_000`
  - `utilityAdjusted = 500_000 + mulPPM(500_000, 455_000) = 727_500`
- repress:
  - `mobilizationWeightPPM = mulPPM(300_000, 700_000) = 210_000`
  - `utilityAdjusted = 520_000 + mulPPM(520_000, 210_000) = 629_200`
- Selected action is `reform`.
- Commit emits deterministic action event.
- If scores are equal, tie-break follows fixed order (`dominantNeedRelief`, then risk, cost, actionId, hash).

## Promotion Notes
- No predecessor; new canonical orchestration contract.
- Boundary with solver core: `docs/specs/30-runtime-determinism/39-deterministic-utility-decision.md` remains solver-grade utility core; this file owns orchestration/context integration across pressures, legitimacy, narrative, media, and emotion.

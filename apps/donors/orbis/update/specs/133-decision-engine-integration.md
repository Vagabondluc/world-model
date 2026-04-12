# 133 Decision Engine Integration

SpecTier: Contract

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`, `docs/brainstorm/129-legitimacy-and-authority-engine.md`, `docs/brainstorm/130-narrative-and-myth-production-engine.md`, `docs/brainstorm/131-information-control-and-media-engine.md`, `docs/brainstorm/132-collective-emotion-engine.md`, `docs/brainstorm/90-action-defs-and-deterministic-preview-model.md`]
- `Owns`: [`DecisionContextV1`, `GoalProfileV1`, `Decision selection contract`]
- `Writes`: [`actor decisions`, `action selection events`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/133-decision-engine-integration.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

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
type MetricKeyV1 = string
type ResourceKeyV1 = string

interface DecisionContextV1 {
  pressures: Record<MetricKeyV1, SignedPpmInt>
  legitimacy: Record<MetricKeyV1, PpmInt>
  emotionalState: EmotionStateV1
  narrativeAlignment: Record<string, SignedPpmInt>
  resourcePosition: Record<ResourceKeyV1, number>
  threatEstimate: Record<string, PpmInt>
  opportunityMap: Record<string, PpmInt>
}
```

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

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Compliance Vector (v1)
Input:
- `DecisionContextV1` fixed snapshot with two eligible actions: `reform`, `repress`
- Scored outputs from utility stage:
  - `reform = 520_000`
  - `repress = 470_000`

Expected:
- Selected action is `reform`.
- Commit emits deterministic action event.
- If scores are equal, tie-break follows fixed order (`dominantNeedRelief`, then risk, cost, actionId, hash).

## Promotion Notes
- No predecessor; new canonical orchestration contract.
- Boundary with solver core: `docs/specs/30-runtime-determinism/39-deterministic-utility-decision.md` remains solver-grade utility core; this file owns orchestration/context integration across pressures, legitimacy, narrative, media, and emotion.

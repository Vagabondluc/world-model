# 🔒 LEGITIMACY AND AUTHORITY ENGINE SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/00-core-foundation/02-metric-registry.md`, `docs/specs/00-core-foundation/03-threshold-registry.md`, `docs/specs/70-governance-benchmarks/82-government-transition-system.md`, `docs/specs/70-governance-benchmarks/83-civil-war-fragmentation-simulator.md`, `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`]
- `Owns`: [`InstitutionIdV1`, `PopulationBlockIdV1`, `AuthorityAsabiyaPPM`, `AuthorityCloutPPM`, `FrontierFactorPPM`, `LegitimacyAuthorityInputsV1`, `AuthorityStateV1`, `PopulationBlockLegitimacyV1`, `AuthorityContestInputV1`]
- `Writes`: [`legitimacy/compliance state`, `defection/contestation signals`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/specs/70-governance-benchmarks/84-legitimacy-and-authority-engine.md`
- `STATUS`: `FROZEN`

## Unit Policy
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedUnitPolicyClauseV1); numeric authority follows `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`.

## Reason Code Integration
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedReasonCodeIntegrationClauseV1); reason-code authority follows `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`.

## Deterministic Conformance
- Ordering/tie-break conformance follows `docs/specs/30-runtime-determinism/139-deterministic-rule-conformance.md` (DeterministicOrderingConformanceRuleV1).
- Clamp/saturation conformance follows `docs/specs/30-runtime-determinism/139-deterministic-rule-conformance.md` (DeterministicClampConformanceRuleV1).
- Clout normalization conformance follows `docs/specs/30-runtime-determinism/139-deterministic-rule-conformance.md` (DeterministicNormalizationConformanceRuleV1).
## Purpose
Define why populations obey one institution over another and how obedience shifts into rebellion.

## Non-Ownership
- This file owns shared clout normalization conformance.
- It does not own generic metric registry keys (`02`) or threshold registry keyspace (`03`).

## Core Principle

Authority is not only force. It is force plus accepted legitimacy.

```text
compliance_capacity + legitimacy_perception -> effective_authority
```

Legitimacy is the conversion:

```text
power -> acceptance
```

## Input Contract

```ts
type InstitutionIdV1 = string
type PopulationBlockIdV1 = string
type AuthorityAsabiyaPPM = PpmInt // 0..1_000_000
type AuthorityCloutPPM = PpmInt // 0..1_000_000
type FrontierFactorPPM = number // 1_000_000..1_250_000

interface LegitimacyAuthorityInputsV1 {
  institutionId: InstitutionIdV1
  coerciveCapacityPPM: PpmInt
  servicePerformancePPM: PpmInt
  narrativeTrustPPM: PpmInt
  proceduralFairnessPPM: PpmInt
  traditionAlignmentPPM: PpmInt
  corruptionPPM: PpmInt
  materialStressPPM: PpmInt
}

interface AuthorityContestInputV1 {
  institutionId: InstitutionIdV1
  compliancePPM: PpmInt
  asabiyaPPM: AuthorityAsabiyaPPM
  institutionCloutPPM: AuthorityCloutPPM
  frontierFactorPPM: FrontierFactorPPM
}
```

## Derived State Contract

```ts
interface AuthorityStateV1 {
  legitimacyPPM: PpmInt
  compliancePPM: PpmInt
  defectionRiskPPM: PpmInt
  contestationLevelPPM: PpmInt
}
```

## Legitimacy Sources

Supported legitimacy channels (weighted by ideology/government form):

- performance legitimacy (order, prosperity, safety)
- procedural legitimacy (law, representation, fairness)
- traditional legitimacy (custom, religion, continuity)
- coercive legitimacy (fear-backed compliance with low trust)
- identity legitimacy (shared in-group alignment)

## Population-Local Legitimacy

Legitimacy must be computed per population block, not globally.

```ts
interface PopulationBlockLegitimacyV1 {
  blockId: PopulationBlockIdV1
  legitimacyPPM: PpmInt
  obedienceStage: "loyalty" | "compliance" | "resistance" | "rebellion"
}
```

Different blocks can simultaneously support and reject the same authority.

## Cross-Spec Conformance: Shared Clout Normalization Rule (v1)

Canonical owner for clout normalization is this section and must be used by:
- `docs/specs/70-governance-benchmarks/80-sociological-ideology-tree.md`
- `docs/specs/70-governance-benchmarks/88-decision-engine-integration.md`

Normalization rule:
1. Clout inputs are non-negative `PpmInt`.
2. Sum all active clout entries: `S = sum(clout_i)`.
3. If `S == 0`, assign equal clout by deterministic key order (ascending id), then normalize.
4. Else compute `clout_i_norm = floor((clout_i * 1_000_000) / S)`.
5. Compute remainder `R = 1_000_000 - sum(clout_i_norm)`.
6. Distribute `R` one unit at a time by deterministic key order (ascending id).

Post-condition:
- `sum(clout_i_norm) == 1_000_000` exactly.
- For identical inputs and id ordering, normalized clout is bit-identical.

## Conceptual Legitimacy Score

For each population block:

```text
legitimacy =
  alignment_with_values
  + perceived_performance
  + narrative_control
  + coercive_presence
  - grievance
```

All terms are deterministic fixed-point values in implementation contracts.

## Deterministic Update Rules

Per tick:

```text
legitimacy_next =
  legitimacy_prev
  + performance_gain
  + procedural_gain
  + tradition_gain
  - corruption_penalty
  - stress_penalty
```

```text
compliance_next =
  f(legitimacy_next, coercive_capacity, narrative_trust)
```

All terms are fixed-point and clamped.

## Obedience Threshold Bands

- high legitimacy -> loyalty
- medium legitimacy -> passive compliance
- low legitimacy -> resistance behavior
- very low legitimacy -> rebellion eligibility

Band transitions must emit reason-coded events.

## Authority Contest Resolution

When multiple institutions claim authority over same scope:

1. compute `effectiveAuthorityPPM = mulPPM(compliancePPM, asabiyaPPM)`
2. compute `frontierAdjustedAuthority = mulPPM(effectiveAuthorityPPM, frontierFactorPPM)` using scaled multiplier
3. compute `contestScorePPM = mulPPM(frontierAdjustedAuthority, institutionCloutPPM)`
4. compare contest scores
2. apply local narrative/trust modifier
3. apply coercive override if above coercion threshold
4. emit reason codes for winner and loser pathways

Winner criteria by block should prioritize:

- delivered security
- justice/procedural trust
- material provisioning
- identity/narrative alignment

Bounds:
- `asabiyaPPM`: `0..1_000_000`
- `institutionCloutPPM`: `0..1_000_000`
- `frontierFactorPPM`: `1_000_000..1_250_000` (`1.0x..1.25x`)
- if `asabiyaPPM < 200_000`, mark institution as high-fracture risk for contest pathways.

## Rebellion Trigger Conditions

Rebellion risk rises when:

- legitimacy low for persistence window
- material stress high
- defection networks present
- rival authority available

Trigger outputs:

- protest wave
- institutional non-compliance
- parallel authority formation
- open insurgency

## Coercion vs Legitimacy Tradeoff

Short-term repression can increase compliance while degrading medium/long-term legitimacy.

```text
coercion_spike -> compliance_up (short) + legitimacy_down (long)
```

This tradeoff is mandatory; repression cannot be a free stabilizer.

## Crisis Sensitivity

During crisis windows:

- performance legitimacy weight increases
- traditional legitimacy weight decreases
- authority replacement likelihood rises if alternatives exist

## Elite vs Popular Legitimacy

System must track at least two aggregates:

- elite coalition legitimacy
- mass population legitimacy

Instability risk is high when either one collapses; regime fragility is extreme when both collapse.

## Legitimacy Decay and Renewal

Legitimacy decays unless refreshed through:

- visible victories
- reform delivery
- ritual/tradition reinforcement
- sustained prosperity and fairness

## Geographic and Infrastructure Modulation

- remote zones reduce central authority projection and narrative trust
- communication latency increases local authority divergence

## Technological Modulation

- higher communication bandwidth increases exposure to performance failures
- higher communication bandwidth also increases loyalty coordination and mandate campaigns

Both effects must be modeled.

## Stability and Oscillation

System should support realistic oscillation:

- legitimacy crises can lead to repression and short-term compliance spikes
- prolonged low legitimacy causes delayed but larger authority fracture

## Cross-Layer Outputs

Feeds:

- government transition engine (`95`)
- civil war and fragmentation engine (`96`)
- chronicler narratives (`97`)
- player control bridge warnings (`87`)

## Why This Matters

Without this engine, institutional power is static.  
With it, political order becomes dynamic and historically plausible.

## Compliance Vector (v1)
Input:
- Institution A:
  - `compliancePPM = 700_000`
  - `asabiyaPPM = 600_000`
  - `institutionCloutPPM = 550_000`
  - `frontierFactorPPM = 1_000_000`
- Institution B:
  - `compliancePPM = 650_000`
  - `asabiyaPPM = 800_000`
  - `institutionCloutPPM = 450_000`
  - `frontierFactorPPM = 1_250_000`

Expected:
- A:
  - `effectiveAuthorityPPM = mulPPM(700_000, 600_000) = 420_000`
  - `frontierAdjustedAuthority = 420_000`
  - `contestScorePPM = mulPPM(420_000, 550_000) = 231_000`
- B:
  - `effectiveAuthorityPPM = mulPPM(650_000, 800_000) = 520_000`
  - `frontierAdjustedAuthority = mulPPM(520_000, 1_250_000) = 650_000`
  - `contestScorePPM = mulPPM(650_000, 450_000) = 292_500`
- Winner is Institution B with deterministic score ordering and reason-coded contest output.

## Promotion Notes
- No predecessor; new canonical contract.



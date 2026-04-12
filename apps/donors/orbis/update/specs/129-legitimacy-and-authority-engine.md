# 129 Legitimacy And Authority Engine

SpecTier: Contract

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/000-brainstorm-shared-clauses.md`, `docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`, `docs/brainstorm/128-institutional-differentiation-engine.md`]
- `Owns`: [`LegitimacyAuthorityInputsV1`, `AuthorityStateV1`, `PopulationBlockLegitimacyV1`]
- `Writes`: [`legitimacy/compliance state`, `defection/contestation signals`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/129-legitimacy-and-authority-engine.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.
## Purpose
Define why populations obey one institution over another and how obedience shifts into rebellion.

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

## Authority Contest Resolution (Hardened)

When multiple institutions claim authority over same scope:

1. **Effective Authority**: `EffectiveAuthority = mulPPM(CompliancePPM, system.asabiya)`
2. **Metaethnic Frontier Factor**: Institutions near cultural "fault lines" gain a `+25%` Asabiya multiplier (Turchin's Theory).
3. **Local Narrative**: apply local narrative/trust modifier.
4. **Coercive Override**: apply coercive override if above coercion threshold.
5. **Reason Code Emission**: emit reason codes for winner and loser pathways.

Winner criteria by block should prioritize:

- delivered security
- justice/procedural trust
- material provisioning
- identity/narrative alignment

## Rebellion Trigger Conditions (Cliodynamic Integration)

Rebellion risk rises when:

- **Asabiya Collapse**: `system.asabiya < 200,000` leads to institutional disintegration.
- **Legitimacy Deficit**: legitimacy low for persistence window.
- **Elite Overproduction**: (Post-MVP) `actor.influence` cluster > `economy.growth` capacity.
- **Rival Authority**: rival authority available with higher `EffectiveAuthority`.

Trigger outputs:

- protest wave
- institutional non-compliance
- parallel authority formation
- open insurgency

## Coercion vs Legitimacy Tradeoff

Short-term repression can increase compliance while degrading medium/long-term legitimacy.

```text
coercion_spike -> compliance_up (short) + legitimacy_down (long)
asabiya_penalty -> prolonged coercion reduces the ability for collective defense
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
- `legitimacy_prev = 500_000`
- `performance_gain = +40_000`
- `procedural_gain = +20_000`
- `tradition_gain = +10_000`
- `corruption_penalty = -30_000`
- `stress_penalty = -20_000`

Expected:
- `legitimacy_next = 520_000`
- Obedience stage remains `compliance` (not `resistance`) for a mid-band threshold model.

## Promotion Notes
- No predecessor; new canonical contract.



# 🔒 SOCIOLOGICAL IDEOLOGY TREE SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/00-core-foundation/02-metric-registry.md`, `docs/specs/00-core-foundation/03-threshold-registry.md`, `docs/specs/70-governance-benchmarks/79-impact-propagation-engine.md`, `docs/specs/70-governance-benchmarks/84-legitimacy-and-authority-engine.md`, `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`]
- `Owns`: [`IdeologyAsabiyaPPM`, `IdeologyCloutPPM`, `IdeologyVectorV1`, `PressureModifierRuleV1`, `RadicalizationTriggerV1`, `IdeologyProfileV1`, `IdeologyDriftRuleV1`, `IdeologyDriftContextV1`]
- `Writes`: [`ideology-adjusted pressure modifiers`, `faction divergence signals`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/specs/70-governance-benchmarks/80-sociological-ideology-tree.md`
- `STATUS`: `FROZEN`

## Purpose
Define a deterministic value-system layer that interprets societal pressures so identical tech paths can produce different historical outcomes.

## Non-Ownership
- Clout/asabiya normalization ownership is canonical in `docs/specs/70-governance-benchmarks/84-legitimacy-and-authority-engine.md`.
- Metric bounds and units are canonical in `docs/specs/00-core-foundation/02-metric-registry.md`.
- Threshold lifecycle and cooldown semantics are canonical in `docs/specs/00-core-foundation/03-threshold-registry.md`.

## Scope
- Input: propagated pressures from `80-impact-propagation-engine.md`
- Input: tech impact tags from `79-tech-impact-matrix-contract.md`
- Output: ideology-adjusted pressure modifiers, event bias, and faction pressure divergence

## Core Principle
- Tech emits force
- Ideology bends reaction
- Regime resolves state transition

This layer controls social interpretation, not technical capability.

## 0.1 Ideological Inertia Contract
Ideologies possess "Inertia" that resists drift:
1. **Baseline Inertia**: Every ideology dimension has an inertia coefficient of `0.99x` per tick, meaning 99% of the value persists.
2. **Shock Event**: Inertia is reduced to `0.50x` for 5 ticks following a `MassExtinctionEvent`, `WarEvent`, or `RegimeCollapse`.
3. **Drift Limit**: Total drift per tick cannot exceed `±5,000 PPM` unless a Shock Event is active.

## Canonical Ideology Dimensions (Frozen v1)
- `authority`: `liberty <-> control`
- `economy`: `collective <-> market`
- `identity`: `universal <-> particularist`
- `knowledge`: `open <-> restricted`
- `progress`: `cautious <-> accelerationist`
- `ecology`: `exploit <-> preserve`
- `military_posture`: `pacifist <-> militant`

## Value Encoding
- Each dimension stored as signed fixed-point in range `[-1_000_000..+1_000_000]`
- `0` is neutral midpoint
- Negative/positive pole meaning is dimension-specific and fixed

## Data Shape
```ts
type IdeologyAsabiyaPPM = PpmInt // 0..1_000_000
type IdeologyCloutPPM = PpmInt // 0..1_000_000 (faction-political weight share)

interface IdeologyVectorV1 {
  authority: SignedPpmInt
  economy: SignedPpmInt
  identity: SignedPpmInt
  knowledge: SignedPpmInt
  progress: SignedPpmInt
  ecology: SignedPpmInt
  military_posture: SignedPpmInt
}

interface PressureModifierRuleV1 {
  metricKey: string
  coefficientPPM: SignedPpmInt
}

interface RadicalizationTriggerV1 {
  metricKey: string
  comparator: ">=" | "<="
  thresholdPPM: PpmInt
  reasonCode: ReasonCodeInt
}

interface IdeologyProfileV1 {
  ideologyId: string
  vector: IdeologyVectorV1
  pressureModifiers: PressureModifierRuleV1[]
  eventBias: Record<string, SignedPpmInt> // eventKey -> weightPPM delta
  radicalizationTriggers: RadicalizationTriggerV1[]
}

interface IdeologyDriftContextV1 {
  factionCloutPPM: IdeologyCloutPPM
  systemAsabiyaPPM: IdeologyAsabiyaPPM
  inGroupFavoritismPPM: PpmInt
  radicalizingExposurePPM: PpmInt
}
```

## Deterministic Interpretation Rules
- Apply ideology modifiers after structural interactions, before threshold event emission
- Modifier application order: ascending `ideologyId`, then `metricKey`
- Missing modifier key means `0` effect
- Clamp all ideology-adjusted values to pressure domain range

## Drift and Evolution Contract
```ts
interface IdeologyDriftRuleV1 {
  sourceMetricKey: string
  targetDimension: keyof IdeologyVectorV1
  driftPerTickPPM: SignedPpmInt
  hysteresisWindowTicks: TickInt
}
```

- Drift is gradual, fixed-point, and bounded
- Crisis-triggered shifts use explicit reason codes and cooldown windows

### Bounded Drift Amplification (Clout/Asabiya Hardened)
Ideological drift magnitude must be weighted by political influence and collective action capacity:

```text
baseDrift = driftPerTickPPM
groupPolarization = mulPPM(inGroupFavoritismPPM, radicalizingExposurePPM)
mobilizationWeight = mulPPM(factionCloutPPM, systemAsabiyaPPM)
amplifier = mulPPM(groupPolarization, mobilizationWeight)
effectiveDrift = baseDrift + mulPPM(baseDrift, amplifier)
```

Bounds:
- `inGroupFavoritismPPM`: `0..1_000_000`
- `radicalizingExposurePPM`: `0..1_000_000`
- `factionCloutPPM`: `0..1_000_000`
- `systemAsabiyaPPM`: `0..1_000_000`
- `effectiveDrift` must still obey per-tick clamp `+-5_000 PPM` (or shock override path).

Conformance note:
- `factionCloutPPM` must be normalized using the shared rule block in `docs/specs/70-governance-benchmarks/84-legitimacy-and-authority-engine.md` ("Cross-Spec Conformance: Shared Clout Normalization Rule (v1)").

## Multi-Actor Separation
- `stateIdeology`: civilization-level canonical vector
- `factionIdeology`: subgroup vectors derived from state vector + local pressures
- `doctrinePackage`: selected behavioral package, derived from ideology and regime

## Conflict Resolution
When multiple ideology triggers fire in one tick:
- sort by `reasonCode` ascending
- apply highest absolute threshold overflow first
- enforce per-trigger cooldown

## Required Output Hooks
- ideology-adjusted pressure deltas
- triggered ideological event keys
- faction divergence score
- explainability trace (`reasonCode`, source metric, modifier applied)

## Example
```yaml
ideologyId: human_primacy_v1
vector:
  authority: 250000
  economy: 100000
  identity: 700000
  knowledge: -200000
  progress: -150000
  ecology: -100000
  military_posture: 300000
pressureModifiers:
  - metricKey: infrastructure.automation
    coefficientPPM: -300000
  - metricKey: population.unrest
    coefficientPPM: 150000
radicalizationTriggers:
  - metricKey: infrastructure.automation
    comparator: ">="
    thresholdPPM: 600000
    reasonCode: 820101
eventBias:
  labor_front_uprising: 250000
  anti_machine_policy: 200000
```

## Validation Rules
- Reject unknown ideology dimensions
- Reject out-of-range vector values
- Reject duplicate `ideologyId`
- Reject trigger entries missing reason codes

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
- `baseDrift = 2_000`
- `factionCloutPPM = 600_000`
- `systemAsabiyaPPM = 700_000`
- `inGroupFavoritismPPM = 500_000`
- `radicalizingExposurePPM = 400_000`

Expected:
- `groupPolarization = mulPPM(500_000, 400_000) = 200_000`
- `mobilizationWeight = mulPPM(600_000, 700_000) = 420_000`
- `amplifier = mulPPM(200_000, 420_000) = 84_000`
- `effectiveDriftRaw = 2_000 + mulPPM(2_000, 84_000) = 2_168`
- `effectiveDriftApplied = 2_168` (no clamp hit)
- deterministic output is identical for identical context and ordering.

## Promotion Notes
- No predecessor; new canonical contract.



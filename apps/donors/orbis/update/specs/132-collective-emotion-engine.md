# 132 Collective Emotion Engine

SpecTier: Contract

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/129-legitimacy-and-authority-engine.md`, `docs/brainstorm/131-information-control-and-media-engine.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`CollectiveEmotionInputsV1`, `EmotionStateV1`, `CollectiveEmotionStateV1`, `EmotionInstanceV1`]
- `Writes`: [`emotion state`, `emotion instances`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/132-collective-emotion-engine.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Model emotion as first-class, queryable state that modifies political behavior, legitimacy, and risk at population scale.

## Context
This engine follows `131-information-control-and-media-engine.md` and modulates legitimacy, faction action, and regime stability under emotional load.

## Core Principle

Crowds are not linear utility optimizers.  
Emotion changes decision thresholds, risk appetite, and response speed.

Emotions are not flavor. They are multipliers.

## Input Contract

```ts
type PopulationBlockIdV1 = string

interface CollectiveEmotionInputsV1 {
  populationBlockId: PopulationBlockIdV1
  fearPPM: PpmInt
  hopePPM: PpmInt
  angerPPM: PpmInt
  humiliationPPM: PpmInt
  pridePPM: PpmInt
  griefPPM: PpmInt
  narrativeShockPPM: PpmInt
  materialStressPPM: PpmInt
}
```

## First-Class Emotion Record

Each subject (population block, faction, institution) carries emotion state:

```ts
interface EmotionStateV1 {
  fearPPM: PpmInt
  hopePPM: PpmInt
  angerPPM: PpmInt
  pridePPM: PpmInt
  humiliationPPM: PpmInt
  trustPPM: PpmInt
}
```

## Output Contract

```ts
interface CollectiveEmotionStateV1 {
  mobilizationBiasPPM: SignedPpmInt
  complianceBiasPPM: SignedPpmInt
  violenceEscalationBiasPPM: SignedPpmInt
  reformReceptivityPPM: PpmInt
  rumorSusceptibilityPPM: PpmInt
}
```

## Tagged Emotion Instance Contract

Emotion instances must be addressable and attributable.

```ts
interface EmotionInstanceV1 {
  emotionInstanceId: string
  subjectGroupId: string
  emotionKey: "fear" | "hope" | "anger" | "pride" | "humiliation" | "trust" | "grief"
  intensityPPM: PpmInt
  targetKey: string         // policy/group/institution target
  sourceEventId: string
  halfLifeTicks: TickInt
}
```

Query requirements:

- who feels what
- about which target
- caused by which event
- remaining intensity after decay

## Baseline vs Triggered Layers

- Baseline temperament: slow-moving civilizational or group disposition.
- Triggered states: event-driven spikes with decay.

Both layers combine into effective emotion used by decision systems.

## Emotional Dynamics

- fear can increase short-term compliance and rumor susceptibility
- anger can increase mobilization and conflict escalation
- hope can increase reform receptivity and long-horizon patience
- humiliation can increase revenge/polarization persistence
- pride can increase cohesion but also out-group hostility
- grief can suppress near-term coordination then rebound via memorial narratives

## Threshold Bands

Emotion intensity is evaluated in bands:

- low: background modulation
- medium: visible political effect
- high: threshold override behavior
- critical: cascade risk (riot, crackdown, regime shock)

## Emotional Math Hooks

Examples:

- high fear -> repression tolerance rises
- high humiliation -> radical narratives spread faster
- high pride -> military sacrifice tolerance rises

## Coupling Rules

Emotion state must modify:

- legitimacy interpretation (`129`)
- narrative adoption speed (`130`)
- media contagion sensitivity (`131`)
- faction radicalization and mobilization (`83`)
- regime transition hazard (`95`)

## Contagion and Damping

Contagion is stronger with:

- high connectivity
- high trust in emotional framing source
- repeated symbolic triggers

Damping is stronger with:

- credible institutions
- stable material conditions
- trusted reconciliation rituals

Contagion graph should reuse media/information connectivity from `131`.

## Coexisting Emotion Vectors

Opposed emotions may coexist (example: hope + anger).  
This must increase volatility and forecast uncertainty.

## Institutional Emotion

Institutions also carry collective emotional state (morale, pride, fear, humiliation).  
Institution emotion modifies cohesion, loyalty, and coup propensity.

## Elite vs Mass Emotion Gap

Track differential:

- elite emotional profile
- mass emotional profile

Large divergence increases instability and sudden legitimacy shocks.

## Emotional Memory

Long-shadow events (war defeat, betrayal, collapse) should persist through long half-life emotion instances and myth linkage (`130`).

## Emotion Bundles (Compression)

For scale/performance, recurring emotion patterns may be compressed into bundles:

- post-war trauma
- frontier anxiety
- imperial nostalgia

Bundles are derived artifacts; raw causality still points to source events.

## Lifetime Policy

- Short: panic, enthusiasm
- Medium: anger, hope
- Long: humiliation, civilizational trust/trauma

Each class uses default half-life ranges.

## Crisis Mode

Under crisis intensity:

- emotional half-life extends
- escalation penalties reduce
- de-escalation actions require higher credibility

## Why This Matters

Without this engine, political behavior appears mechanically rational.  
With this engine, mass behavior becomes historically plausible, nonlinear, and narratively legible.

## Compliance Vector (v1)
Input:
```ts
const instance: EmotionInstanceV1 = {
  emotionInstanceId: "emo_001",
  subjectGroupId: "workers_capital",
  emotionKey: "anger",
  intensityPPM: 600_000,
  targetKey: "policy.tax_hike",
  sourceEventId: "evt_price_shock",
  halfLifeTicks: 4
}
```
Expected:
- At `t + 4 ticks`, intensity decays to `300_000`.
- At `t + 8 ticks`, intensity decays to `150_000`.
- Decay is deterministic and independent of iteration order.

## Promotion Notes
- No predecessor; new canonical contract.



# 122 Causality Trace Contract (Outcome Driver Explanation)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`OutcomeDriverTrace contract`, `causality trace payload schema`]
- `Writes`: [`trace payload definitions`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/122-causality-trace-contract.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define deterministic trace payload for high-impact actions so outcome attribution is explainable, auditable, and UI-safe.

## Scope Tag
- `MVP-now`: trace schema, top drivers, reason codes, confidence, provenance
- `Post-MVP`: probabilistic calibration analytics
- `Research`: model-specific uncertainty calibration

## Type Legend
```ts
type PpmInt = number
type SignedPpmInt = number
type TickInt = number
type ReasonCodeInt = number
```

## Trace Payload Definition
```ts
interface OutcomeDriverTraceV1 {
  outcomeKey: string
  timestampTick: TickInt
  topDrivers: Array<{
    key: string                 // canonical key from 113
    contributionPPM: SignedPpmInt
    reasonCode: ReasonCodeInt   // from 114
    sourceTechId?: string
    sourcePolicyId?: string
    sourceEventId?: string
  }>
  predictedChain?: Array<{
    stageKey: string
    outcomeKey: string
    confidencePPM: PpmInt       // 0..1_000_000
    horizonTicks: TickInt
  }>
  confidenceLabel: "low" | "medium" | "high"
  confidencePPM: PpmInt
  provenance: {
    source: "earth" | "fitted" | "gameplay" | "simulation" | "historical"
    modelId: string
    modelVersion: string
    parameterSetId: string
  }
  validityFlags: Array<"SATURATED" | "OUT_OF_RANGE_INPUT" | "FALLBACK_USED" | "THRESHOLD_TRIGGERED">
}
```

## UI-Facing Minimal Views

### Top Drivers Summary
```ts
interface TopDriversSummaryV1 {
  topFactors: Array<{
    label: string
    valuePPM: PpmInt
    changePPM: SignedPpmInt
    contributionPPM: SignedPpmInt
    iconKey: string
  }>
  primaryDriverKey: string
  secondaryDriverKeys: string[]
}
```

### Reason Code Explanation
```ts
interface ReasonCodeExplanationV1 {
  reasonCode: ReasonCodeInt
  description: string
  triggerCondition: string
  affectedSystems: string[]
  typicalMagnitudePPM: PpmInt
  cooldownTicks: TickInt
}
```

### Confidence Indicator
```ts
interface ConfidenceIndicatorV1 {
  level: "low" | "medium" | "high"
  numericPPM: PpmInt
  basis: string
  uncertaintySources: string[]
}
```

## Trace Generation Rules
- Generate full trace when any of the following is true:
  - action affects `>= 3` pressure metrics by `>= 100_000 ppm`
  - action triggers one or more threshold events
  - total absolute impact exceeds `500_000 ppm`
  - action is marked strategic/high-impact
- Trace must include:
  - immediate effects
  - cascade effects
  - threshold triggers
  - predicted chain
  - uncertainty sources

## Integration with Panel Contracts (`115`)
- Situation panel: show top 3-5 drivers + confidence + reason code chips
- Timeline panel: include trace summary and shared-driver links
- Action preview panel: show predicted chain, risk drivers, and mitigation hints

## Validation Requirements
- all top-driver keys must exist in `113`
- all reason codes must exist in `114`
- confidencePPM range is `0..1_000_000`
- no raw display units in authoritative payload

## Persistence Requirements
- persist traces for all threshold-triggering events
- retain trace linkage for replay and causality debugging
- export format must preserve reason codes and provenance fields

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

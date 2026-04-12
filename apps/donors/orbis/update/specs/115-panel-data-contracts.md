# 115 Panel Data Contracts (Brainstorm)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`panel data contracts`, `panel payload schemas`]
- `Writes`: [`UI panel contract mappings`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/115-panel-data-contracts.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define minimal, stable payload envelopes for key MVP panels so UI and simulation can evolve without interface drift.

## Common Envelope
```ts
interface PanelEnvelopeV1<T> {
  worldId: string
  tick: number
  revisionId: string
  generatedAtIso: string
  confidence: "low" | "medium" | "high"
  data: T
}
```

## Situation Room Payload
```ts
interface SituationRoomDataV1 {
  topDeltas: Array<{ metricKey: string; deltaPPM: number }>
  risks: Array<{ metricKey: string; severity: "low" | "med" | "high"; reasonCode: number }>
  factionHeat: Array<{ factionId: string; radicalizationPPM: number; influencePPM: number }>
  institutionStance: Array<{ institutionId: string; stanceKey: string; strengthPPM: number }>
  narrativeDrift: Array<{ metricKey: string; divergencePPM: number }>
  topDrivers: Array<{ key: string; contributionPPM: number; reasonCode: number }>
}
```

## Action Picker Payload
```ts
interface ActionPickerItemV1 {
  actionId: string
  label: string
  category: string
  likelyEffects: Array<{ metricKey: string; direction: "up" | "down"; magnitudePPM: number }>
  supporters: string[]
  opponents: string[]
  risk: { severity: "low" | "med" | "high"; reasonCode: number }
  confidence: "low" | "medium" | "high"
  provenance: { source: "fitted" | "gameplay"; modelVersion: string }
}
```

## Timeline Payload
```ts
interface TimelineEventCardV1 {
  eventId: string
  tick: number
  eventKey: string
  scope: string
  summary: string
  reasonCodes: number[]
  topDrivers: Array<{ key: string; contributionPPM: number }>
}
```

## Leader Card Payload
```ts
interface LeaderCardV1 {
  actorId: string
  name: string
  role: string
  ambitionPPM: number
  riskTolerancePPM: number
  influencePPM: number
  loyaltyIndexPPM: number
  currentPlotRisk: { severity: "low" | "med" | "high"; reasonCode: number }
}
```

## Risk Feed Payload
```ts
interface RiskFeedEntryV1 {
  riskId: string
  metricKey: string
  currentPPM: number
  thresholdPPM: number
  etaTicks: number
  severity: "low" | "med" | "high"
  reasonCode: number
}
```

## UI Write Contract
- high-impact actions require:
  - preview payload
  - commit request with revision
  - checkpoint confirmation result
- stale revision must return deterministic conflict envelope

```ts
interface UiConflictResultV1 {
  conflict: boolean
  serverRevisionId: string
  clientRevisionId: string
  resolution: "accept" | "reject" | "fork_required"
  reasonCode: number
}
```

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

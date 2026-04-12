# 🔒 EVENT LOG TIERING POLICY SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`]
- `Owns`: [`EventTierV1`, `TieringPolicyV1`, `UnrestWaveV1`, `EraAggregateV1`]
- `Writes`: [`retention rollups`, `tiered event artifacts`]

## Purpose
Control long-run event-log growth with deterministic retention and compaction tiers.

## Type Contracts
```ts
type EventTierV1 = "A" | "B" | "C" | "D"

interface TieringPolicyV1 {
  keepPermanent: EventTierV1[]
  compactToWaves: EventTierV1[]
  compactToEra: EventTierV1[]
  purgeIfDebugOff: EventTierV1[]
}

interface UnrestWaveV1 {
  worldId: string
  startTick: TickInt
  peakTick: TickInt
  peakValuePPM: PpmInt
  drivers: string[]
  resolutionMode: string
}

interface EraAggregateV1 {
  worldId: string
  eraIndex: number
  startTick: TickInt
  endTick: TickInt
  populationNetPPM: SignedPpmInt
  gdpNetPPM: SignedPpmInt
  topPressures: string[]
  regimeTransitions: number
  techUnlocks: number
}
```

## Retention Tiers
- Tier A: permanent (critical actions/transitions/disasters).
- Tier B: compact to wave summaries.
- Tier C: compact to era aggregates.
- Tier D: debug/intermediate, purge when debug disabled.

## Determinism Rules
- Compaction windows are fixed by tick boundaries.
- Compaction output ordering is deterministic by `(startTick, id)`.
- Tier A events are never dropped.

## Compliance Vector (v1)
Input:
- 1000-tick sequence with repeated unrest micro-events in Tier B.

Expected:
- Tier B condensed into deterministic `UnrestWaveV1` set.
- Tier A events preserved exactly.

## Promotion Notes
- No predecessor; new canonical contract.

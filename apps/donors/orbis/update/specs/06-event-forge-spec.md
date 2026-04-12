# Event Forge Spec

## 1) Event Catalog

```ts
type EventForgeEventType =
  | "meteor_strike"
  | "drought"
  | "volcanic_eruption"
  | "flood"
  | "plague"
  | "trade_collapse"
  | "invasive_species"
  | "magic_anomaly"

interface EventForgeTargetRegion {
  regionId: string
  centerCellId?: number
  radiusCells?: number
}

interface EventForgeCommand {
  commandId: string
  eventType: EventForgeEventType
  intensityPPM: number
  durationTicks: number
  target: EventForgeTargetRegion
  applyAtTick?: number
  chainAfterCommandId?: string
  canonMode: boolean
}
```

## 2) Validation

```ts
interface EventForgeValidationResult {
  accepted: boolean
  reasonCode?: string
  normalizedCommand?: EventForgeCommand
}
```

Validation rules:
1. `intensityPPM` in `0..1_000_000`.
2. `durationTicks >= 1`.
3. chain references must be acyclic.

## 3) Preview

```ts
interface EventForgePreview {
  expectedCasualtiesBandPPM: [number, number]
  expectedBiomeDamageBandPPM: [number, number]
  expectedMigrationPressureBandPPM: [number, number]
  expectedRecoveryTicksBand: [number, number]
  riskFlags: string[]
}
```


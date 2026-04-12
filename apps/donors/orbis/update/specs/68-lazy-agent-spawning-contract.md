# 🔒 LAZY AGENT SPAWNING CONTRACT v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/60-projection-performance/67-runtime-lod-chunking-performance.md`]
- `Owns`: [`EntityModeV1`, `BloomPolicyV1`, `DormantRegionStateV1`, `DiscreteSpawnResultV1`]
- `Writes`: [`entity mode transitions`, `deterministic bloom/compress artifacts`]

## Purpose
Bound active simulation cost by keeping out-of-view regions aggregate-only and blooming discrete entities on demand.

## Type Contracts
```ts
type EntityModeV1 = "Dormant" | "Discrete"

interface BloomPolicyV1 {
  bloomZoomThresholdPPM: PpmInt
  compressZoomThresholdPPM: PpmInt
  bloomSampleRatePPM: PpmInt
}

interface DormantRegionStateV1 {
  regionId: string
  totalPopulationPPM: PpmInt
  unrestPPM: PpmInt
  pressureDeltaPPM: SignedPpmInt
  birthRatePPM: PpmInt
  deathRatePPM: PpmInt
}

interface DiscreteSpawnResultV1 {
  regionId: string
  tick: TickInt
  spawnedEntityCount: number
  seedKey: string
}
```

## Deterministic Bloom/Compress
- Bloom seed key: `regionId + tick + worldSeed`.
- Same seed key must produce identical spawned roster.
- Compress must preserve aggregate totals within fixed tolerance policy.

## Compliance Vector (v1)
Input:
- region at dormant mode, zoom crosses bloom threshold twice at same tick and seed.

Expected:
- both bloom operations produce identical `spawnedEntityCount` and roster checksum.

## Promotion Notes
- No predecessor; new canonical contract.

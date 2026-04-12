# 🔒 HIERARCHICAL PATHFINDING CONTRACT v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/60-projection-performance/67-runtime-lod-chunking-performance.md`]
- `Owns`: [`PathingModeV1`, `FlowFieldCacheKeyV1`, `StrategicPathRequestV1`, `TacticalFlowFieldV1`]
- `Writes`: [`strategic path results`, `flow-field cache artifacts`]

## Purpose
Provide deterministic, scalable pathing using strategic HPA* and tactical flow fields.

## Type Contracts
```ts
type PathingModeV1 = "Strategic" | "Tactical"
type FlowFieldCacheKeyV1 = string

interface StrategicPathRequestV1 {
  requestId: string
  originClusterId: string
  targetClusterId: string
}

interface TacticalFlowFieldV1 {
  cacheKey: FlowFieldCacheKeyV1
  regionId: string
  targetCellId: string
  generatedTick: TickInt
}
```

## Rules
- Strategic mode uses cluster graph only.
- Tactical mode reuses one flow field for coherent group targets.
- Pathing queue must be non-blocking relative to render thread.

## Budget Targets (v1)
- 1000 mixed path requests: `p99 < 50ms`.
- Tactical unit step query after flow field build: `O(1)` lookup.

## Compliance Vector (v1)
Input:
- 100 units share same tactical destination in one region.

Expected:
- one flow field build.
- all 100 units consume same `FlowFieldCacheKeyV1`.

## Promotion Notes
- No predecessor; new canonical contract.

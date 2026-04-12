# Runtime LOD, Chunking, and Performance Spec (v1)

## Purpose
Define runtime architecture for scalable planetary rendering/simulation with deterministic chunk generation and bounded frame costs.

## Core Principle
Authority fields are global and compact; high-detail voxel/chunk realizations are on-demand and disposable.

## Runtime Components
1. Chunk scheduler
2. LOD selector
3. Meshing pipeline (or instance build pipeline)
4. Cache manager (CPU/GPU)
5. Dirty-region invalidation

## Chunk Lifecycle States
- `unloaded`
- `scheduled`
- `generating`
- `meshing`
- `resident`
- `evicting`

## Scheduler Rules
- Limit chunk generations per frame.
- Prioritize visible + interaction-adjacent chunks.
- Defer far-field updates behind near-field deadlines.

## LOD Rules
- LOD is selected by query precision, not only distance.
- Hysteresis required for stable transitions.
- Higher LOD realization must sample lower-level authority without redefining macro truth.

## Mesh/Data Build Rules
- Avoid one-mesh-per-voxel.
- Use instancing or greedy meshing per chunk.
- Rebuild only when chunk inputs change.

## Performance Budgets (Define per target platform)
- max chunk generates/frame
- max mesh uploads/frame
- max active resident chunks
- max CPU generation ms/frame
- max GPU upload bytes/frame

## Determinism Rules
- Chunk generation pure for fixed `(seed, coordinates, profile)`.
- Cache keys include all generation-relevant parameters.

## Cross-Doc Dependencies
- `docs/03-hex-to-voxel-pipeline.md`
- `docs/04-multi-scale-lod-model.md`
- `docs/09-test-and-determinism-spec.md`

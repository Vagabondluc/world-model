# Test and Determinism Spec (v1)

## Purpose
Standardize measurable acceptance tests and deterministic behavior checks.

## Determinism Requirements
- Same inputs must produce byte-identical categorical outputs.
- Same inputs must produce numerically stable continuous outputs within epsilon.
- Inputs include:
  - `worldSeed`
  - parent hex authority fields
  - neighbor edge keys
  - subdivision `N`
  - raster size
  - spec/generator versions

## Required Test Fixtures
- Fixture A: isolated single hex.
- Fixture B: two neighboring hexes sharing one edge.
- Fixture C: six neighbors ring around one center hex.
- Fixture D: polar/high-distortion geometry sample.

## Assertions
1. Sub-hex count:
- `count == 1 + 3*N*(N-1)`

2. Geometric containment:
- every sub-hex center must be inside parent polygon with margin epsilon `1e-6` local units.

3. Symmetric adjacency:
- if `A -> B` then `B -> A`.

4. Shared-edge continuity:
- `BiomeIndexMap` exact equality
- `WaterMask` exact equality
- `ElevationDeltaMap` absolute error <= `0.05 m`
- `SoilDepthMap` absolute error <= `0.05 m`
- `MoistureMap` absolute error <= `1/255`

5. Deterministic rerun:
- two runs on same machine must match deterministic constraints exactly.

6. Cross-platform stability:
- categorical maps must match exactly.
- continuous maps must meet same epsilons.

## Compare Space Rules
- Float maps are compared in decoded linear unit space.
- Categorical/bitmask maps are compared as raw bytes.

## CI Policy
- A failed deterministic test blocks merge.
- Fixture updates require changelog entry with rationale.

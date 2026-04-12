# Sub-Hex Grid Spec (3-Mile Hex Refinement)

## Status
Foundation spec. Freeze once adopted.

## Goal
Refine one authoritative local parent hex (~3 miles) into deterministic seam-safe sub-hexes for texture baking and derived visualizations.

## Terminology
- Parent hex: authoritative L5 cell
- Sub-hex: derived child cell in parent interior
- `N`: subdivision factor per edge (`N >= 1`)
- Local axial: `(q, r)` with `s = -q-r`

## Parent Local Frame
For each parent hex:
1. `Nrm = normalize(center)`
2. Build tangent basis `(T, B)` on the local tangent plane
3. Project 3D points to 2D:
   - `x = dot(P - C, T)`
   - `y = dot(P - C, B)`

Use this frame for sub-hex placement and raster baking.

## Sub-Hex Count
Use a hex-of-hexes lattice:

`subCount = 1 + 3 * N * (N - 1)`

Examples:
- `N=1 -> 1`
- `N=2 -> 7`
- `N=3 -> 19`
- `N=4 -> 37`
- `N=5 -> 61`

## Valid Local Axial Domain
Let `R = N - 1`. Valid sub-hex coordinates satisfy:

`max(abs(q), abs(r), abs(q + r)) <= R`

## 2D Placement
Pointy-top axial mapping:

- `x = a * (sqrt(3) * q + sqrt(3)/2 * r)`
- `y = a * (3/2 * r)`

Where `a` is solved to fit centers inside the projected parent polygon.

### Fit Strategy
Implement `fitSubHexScale(parentPolygon2D, N)` with a robust numeric method (binary search) to avoid brittle closed-form assumptions under spherical distortions.

## Stable IDs

`subId = "${parentHexId}:sh:${q},${r}"`

No global counters.

## Seam-Safe Border Contract
Shared edges between neighboring parent hexes must sample border-dependent values via shared edge keys, not local-only noise.

### Edge key (v1 canonical)
Each shared edge key must be:

`edgeKey = "${min(parentHexId, neighborHexId)}:${max(parentHexId, neighborHexId)}:${edgeOrdinalFromMin}"`

Where:
- `edgeOrdinalFromMin` is `0..5` in clockwise vertex order on the min-id hex.
- The max-id hex must map to the same physical edge via neighbor edge lookup table.
- Edge direction is always from `V_edgeOrdinal` to `V_(edgeOrdinal+1)%6` on min-id hex.

### Edge sampling API

`edgeSample(edgeKey, t, seed)` where `t in [0,1]`

For boundary sub-hex index `k` on an edge with `N` segments:
- `t = k / (N - 1)` when traversing in canonical edge direction.
- Neighbor side must reverse index if orientation opposes canonical direction.

Use for:
- edge elevation constraints
- river entry/exit continuity
- water mask continuity

## Adjacency and Overflow
Internal neighbors use axial 6-direction offsets.  
Overflow from boundary sub-hexes maps to neighbor parent boundary lists by ordered edge index mapping (with orientation-aware reversal when needed).

Required tables:
- `neighborByEdge[6]` for each parent hex
- `neighborEdgeOrdinal[6]` mapping local edge to neighbor edge
- `reverseOrientation[6]` boolean

Boundary mapping rule:
1. Enumerate boundary cells per local edge in deterministic order.
2. Map boundary index `k` to neighbor edge index `k'`:
   - if `reverseOrientation=false`, `k'=k`
   - if `reverseOrientation=true`, `k'=(N-1)-k`
3. Resolve target neighbor boundary sub-hex by `k'`.

## Raster Baking from Sub-Hexes
For each pixel in hex-local raster:
1. Convert pixel center to local `(x, y)`
2. Reject outside-parent points
3. Convert to fractional axial
4. Cube-round to `(q, r)`
5. Clamp/projection for boundary edge cases
6. Write semantic outputs from sampled/resolved sub-hex fields

Outputs:
- biome index
- elevation delta
- soil depth
- moisture
- water mask
- optional material class

## Public API (Target)

```ts
export function refineHexToSubHexGrid(
  parent: ParentHex,
  worldSeed: number,
  N: number,
  rasterSize: number
): RefinedHex;
```

## Acceptance Tests
1. Sub-hex count formula matches.
2. Centers are contained in parent polygon.
3. Internal adjacency is symmetric.
4. Shared-edge rasters match neighbor with fixed epsilons:
   - elevation delta <= `0.05 m`
   - soil depth <= `0.05 m`
   - moisture <= `1/255`
   - biome index exact equality
   - water mask exact equality
5. Determinism is byte-stable for same inputs.
6. Parent vertex ordering changes do not break seam mapping.

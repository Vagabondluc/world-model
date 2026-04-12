# 🔒 HYDROLOGY SOLVER CONTRACT (Rivers / Basins / Lakes / Mouths) v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## 0) Goal

A deterministic hydrology domain that:

* operates in **CellSpace** (hex adjacency)
* uses climate caches (PrecipCell, TempCell, WaterMask)
* generates **drainage basins**, **river graphs**, **flow accumulation**
* supports lakes, deltas, canyons, waterfalls as *derived features*
* can be regenerated procedurally at chosen timescales (not always simulated)
* outputs fields + graph artifacts for dashboards and plugins

No full Navier–Stokes. This is terrain-driven drainage + graph.

---

# 1) Inputs / Outputs

## Inputs (read-only)

* `ElevationCell` (2000) (authoritative surface)
* `WaterMaskCell` (2002) (ocean/sea level derived)
* `PrecipCell` (3003) (climate cache)
* `TempCell` (3000) (for ice / frozen water)
* adjacency list: `neighbors[cellId]`
* parameters (section 9)

## Outputs (authoritative hydrology)

Cell fields:

* `RiverFlowCell` (2003) — flow accumulation proxy PPM
* `SoilStorageCell` (new fieldId 2013) — PPM (0..b)
* `GroundwaterStorageCell` (new fieldId 2014) — PPM
* `LakeMaskCell` (new fieldId 2008) — 0..1 PPM
* `RiverDepthCell` (new fieldId 2009) — PPM
* `RiverWidthCell` (new fieldId 2010) — PPM
* `ErosionPotentialCell` (new fieldId 2011) — PPM (optional)
* `FrozenWaterMaskCell` (new fieldId 2012) — PPM (optional)

Graph artifacts (typed stores):

* `RiverGraph[]`
* `Mouth[]`
* `Basin[]`

---

# 2) Core Concepts (Typed)

```ts
type RiverId = uint32
type BasinId = uint32
type MouthId = uint32
type NodeId = uint32
```

### 2.1 Mouth

A mouth is a coastal endpoint draining into "big water".

```ts
interface Mouth {
  mouthId: MouthId
  cellId: uint32
  basinId: BasinId
  strengthPPM: uint32     // coastline suitability score
}
```

### 2.2 Basin

A drainage basin groups cells whose flow ultimately reaches the same mouth.

```ts
interface Basin {
  basinId: BasinId
  mouthId: MouthId
  cellIds: uint32[]       // optional; may be implicit via basinIndex per cell
  areaWeightPPM: uint32
}
```

### 2.3 RiverGraph

A river is a directed acyclic graph of nodes flowing toward a mouth.

```ts
interface RiverNode {
  nodeId: NodeId
  cellId: uint32
  nextNodeId: NodeId | 0      // downstream link
  flowPPM: uint32
  widthPPM: uint32
  depthPPM: uint32
}

interface RiverGraph {
  riverId: RiverId
  basinId: BasinId
  mouthId: MouthId
  sourceNodeIds: NodeId[]     // headwaters
  nodes: RiverNode[]          // sorted by downstream order
}
```

Nodes are derived from cells (usually 1 node per cell along river path) or decimated (every Nth cell) for memory. v1 default: **one node per river cell**.

---

# 3) Determinism Rules (Hard)

All random choices use stateless hashes:

```
hash(worldSeed, hydroTick, basinId, riverIndex, stageId)
```

No mutable RNG.

All iteration orders are stable:

* cell loops in ascending `cellId`
* mouth candidates sorted by `(strength desc, cellId asc)`
* nodes sorted by `(distanceToMouth asc, cellId asc)` or topological order

---

# 4) Water Mask & Sea Level

Ocean = `ElevationCell < SeaLevel`.

`WaterMaskCell` is derived from:

* SeaLevel scalar
* optional ice caps (FrozenWaterMask overrides traversal)

Hydrology must treat:

* ocean as sink
* lakes as sinks unless "overflow" logic enabled (v2)

---

# 5) Mouth Generation (Coastline-Only)

### 5.1 Candidate coastal cells

A cell is coast if:

* it is land (not ocean)
* at least one neighbor is ocean

### 5.2 "Mostly water" chunk rule (from transcript)

Instead of chunking, in hex world we use a neighborhood test:

Coast candidate valid if:

* within radius R (e.g., 2), ocean fraction ≥ `coastOceanFracMinPPM`

This avoids "big river into tiny pond."

### 5.3 Mouth selection

Select `M` mouths per planet (or per region), deterministically:

* compute `strengthPPM` for each candidate
* keep top K
* sample without replacement using hash ordering

---

# 6) Basin Assignment (Mountain-Aware)

Baseline basin assignment:

* each land cell chooses "closest mouth" (graph distance)

But we add tectonic/mountain splitting:

### 6.1 Mountain barrier proxy

We use either:

* `SlopeCell` threshold, or
* `tectonicStressCell` if you have it later

v1: slope-based barrier.

Basin distance cost:

```
cost = steps + barrierPenalty * barrierCrossings
```

This naturally splits basins along ridges.

Output:

* `basinIndexPerCell[cellId] = basinId` (new compact array)

---

# 7) Flow Direction & River Pathing

### 7.1 Local downhill rule

For each land cell:

* pick lowest neighbor by elevation (ties broken by cellId)
  This defines a flow direction graph.

Problem: endorheic basins (stuck above sea level).

### 7.2 Mouth guidance rule (from transcript)

When slope becomes too flat or stuck:

* include a "hint vector" toward basin mouth

Implementation:

* score neighbors by:

  * elevation drop (primary)
  * mouth-distance reduction (secondary)
  * wider sampling radius on flatland

Sampling radius grows as slope decreases:

* radius = 1 normally
* radius = 2..Rmax on flat

This yields winding but convergent rivers.

---

# 8) Flow Accumulation (Precip → Soil → River)

We compute `flowPPM` per cell using the **ABCD 2-bucket model**:

### 8.1 Soil Moisture Bucket (ABCD Step 1)
For each cell:
1. `W = PrecipPPM + PrevSoilStorage`
2. `Y = W - ActualEvap(W, param_b)` (Total available for runoff/recharge)
3. `SurfaceRunoff = (1 - param_c) * Y`
4. `GroundwaterRecharge = param_c * Y`
5. `NewSoilStorage = W - E - SurfaceRunoff - GroundwaterRecharge`

### 8.2 Groundwater Bucket (ABCD Step 2)
1. `Baseflow = param_d * PrevGroundwaterStorage`
2. `NewGroundwaterStorage = PrevGroundwaterStorage + GroundwaterRecharge - Baseflow`

### 8.3 Total Streamflow (Accumulation)
`TotalRunoff = SurfaceRunoff + Baseflow`

Then, topologically traverse cells from high to low:
* `AccumulatedFlow[neighbor] += AccumulatedFlow[cell] + TotalRunoff[cell]`

This yields river networks with sustained baseflow during dry epochs.

---

# 9) Feature Synthesis: Lakes, Deltas, Waterfalls, Canyons

These are **derived features**, optional toggles.

### 9.1 Lakes (v1 simple)

A lake exists when:

* cell is local minimum (all neighbors higher)
* and receives upstream flow above threshold
  Mark `LakeMaskCell = 1`.

No spill simulation in v1.

### 9.2 Deltas

At mouth region:

* if flowPPM above deltaThreshold
* with probability derived from deterministic hash
  Split the final segment into 2–3 distributaries.

### 9.3 Waterfalls

If along a river path:

* elevation drop between nodes > waterfallDropThreshold
  Mark waterfall feature event for dashboard + gameplay.

### 9.4 Canyons

If river crosses "young mountain" proxy:

* slope high + tectonic uplift tag (later)
  Increase `ErosionPotentialCell` and optionally carve (surface domain).

v1: canyon is a tag + visual marker, not terrain mutation (unless enabled).

---

# 10) Frozen Water / Ice Interaction (Optional v1)

If `TempCell < freezeThreshold`:

* water bodies become frozen
* rivers may be reduced (flow penalty) or treated as solid for gameplay

Hydrology may output:

* FrozenWaterMaskCell

---

# 11) Parameter Table v1 (Numeric)

```ts
interface HydroParamsV1 {
  // ABCD Model Parameters
  soilSaturation_b: uint32      // Max soil storage
  rechargeRatio_c: uint32       // Fraction of excess to groundwater
  baseflowRate_d: uint32        // Groundwater discharge rate

  mouthCount: uint16
  coastRadius: uint8
  coastOceanFracMinPPM: uint32

  basinBarrierSlopePPM: uint32
  basinBarrierPenaltyPPM: uint32

  flatSlopeThresholdPPM: uint32
  maxSearchRadius: uint8

  riverMinFlowPPM: uint32

  widthCurveA_PPM: uint32
  widthCurveB_PPM: uint32
  depthCurveA_PPM: uint32
  depthCurveB_PPM: uint32

  lakeMinFlowPPM: uint32

  deltaFlowThresholdPPM: uint32
  deltaSplitChancePPM: uint32

  waterfallDrop_cm: int32
  canyonSlopeThresholdPPM: uint32
  canyonChancePPM: uint32
}
```

All values fixed-point, deterministic.

---

# 12) Regenerate vs Simulate Policy Hook

Hydrology supports two modes:

* **Procedural regenerate** (default): recompute from current elevation + climate
* **Incremental simulate** (v2+): erosion and lake spill persist

v1 locks: **regenerate** at HydroTick.
This matches your "better regenerate than simulate" insight.

---

# 13) Dashboard Requirements

Hydrology dashboard must show:

* river flow map (RiverFlowCell)
* basin overlay (basinId per cell)
* mouth markers
* river graph viewer (nodes/tributaries)
* waterfall/canyon markers
* validity flags:

  * cycles detected (shouldn't happen)
  * too many endorheic cells
  * mouthCount insufficient

And onboarding explaining:

* drainage basins
* flow accumulation
* why mouths matter
* why mountains split basins

---

# 14) Field Registry Additions (Lock IDs Now)

Add these FieldIds:

| FieldId | Name                 | Basis | Unit | Clamp        |
| ------: | -------------------- | ----- | ---- | ------------ |
|    2008 | LakeMaskCell         | Cell  | PPM  | 0..1,000,000 |
|    2009 | RiverDepthCell       | Cell  | PPM  | 0..1,000,000 |
|    2010 | RiverWidthCell       | Cell  | PPM  | 0..1,000,000 |
|    2011 | ErosionPotentialCell | Cell  | PPM  | 0..1,000,000 |
|    2012 | FrozenWaterMaskCell  | Cell  | PPM  | 0..1,000,000 |
|    2013 | SoilStorageCell      | Cell  | PPM  | 0..1,000,000 |
|    2014 | GroundwaterStorageCell| Cell | PPM  | 0..1,000,000 |

IDs are now reserved.

---

## ✅ Result

You now have a deterministic hydrology system that:

* matches the river-network transcript (mouths → basins → sources → graphs)
* stays cell-based and plays well with hex adjacency
* produces useful artifacts for ecology + gameplay
* remains cheap via procedural regeneration

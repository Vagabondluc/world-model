# 🔒 93: Settlement & Urban Realizer (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `SettlementSuitability` ([`Spec 27`](../specs/20-world-generation/27-settlement-suitability.md)): Location scoring.
    - `EconomicFlow` ([`Spec 45`](../specs/40-actions-gameplay/45-economic-flow-trade-network.md)): Trade paths and volume.
    - `AccumulatedWork` ([`Spec 90`](./90-project-production-management.md)): Construction progress.
    - `CivilizationTags` ([`Spec 83`](./83-faction-interest-group-generator.md)): Aesthetic and structural bias (e.g., `Militaristic`).
- **Outputs**:
    - `RoadNetworkV1`: Graph of connected transportation edges.
    - `UrbanGridV1`: Map of partitioned building plots.
    - `VoxelMutation`: Realization of buildings into the 3D voxel world.
- **Parameters**:
    - `PLOT_MIN_AREA`: 100 m².
    - `RELAXATION_STRENGTH`: 0.3 (Voronoi relaxation toward economic paths).

## 2. Mathematical Kernels

### 2.1 Voronoi-Graph Road Networks
Roads are not just lines; they are topographically aware networks.
1.  **Macro-Skeleton**: Generate Voronoi cells centered on `SettlementSuitability` maxima.
2.  **Edge Relaxation**: Pull Voronoi edges toward the **Min-Cost Flow** path (Spec 45) using a deterministic relaxation spring model.
3.  **Reachability Constraint**: Every `UrbanPlotV1` must share at least one edge with a road node.

### 2.2 Building Selection (Tiered Scaling)
Building height and material scale with `SettlementTier` (Spec 95) and `PopDensityPPM`.
```text
BuildingHeight = BaseHeight * f(PopDensityPPM) * TechLevel.ArchitecturePPM
```

| Tier | Scale | OSR / D&D Translation |
| :--- | :--- | :--- |
| **Village** | 1-2 Voxels | Simple structures, no verticality. |
| **Town** | 3-5 Voxels | Multistory, dedicated commercial zones. |
| **City** | 10+ Voxels | Significant line-of-sight obstruction, complex interiors. |

## 3. Determinism & Flow
- **Evaluation Order**: Step 7 of the `CivTick` sequence (Realization Phase).
- **Collision Detection**: Plots are assigned using a deterministic **Rectangle Packing** algorithm. Tie-break by `PlotIndex` ascending.
- **Stable ID**: Road nodes use `hash64(HexId, vertexCoord)`.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `URBAN_REALIZATION_TRACE`
- **Primary Drivers**:
    - `ECONOMIC_GRAVITY`: How trade routes shaped the street layout.
    - `SUITABILITY_CLUSTERING`: Why buildings are clustered in specific hex quadrants.
    - `MAINTENANCE_DECAY`: Attribution for degraded building materials.

## 5. Failure Modes & Bounds
- **Saturated Result**: If `PopDensityPPM` exceeds physical plot capacity, buildings transition to `Skyscraper` or `Arcology` (if tech permits).
- **Invalid Input**: If `AccumulatedWork` is 0, no new voxels are placed.

## Hardening Addendum (2026-02-12)
- `SpecTier`: `Brainstorm Draft`
- `Status`: `Promotion Candidate after canonical header rewrite`
- `CanonicalizationTarget`: `docs/specs/* (TBD)`
- `DeterminismNote`: `Use fixed-point/PPM conventions from runtime determinism canon before promotion.`

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm draft.

Expected:
- deterministic output for identical inputs and evaluation order.
- explicit tie-break and clamp behavior is documented before promotion.

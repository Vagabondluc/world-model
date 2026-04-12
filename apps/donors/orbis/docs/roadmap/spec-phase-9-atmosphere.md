
# Spec: Volumetric Atmosphere (Phase 9 - Revised)

## 1. Objective
Synthesize a dynamic, high-fidelity volumetric cloud layer.
**Critical Change**: Replace the "Single Voxel per Hex" model with a **"Cloud Cluster" model** to eliminate the low-resolution artifacting. Clouds must appear as organic aggregations of "Cloudlets" (Micro-voxels).

## 2. Theoretical Model: The "Cloud Cluster" System

### 2.1 Concept
The atmosphere is not a 1:1 mapping of the terrain grid. It is a particle system anchored to the terrain's moisture data.
- **Macro-Structure**: Defined by Hex Moisture (Where the clouds are).
- **Micro-Structure**: Defined by Local Noise & Clustering (What the clouds look like).

### 2.2 Generation Logic
For every Hex $H$ with $Moisture > 0.4$:
1.  **Cluster Volume**: Define a bounding volume above the hex at `Altitude ~ 1.15R`.
2.  **Particle Emitter**:
    - **Count**: $N = 3$ to $8$ (Based on Moisture intensity).
    - **Position**: $P = Center + RandomOffset$.
    - **Jitter**: Apply Perlin Noise to the offset to create organic shapes (not just spheres).
3.  **Verticality**:
    - If `Biome == RAIN_FOREST` or `OCEAN` (Storms): Allow stacking particles vertically to form "Towers" (Cumulonimbus).
    - If `Biome == SAVANNA`: Flat, sparse particles (Stratus).

## 3. Visuals & Material
- **Geometry**: `BoxGeometry` (Instanced).
- **Scale**: Cloudlets are approx **25-30%** the size of a standard terrain voxel.
- **Material**: `VoxelMaterial.CLOUD` (Existing).
- **Opacity**: 0.85 (Slightly higher to mask internal intersections of the cluster).
- **Color**: Pure White `#ffffff`.

## 4. Technical Implementation Plan

### 4.1 `CloudLayer` Component Refactor
- **Input**: `HexData[]`.
- **Process**:
  - Iterate all hexes.
  - If moist, push multiple matrices to the `InstancedMesh`.
  - Use `PseudoRandom` (seeded by hex ID) to ensure deterministic placement of cloudlets.
- **Performance**:
  - This increases instance count by ~5x compared to the previous model.
  - **Optimization**: Only spawn clouds for the ~30% of hexes that are moist.
  - **Limit**: Hard cap at 20,000 instances to ensure 60fps.

### 4.2 Animation
- **Orbit**: Rotate the entire group (Low cost).
- **Turbulence**: (Optional) Use a vertex shader or simple scale oscillation to make the clouds "breathe" if performance permits.

## 5. Verification Plan

### TC-901: Visual Density
- **Check**: Clouds look like "Cotton Balls" or "LEGO piles" rather than "Floating Crates".
- **Check**: No single-voxel clouds exist (unless very low moisture/random chance).

### TC-902: Biome Correlation
- **Check**: Heavy density/towers over Oceans/Jungles.
- **Check**: Clear skies over Deserts.

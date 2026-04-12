
# Spec: Volumetric Globe Visualization (Phase 8c)

## 1. Objective
Transform the **Global Voxel View** from a hollow "eggshell" representation into a **Volumetric Crust** that conveys mass, depth, and geological stratification. The planet should appear as a solid object constructed from voxels, not just a surface mesh.

## 2. Volumetric Stacking
### 2.1 Layer Architecture
Instead of rendering a single voxel per hex, we will render a **column** of 4 voxels extending inwards from the surface.

| Layer Index | Depth Offset | Role | Material Logic |
| :--- | :--- | :--- | :--- |
| **0** | `0.0` | **Surface** | Matches the Biome (Grass, Sand, Snow, Water). |
| **1** | `-1.0` | **Substrate** | The soil beneath. Dirt for flora, Sand for beaches, Ice for glaciers. |
| **2** | `-2.0` | **Bedrock** | Hard Stone layer acting as the crust foundation. |
| **3** | `-3.0` | **Mantle** | The deep core. Magma or Obsidian. |

### 2.2 Geometry & Scaling
- **Voxel Count**: The `InstancedMesh` count increases by factor of 4 (e.g., 40k hexes -> 160k voxels).
- **Positioning**: 
  `Position = SurfaceCenter * (1.0 - (LayerIndex * VoxelSize / GlobeRadius))`
- **Scale**: Inner voxels naturally overlap more due to spherical geometry, reinforcing the "solid core" look without gaps.

## 3. Stratigraphy Rules
To create convincing cross-sections:

1. **Oceanic Columns**:
   - Surface: `WATER`
   - Substrate: `DEEP_WATER`
   - Bedrock: `SAND` (Ocean Floor)
   - Mantle: `STONE`

2. **Terrestrial Columns**:
   - Surface: `GRASS`/`FOREST`
   - Substrate: `DIRT`
   - Bedrock: `STONE`
   - Mantle: `LAVA` (or `OBSIDIAN`)

3. **Polar Columns**:
   - Surface: `SNOW`
   - Substrate: `ICE`
   - Bedrock: `STONE`
   - Mantle: `STONE`

## 4. Performance Considerations
- **Limit**: Max crust depth fixed at 4 layers to keep instance count under 200k for Level 6 subdivisions.
- **Optimization**: Use a single `InstancedMesh` with a stride in the loop. No need for multiple meshes.

## 5. Visual Verification
- [ ] **TC-Vol-01**: Voxel planet appears solid when rotating; no background visible through cracks.
- [ ] **TC-Vol-02**: Cross-section colors are logical (Blue water on top of sand; Green grass on top of dirt).

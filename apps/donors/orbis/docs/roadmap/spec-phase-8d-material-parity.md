
# Spec: Material Parity for Global Voxel View (Phase 8d)

## 1. Objective
Ensure the Global Voxel View matches the aesthetic quality of the Local Voxel Visualizer. This eliminates the "Plastic Planet" look and introduces material properties like transparency (Water), roughness (Ice vs Rock), and metalness (Obsidian).

## 2. Refactoring
- **Split Geometry**: The monolithic `InstancedMesh` is split into multiple meshes, grouped by `VoxelMaterial`.
- **Material Props**:
  - `Water/DeepWater`: Transparent (Opacity 0.7), Low Roughness (0.1).
  - `Ice`: Semi-Opaque, Shiny.
  - `Obsidian`: Metallic.
- **Lighting**: Shadows enabled (`castShadow`/`receiveShadow`) to give depth to the crust layers.

## 3. Transparency Handling
- To prevent "seeing inside" the hollow core, the Phase 8c Crust Layers must ensure the bottom-most layer (Mantle) is opaque.
- Transparency is sorted by Three.js automatically between the opaque and transparent groups.

## 4. Verification
- [ ] **TC-Mat-01**: Oceans look like water (transparent blue), not blue plastic.
- [ ] **TC-Mat-02**: Shadows cast by mountains onto the surface.

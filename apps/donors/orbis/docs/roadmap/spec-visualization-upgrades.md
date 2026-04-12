# Spec: Visualization Upgrades (Phase 8b)

## 1. Objective
Bridge the visual gap between the abstract **Hex Grid** and the concrete **Voxel Chunk** by allowing the entire globe to be viewed as a voxel approximation. Additionally, provide usability improvements for the Hex Grid by allowing users to toggle physical extrusion.

## 2. Feature: Global Voxel View

### 2.1 Concept
Currently, the user sees a "Board Game" style map (Hexes) at the global level and a "Minecraft" style view (Voxels) at the local level. The **Global Voxel View** renders the planetary data using Instanced Cubes, creating a "Lego Planet" aesthetic.

### 2.2 Technical Implementation
- **Geometry**: `THREE.BoxGeometry` (1x1x1).
- **Mesh**: `THREE.InstancedMesh` with count = `hexes.length`.
- **Positioning**:
  - Place a cube at each `HexData.center` (scaled to globe radius).
  - **Orientation**: Rotated to align with the surface normal (creates a smooth spherical "pixel" effect).
  - **Scale**: Uniform scaling to ensure slight gaps or tight fit depending on aesthetic (Target: Tight fit, `0.95` scale to see boundaries).
- **Material Mapping**:
  - **Hex View**: Uses abstract Biome/Data colors (e.g., Temperature Map).
  - **Voxel View**: Uses *Literal* Material colors (e.g., `SAND`, `SNOW`, `STONE`, `DEEP_WATER`).
  - This requires a `Hex -> VoxelMaterial` mapping function in the `HexGrid` component.

### 2.3 Store Changes
- `UIStore`: Add `globeMode: 'HEX' | 'VOXEL'`.
- **Default**: `'HEX'`.

## 3. Feature: Hex Elevation Toggle

### 3.1 Concept
The physical extrusion of hexes (where mountains stick out) can be visually noisy and "unsettling" when viewing abstract data layers like Plate Tectonics or Biomes. A smooth sphere is often preferred for data readability.

### 3.2 Implementation
- **State**: `showGlobeElevation` (boolean).
- **Default Behavior**: `FALSE` (Flat Sphere).
  - *Rationale*: The default Hex view should feel like a clean planetary "dashboard". Extrusion is an opt-in visualization for analyzing terrain relief.
- **Logic**:
  - When `true`: `Radius = GlobeRadius + (Height * ElevationScale)`.
  - When `false`: `Radius = GlobeRadius` (Uniform).
- **UI**: A toggle button (e.g., "3D Relief") in the view controls overlay.

## 4. Interaction Implications
- **Picking (Raycasting)**: 
  - The existing dot-product-based raycaster in `HexGrid` relies on normalized direction vectors from the center.
  - **Benefit**: This works regardless of whether the mesh is flat or extruded, or hex or voxel, provided the "centers" (unit vectors) remain consistent.
  - **Constraint**: Drag-to-paint must work seamlessly in both modes.

## 5. Verification Plan
- [ ] **TC-Visual-01**: App loads with a **perfectly spherical** Hex Grid (Elevation Off).
- [ ] **TC-Visual-02**: Toggling "Relief" on/off transitions the geometry smoothly.
- [ ] **TC-Visual-03**: Switching to "Voxel Mode" replaces Hex prisms with instanced Cubes.
- [ ] **TC-Visual-04**: Voxel Mode accurately reflects the material palette (e.g., Pole is White/Ice, Desert is Yellow/Sand).


# Component: HexGrid
**Status**: `PASS` (Phase 8b Verified)

## 1. Interface Contract
- Renders the planetary interface in either `HEX` or `VOXEL` mode.
- Handles user interaction (Selection, Terraforming brushes).
- Visualizes complex data layers (Plates, Biomes, Elevation, etc.).

## 2. Feature: Global Voxel View (Phase 8b)
- **Implementation**: Uses `THREE.InstancedMesh` with `BoxGeometry`.
- **Scaling**: Voxel size is dynamically calculated based on the hex density (Subdivision level) to ensure tight packing without gaps.
- **Material Sync**: Colors are strictly mapped from `VoxelMaterial` palette, ensuring the global view matches the local voxel chunk view.
- **Selection**: When in Voxel mode, the selection cursor transforms from a hexagonal ring to a wireframe cube.

## 3. Feature: Elevation Toggle (Phase 8b)
- **Implementation**: `showGlobeElevation` prop controls the radius calculation.
- **Logic**:
  - `TRUE`: `Radius = GlobeRadius + (Height - SeaLevel) * Scale`.
  - `FALSE`: `Radius = GlobeRadius`.
- **Effect**: Instantly flattens the world for clearer data analysis (e.g., viewing Plate Tectonics without geometric noise).

## 4. Acceptance Criteria (Verified)
- [x] **AC-01**: Toggling `Hex/Voxel` mode switches geometry instantly.
- [x] **AC-02**: Voxel mode colors match the `VoxelVisualizer` colors (e.g., Deep Ocean is dark blue, Ice is white).
- [x] **AC-03**: Voxel mode cubes scale correctly when changing Subdivision level.
- [x] **AC-04**: Toggling `Relief` flattens the sphere to a perfect ball.
- [x] **AC-05**: Selection cursor adapts shape to the active mode.

## 5. Performance
- **InstancedMesh**: Handles 40,000+ instances (Level 6) at 60fps.
- **Geometry Updates**: Only positions/colors update on regeneration; buffers are reused.

## 6. Voxel Material Legend
The following table defines the authoritative visual palette for the Orbis Voxel Engine:

| Material | Color (Hex) | Description |
| :--- | :--- | :--- |
| **WATER** | `#3b82f6` | Standard surface water. |
| **DEEP_WATER** | `#1e3a8a` | Abyssal and deep oceanic layers. |
| **SAND** | `#fde047` | Beaches and arid desert dunes. |
| **GRASS** | `#4ade80` | Lush vegetation and temperate ground. |
| **DIRT** | `#854d0e` | Nutrient-rich substrate beneath flora. |
| **MUD** | `#573010` | Wetland and mangrove substrate. |
| **STONE** | `#94a3b8` | Exposed bedrock and montane rock. |
| **SNOW** | `#ffffff` | High-altitude frozen precipitation. |
| **ICE** | `#a5f3fc` | Glacial and permafrost layers. |
| **WOOD** | `#78350f` | Tree trunks and woody biologicals. |
| **LEAVES** | `#15803d` | Forest canopies and foliage. |
| **CACTUS** | `#166534` | Arid succulent features. |
| **BEDROCK** | `#020617` | Indestructible core boundary (Y=0). |
| **BUILDING** | `#f8fafc` | Civilizational structures and concrete. |
| **CORAL** | `#f472b6` | Tropical shelf reef features. |
| **KELP** | `#0d9488` | Cold-water shelf vegetation. |
| **OBSIDIAN** | `#1e1b4b` | Volcanic and mantle rock. |
| **SALT** | `#f1f5f9` | Evaporite deposits and salt flats. |
| **CLOUD** | `#ffffff` | Atmospheric particulate clusters. |

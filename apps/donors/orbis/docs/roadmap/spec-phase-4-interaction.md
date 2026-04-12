# Spec: Interaction & Hydrology (Phase 4)

## 1. Objective
Enable high-precision interaction with the planet surface and refine the simulation of settlement growth and river systems.

## 2. Features

### 2.1 GPU Picking / Raycasting
Current selection uses basic `faceIndex` mapping which can be jittery on complex meshes.
- **Decision**: Implement a custom Raycaster in `HexGrid.tsx` that uses the `center` property of hexes to find the nearest neighbor to the hit point.
- **Fallback**: Maintain the `faceIndex` lookup but optimize the vertex attribute mapping.

### 2.2 Rivers 2.0 (Drainage Basins)
- **Logic**: Each hex will now track a `flowDirection` (pointing to the lowest neighbor).
- **Accumulation**: Sum up the `moisture` contribution of all "upstream" hexes. 
- **Visualization**: Increase river width in `VoxelVisualizer` based on accumulation.

### 2.3 Settlement Evolution
Settlements should not be static.
- **Growth Factors**:
  - `Coastal_Bonus`: +20% growth.
  - `River_Bonus`: +40% growth.
  - `Arid_Penalty`: -50% growth.
- **Voxel Representation**: Cities should render "Skyscrapers" (multiple BUILDING blocks) while villages render small "Huts".

## 3. Verification Plan
- [ ] **Test Case 1**: Clicking any point on a hex selects the correct ID.
- [ ] **Test Case 2**: Rivers always flow toward lower elevation (No uphill rivers).
- [ ] **Test Case 3**: Settlement size in voxel view correlates with `SettlementType`.
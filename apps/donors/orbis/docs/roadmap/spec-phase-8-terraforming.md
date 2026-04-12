# Spec: Active Terraforming (Phase 8)

## 1. Objective
Allow users to modify the planetary data in real-time using "brushes." This transforms Orbis from a procedural viewer into a creative tool.

## 2. Core Mechanics

### 2.1 The Brush System
Instead of selecting a single hex, the user selects a **Target** and a **Radius**.
```typescript
interface Brush {
  centerId: string;
  radius: number; // 1 = center + neighbors, 2 = neighbors of neighbors
  intensity: number; // 0.0 to 1.0
  mode: 'RAISE' | 'LOWER' | 'HEAT' | 'COOL' | 'WET' | 'DRY';
}
```

### 2.2 Gaussian Falloff
Modifications should not be flat. The effect should be strongest at the center and decay towards the edge of the brush radius.
- **Formula**: `delta = intensity * Math.exp(-distanceSquared / sigma)`

### 2.3 Store Actions (Partial Updates)
We cannot regenerate the whole `hexes` array on every click.
1. **Identify Affected Indices**: Find indices of hexes in range.
2. **Clone & Mutate**: Create a copy of only the affected hex objects.
3. **Re-evaluate Biome**: Run `determineBiome` *only* on the mutated hexes using their new Height/Temp/Moisture values.
4. **Hydrology Recalculation**: (Complex) If height changes, `flowDirection` and `downstreamId` might change. *Strategy: Defer hydrology recalc until mouse-up.*

## 3. Test Cases (TDD)

### TC-801: Brush Selection
- **Input**: Select Hex A, Radius 1.
- **Expected**: Hex A and all 5-6 immediate neighbors are identified.
- **Verification**: `getHexNeighbors(A, 1).length` equals neighbor count.

### TC-802: Height Deformation
- **Input**: Apply `RAISE` (intensity 0.1) to Ocean Hex (height -0.2).
- **Expected**:
  - Center Hex Height > -0.2 (e.g., -0.1).
  - Neighbor Hex Height > previous, but less than Center change.
  - **Biome Shift**: If Height crosses `0.0`, Biome changes from `OCEAN` to `STRAND`/`BEACH`.

### TC-803: Voxel Reactivity
- **Input**: Modify Hex A while `selectedHexId === A`.
- **Expected**: `useLocalStore` detects change in `hex.biomeData` and triggers `hydrateVoxelChunk` automatically.

### TC-804: Temperature Forcing
- **Input**: Apply `HEAT` to `TUNDRA` hex.
- **Expected**:
  - Temp value increases.
  - Biome shifts: `TUNDRA` -> `TAIGA` -> `GRASSLAND` -> `DESERT`.
  - Voxels update: `SNOW` blocks replaced by `GRASS` or `SAND`.

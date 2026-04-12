
# Spec: Continental Geomorphology (Phase 1)

## 1. Objective
Replace uniform random noise with structured distinct landmasses (continents) and oceans.

## 2. Algorithms

### 2.1 Plate Assignment
**Input**: `plateCount`, `seed`  
**Output**: `PlateData[]`
```typescript
interface PlateData {
  id: number;
  center: Vector3;
  type: 'OCEANIC' | 'CONTINENTAL';
  elevationBias: number; // -0.5 for Oceanic, +0.3 for Continental
}
```
**Logic**:
1. Generate `plateCount` random points on sphere.
2. For every even index, assign `OCEANIC`. For odd, `CONTINENTAL`.
3. Store in a lookup array.

### 2.2 Continental Masking (The "Macro" Pass)
**Input**: `position (x,y,z)`
**Logic**:
1. Sample `fbm3D(pos, scale=0.5, octaves=2)`.
2. Apply `smoothstep(-0.2, 0.2, value)` to create a hard transition between "Deep Ocean" and "Land Shelf".
3. **Result**: `mask` (0.0 to 1.0).

### 2.3 Orogeny (Mountain Building)
**Input**: `distToPlateEdge`
**Logic**:
1. If `distToPlateEdge < 0.05` (normalized distance):
2. `orogenyFactor = 1.0 - (dist / 0.05)`.
3. Add `orogenyFactor * 0.5` to elevation.

## 3. Verification Plan (TDD)
- [ ] **Test Case 1**: `generatePlanetHexes` returns roughly 50-60% negative elevation hexes (Oceans).
- [ ] **Test Case 2**: "Blobs" of positive elevation cluster together (Continents), verified visually.
- [ ] **Test Case 3**: Elevation values span the full range `-1.0` to `1.0` (currently they might hover near 0).

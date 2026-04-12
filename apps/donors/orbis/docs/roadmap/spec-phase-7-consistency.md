# Spec: Biome Consistency & Verification (Phase 7)

## 1. Objective
Eliminate logical disconnects between the **Authoritative Biome Model** (the Hex Grid) and the **Physical Reality** (the Voxel World). 
A biome is not an arbitrary label; it is a **statistical conclusion** derived from the physical properties of the terrain (elevation, temperature, moisture).

## 2. The First Principle
> **You do NOT "read" a biome from colors or materials. You infer a biome from statistical signals in the voxel field.**

## 3. Disconnect Resolution (Fixed in Phase 7)
### The Issue
Previous implementations allowed "Fall-through" logic where hexes in the `OCEANIC` vertical zone (deep water) were processed by terrestrial biome rules, resulting in "Mediterranean" or "Grassland" hexes located underwater.

### The Fix: Strict Zonation Overrides
The `determineBiome` function must strictly prioritize Vertical Zones before considering Climate.
1. **ABYSSAL** -> `DEEP_OCEAN` (No exceptions)
2. **OCEANIC** -> `OCEAN` (No exceptions)
3. **SHELF** -> `KELP` / `CORAL` / `OCEAN` (Climate dependent, but always aquatic)
4. **SUMMIT** -> `ICE` (Lapse rate dominance)

## 4. Biome Verification Protocol (Future Implementation)
To prevent regression, we define a "Round-Trip Consistency Check".

### 4.1 Biome Feature Vector
For any given sample area (Hex or Chunk), we extract a feature vector:
```typescript
type BiomeSignature = {
  surfaceWaterRatio: number;   // 0.0 - 1.0
  vegetationDensity: number;   // 0.0 - 1.0
  elevationMean: number;       // Normalized against Sea Level
  temperatureMean: number;     // Celsius
  moistureMean: number;        // 0.0 - 1.0
}
```

### 4.2 Inference Rules
We can "Reverse Engineer" the biome from the voxels:
- `surfaceWaterRatio > 0.8` -> **Aquatic**
- `vegetationDensity > 0.6` AND `temperature > 20` -> **Tropical Forest**
- `elevationMean > 0.8` AND `surfaceWaterRatio < 0.1` -> **Alpine/Summit**

### 4.3 The Consistency Check
If `AuthoritativeBiome != InferredBiome`:
- **Flag Warning**: "Climate Model Inconsistent with Terrain Realization"
- **Action**: Either adjust the `determineBiome` rules OR adjust the `generateVoxelChunk` erosion parameters.

## 5. Verification Plan
- [x] **TC-701**: Ensure no hex with `height < -0.1` (relative to sea level) has a Terrestrial Biome.
- [ ] **TC-702**: Ensure `determineBiome` is pure and deterministic based on inputs.

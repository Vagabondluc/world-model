# Geology Matter Matrix Spec (v1)

## 1. Purpose
Define the deterministic resolver that translates **Authoritative Hex State** into **Voxel Materials**.
This spec replaces abstract "matter classes" with concrete `VoxelMaterial` assignments compatible with `types.ts`.

## 2. Inputs (The Context)
The resolver requires a `VoxelContext` derived from the Hex and the local position.

```typescript
// Concrete Context derived from HexData + Config + Position
type VoxelContext = {
  // Authoritative Inputs
  biome: BiomeType;
  temperature: number;    // Normalized 0..1
  moisture: number;       // Normalized 0..1
  elevationM: number;     // Absolute Meters (Sea Level = 0)
  
  // Derived Structural Inputs
  sedimentDepthM: number; // Thickness of unconsolidated layer
  magmaDepthM: number;    // Depth where crust transitions to mantle
  
  // Local Query Inputs
  yM: number;             // Y position in meters relative to planet center (or sea level datum)
  depthM: number;         // Depth below the surface (0 = surface, >0 = underground)
};
```

## 3. The Matrix (Resolution Logic)
The resolution happens in **Layers**. The first matching layer returns the material.

### Layer 1: Atmosphere & Ocean
*Applies when `yM > SurfaceHeightM`*

| Condition | Material |
| :--- | :--- |
| `yM <= SeaLevelM` AND `zone == ABYSSAL` | `VoxelMaterial.DEEP_WATER` |
| `yM <= SeaLevelM` | `VoxelMaterial.WATER` |
| `yM > SurfaceHeightM` | `VoxelMaterial.AIR` |

### Layer 2: Surface Veneer (Sediment/Soil)
*Applies when `depthM <= sedimentDepthM`*

| Biome / Condition | Moisture | Material |
| :--- | :--- | :--- |
| **Volcanic** | Any | `OBSIDIAN` (Fresh flow) |
| **Desert / Beach** | < 0.2 | `SAND` |
| **Salt Flats** | < 0.1 | `SALT` |
| **Mangrove / Swamp** | > 0.8 | `MUD` |
| **Snow / Ice** | Any | `SNOW` (Top), `ICE` (Compact) |
| **General** | > 0.4 | `GRASS` (Top), `DIRT` (Sub) |
| **General** | <= 0.4 | `DIRT` |

*Refinement*:
- If `depthM == 0` (Topmost voxel), use `GRASS`/`SNOW`/`SAND`.
- If `0 < depthM < sedimentDepthM`, use `DIRT`/`ICE`/`SAND`.

### Layer 3: Bedrock (Crust)
*Applies when `sedimentDepthM < depthM < magmaDepthM`*

| Condition | Material |
| :--- | :--- |
| `Biome == VOLCANIC` | `OBSIDIAN` |
| `Biome == CORAL_REEF` (fossilized) | `STONE` (Limestone proxy) |
| Default | `STONE` |

*Future expansion*: Split `STONE` into `GRANITE`, `BASALT`, `LIMESTONE` when `VoxelMaterial` enum is expanded.

### Layer 4: Mantle / Deep Core
*Applies when `depthM >= magmaDepthM`*

| Condition | Material |
| :--- | :--- |
| Default | `BEDROCK` (Placeholder for Mantle/Magma) |

## 4. Implementation Contract
The implementation must exist as a pure function:

```typescript
import { VoxelMaterial } from '../types';

export function resolveVoxelMaterial(ctx: VoxelContext): VoxelMaterial {
  // 1. Atmosphere/Water Check
  // 2. Surface Veneer Check (Sediment lookup)
  // 3. Bedrock Check
  // 4. Mantle Check
}
```

## 5. Derived Values Calculation
How to compute inputs from `HexData`:

*   **Sediment Depth**: 
    *   Base: `2m`.
    *   `+4m` if `moisture > 0.8` (Swamp/Jungle).
    *   `+10m` if `CoastalFeature == BARRIER` (Sandbar).
    *   `0m` if `slope > 0.8` (Steep cliffs strip soil).
*   **Magma Depth**:
    *   Base: `60,000m` (Deep).
    *   `200m` if `Biome == VOLCANIC` (Active vent).

## 6. Determinism & Seams
*   The `resolveVoxelMaterial` function **must not** use `Math.random()`.
*   Any noise used for variation (e.g. soil thickness variation) must use `worldSeed` + `hexId` + `localPos`.

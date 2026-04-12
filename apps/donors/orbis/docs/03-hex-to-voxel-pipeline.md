# Hex to Voxel Pipeline

## Problem Framing
In a planetary hex system, a hex is authority, not stored geometry.

- Hex stores laws: biome, climate, elevation, tags.
- Voxels are generated views sampled from those laws.

## Canonical Unit System (v1 Frozen)
- Horizontal world space: meters.
- Vertical world space: meters.
- Voxel grid index space: integers.
- Conversion:
  - `worldYMeters = (chunkBaseYVox + localY) * metersPerVoxel`
  - `voxelY = floor(worldYMeters / metersPerVoxel)`

Never compare normalized values directly to voxel indices.

## Pipeline
1. Macro terrain classification
2. Vertical profile generation (meters)
3. Scale-dependent deformation (meters)
4. Material resolution by depth and biome policy
5. Overlay projection (vegetation/props/structures)

## Minimal Types

```ts
export type HexAuthority = {
  id: string;
  biome: string;
  elevationNorm: number; // 0..1 authority input
  moistureNorm: number;  // 0..1 authority input
  temperatureNorm: number; // 0..1 authority input
  seed: number;
};

export type TerrainContext = {
  worldSeed: number;
  metersPerVoxel: number;
  seaLevelM: number;
  minElevationM: number;
  maxElevationM: number;
  scale: number;
};
```

```ts
export enum VoxelMat {
  Air = 0,
  Water = 1,
  Surface = 2,
  Soil = 3,
  Rock = 4,
  Sand = 5,
  Snow = 6,
}
```

## Deterministic Sampling (World-Space Only)

```ts
function hash3(x: number, z: number, seed: number) {
  const n = Math.sin(x * 127.1 + z * 311.7 + seed * 17.13) * 43758.5453;
  return n - Math.floor(n);
}
```

```ts
function normToMeters(v: number, minM: number, maxM: number) {
  return minM + v * (maxM - minM);
}

export function surfaceHeightM(
  hex: HexAuthority,
  worldX: number,
  worldZ: number,
  ctx: TerrainContext
) {
  const baseM = normToMeters(hex.elevationNorm, ctx.minElevationM, ctx.maxElevationM);
  const ampM = 8 * ctx.scale; // tune by scale profile
  const n = hash3(worldX, worldZ, hex.seed ^ ctx.worldSeed);
  return baseM + (n - 0.5) * ampM;
}
```

## Material Policies

```ts
export function surfaceMaterial(hex: HexAuthority): VoxelMat {
  switch (hex.biome) {
    case "desert":
      return VoxelMat.Sand;
    case "tundra":
      return VoxelMat.Snow;
    default:
      return VoxelMat.Surface;
  }
}

export function soilDepthM(hex: HexAuthority) {
  return 1 + hex.moistureNorm * 4; // meters
}
```

## Core Resolver (World Space)

```ts
export function voxelAtWorld(
  hex: HexAuthority,
  worldX: number,
  worldY: number,
  worldZ: number,
  ctx: TerrainContext
): VoxelMat {
  const surfaceM = surfaceHeightM(hex, worldX, worldZ, ctx);
  const soilM = soilDepthM(hex);

  if (worldY > surfaceM) {
    if (worldY <= ctx.seaLevelM && surfaceM <= ctx.seaLevelM) return VoxelMat.Water;
    return VoxelMat.Air;
  }
  if (worldY >= surfaceM - ctx.metersPerVoxel) return surfaceMaterial(hex);
  if (worldY > surfaceM - soilM) return VoxelMat.Soil;
  return VoxelMat.Rock;
}
```

## Chunk Builder (Sampling Wrapper)

```ts
export function buildChunk(
  hex: HexAuthority,
  chunkOriginWorld: { x: number; y: number; z: number },
  size: number,
  ctx: TerrainContext
) {
  const data = new Uint8Array(size * size * size);
  let i = 0;
  for (let lx = 0; lx < size; lx++) {
    for (let ly = 0; ly < size; ly++) {
      for (let lz = 0; lz < size; lz++) {
        const worldX = chunkOriginWorld.x + lx * ctx.metersPerVoxel;
        const worldY = chunkOriginWorld.y + ly * ctx.metersPerVoxel;
        const worldZ = chunkOriginWorld.z + lz * ctx.metersPerVoxel;
        data[i++] = voxelAtWorld(hex, worldX, worldY, worldZ, ctx);
      }
    }
  }
  return data;
}
```

## Non-Negotiable Rules
- Never store dense full-planet voxels.
- Authority fields are the source of truth.
- Resolver inputs are world-space, deterministic, and seam-constrained at borders.

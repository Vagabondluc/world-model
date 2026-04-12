# Baked Texture Spec (Per Hex)

## Status
Foundation spec. Freeze early.

## Purpose
Define engine-agnostic semantic textures per authoritative local hex (L5) that:
- summarize local features
- drive voxel/sprite/grid derivations
- support deterministic regeneration

## Core Rules
1. Textures encode simulation facts, not art color.
2. Each channel has one semantic meaning.
3. Values are normalized or unit-defined.
4. Textures are generated, never hand-edited.
5. Cache by `(hexId, resolution)` and regenerate deterministically.
6. v1 uses one canonical format per map (no runtime alternatives).

## Ownership
- Generated and stored at L5 (local hex authority level).
- Consumed by L6-L8 derived views.

## Canonical Texture Set (v1 Frozen)

## 1) `BiomeIndexMap`
- Format: `R8`
- Typical size: `64x64`
- Meaning: dominant biome ID per sample

## 2) `ElevationDeltaMap`
- Format: `R16F`
- Unit: meters
- Meaning: local elevation delta from parent hex mean elevation

## 3) `SoilDepthMap`
- Format: `R16F`
- Unit: meters
- Meaning: unconsolidated depth (soil/alluvium/sediment)

## 4) `MoistureMap`
- Format: `R8`
- Range: `0..1`
- Meaning: long-term moisture availability

## 5) `WaterMask`
- Format: `R8` bitmask
- Bits:
  - `1`: river
  - `2`: lake
  - `4`: wetland

## 6) `MaterialClassMap` (Optional)
- Format: `R8`
- Meaning: dominant substrate class (bedrock/sand/silt/clay/organic/volcanic)

## Coordinate System
Use canonical hex-local UV sampling for all maps.

Definitions:
- Parent hex vertices in local 2D are `V0..V5` (clockwise).
- Raster coordinates are pixel centers:
  - `u = (i + 0.5) / width`
  - `v = (j + 0.5) / height`
- `u,v` map to local 2D bounding rectangle, then tested against hex interior.

Rules:
- Outside-hex pixels are encoded as invalid (sentinel policy).
- Inside-hex pixels must be sampled by the same point-to-subhex resolver.
- Border pixels must use edge-constrained samples (from shared edge key contract).

## Semantic Mipmapping
Downsampling must aggregate meaning, not color averages.

Examples:
- biome coverage histogram
- slope histogram from elevation deltas
- terrain class inference for travel/combat

Required aggregation functions:
- categorical maps: majority vote with deterministic tie-breaker
- bitmask maps: bitwise OR
- continuous maps: arithmetic mean in linear value space

## Downstream Projection

Voxels:
- Sample elevation delta + soil depth + material class to resolve vertical columns.

Sprites:
- Sample biome/moisture/water/material to spawn contextual instances.

5-ft grid:
- Aggregate local terrain into movement/encounter-safe tile classes.

## Storage Guidance
At `64x64`, the set is typically tens of KB per active refined hex.  
Keep only active regions hot in cache.

## Invalid/Sentinel Encoding (v1)
- `BiomeIndexMap`: `255` means invalid/outside
- `ElevationDeltaMap`: IEEE float16 `NaN` means invalid/outside
- `SoilDepthMap`: IEEE float16 `NaN` means invalid/outside
- `MoistureMap`: `255` means invalid/outside
- `WaterMask`: `0` means none (outside also treated as none for consumers)
- `MaterialClassMap`: `255` means invalid/outside

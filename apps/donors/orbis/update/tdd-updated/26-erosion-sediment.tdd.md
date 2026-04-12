# TDD Twin: Erosion & Sediment

## 1. Erosion Model Tests
- [ ] Verify water erosion rate calculations.
- [ ] Test wind erosion rate calculations.
- [ ] Validate erosion threshold parameters.

## 2. Sediment Transport Tests
- [ ] Verify sediment deposition patterns.
- [ ] Test sediment transport capacity.
- [ ] Validate sediment sorting by particle size.

## 3. Terrain Modification Tests
- [ ] Verify terrain height changes from erosion.
- [ ] Test terrain smoothing algorithms.
- [ ] Validate canyon/valley formation.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

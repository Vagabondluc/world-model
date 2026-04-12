# TDD Twin: Hydrology Erosion

## 1. Water Erosion Tests
- [ ] Verify hydraulic erosion rates.
- [ ] Test river incision depth calculations.
- [ ] Validate sediment transport capacity.

## 2. Coastal Erosion Tests
- [ ] Verify wave erosion calculations.
- [ ] Test sea level change effects.
- [ ] Validate coastline evolution.

## 3. Deposition Tests
- [ ] Verify sediment deposition patterns.
- [ ] Test delta formation.
- [ ] Validate alluvial plain creation.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

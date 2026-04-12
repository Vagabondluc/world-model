# TDD Twin: Tectonics Crust

## 1. Plate Tectonics Tests
- [ ] Verify plate boundary detection.
- [ ] Test continental drift calculations.
- [ ] Validate plate collision handling.

## 2. Crust Formation Tests
- [ ] Verify crust thickness modeling.
- [ ] Test crust composition distribution.
- [ ] Validate crust age calculations.

## 3. Volcanism Tests
- [ ] Verify volcanic eruption probability.
- [ ] Test lava flow modeling.
- [ ] Validate volcanic terrain formation.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

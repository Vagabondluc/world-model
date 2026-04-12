# TDD Twin: Biosphere Capacity

## 1. Carrying Capacity Tests
- [ ] Verify biome-specific carrying capacity calculations.
- [ ] Test capacity changes with climate shifts.
- [ ] Validate capacity saturation effects on population growth.

## 2. Resource Competition Tests
- [ ] Verify inter-species competition for limited resources.
- [ ] Test niche partitioning dynamics.
- [ ] Validate competitive exclusion principles.

## 3. Succession Tests
- [ ] Verify primary succession on barren terrain.
- [ ] Test secondary succession after disturbance.
- [ ] Validate climax community stability.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

# TDD Twin: Biome Stability

## 1. Biome Transition Tests
- [ ] Verify biome change thresholds.
- [ ] Test biome transition smoothness.
- [ ] Validate biome stability metrics.

## 2. Climate-Biome Tests
- [ ] Verify biome distribution based on climate.
- [ ] Test biome shifts with climate change.
- [ ] Validate biome-climate coupling.

## 3. Disturbance Tests
- [ ] Verify biome recovery after disturbance.
- [ ] Test succession pathways.
- [ ] Validate resilience metrics.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

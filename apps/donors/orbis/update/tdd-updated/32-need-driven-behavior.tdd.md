# TDD Twin: Need-Driven Behavior

## 1. Need System Tests
- [ ] Verify need value calculation algorithms.
- [ ] Test need decay over time.
- [ ] Validate need priority ordering.

## 2. Action Selection Tests
- [ ] Verify action selection based on needs.
- [ ] Test action execution effects on needs.
- [ ] Validate action planning efficiency.

## 3. Behavior Tests
- [ ] Verify emergent behavior from needs.
- [ ] Test behavior consistency.
- [ ] Validate behavior adaptation.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

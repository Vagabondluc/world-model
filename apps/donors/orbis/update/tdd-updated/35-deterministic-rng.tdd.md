# TDD Twin: Deterministic RNG

## 1. Hash Primitive Tests
- [ ] Test SplitMix64 hash consistency.
- [ ] Verify `hash64(seed, context)` output bit-identity.
- [ ] Test deterministic float01 conversion from uint64.

## 2. Stream Calculation Tests
- [ ] Verify `world_seed` + `subsystem_id` + `tick` yields unique streams.
- [ ] Test no overlapping RNG results between domains.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

# TDD Twin: State Authority Contract

## 1. Authority Tests
- [ ] Verify single source of truth for world state.
- [ ] Test state change authorization.
- [ ] Validate state consistency checks.

## 2. Mutation Tests
- [ ] Verify authorized mutation channels.
- [ ] Test mutation validation pipeline.
- [ ] Validate mutation rollback on failure.

## 3. Query Tests
- [ ] Verify read-only query access.
- [ ] Test query performance and caching.
- [ ] Validate query result consistency.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

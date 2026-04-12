# TDD Twin: Save/Load Snapshot Contract

## 1. Serialization Tests
- [ ] Verify complete world state serialization.
- [ ] Test serialization performance.
- [ ] Validate serialization format consistency.

## 2. Deserialization Tests
- [ ] Verify complete world state restoration.
- [ ] Test version compatibility handling.
- [ ] Validate data integrity checks.

## 3. Incremental Save Tests
- [ ] Verify incremental delta serialization.
- [ ] Test delta application correctness.
- [ ] Validate rollback functionality.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

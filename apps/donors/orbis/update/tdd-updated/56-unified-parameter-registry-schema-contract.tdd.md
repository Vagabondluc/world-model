# TDD Twin: Unified Parameter Registry Schema Contract

## 1. Schema Validation Tests
- [ ] Verify parameter schema validation.
- [ ] Test parameter type checking.
- [ ] Validate parameter range constraints.

## 2. Registry Tests
- [ ] Verify parameter registration and lookup.
- [ ] Test parameter versioning.
- [ ] Validate parameter inheritance.

## 3. Query Tests
- [ ] Verify parameter query performance.
- [ ] Test parameter filtering and sorting.
- [ ] Validate parameter aggregation.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

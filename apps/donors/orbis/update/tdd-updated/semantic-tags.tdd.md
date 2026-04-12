# TDD Twin: Semantic Tags

## 1. Tag Definition Tests
- [ ] Verify tag schema validation.
- [ ] Test tag hierarchy relationships.
- [ ] Validate tag intensity ranges.

## 2. Tag Assignment Tests
- [ ] Verify automatic tag assignment.
- [ ] Test manual tag assignment.
- [ ] Validate tag conflict resolution.

## 3. Query Tests
- [ ] Verify tag-based filtering.
- [ ] Test tag-based aggregation.
- [ ] Validate tag-based search performance.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

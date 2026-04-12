# TDD Twin: Data Types

## 1. Primary Data Types
- [ ] Verify `uint64`, `int32`, `uint32`, `uint16`, `int16`, `uint8` types.
- [ ] Test fixed-point PPM (Parts Per Million) representation consistency.
- [ ] Verify `AbsTime` precision and range.

## 2. Domain Data Structures
- [ ] Validate `SpeciesId` format and generation.
- [ ] Verify `BiomeTypeId` mapping and registry.
- [ ] Test `TagInstance` intensity clamping (0..1,000,000).

## 3. Serialization Consistency
- [ ] Verify bit-identical serialization across platforms.
- [ ] Test byte-order (Little Endian canonical).
- [ ] Validate struct padding/alignment for network transport.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

# TDD Twin: Time Clock System

## 1. Clock Synchronization Tests
- [ ] Verify `AbsTime` monotonic progression.
- [ ] Test tick-based vs. wall-clock time modes.
- [ ] Validate tick-to-`AbsTime` conversion precision.

## 2. Time Dilation Tests
- [ ] Verify simulation speed multipliers (0.1x to 10x).
- [ ] Test pause/resume state preservation.
- [ ] Validate time-step consistency across speed changes.

## 3. Event Scheduling Tests
- [ ] Verify future event scheduling accuracy.
- [ ] Test event cancellation and rescheduling.
- [ ] Validate event ordering by timestamp.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

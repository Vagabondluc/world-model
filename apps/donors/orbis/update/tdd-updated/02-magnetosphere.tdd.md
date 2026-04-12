# TDD Twin: Magnetosphere

## 1. Dynamo Model Tests
- [ ] Verify core rotation rate to magnetic field strength correlation.
- [ ] Test magnetic pole drift over geological timescales.
- [ ] Validate field intensity at surface vs. altitude.

## 2. Solar Wind Interaction Tests
- [ ] Verify magnetosphere compression during solar storms.
- [ ] Test aurora oval formation at magnetic poles.
- [ ] Validate cosmic ray deflection efficiency.

## 3. Field Reversal Tests
- [ ] Verify reversal probability based on core dynamics.
- [ ] Test field strength decay during reversal.
- [ ] Validate post-reversal field re-stabilization.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

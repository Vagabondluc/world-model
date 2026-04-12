# TDD Twin: Atmosphere Transport

## 1. Wind Model Tests
- [ ] Verify wind speed and direction calculations.
- [ ] Test Coriolis effect implementation.
- [ ] Validate atmospheric circulation patterns.

## 2. Heat Transport Tests
- [ ] Verify heat advection and diffusion.
- [ ] Test temperature gradient evolution.
- [ ] Validate thermal equilibrium.

## 3. Moisture Transport Tests
- [ ] Verify humidity distribution.
- [ ] Test precipitation formation.
- [ ] Validate water cycle integration.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

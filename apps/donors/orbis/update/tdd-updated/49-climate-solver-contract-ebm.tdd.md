# TDD Twin: Climate Solver Contract (EBM)

## 1. Energy Balance Tests
- [ ] Test Level 1-4 sophistication levels.
- [ ] Verify equilibrium form: `In = (S/4) * (1 - albedo)`.
- [ ] Test dynamic form: `dT/dt = k * (In - Out)`.

## 2. Zonal Model Tests
- [ ] Verify insolation per latitude band based on declination.
- [ ] Test diffusion mixing between adjacent bands.
- [ ] Verify Snowball hysteresis and albedo thresholds.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

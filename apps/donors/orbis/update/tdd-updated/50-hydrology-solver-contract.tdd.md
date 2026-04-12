# TDD Twin: Hydrology Solver Contract

## 1. Water Balance Tests
- [ ] Verify precipitation accumulation and runoff.
- [ ] Test evaporation rates based on temperature.
- [ ] Validate water table dynamics.

## 2. Flow Model Tests
- [ ] Verify river flow calculations.
- [ ] Test watershed delineation.
- [ ] Validate floodplain modeling.

## 3. Groundwater Tests
- [ ] Verify aquifer recharge rates.
- [ ] Test groundwater flow patterns.
- [ ] Validate well extraction effects.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

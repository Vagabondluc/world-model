# TDD Twin: Carbon Cycle

## 1. Atmospheric CO2 Tests
- [ ] Verify CO2 concentration changes with emissions/absorption.
- [ ] Test greenhouse effect temperature correlation.
- [ ] Validate ocean-atmosphere CO2 exchange rates.

## 2. Ocean Carbon Tests
- [ ] Verify dissolved inorganic carbon (DIC) distribution.
- [ ] Test calcium carbonate saturation state.
- [ ] Validate biological pump efficiency.

## 3. Terrestrial Carbon Tests
- [ ] Verify biomass carbon storage by biome.
- [ ] Test soil carbon sequestration rates.
- [ ] Validate forest regrowth carbon uptake.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

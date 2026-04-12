# TDD Twin: Trophic Energy

## 1. Energy Flow Tests
- [ ] Verify energy transfer efficiency between trophic levels.
- [ ] Test energy loss through metabolism.
- [ ] Validate energy conservation principles.

## 2. Food Web Tests
- [ ] Verify predator-prey relationships.
- [ ] Test food web stability metrics.
- [ ] Validate cascade effects from species removal.

## 3. Biomass Tests
- [ ] Verify biomass accumulation rates.
- [ ] Test biomass distribution across trophic levels.
- [ ] Validate biomass turnover calculations.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

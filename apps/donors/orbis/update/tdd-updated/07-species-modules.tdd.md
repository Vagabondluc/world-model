# TDD Twin: Species Modules

## 1. Species Definition Tests
- [ ] Verify species trait inheritance from templates.
- [ ] Test species ID generation uniqueness.
- [ ] Validate species metadata completeness.

## 2. Trait System Tests
- [ ] Verify trait value ranges and constraints.
- [ ] Test trait interaction effects.
- [ ] Validate trait mutation rates.

## 3. Population Dynamics Tests
- [ ] Verify birth/death rate calculations.
- [ ] Test carrying capacity enforcement.
- [ ] Validate age structure distribution.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

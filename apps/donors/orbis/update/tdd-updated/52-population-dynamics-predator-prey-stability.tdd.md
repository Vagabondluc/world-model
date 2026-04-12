# TDD Twin: Population Dynamics (Predator-Prey Stability)

## 1. Lotka-Volterra Tests
- [ ] Verify predator-prey oscillation patterns.
- [ ] Test equilibrium stability conditions.
- [ ] Validate phase relationships.

## 2. Carrying Capacity Tests
- [ ] Verify logistic growth constraints.
- [ ] Test carrying capacity effects on stability.
- [ ] Validate density-dependent mortality.

## 3. Multi-Species Tests
- [ ] Verify food web stability metrics.
- [ ] Test cascade effects from species loss.
- [ ] Validate competitive exclusion dynamics.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

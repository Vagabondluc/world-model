# TDD Twin: Simulator Dashboard

## 1. Dashboard UI Tests
- [ ] Verify dashboard component rendering.
- [ ] Test real-time metric updates.
- [ ] Validate responsive layout behavior.

## 2. Metric Collection Tests
- [ ] Verify FPS tracking accuracy.
- [ ] Test memory usage monitoring.
- [ ] Validate entity count reporting.

## 3. Control Interface Tests
- [ ] Verify pause/resume functionality.
- [ ] Test simulation speed adjustment.
- [ ] Validate reset functionality.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

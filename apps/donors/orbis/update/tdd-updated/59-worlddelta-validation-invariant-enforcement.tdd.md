# TDD Twin: WorldDelta Validation & Invariant Enforcement

## 1. Pipeline Integrity Tests
- [ ] Verify 10-step validation pipeline execution order.
- [ ] Test `RegistryValidation` through `DigestTraceCommit`.
- [ ] Verify deterministic rejection of invalid deltas.

## 2. Invariant Check Tests
- [ ] Test `InvariantDefV1` enforcement (e.g., NonNegativeField).
- [ ] Verify `Severity` escalation (Warn, Halt, Quarantine).
- [ ] Test `DeltaRejectionTraceV1` logging.

## 3. Orbis 1.0 Compatibility Tests
- [ ] Verify type mapping to Orbis 1.0 BiomeType enum (23 values: DEEP_OCEAN=0 through ALPINE=22)
- [ ] Verify type mapping to Orbis 1.0 VoxelMaterial enum (22 values: AIR=0 through MAGMA=21)
- [ ] Verify WorldDelta format compatibility (h?: number, t?: number, m?: number, s?: SettlementType, d?: string)
- [ ] Test serialization format compatibility (Little Endian byte order)
- [ ] Verify RefinedHexHeader structure compatibility (specVersion, encodingVersion, generatorVersion, worldSeed, hexId, rasterSize, subDivN)

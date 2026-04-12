
# TDD Plan: Persistence (Phase 13)

## 1. Unit Tests (Logic)

### TC-1301: Delta Extraction
**Scenario**: User generates world, then raises one hex.
**Input**: 
- `baseHexes`: Generated from Seed A.
- `currentHexes`: Same as base, but `hex[0].height` increased by 0.5.
**Expected Output**: 
- `deltas` object contains ONLY key `hex[0].id`.
- `deltas[id].h` equals the new height.

### TC-1302: Delta Application (Hydration)
**Scenario**: Loading a save file.
**Input**:
- `ProjectSave` with `seed: 123` and `deltas: { 'cell-5': { h: 0.8 } }`.
**Action**:
- Run `generatePlanetHexes(config, 123)`.
- Apply deltas.
**Expected Output**:
- Hex `cell-5` height is `0.8`.
- Hex `cell-6` (untouched) matches the procedural generation.

### TC-1303: Schema Validation
**Scenario**: Loading a corrupted JSON (missing seed).
**Action**: Parse with Zod schema.
**Expected Output**: Validation Error / Safe Fallback (User Alert), App does not crash.

## 2. Integration Tests (Store)

### TC-1304: Save-Load Cycle
1. Generate World.
2. Paint a smiley face with "Raise" brush.
3. Click Save.
4. Refresh Page (Simulated reset).
5. Click Load.
6. Verify smiley face exists (Height map matches).

### TC-1305: Earth Preset
1. Open Load Modal.
2. Select "Earth".
3. Verify Config: `plateCount` is 12, `seaLevel` is 0.1.
4. Verify Seed matches fixed Earth seed.

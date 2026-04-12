
# Spec: Biome Resilience (Phase 3)

## 1. Objective
Replace fragile `if/else` chains with a **Whittaker-style Lookup Table**. This ensures every combination of Height/Temp/Moisture maps to a valid, logical biome.

## 2. The Biome Matrix
We calculate a composite index for Temperature and Moisture based on bands.

### 2.1 Temperature Bands (Celsius)
1. **POLAR**: `<-10°C`
2. **BOREAL**: `-10°C` to `5°C`
3. **TEMPERATE**: `5°C` to `20°C`
4. **SUBTROPICAL**: `20°C` to `30°C`
5. **TROPICAL**: `>30°C`

### 2.2 Moisture Bands (Normalized 0-1)
1. **ARID**: `<0.2`
2. **SEMI_ARID**: `0.2` to `0.4`
3. **MODERATE**: `0.4` to `0.6`
4. **HUMID**: `0.6` to `0.8`
5. **WET**: `>0.8`

## 3. New Biome Definitions
- **MANGROVE**: Coastal (`SHELF`/`STRAND`) + Tropical + Wet.
- **CLIFFS**: Coastal (`STRAND`) + High Slope (or Highland elevation meeting ocean).
- **ALPINE_TUNDRA**: `MONTANE` + Temperate/Boreal.
- **HIGH_DESERT**: `HIGHLAND` + Arid.

## 4. Verification Plan (TDD)
- [ ] **Test Case 1**: "Undefined" biome never appears.
- [ ] **Test Case 2**: Gradient Check. Walking from Equator to Pole should yield:
  - `Tropical Rainforest` -> `Savanna` -> `Temperate Forest` -> `Taiga` -> `Tundra` -> `Ice`.
- [ ] **Test Case 3**: Coastal Check. Hexes at `Height ~ 0` should prioritize `BEACH` or `MANGROVE`.

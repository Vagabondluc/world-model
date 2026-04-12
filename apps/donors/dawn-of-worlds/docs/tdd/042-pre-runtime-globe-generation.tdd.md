# TDD-042: Pre-Runtime Globe Generation

**Epic:** Pre-Game Globe
**Spec:** `docs/specs/042-pre-runtime-globe-generation.md`

## 1. Genesis Pipeline Tests

### `logic/genesis/climate.test.ts` (New Module)

- **Test:** `calculateBiome_ShouldUseWhittakerMatrix`
    - **Setup:** High Temp + High Moisture.
    - **Expect:** Returns 'RAINFOREST'.
    - **Setup:** High Temp + Low Moisture.
    - **Expect:** Returns 'DESERT'.

- **Test:** `generateRainShadows_ShouldDryOutLeewardSide`
    - **Setup:** Wind from West. High Mountain Range at X=10.
    - **Expect:** Hexes at X=11 (East) have significantly reduced Moisture.

- **Test:** `applyLatitudeTempGradient_ShouldMakePolesCold`
    - **Setup:** Planet Radius 100.
    - **Expect:** Temp at Lat 90 (Pole) < -10C. Temp at Lat 0 (Equator) > 25C.

### `logic/genesis/noise.test.ts` (New Module)

- **Test:** `generateHeightmap_ShouldRespectOctaves`
    - **Setup:** Config A: Octaves=1. Config B: Octaves=8.
    - **Expect:** Config B output has higher fractal detail (frequency variance) than A.

## 2. Region Extraction Tests

### `logic/genesis/extractor.test.ts`

- **Test:** `extractRegion_ShouldPreserveBiomeData`
    - **Setup:** Globe has a Desert hex at [10, 20]. User selects region covering [10, 20].
    - **Expect:** Extracted `GameHex` matches Biome 'DESERT'.

- **Test:** `projectRegion_ShouldHandleCoordinateWrapping`
    - **Setup:** Select region crossing the Dateline (180/-180).
    - **Expect:** Hex grid coordinates are contiguous (0,0 -> 1,0), handling the wrap correctly.

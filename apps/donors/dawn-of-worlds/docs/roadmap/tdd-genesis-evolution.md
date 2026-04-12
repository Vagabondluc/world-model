# TDD: Genesis Protocol Evolution

## Test Suite 1: Seeded Determinism
**Target:** `logic/biomes.ts`

- [ ] **Test 1.1 (Consistency):** Given the same `seed` and `density` params, `getBaseBiome` must return the same results for the same coordinates across multiple calls.
- [ ] **Test 1.2 (Variability):** Changing only the `seed` while keeping `density` constant must result in different biome values for the same coordinates (spatial shift).

## Test Suite 2: Preview Scaling
**Target:** `components/setup-wizard/MapPreview.tsx`

- [ ] **Test 2.1 (Dynamic Rendering):** Updating the `previewZoom` state in parent must trigger a re-draw of the canvas.
- [ ] **Test 2.2 (Canvas Bounds):** At zoom 1.0, the preview must center on a specific focal point to avoid showing only the top-left corner of a large map.

## Test Suite 3: UI Integration
**Target:** `components/setup-wizard/Step1World.tsx`

- [ ] **Test 3.1 (State Propagation):** Clicking "Randomize Seed" must update the `config.worldGen.seed` value, which in turn must trigger the `MapPreview` to re-render.
- [ ] **Test 3.2 (Input Validation):** Manual seed input must only accept integers.

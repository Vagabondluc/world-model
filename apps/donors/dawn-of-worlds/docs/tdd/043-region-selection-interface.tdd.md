# TDD-043: Region Selection Interface

**Epic:** Region Selection
**Spec:** `docs/specs/043-region-selection-interface.md`

## 1. Selection Logic Tests

### `logic/genesis/selector.test.ts`

- **Test:** `getRegionStats_ShouldCountBiomesCorrectly`
    - **Setup:** Mock Globe with 50% Water, 50% Land. Selection covers entire globe.
    - **Expect:** Stats return `{ water: 0.5, land: 0.5 }`.

- **Test:** `validateSelection_ShouldFail_IfTooLarge`
    - **Setup:** Config max radius = 100km. User selects 500km radius.
    - **Expect:** Returns `isValid: false`, `reason: "Too Large"`.

## 2. Coordinate Mapping Tests

### `logic/genesis/coordinates.test.ts`

- **Test:** `screenToGlobe_ShouldReturnAccurateLatLong`
    - **Setup:** Camera at (0,0,10). Click center of screen (0,0).
    - **Expect:** Returns Lat 0, Long 0.

- **Test:** `selectionToGameGrid_ShouldCenterOnFocus`
    - **Setup:** Select region centered on Lat 45, Long 90.
    - **Expect:** Generated GameGrid (0,0) corresponds to Globe (45, 90).

# TDD-048: Pole Mitigation

**Epic:** Pole Mitigation
**Spec:** `docs/specs/048-pole-mitigation.md`

## 1. Pentagon Logic Tests

### `logic/globe/poles.test.ts`

- **Test:** `identifyPentagons_ShouldFindExactlyTwelve`
    - **Setup:** Generate any level Icosahedron.
    - **Expect:** Returns exactly 12 IDs for pentagonal cells.

- **Test:** `handlePentagonGameplay_ShouldBlockOrAdjust`
    - **Setup:** Unit tries to move into Pentagon Cell.
    - **Expect:** Movement disallowed OR handled as special 5-neighbor case (depending on design choice).

## 2. Visual Mitigation Tests

### `logic/globe/visuals.test.ts`

- **Test:** `maskPentagon_ShouldApplyAsset`
    - **Setup:** Render loop.
    - **Expect:** Pentagons rendered with "Impassable Mountain" or "Polar Vendor" asset to hide geometry.

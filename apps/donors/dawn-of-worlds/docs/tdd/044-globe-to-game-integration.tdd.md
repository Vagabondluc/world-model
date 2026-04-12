# TDD-044: Globe-to-Game Integration

**Epic:** Globe Integration
**Spec:** `docs/specs/044-globe-to-game-integration.md`

## 1. Coordinate Projection Tests

### `logic/globe/projection.test.ts`

- **Test:** `projectGlobeToGrid_ShouldMaintainAdjacency`
    - **Setup:** Select cluster of 3 hexes on Globe.
    - **Expect:** Resulting Grid coordinates (q,r) are adjacent.

- **Test:** `handleDatelineCrossing_ShouldNormalizeCoordinates`
    - **Setup:** Selection spans longitude 180/-180.
    - **Expect:** Grid coordinates flow continuously without a gap.

## 2. State Hydration Tests

### `logic/globe/hydrator.test.ts`

- **Test:** `hydrateWorldCache_ShouldPopulateFromGlobeData`
    - **Setup:** GlobeData has 'Mountain' at index 50.
    - **Expect:** `gameStore.worldCache` contains a hex with `kind: 'TERRAIN'` and `biome: 'MOUNTAIN'`.

- **Test:** `resetGameLoop_ShouldClearOldState`
    - **Setup:** Existing game state with history.
    - **Expect:** `hydrateWorldCache` clears previous entities (Cities, Units) but optionally keeps player data if specified.

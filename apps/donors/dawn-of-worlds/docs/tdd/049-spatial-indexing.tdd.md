# TDD-049: Spatial Indexing

**Epic:** Spatial Indexing
**Spec:** `docs/specs/049-spatial-indexing.md`

## 1. Structure Tests

### `logic/globe/spatialIndex.test.ts`

- **Test:** `buildIndex_ShouldPartitionFaces`
    - **Setup:** Insert 10k faces.
    - **Expect:** Tree depth increases. Faces distributed into nodes.

- **Test:** `queryRadius_ShouldReturnNearbyObjects`
    - **Setup:** Search for objects within 5 units of (0,1,0).
    - **Expect:** Returns items in range. Excludes distant items.

## 2. Dynamic Update Tests

- **Test:** `updateObjectPosition_ShouldRebalance`
    - **Setup:** Move object from Node A to Node B.
    - **Expect:** Index updates correctly. Object found in new location query.

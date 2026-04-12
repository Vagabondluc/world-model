# TDD-046: Smooth Sphere Geometry

**Epic:** Sphere Geometry
**Spec:** `docs/specs/046-smooth-sphere-geometry.md`

## 1. Geometry Math Tests

### `logic/globe/geometry.test.ts`

- **Test:** `getMidpoint_ShouldReturnNormalizedVector`
    - **Setup:** Two vertices on unit sphere.
    - **Expect:** Midpoint is also 1.0 distance from origin (projected).

- **Test:** `calculateFaceNormal_ShouldPointOutward`
    - **Setup:** Triangle face on sphere surface.
    - **Expect:** Normal vector points away from origin.

## 2. Chunking Tests

### `logic/globe/chunking.test.ts`

- **Test:** `assignFaceToChunk_ShouldGroupNearbyFaces`
    - **Setup:** List of faces. Spatial grouping.
    - **Expect:** Faces in same octant are assigned to same Chunk ID.

# TDD-045: Smooth Spherical Globe Architecture

**Epic:** Smooth Globe
**Spec:** `docs/specs/045-smooth-spherical-globe-architecture.md`

## 1. Mesh Generation Tests

### `logic/globe/meshGenerator.test.ts`

- **Test:** `generateIcosahedron_ShouldReturnCorrectVertexCount`
    - **Setup:** Base Icosahedron (Subdivision 0).
    - **Expect:** 12 Vertices, 20 Faces.

- **Test:** `subdivide_ShouldIncreaseResolution`
    - **Setup:** Subdivide level 1.
    - **Expect:** Face count = 20 * 4 = 80.

- **Test:** `spherify_ShouldNormalizeRadius`
    - **Setup:** Generate subdivided mesh.
    - **Expect:** All vertices have distance ~1.0 from origin (+/- epsilon).

## 2. Performance Tests

### `logic/globe/performance.test.ts`

- **Test:** `generateHighResGlobe_ShouldCompleteWithinBudget`
    - **Setup:** Subdivision level 5 (High Res).
    - **Expect:** Generation time < 200ms (on test runner).

- **Test:** `memoryUsage_ShouldStayWithinLimits`
    - **Setup:** Generate massive mesh (Subdivision 7).
    - **Expect:** Verify array buffer sizes do not exceed defined memory budget (e.g., 50MB).

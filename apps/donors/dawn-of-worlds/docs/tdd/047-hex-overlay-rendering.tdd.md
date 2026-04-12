# TDD-047: Hex Overlay Rendering

**Epic:** Hex Overlay
**Spec:** `docs/specs/047-hex-overlay-rendering.md`

## 1. Hex Generation Tests

### `logic/globe/hexOverlay.test.ts`

- **Test:** `generateHexDual_ShouldFormHexagonsFromTriangles`
    - **Setup:** Input Icosahedron dual graph.
    - **Expect:** Most cells are Hexagons (6 neighbors). Correctly identifies Pentagons (5 neighbors) at 12 vertices.

- **Test:** `distortHexEdges_ShouldMatchSphereCurvature`
    - **Setup:** Generate edge points for large hex.
    - **Expect:** Intermediate points follow the great circle arc, not a straight line.

## 2. Interaction Tests

### `logic/globe/raycast.test.ts`

- **Test:** `getHexAtScreenPoint_ShouldIdentifyCorrectFace`
    - **Setup:** Raycast from camera to center of a known hex.
    - **Expect:** Returns correct Hex ID.

- **Test:** `highlightHex_ShouldUpdateInstanceColor`
    - **Setup:** Select Hex #123.
    - **Expect:** Instance #123 color attribute matches 'HighlightColor'.

# Hex Utils TDD Specification

**Version:** 1.0.0  
**Last Updated:** 2026-01-28  
**Reference Implementation:** [`src/services/generators/hexUtils.ts`](../../src/services/generators/hexUtils.ts)

---

## Test Suite Overview

This test suite defines comprehensive test specifications for hexagonal coordinate utilities used throughout the Mappa Imperium project. The hex utilities provide fundamental geometric operations for the hexagonal grid system, including coordinate transformations, distance calculations, and neighbor enumeration.

### Key Functions Under Test

| Function | Purpose |
|----------|---------|
| `hexToPixel()` | Convert axial hex coordinates to pixel position |
| `pixelToHex()` | Convert pixel position to axial hex coordinates |
| `roundHex()` | Round fractional hex coordinates to nearest whole hex |
| `hexDistance()` | Calculate distance between two hex coordinates |
| `getNeighbors()` | Get the 6 neighboring coordinates of a hex |
| `cubeToAxial()` | Convert cube coordinates to axial coordinates |
| `axialToCube()` | Convert axial coordinates to cube coordinates |

---

## Test Cases

### 1. hexToPixel()

#### Test 1.1: Origin hex to pixel
- **Input:** `hex = { q: 0, r: 0, s: 0 }`, `size = 40`
- **Expected Output:** `{ x: 0, y: 0 }`
- **Edge Cases:** None
- **Description:** The origin hex should map to pixel origin (0, 0)

#### Test 1.2: Positive q coordinate
- **Input:** `hex = { q: 1, r: 0, s: -1 }`, `size = 40`
- **Expected Output:** `{ x: 60, y: 34.64 }` (approximately)
- **Edge Cases:** None
- **Description:** A hex with q=1 should be positioned to the right of origin

#### Test 1.3: Positive r coordinate
- **Input:** `hex = { q: 0, r: 1, s: -1 }`, `size = 40`
- **Expected Output:** `{ x: 0, y: 69.28 }` (approximately)
- **Edge Cases:** None
- **Description:** A hex with r=1 should be positioned below origin

#### Test 1.4: Negative coordinates
- **Input:** `hex = { q: -2, r: -1, s: 3 }`, `size = 40`
- **Expected Output:** `{ x: -120, y: -103.92 }` (approximately)
- **Edge Cases:** Negative coordinate values
- **Description:** Hexes with negative coordinates should map correctly

#### Test 1.5: Size scaling
- **Input:** `hex = { q: 1, r: 0, s: -1 }`, `size = 20`
- **Expected Output:** `{ x: 30, y: 17.32 }` (approximately)
- **Edge Cases:** Small size values
- **Description:** Pixel coordinates should scale linearly with hex size

#### Test 1.6: Large size values
- **Input:** `hex = { q: 1, r: 0, s: -1 }`, `size = 200`
- **Expected Output:** `{ x: 300, y: 173.2 }` (approximately)
- **Edge Cases:** Large size values
- **Description:** Large size values should produce proportional results

#### Test 1.7: Zero size
- **Input:** `hex = { q: 1, r: 0, s: -1 }`, `size = 0`
- **Expected Output:** `{ x: 0, y: 0 }`
- **Edge Cases:** Zero boundary value
- **Description:** Zero size should produce zero pixel coordinates

#### Test 1.8: Fractional coordinates
- **Input:** `hex = { q: 1.5, r: 0.5, s: -2 }`, `size = 40`
- **Expected Output:** `{ x: 90, y: 51.96 }` (approximately)
- **Edge Cases:** Fractional coordinate values
- **Description:** Fractional hex coordinates should be handled correctly

---

### 2. pixelToHex()

#### Test 2.1: Origin pixel to hex
- **Input:** `point = { x: 0, y: 0 }`, `size = 40`
- **Expected Output:** `{ q: 0, r: 0, s: 0 }`
- **Edge Cases:** None
- **Description:** The pixel origin should map to the origin hex

#### Test 2.2: Pixel at hex center
- **Input:** `point = { x: 60, y: 34.64 }`, `size = 40`
- **Expected Output:** `{ q: 1, r: 0, s: -1 }`
- **Edge Cases:** None
- **Description:** A pixel at the center of hex (1,0) should return that hex

#### Test 2.3: Pixel near boundary (rounding test)
- **Input:** `point = { x: 30, y: 17.32 }`, `size = 40`
- **Expected Output:** `{ q: 0, r: 0, s: 0 }` or `{ q: 1, r: 0, s: -1 }`
- **Edge Cases:** Boundary between hexes
- **Description:** Pixels near hex boundaries should round to the nearest hex

#### Test 2.4: Negative pixel coordinates
- **Input:** `point = { x: -60, y: -34.64 }`, `size = 40`
- **Expected Output:** `{ q: -1, r: 0, s: 1 }`
- **Edge Cases:** Negative pixel values
- **Description:** Negative pixel coordinates should map correctly

#### Test 2.5: Large pixel coordinates
- **Input:** `point = { x: 600, y: 346.4 }`, `size = 40`
- **Expected Output:** `{ q: 10, r: 0, s: -10 }`
- **Edge Cases:** Large coordinate values
- **Description:** Large pixel values should produce correct hex coordinates

#### Test 2.6: Zero size (edge case)
- **Input:** `point = { x: 100, y: 100 }`, `size = 0`
- **Expected Output:** Should handle gracefully (throw error or return special value)
- **Edge Cases:** Zero size division
- **Description:** Zero size should be handled as an error case

#### Test 2.7: Precision handling
- **Input:** `point = { x: 60.0001, y: 34.6401 }`, `size = 40`
- **Expected Output:** `{ q: 1, r: 0, s: -1 }`
- **Edge Cases:** Floating-point precision
- **Description:** Small floating-point errors should not affect hex selection

---

### 3. roundHex()

#### Test 3.1: Already integer coordinates
- **Input:** `{ q: 1, r: 2, s: -3 }`
- **Expected Output:** `{ q: 1, r: 2, s: -3 }`
- **Edge Cases:** None
- **Description:** Integer coordinates should remain unchanged

#### Test 3.2: Simple fractional coordinates
- **Input:** `{ q: 1.4, r: 2.3, s: -3.7 }`
- **Expected Output:** `{ q: 1, r: 2, s: -3 }`
- **Edge Cases:** None
- **Description:** Simple fractional coordinates should round correctly

#### Test 3.3: Boundary case - equal differences
- **Input:** `{ q: 0.5, r: 0.5, s: -1.0 }`
- **Expected Output:** Should round to one of the three nearest hexes deterministically
- **Edge Cases:** Equidistant from multiple hexes
- **Description:** When coordinates are equidistant, should round deterministically

#### Test 3.4: Boundary case - q difference largest
- **Input:** `{ q: 0.8, r: 0.1, s: -0.9 }`
- **Expected Output:** `{ q: 1, r: 0, s: -1 }` (q adjusted to maintain q+r+s=0)
- **Edge Cases:** One coordinate has largest difference
- **Description:** When q difference is largest, adjust q to maintain constraint

#### Test 3.5: Boundary case - r difference largest
- **Input:** `{ q: 0.1, r: 0.8, s: -0.9 }`
- **Expected Output:** `{ q: 0, r: 1, s: -1 }`
- **Edge Cases:** One coordinate has largest difference
- **Description:** When r difference is largest, adjust r to maintain constraint

#### Test 3.6: Boundary case - s difference largest
- **Input:** `{ q: 0.1, r: 0.1, s: -0.2 }`
- **Expected Output:** `{ q: 0, r: 0, s: 0 }`
- **Edge Cases:** One coordinate has largest difference
- **Description:** When s difference is largest, adjust s to maintain constraint

#### Test 3.7: Negative fractional coordinates
- **Input:** `{ q: -1.4, r: -2.3, s: 3.7 }`
- **Expected Output:** `{ q: -1, r: -2, s: 3 }`
- **Edge Cases:** Negative fractional values
- **Description:** Negative fractional coordinates should round correctly

#### Test 3.8: Large fractional coordinates
- **Input:** `{ q: 100.6, r: 50.4, s: -151.0 }`
- **Expected Output:** `{ q: 101, r: 50, s: -151 }`
- **Edge Cases:** Large coordinate values
- **Description:** Large fractional coordinates should round correctly

#### Test 3.9: Constraint validation
- **Input:** `{ q: 1.5, r: 2.5, s: -4.0 }`
- **Expected Output:** Result must satisfy q + r + s = 0
- **Edge Cases:** Constraint maintenance
- **Description:** Rounded coordinates must always satisfy the cube constraint

---

### 4. hexDistance()

#### Test 4.1: Same hex (distance 0)
- **Input:** `a = { q: 0, r: 0, s: 0 }`, `b = { q: 0, r: 0, s: 0 }`
- **Expected Output:** `0`
- **Edge Cases:** None
- **Description:** Distance to same hex should be zero

#### Test 4.2: Adjacent hex (distance 1)
- **Input:** `a = { q: 0, r: 0, s: 0 }`, `b = { q: 1, r: 0, s: -1 }`
- **Expected Output:** `1`
- **Edge Cases:** None
- **Description:** Distance to adjacent hex should be one

#### Test 4.3: Distance 2
- **Input:** `a = { q: 0, r: 0, s: 0 }`, `b = { q: 2, r: 0, s: -2 }`
- **Expected Output:** `2`
- **Edge Cases:** None
- **Description:** Distance two hexes away should be two

#### Test 4.4: Diagonal distance
- **Input:** `a = { q: 0, r: 0, s: 0 }`, `b = { q: 1, r: 1, s: -2 }`
- **Expected Output:** `2`
- **Edge Cases:** None
- **Description:** Diagonal movement should have correct distance

#### Test 4.5: Negative coordinates
- **Input:** `a = { q: -5, r: -3, s: 8 }`, `b = { q: 2, r: 1, s: -3 }`
- **Expected Output:** `7`
- **Edge Cases:** Negative coordinate values
- **Description:** Distance should work correctly with negative coordinates

#### Test 4.6: Large coordinates
- **Input:** `a = { q: 0, r: 0, s: 0 }`, `b = { q: 100, r: 50, s: -150 }`
- **Expected Output:** `100`
- **Edge Cases:** Large coordinate values
- **Description:** Distance should work correctly with large coordinates

#### Test 4.7: Symmetry test
- **Input:** `a = { q: 1, r: 2, s: -3 }`, `b = { q: 4, r: 5, s: -9 }`
- **Expected Output:** `hexDistance(a, b) === hexDistance(b, a)`
- **Edge Cases:** None
- **Description:** Distance should be symmetric

#### Test 4.8: Triangle inequality
- **Input:** `a = { q: 0, r: 0, s: 0 }`, `b = { q: 2, r: 2, s: -4 }`, `c = { q: 4, r: 0, s: -4 }`
- **Expected Output:** `hexDistance(a, c) <= hexDistance(a, b) + hexDistance(b, c)`
- **Edge Cases:** None
- **Description:** Distance should satisfy triangle inequality

---

### 5. getNeighbors()

#### Test 5.1: Origin neighbors
- **Input:** `hex = { q: 0, r: 0, s: 0 }`
- **Expected Output:** Array of 6 hexes at distance 1 from origin
- **Edge Cases:** None
- **Description:** Origin should have 6 neighbors at correct positions

#### Test 5.2: Neighbor count
- **Input:** `hex = { q: 5, r: 5, s: -10 }`
- **Expected Output:** Array of exactly 6 hexes
- **Edge Cases:** None
- **Description:** Every hex should have exactly 6 neighbors

#### Test 5.3: Neighbor positions
- **Input:** `hex = { q: 0, r: 0, s: 0 }`
- **Expected Output:** Neighbors should be at positions: (1,0), (1,-1), (0,-1), (-1,0), (-1,1), (0,1)
- **Edge Cases:** None
- **Description:** Neighbors should be at correct relative positions

#### Test 5.4: Neighbor distances
- **Input:** `hex = { q: 0, r: 0, s: 0 }`
- **Expected Output:** Each neighbor should be at distance 1 from origin
- **Edge Cases:** None
- **Description:** All neighbors should be at distance 1

#### Test 5.5: Negative coordinate neighbors
- **Input:** `hex = { q: -5, r: -3, s: 8 }`
- **Expected Output:** Array of 6 hexes with correct positions
- **Edge Cases:** Negative coordinate values
- **Description:** Negative coordinate hexes should have correct neighbors

#### Test 5.6: Neighbor constraint
- **Input:** `hex = { q: 0, r: 0, s: 0 }`
- **Expected Output:** Each neighbor should satisfy q + r + s = 0
- **Edge Cases:** None
- **Description:** All neighbors should satisfy the cube constraint

#### Test 5.7: Neighbor uniqueness
- **Input:** `hex = { q: 0, r: 0, s: 0 }`
- **Expected Output:** All 6 neighbors should be unique
- **Edge Cases:** None
- **Description:** Neighbors should not contain duplicates

---

### 6. cubeToAxial()

#### Test 6.1: Origin conversion
- **Input:** `{ q: 0, r: 0, s: 0 }`
- **Expected Output:** `{ q: 0, r: 0 }`
- **Edge Cases:** None
- **Description:** Origin should convert to origin

#### Test 6.2: Simple conversion
- **Input:** `{ q: 3, r: 5, s: -8 }`
- **Expected Output:** `{ q: 3, r: 5 }`
- **Edge Cases:** None
- **Description:** Cube coordinates should drop s coordinate

#### Test 6.3: Negative coordinates
- **Input:** `{ q: -3, r: -5, s: 8 }`
- **Expected Output:** `{ q: -3, r: -5 }`
- **Edge Cases:** Negative coordinate values
- **Description:** Negative cube coordinates should convert correctly

#### Test 6.4: Large coordinates
- **Input:** `{ q: 100, r: 200, s: -300 }`
- **Expected Output:** `{ q: 100, r: 200 }`
- **Edge Cases:** Large coordinate values
- **Description:** Large cube coordinates should convert correctly

---

### 7. axialToCube()

#### Test 7.1: Origin conversion
- **Input:** `{ q: 0, r: 0 }`
- **Expected Output:** `{ q: 0, r: 0, s: 0 }`
- **Edge Cases:** None
- **Description:** Origin should convert to origin

#### Test 7.2: Simple conversion
- **Input:** `{ q: 3, r: 5 }`
- **Expected Output:** `{ q: 3, r: 5, s: -8 }`
- **Edge Cases:** None
- **Description:** Axial coordinates should calculate s = -q - r

#### Test 7.3: Negative coordinates
- **Input:** `{ q: -3, r: -5 }`
- **Expected Output:** `{ q: -3, r: -5, s: 8 }`
- **Edge Cases:** Negative coordinate values
- **Description:** Negative axial coordinates should convert correctly

#### Test 7.4: Large coordinates
- **Input:** `{ q: 100, r: 200 }`
- **Expected Output:** `{ q: 100, r: 200, s: -300 }`
- **Edge Cases:** Large coordinate values
- **Description:** Large axial coordinates should convert correctly

#### Test 7.5: Constraint validation
- **Input:** `{ q: 3, r: 5 }`
- **Expected Output:** Result must satisfy q + r + s = 0
- **Edge Cases:** Constraint maintenance
- **Description:** Converted cube coordinates must satisfy the cube constraint

#### Test 7.6: NaN coordinate handling
- **Input:** `{ q: NaN, r: 0 }`
- **Expected Output:** Should handle gracefully (throw error or return special value)
- **Edge Cases:** NaN value
- **Description:** NaN coordinates should be handled as error case

#### Test 7.7: Infinity coordinate handling
- **Input:** `{ q: Infinity, r: 0 }` or `{ q: -Infinity, r: 0 }`
- **Expected Output:** Should handle gracefully (throw error or return special value)
- **Edge Cases:** Infinity value
- **Description:** Infinity coordinates should be handled as error case

#### Test 7.8: Mixed NaN/infinity coordinates
- **Input:** `{ q: NaN, r: Infinity }`
- **Expected Output:** Should handle gracefully
- **Edge Cases:** Multiple invalid values
- **Description:** Multiple invalid coordinates should be handled

---

### 8. Performance Benchmarks

#### Test 8.1: hexToPixel performance
- **Input:** Generate 10,000 hex coordinates, convert each to pixel
- **Expected Output:** Complete within 100ms (target: <10μs per conversion)
- **Edge Cases:** None
- **Description:** hexToPixel should be performant for bulk operations

#### Test 8.2: pixelToHex performance
- **Input:** Generate 10,000 pixel coordinates, convert each to hex
- **Expected Output:** Complete within 150ms (target: <15μs per conversion)
- **Edge Cases:** None
- **Description:** pixelToHex should be performant for bulk operations

#### Test 8.3: hexDistance performance
- **Input:** Calculate distance between 10,000 pairs of hexes
- **Expected Output:** Complete within 50ms (target: <5μs per calculation)
- **Edge Cases:** None
- **Description:** hexDistance should be very fast (simple arithmetic)

#### Test 8.4: getNeighbors performance
- **Input:** Generate neighbors for 10,000 hexes
- **Expected Output:** Complete within 100ms (target: <10μs per call)
- **Edge Cases:** None
- **Description:** getNeighbors should be performant for bulk operations

#### Test 8.5: roundHex performance
- **Input:** Round 10,000 fractional hex coordinates
- **Expected Output:** Complete within 100ms (target: <10μs per rounding)
- **Edge Cases:** None
- **Description:** roundHex should be performant for bulk operations

#### Test 8.6: Large coordinate set performance
- **Input:** Process 100,000 hex coordinates through full pipeline (hexToPixel → pixelToHex → roundHex)
- **Expected Output:** Complete within 3 seconds
- **Edge Cases:** Large dataset
- **Description:** Should handle large coordinate sets efficiently

#### Test 8.7: Memory usage for large operations
- **Input:** Process 100,000 hex coordinates
- **Expected Output:** Memory usage should not grow significantly (no leaks)
- **Edge Cases:** Large dataset
- **Description:** Large operations should not cause memory issues

#### Test 8.8: Concurrent operation performance
- **Input:** Simulate 10 concurrent users each processing 1,000 hexes
- **Expected Output:** All operations complete within 500ms
- **Edge Cases:** Concurrent access
- **Description:** Should handle concurrent operations efficiently

---

## Test Categories

### Unit Tests
- All coordinate transformation tests
- Distance calculation tests
- Neighbor enumeration tests
- Rounding algorithm tests

### Integration Tests
- Round-trip conversion: `hexToPixel` → `pixelToHex` → original hex
- Round-trip conversion: `cubeToAxial` → `axialToCube` → original cube
- Combined operations: `pixelToHex` → `getNeighbors` → verify neighbor positions

### Property-Based Tests
- **Symmetry:** `hexDistance(a, b) === hexDistance(b, a)` for all a, b
- **Non-negativity:** `hexDistance(a, b) >= 0` for all a, b
- **Identity:** `hexDistance(a, a) === 0` for all a
- **Triangle inequality:** `hexDistance(a, c) <= hexDistance(a, b) + hexDistance(b, c)`
- **Constraint preservation:** All cube coordinates satisfy q + r + s = 0

---

## Mock Requirements

No mocks are required for hex utilities as they are pure functions with no external dependencies.

---

## Test Data

### Sample Hex Coordinates
```typescript
const originHex: HexCoordinate = { q: 0, r: 0, s: 0 };
const positiveHex: HexCoordinate = { q: 3, r: 5, s: -8 };
const negativeHex: HexCoordinate = { q: -3, r: -5, s: 8 };
const mixedHex: HexCoordinate = { q: 5, r: -2, s: -3 };
```

### Sample Pixel Coordinates
```typescript
const originPixel = { x: 0, y: 0 };
const positivePixel = { x: 60, y: 34.64 };
const negativePixel = { x: -60, y: -34.64 };
```

### Sample Sizes
```typescript
const sizes = [0, 1, 20, 40, 100, 200];
```

---

## Coverage Goals

| Metric | Target | Notes |
|--------|--------|-------|
| Line Coverage | 100% | All code paths should be covered |
| Branch Coverage | 100% | All conditional branches should be covered |
| Function Coverage | 100% | All exported functions should be tested |
| Statement Coverage | 100% | All statements should be executed |

---

## Implementation Notes

### Testing Framework
- Use **Vitest** for unit tests (consistent with project standards)
- Use **@testing-library/react** for any React component tests

### Precision Handling
- Use `toBeCloseTo()` for floating-point comparisons
- Define tolerance thresholds for coordinate comparisons
- Test boundary cases where rounding decisions matter

### Test Organization
```typescript
// Example test structure
describe('hexToPixel', () => {
  describe('basic transformations', () => {
    it('should map origin hex to pixel origin', () => {
      // test implementation
    });
  });
  
  describe('edge cases', () => {
    it('should handle zero size', () => {
      // test implementation
    });
  });
  
  describe('precision handling', () => {
    it('should handle fractional coordinates', () => {
      // test implementation
    });
  });
});
```

---

## Related Documentation

- [INDEX.md](./INDEX.md:1) - Documentation index and cross-reference matrix
- [hex_tile_renderer_spec.md](./hex_tile_renderer_spec.md:1) - Hex tile component that uses hex utilities
- [unified_map_renderer_spec.md](./unified_map_renderer_spec.md:1) - Map renderer that uses hex utilities

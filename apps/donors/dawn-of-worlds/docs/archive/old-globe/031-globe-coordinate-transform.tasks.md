---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# Task List: Globe Coordinate Transform

**TDD Reference:** [031-globe-coordinate-transform.tdd.md](../tdd/031-globe-coordinate-transform.tdd.md)

---

## Phase 1: Transform Types

### Task 1.1: Create ProjectionType Enum
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-003 (Perspective/Orthographic/Mollweide projection)
**Implementation Steps:**
1. Create file `logic/globe/transform/types.ts`
2. Define `ProjectionType` enum with values: `PERSPECTIVE`, `ORTHOGRAPHIC`, `MOLLWEIDE`
3. Export enum
**Test Mapping:** TC-003-001, TC-003-002 (Projection type tests)

### Task 1.2: Create ScreenCoordinates Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-005 (Screen to vector conversion)
**Implementation Steps:**
1. In `logic/globe/transform/types.ts`, define `ScreenCoordinates` interface with fields: `x`, `y`
2. Export interface
**Test Mapping:** TC-005-001, TC-005-002 (Screen coordinates tests)

### Task 1.3: Create BarycentricCoordinates Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-006 (Barycentric conversion)
**Implementation Steps:**
1. In `logic/globe/transform/types.ts`, define `BarycentricCoordinates` interface with fields: `u`, `v`, `w`
2. Export interface
**Test Mapping:** TC-006-001, TC-006-002 (Barycentric tests)

---

## Phase 2: Cell to Vector Conversion

### Task 2.1: Create CellToVectorConverter Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Cell to vector conversion)
**Implementation Steps:**
1. Create file `logic/globe/transform/cell.ts`
2. Implement `CellToVectorConverter` class
3. Add `convert(cell: Cell): Vector3` method
4. Export class
**Test Mapping:** TC-001-001, TC-001-002 (Converter tests)

### Task 2.2: Implement Cell Center Conversion
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Cell to vector conversion)
**Implementation Steps:**
1. In `CellToVectorConverter`, implement `convert()` method
2. Return cell center as vector
3. Export method
**Test Mapping:** TC-001-001, TC-001-002 (Conversion tests)

---

## Phase 3: Vector to Cell Conversion

### Task 3.1: Create VectorToCellConverter Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-002 (Vector to cell conversion)
**Implementation Steps:**
1. Create file `logic/globe/transform/vector.ts`
2. Implement `VectorToCellConverter` class
3. Add `convert(vector: Vector3, cells: Cell[]): Cell | null` method
4. Export class
**Test Mapping:** TC-002-001, TC-002-002 (Converter tests)

### Task 3.2: Implement Vector to Cell Lookup
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Vector to cell conversion)
**Implementation Steps:**
1. In `VectorToCellConverter`, implement `convert()` method
2. Find cell containing vector point
3. Use barycentric coordinates for lookup
4. Return cell or null
5. Export method
**Test Mapping:** TC-002-001, TC-002-002 (Lookup tests)

---

## Phase 4: Projections

### Task 4.1: Create ProjectionBase Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-003 (Projections)
**Implementation Steps:**
1. Create file `logic/globe/transform/projection.ts`
2. Implement `ProjectionBase` abstract class
3. Add `project(vector: Vector3): ScreenCoordinates` abstract method
4. Add `unproject(screen: ScreenCoordinates): Vector3` abstract method
5. Export class
**Test Mapping:** TC-003-001, TC-003-002 (Base tests)

### Task 4.2: Implement PerspectiveProjection
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-003 (Perspective projection)
**Implementation Steps:**
1. In `logic/globe/transform/projection.ts`, implement `PerspectiveProjection` class
2. Implement `project()` method for perspective projection
3. Implement `unproject()` method for inverse projection
4. Export class
**Test Mapping:** TC-003-001, TC-003-002 (Perspective tests)

### Task 4.3: Implement OrthographicProjection
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-003 (Orthographic projection)
**Implementation Steps:**
1. In `logic/globe/transform/projection.ts`, implement `OrthographicProjection` class
2. Implement `project()` method for orthographic projection
3. Implement `unproject()` method for inverse projection
4. Export class
**Test Mapping:** TC-003-003, TC-003-004 (Orthographic tests)

### Task 4.4: Implement MollweideProjection
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-003 (Mollweide projection)
**Implementation Steps:**
1. In `logic/globe/transform/projection.ts`, implement `MollweideProjection` class
2. Implement `project()` method for Mollweide projection
3. Implement `unproject()` method for inverse projection
4. Export class
**Test Mapping:** TC-003-005, TC-003-006 (Mollweide tests)

---

## Phase 5: Screen to Vector Conversion

### Task 5.1: Create ScreenToVectorConverter Class
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-005 (Screen to vector conversion)
**Implementation Steps:**
1. Create file `logic/globe/transform/screen.ts`
2. Implement `ScreenToVectorConverter` class
3. Add `convert(screen: ScreenCoordinates, projection: ProjectionBase): Vector3` method
4. Export class
**Test Mapping:** TC-005-001, TC-005-002 (Converter tests)

### Task 5.2: Implement Screen to Vector
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-005 (Screen to vector conversion)
**Implementation Steps:**
1. In `ScreenToVectorConverter`, implement `convert()` method
2. Use projection unproject method
3. Return vector
4. Export method
**Test Mapping:** TC-005-001, TC-005-002 (Conversion tests)

---

## Phase 6: Coordinate Transform Manager

### Task 6.1: Create CoordinateTransformManager Class
**Priority:** P0
**Dependencies:** Task 2.1, Task 3.1, Task 4.1, Task 5.1
**Acceptance Criteria:** AC-006 (Coordinate transform manager)
**Implementation Steps:**
1. Create file `logic/globe/transform/manager.ts`
2. Implement `CoordinateTransformManager` class
3. Add `setProjection(type: ProjectionType): void` method
4. Add `cellToVector(cell: Cell): Vector3` method
5. Add `vectorToCell(vector: Vector3): Cell | null` method
6. Add `screenToVector(screen: ScreenCoordinates): Vector3` method
7. Add `vectorToScreen(vector: Vector3): ScreenCoordinates` method
8. Export class
**Test Mapping:** TC-006-001, TC-006-002 (Manager tests)

### Task 6.2: Implement Projection Switching
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-006 (Projection switching)
**Implementation Steps:**
1. In `CoordinateTransformManager`, implement `setProjection()` method
2. Create projection instance based on type
3. Store active projection
4. Export method
**Test Mapping:** TC-006-001, TC-006-002 (Switching tests)

### Task 6.3: Implement Transform Methods
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-006 (Transform methods)
**Implementation Steps:**
1. In `CoordinateTransformManager`, implement transform methods
2. Delegate to appropriate converters
3. Use active projection for screen/vector transforms
4. Export methods
**Test Mapping:** TC-006-001, TC-006-002 (Transform tests)

---

## Phase 7: Barycentric Conversion

### Task 7.1: Create BarycentricConverter Class
**Priority:** P0
**Dependencies:** Task 1.3
**Acceptance Criteria:** AC-006 (Barycentric conversion)
**Implementation Steps:**
1. Create file `logic/globe/transform/barycentric.ts`
2. Implement `BarycentricConverter` class
3. Add `toBarycentric(point: Vector3, triangle: Vector3[]): BarycentricCoordinates` method
4. Add `fromBarycentric(barycentric: BarycentricCoordinates, triangle: Vector3[]): Vector3` method
5. Export class
**Test Mapping:** TC-006-001, TC-006-002 (Barycentric tests)

### Task 7.2: Implement Barycentric Conversion
**Priority:** P0
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-006 (Barycentric conversion)
**Implementation Steps:**
1. In `BarycentricConverter`, implement `toBarycentric()` method
2. Calculate barycentric coordinates from point and triangle
3. Return barycentric coordinates
4. Export method
**Test Mapping:** TC-006-001, TC-006-002 (To barycentric tests)

### Task 7.3: Implement Barycentric Inverse Conversion
**Priority:** P0
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-006 (Barycentric conversion)
**Implementation Steps:**
1. In `BarycentricConverter`, implement `fromBarycentric()` method
2. Calculate point from barycentric coordinates and triangle
3. Return vector
4. Export method
**Test Mapping:** TC-006-003, TC-006-004 (From barycentric tests)

---

## Phase 8: Vector Operations

### Task 8.1: Create VectorUtils Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-007 (Vector normalization)
**Implementation Steps:**
1. Create file `logic/globe/transform/vector-utils.ts`
2. Implement `VectorUtils` class
3. Add `normalize(vector: Vector3): Vector3` method
4. Add `length(vector: Vector3): number` method
5. Add `dot(v1: Vector3, v2: Vector3): number` method
6. Add `cross(v1: Vector3, v2: Vector3): Vector3` method
7. Export class
**Test Mapping:** TC-007-001, TC-007-002 (Utils tests)

### Task 8.2: Implement Vector Normalization
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-007 (Vector normalization)
**Implementation Steps:**
1. In `VectorUtils`, implement `normalize()` method
2. Calculate vector length
3. Divide each component by length
4. Return normalized vector
5. Export method
**Test Mapping:** TC-007-001, TC-007-002 (Normalization tests)

### Task 8.3: Implement Vector Length
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-007 (Vector operations)
**Implementation Steps:**
1. In `VectorUtils`, implement `length()` method
2. Calculate Euclidean length
3. Return length
4. Export method
**Test Mapping:** TC-007-003, TC-007-004 (Length tests)

---

## Phase 9: Vector Interpolation

### Task 9.1: Create VectorInterpolator Class
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-008 (Vector interpolation)
**Implementation Steps:**
1. Create file `logic/globe/transform/interpolation.ts`
2. Implement `VectorInterpolator` class
3. Add `lerp(v1: Vector3, v2: Vector3, t: number): Vector3` method
4. Add `slerp(v1: Vector3, v2: Vector3, t: number): Vector3` method
5. Export class
**Test Mapping:** TC-008-001, TC-008-002 (Interpolation tests)

### Task 9.2: Implement Linear Interpolation
**Priority:** P0
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-008 (Vector interpolation)
**Implementation Steps:**
1. In `VectorInterpolator`, implement `lerp()` method
2. Linearly interpolate between vectors
3. Return interpolated vector
4. Export method
**Test Mapping:** TC-008-001, TC-008-002 (Lerp tests)

### Task 9.3: Implement Spherical Interpolation
**Priority:** P0
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-008 (Vector interpolation)
**Implementation Steps:**
1. In `VectorInterpolator`, implement `slerp()` method
2. Spherically interpolate between vectors
3. Return interpolated vector
4. Export method
**Test Mapping:** TC-008-003, TC-008-004 (Slerp tests)

---

## Phase 10: Test Files

### Task 10.1: Create CellToVectorTests
**Priority:** P0
**Dependencies:** Task 2.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/globe/transform/__tests__/cell.test.ts`
2. Write tests for cell to vector conversion
3. Write tests for cell center conversion
**Test Mapping:** TC-001-001, TC-001-002

### Task 10.2: Create VectorToCellTests
**Priority:** P0
**Dependencies:** Task 3.2
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/globe/transform/__tests__/vector.test.ts`
2. Write tests for vector to cell conversion
3. Write tests for vector lookup
4. Write tests for null handling
**Test Mapping:** TC-002-001, TC-002-002

### Task 10.3: Create ProjectionTests
**Priority:** P0
**Dependencies:** Task 4.4
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/globe/transform/__tests__/projection.test.ts`
2. Write tests for perspective projection
3. Write tests for orthographic projection
4. Write tests for Mollweide projection
5. Write tests for projection/unprojection roundtrip
**Test Mapping:** TC-003-001, TC-003-002

### Task 10.4: Create ScreenToVectorTests
**Priority:** P0
**Dependencies:** Task 5.2
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `logic/globe/transform/__tests__/screen.test.ts`
2. Write tests for screen to vector conversion
3. Write tests for vector to screen conversion
4. Write tests for roundtrip conversion
**Test Mapping:** TC-005-001, TC-005-002

### Task 10.5: Create ManagerTests
**Priority:** P0
**Dependencies:** Task 6.3
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/globe/transform/__tests__/manager.test.ts`
2. Write tests for projection switching
3. Write tests for transform methods
4. Write tests for manager state
**Test Mapping:** TC-006-001, TC-006-002

### Task 10.6: Create BarycentricTests
**Priority:** P0
**Dependencies:** Task 7.3
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/globe/transform/__tests__/barycentric.test.ts`
2. Write tests for barycentric conversion
3. Write tests for barycentric inverse conversion
4. Write tests for roundtrip conversion
**Test Mapping:** TC-006-001, TC-006-002

### Task 10.7: Create VectorUtilsTests
**Priority:** P0
**Dependencies:** Task 8.3
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/globe/transform/__tests__/vector-utils.test.ts`
2. Write tests for vector normalization
3. Write tests for vector length
4. Write tests for dot product
5. Write tests for cross product
**Test Mapping:** TC-007-001, TC-007-002

### Task 10.8: Create InterpolationTests
**Priority:** P0
**Dependencies:** Task 9.3
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/globe/transform/__tests__/interpolation.test.ts`
2. Write tests for linear interpolation
3. Write tests for spherical interpolation
4. Write tests for interpolation bounds
**Test Mapping:** TC-008-001, TC-008-002

---

## Summary

**Total Tasks:** 41
**P0 Tasks:** 41 (Types, Cell/Vector conversion, Projections, Screen conversion, Manager, Barycentric, Vector operations, Interpolation, Tests)

**Phases:** 10
- Phase 1: Transform Types (3 tasks)
- Phase 2: Cell to Vector Conversion (2 tasks)
- Phase 3: Vector to Cell Conversion (2 tasks)
- Phase 4: Projections (4 tasks)
- Phase 5: Screen to Vector Conversion (2 tasks)
- Phase 6: Coordinate Transform Manager (3 tasks)
- Phase 7: Barycentric Conversion (3 tasks)
- Phase 8: Vector Operations (3 tasks)
- Phase 9: Vector Interpolation (3 tasks)
- Phase 10: Test Files (8 tasks)

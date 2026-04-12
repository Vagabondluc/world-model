---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# Task List: Globe Geometry Core

**TDD Reference:** [030-globe-geometry-core.tdd.md](../tdd/030-globe-geometry-core.tdd.md)

---

## Phase 1: Core Types

### Task 1.1: Create Vector3 Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Icosahedron initialization)
**Implementation Steps:**
1. Create file `logic/globe/types.ts`
2. Define `Vector3` interface with fields: `x`, `y`, `z`
3. Export interface
**Test Mapping:** TC-001-001, TC-001-002 (Vector3 tests)

### Task 1.2: Create CellKind Enum
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-005 (Cell kind classification)
**Implementation Steps:**
1. In `logic/globe/types.ts`, define `CellKind` enum with values: `HEXAGON`, `PENTAGON`
2. Export enum
**Test Mapping:** TC-005-001, TC-005-002 (CellKind tests)

### Task 1.3: Create Cell Interface
**Priority:** P0
**Dependencies:** Task 1.1, Task 1.2
**Acceptance Criteria:** AC-003 (Cell creation)
**Implementation Steps:**
1. In `logic/globe/types.ts`, define `Cell` interface with fields:
   - `id: string`
   - `kind: CellKind`
   - `vertices: Vector3[]`
   - `center: Vector3`
   - `neighbors: string[]`
   - `faceIndex: number`
2. Export interface
**Test Mapping:** TC-003-001, TC-003-002 (Cell tests)

---

## Phase 2: Icosahedron Initialization

### Task 2.1: Create IcosahedronGenerator Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (Icosahedron initialization)
**Implementation Steps:**
1. Create file `logic/globe/icosahedron.ts`
2. Implement `IcosahedronGenerator` class
3. Add `generate(): Vector3[]` method
4. Add `getVertices(): Vector3[]` method
5. Add `getFaces(): number[][]` method
6. Export class
**Test Mapping:** TC-001-001, TC-001-002 (Generator tests)

### Task 2.2: Implement Icosahedron Vertices
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Icosahedron initialization)
**Implementation Steps:**
1. In `IcosahedronGenerator`, implement vertex generation
2. Calculate golden ratio
3. Generate 12 vertices of icosahedron
4. Normalize vertices to unit sphere
5. Export vertices
**Test Mapping:** TC-001-001, TC-001-002 (Vertices tests)

### Task 2.3: Implement Icosahedron Faces
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Icosahedron initialization)
**Implementation Steps:**
1. In `IcosahedronGenerator`, implement face generation
2. Define 20 triangular faces
3. Store face indices
4. Export faces
**Test Mapping:** TC-001-003, TC-001-004 (Faces tests)

---

## Phase 3: Subdivision Algorithm

### Task 3.1: Create SubdivisionAlgorithm Class
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Subdivision algorithm)
**Implementation Steps:**
1. Create file `logic/globe/subdivision.ts`
2. Implement `SubdivisionAlgorithm` class
3. Add `subdivide(vertices: Vector3[], faces: number[][], level: number): { vertices: Vector3[], faces: number[][] }` method
4. Export class
**Test Mapping:** TC-002-001, TC-002-002 (Subdivision tests)

### Task 3.2: Implement Edge Midpoint Calculation
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Subdivision algorithm)
**Implementation Steps:**
1. In `SubdivisionAlgorithm`, implement `getEdgeMidpoint(v1: Vector3, v2: Vector3): Vector3` function
2. Calculate midpoint between two vertices
3. Normalize to unit sphere
4. Return midpoint
5. Export function
**Test Mapping:** TC-002-001, TC-002-002 (Midpoint tests)

### Task 3.3: Implement Face Subdivision
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Subdivision algorithm)
**Implementation Steps:**
1. In `SubdivisionAlgorithm`, implement `subdivideFace(face: number[], vertices: Vector3[]): number[][]` function
2. Calculate midpoints of each edge
3. Create 4 new triangular faces
4. Return new faces
5. Export function
**Test Mapping:** TC-002-003, TC-002-004 (Face subdivision tests)

### Task 3.4: Implement Recursive Subdivision
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Subdivision algorithm)
**Implementation Steps:**
1. In `SubdivisionAlgorithm`, implement recursive subdivision
2. Subdivide faces for specified level
3. Accumulate new vertices
4. Return subdivided geometry
5. Export function
**Test Mapping:** TC-002-005, TC-002-006 (Recursive tests)

---

## Phase 4: Cell Creation

### Task 4.1: Create CellFactory Class
**Priority:** P0
**Dependencies:** Task 1.3, Task 3.1
**Acceptance Criteria:** AC-003 (Cell creation)
**Implementation Steps:**
1. Create file `logic/globe/cell.ts`
2. Implement `CellFactory` class
3. Add `createCell(id: string, vertices: Vector3[], faceIndex: number): Cell` method
4. Export class
**Test Mapping:** TC-003-001, TC-003-002 (Factory tests)

### Task 4.2: Implement Cell Center Calculation
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-009 (Cell center calculation)
**Implementation Steps:**
1. In `CellFactory`, implement `calculateCenter(vertices: Vector3[]): Vector3` function
2. Average all vertex positions
3. Normalize to unit sphere
4. Return center
5. Export function
**Test Mapping:** TC-009-001, TC-009-002 (Center tests)

### Task 4.3: Implement Cell Creation
**Priority:** P0
**Dependencies:** Task 4.1, Task 4.2
**Acceptance Criteria:** AC-003 (Cell creation)
**Implementation Steps:**
1. In `CellFactory`, implement `createCell()` method
2. Calculate cell center
3. Determine cell kind
4. Initialize empty neighbors array
5. Return cell object
6. Export method
**Test Mapping:** TC-003-001, TC-003-002 (Creation tests)

---

## Phase 5: Cell ID Generation

### Task 5.1: Create CellIdGenerator Class
**Priority:** P0
**Dependencies:** Task 1.3
**Acceptance Criteria:** AC-004 (Cell ID generation)
**Implementation Steps:**
1. Create file `logic/globe/id.ts`
2. Implement `CellIdGenerator` class
3. Add `generate(faceIndex: number, cellIndex: number): string` method
4. Add `parse(id: string): { faceIndex: number, cellIndex: number }` method
5. Export class
**Test Mapping:** TC-004-001, TC-004-002 (ID tests)

### Task 5.2: Implement ID Generation
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-004 (Cell ID generation)
**Implementation Steps:**
1. In `CellIdGenerator`, implement `generate()` method
2. Format ID as `F{faceIndex}C{cellIndex}`
3. Return formatted ID
4. Export method
**Test Mapping:** TC-004-001, TC-004-002 (Generation tests)

### Task 5.3: Implement ID Parsing
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-004 (Cell ID parsing)
**Implementation Steps:**
1. In `CellIdGenerator`, implement `parse()` method
2. Extract face index from ID
3. Extract cell index from ID
4. Return parsed object
5. Export method
**Test Mapping:** TC-004-003, TC-004-004 (Parsing tests)

---

## Phase 6: Cell Kind Classification

### Task 6.1: Create CellKindClassifier Class
**Priority:** P0
**Dependencies:** Task 1.2, Task 1.3
**Acceptance Criteria:** AC-005 (Cell kind classification)
**Implementation Steps:**
1. Create file `logic/globe/kind.ts`
2. Implement `CellKindClassifier` class
3. Add `classify(cell: Cell): CellKind` method
4. Export class
**Test Mapping:** TC-005-001, TC-005-002 (Classifier tests)

### Task 6.2: Implement Pentagon Detection
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-010 (Pentagon detection)
**Implementation Steps:**
1. In `CellKindClassifier`, implement `isPentagon(cell: Cell): boolean` function
2. Check if cell has 5 vertices
3. Return true if pentagon
4. Export function
**Test Mapping:** TC-010-001, TC-010-002 (Pentagon tests)

### Task 6.3: Implement Hexagon Detection
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-005 (Cell kind classification)
**Implementation Steps:**
1. In `CellKindClassifier`, implement `isHexagon(cell: Cell): boolean` function
2. Check if cell has 6 vertices
3. Return true if hexagon
4. Export function
**Test Mapping:** TC-005-001, TC-005-002 (Hexagon tests)

### Task 6.4: Implement Classification
**Priority:** P0
**Dependencies:** Task 6.1, Task 6.2, Task 6.3
**Acceptance Criteria:** AC-005 (Cell kind classification)
**Implementation Steps:**
1. In `CellKindClassifier`, implement `classify()` method
2. Check if pentagon
3. Check if hexagon
4. Return appropriate kind
5. Export method
**Test Mapping:** TC-005-001, TC-005-002 (Classification tests)

---

## Phase 7: Neighbor Finding

### Task 7.1: Create NeighborFinder Class
**Priority:** P0
**Dependencies:** Task 1.3
**Acceptance Criteria:** AC-006 (Neighbor finding)
**Implementation Steps:**
1. Create file `logic/globe/neighbor.ts`
2. Implement `NeighborFinder` class
3. Add `findNeighbors(cell: Cell, allCells: Cell[]): string[]` method
4. Export class
**Test Mapping:** TC-006-001, TC-006-002 (Finder tests)

### Task 7.2: Implement Shared Edge Detection
**Priority:** P0
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-006 (Neighbor finding)
**Implementation Steps:**
1. In `NeighborFinder`, implement `sharesEdge(cell1: Cell, cell2: Cell): boolean` function
2. Check if cells share at least 2 vertices
3. Return true if neighbors
4. Export function
**Test Mapping:** TC-006-001, TC-006-002 (Edge detection tests)

### Task 7.3: Implement Neighbor Finding
**Priority:** P0
**Dependencies:** Task 7.1, Task 7.2
**Acceptance Criteria:** AC-006 (Neighbor finding)
**Implementation Steps:**
1. In `NeighborFinder`, implement `findNeighbors()` method
2. Iterate through all cells
3. Check for shared edges
4. Collect neighbor IDs
5. Return neighbor array
6. Export method
**Test Mapping:** TC-006-001, TC-006-002 (Finding tests)

---

## Phase 8: Face Boundary Handling

### Task 8.1: Create FaceBoundaryHandler Class
**Priority:** P1
**Dependencies:** Task 1.3
**Acceptance Criteria:** AC-007 (Face boundary handling)
**Implementation Steps:**
1. Create file `logic/globe/boundary.ts`
2. Implement `FaceBoundaryHandler` class
3. Add `handleBoundary(cell: Cell, allCells: Cell[]): void` method
4. Export class
**Test Mapping:** TC-007-001, TC-007-002 (Boundary tests)

### Task 8.2: Implement Face Boundary Detection
**Priority:** P1
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-007 (Face boundary handling)
**Implementation Steps:**
1. In `FaceBoundaryHandler`, implement `isOnFaceBoundary(cell: Cell): boolean` function
2. Check if cell is on edge of face
3. Return true if on boundary
4. Export function
**Test Mapping:** TC-007-001, TC-007-002 (Detection tests)

### Task 8.3: Implement Boundary Neighbor Wrapping
**Priority:** P1
**Dependencies:** Task 8.1, Task 8.2
**Acceptance Criteria:** AC-007 (Face boundary handling)
**Implementation Steps:**
1. In `FaceBoundaryHandler`, implement `wrapBoundaryNeighbors(cell: Cell, allCells: Cell[]): string[]` function
2. Find neighbors across face boundaries
3. Return wrapped neighbor IDs
4. Export function
**Test Mapping:** TC-007-003, TC-007-004 (Wrapping tests)

---

## Phase 9: Adjacency Graph Building

### Task 9.1: Create AdjacencyGraphBuilder Class
**Priority:** P0
**Dependencies:** Task 1.3, Task 7.1
**Acceptance Criteria:** AC-008 (Adjacency graph building)
**Implementation Steps:**
1. Create file `logic/globe/graph.ts`
2. Implement `AdjacencyGraphBuilder` class
3. Add `build(cells: Cell[]): Map<string, string[]>` method
4. Export class
**Test Mapping:** TC-008-001, TC-008-002 (Graph tests)

### Task 9.2: Implement Graph Building
**Priority:** P0
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-008 (Adjacency graph building)
**Implementation Steps:**
1. In `AdjacencyGraphBuilder`, implement `build()` method
2. Create Map for adjacency
3. Find neighbors for each cell
4. Store neighbor relationships
5. Return adjacency graph
6. Export method
**Test Mapping:** TC-008-001, TC-008-002 (Building tests)

---

## Phase 10: Cell Calculations

### Task 10.1: Implement Cell Area Calculation
**Priority:** P1
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-011 (Cell area calculation)
**Implementation Steps:**
1. In `CellFactory`, implement `calculateArea(cell: Cell): number` function
2. Calculate area of polygon on sphere
3. Return area value
4. Export function
**Test Mapping:** TC-011-001, TC-011-002 (Area tests)

### Task 10.2: Implement Cell Vertex Calculation
**Priority:** P1
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-009 (Cell vertex calculation)
**Implementation Steps:**
1. In `CellFactory`, implement `calculateVertices(cell: Cell): Vector3[]` function
2. Return cell vertices
3. Export function
**Test Mapping:** TC-009-003, TC-009-004 (Vertex tests)

---

## Phase 11: Globe Mesh Builder

### Task 11.1: Create GlobeMeshBuilder Class
**Priority:** P0
**Dependencies:** Task 2.1, Task 3.1, Task 4.1
**Acceptance Criteria:** AC-001, AC-002, AC-003
**Implementation Steps:**
1. Create file `logic/globe/mesh.ts`
2. Implement `GlobeMeshBuilder` class
3. Add `build(subdivisionLevel: number): { cells: Cell[], vertices: Vector3[], faces: number[][] }` method
4. Export class
**Test Mapping:** TC-001-001, TC-002-001, TC-003-001 (Mesh tests)

### Task 11.2: Implement Mesh Building Pipeline
**Priority:** P0
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-001, AC-002, AC-003
**Implementation Steps:**
1. In `GlobeMeshBuilder`, implement `build()` method
2. Generate icosahedron
3. Subdivide to specified level
4. Create cells from faces
5. Build adjacency graph
6. Return mesh data
7. Export method
**Test Mapping:** TC-001-001, TC-002-001, TC-003-001 (Pipeline tests)

---

## Phase 12: Test Files

### Task 12.1: Create IcosahedronTests
**Priority:** P0
**Dependencies:** Task 2.3
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/globe/__tests__/icosahedron.test.ts`
2. Write tests for icosahedron generation
3. Write tests for vertex count
4. Write tests for face count
**Test Mapping:** TC-001-001, TC-001-002

### Task 12.2: Create SubdivisionTests
**Priority:** P0
**Dependencies:** Task 3.4
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/globe/__tests__/subdivision.test.ts`
2. Write tests for subdivision algorithm
3. Write tests for edge midpoint calculation
4. Write tests for face subdivision
5. Write tests for recursive subdivision
**Test Mapping:** TC-002-001, TC-002-002

### Task 12.3: Create CellTests
**Priority:** P0
**Dependencies:** Task 4.3
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/globe/__tests__/cell.test.ts`
2. Write tests for cell creation
3. Write tests for cell center calculation
4. Write tests for cell properties
**Test Mapping:** TC-003-001, TC-003-002

### Task 12.4: Create CellIdTests
**Priority:** P0
**Dependencies:** Task 5.3
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/globe/__tests__/id.test.ts`
2. Write tests for ID generation
3. Write tests for ID parsing
4. Write tests for ID uniqueness
**Test Mapping:** TC-004-001, TC-004-002

### Task 12.5: Create CellKindTests
**Priority:** P0
**Dependencies:** Task 6.4
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `logic/globe/__tests__/kind.test.ts`
2. Write tests for pentagon detection
3. Write tests for hexagon detection
4. Write tests for cell kind classification
**Test Mapping:** TC-005-001, TC-005-002

### Task 12.6: Create NeighborTests
**Priority:** P0
**Dependencies:** Task 7.3
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/globe/__tests__/neighbor.test.ts`
2. Write tests for neighbor finding
3. Write tests for shared edge detection
4. Write tests for neighbor count
**Test Mapping:** TC-006-001, TC-006-002

### Task 12.7: Create BoundaryTests
**Priority:** P1
**Dependencies:** Task 8.3
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/globe/__tests__/boundary.test.ts`
2. Write tests for face boundary detection
3. Write tests for boundary neighbor wrapping
4. Write tests for boundary handling
**Test Mapping:** TC-007-001, TC-007-002

### Task 12.8: Create GraphTests
**Priority:** P0
**Dependencies:** Task 9.2
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/globe/__tests__/graph.test.ts`
2. Write tests for adjacency graph building
3. Write tests for graph traversal
4. Write tests for graph consistency
**Test Mapping:** TC-008-001, TC-008-002

### Task 12.9: Create CellCalculationTests
**Priority:** P1
**Dependencies:** Task 10.2
**Acceptance Criteria:** AC-009, AC-010, AC-011
**Implementation Steps:**
1. Create file `logic/globe/__tests__/calculations.test.ts`
2. Write tests for cell center calculation
3. Write tests for pentagon detection
4. Write tests for cell area calculation
**Test Mapping:** TC-009-001, TC-010-001, TC-011-001

### Task 12.10: Create MeshTests
**Priority:** P0
**Dependencies:** Task 11.2
**Acceptance Criteria:** AC-001, AC-002, AC-003
**Implementation Steps:**
1. Create file `logic/globe/__tests__/mesh.test.ts`
2. Write tests for mesh building pipeline
3. Write tests for mesh consistency
4. Write tests for different subdivision levels
**Test Mapping:** TC-001-001, TC-002-001, TC-003-001

---

## Summary

**Total Tasks:** 53
**P0 Tasks:** 41 (Types, Icosahedron, Subdivision, Cell creation, ID generation, Kind classification, Neighbor finding, Graph building, Mesh building, Tests)
**P1 Tasks:** 12 (Boundary handling, Cell calculations, Tests)

**Phases:** 12
- Phase 1: Core Types (3 tasks)
- Phase 2: Icosahedron Initialization (3 tasks)
- Phase 3: Subdivision Algorithm (4 tasks)
- Phase 4: Cell Creation (3 tasks)
- Phase 5: Cell ID Generation (3 tasks)
- Phase 6: Cell Kind Classification (4 tasks)
- Phase 7: Neighbor Finding (3 tasks)
- Phase 8: Face Boundary Handling (3 tasks)
- Phase 9: Adjacency Graph Building (2 tasks)
- Phase 10: Cell Calculations (2 tasks)
- Phase 11: Globe Mesh Builder (2 tasks)
- Phase 12: Test Files (10 tasks)

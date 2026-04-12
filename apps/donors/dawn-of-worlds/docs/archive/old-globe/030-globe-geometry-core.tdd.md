---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# TDD: Globe Geometry Core

## Specification Reference
- Spec: [`030-globe-geometry-core.md`](../specs/030-globe-geometry-core.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: Icosahedron Initialization
**Given** subdivision level is specified
**When** icosahedron is initialized
**Then** base vertices and faces must be created

### AC-002: Subdivision Algorithm
**Given** a subdivision level
**When** subdivision is performed
**Then** correct number of cells must be generated

### AC-003: Cell Creation
**Given** subdivision results
**When** cells are created
**Then** each cell must have valid ID, kind, and neighbors

### AC-004: Cell ID Generation
**Given** face and local coordinates
**When** cell ID is generated
**Then** ID must follow format c:face:u:v

### AC-005: Cell Kind Classification
**Given** a cell
**When** cell kind is determined
**Then** cell must be HEX or PENT based on edge count

### AC-006: Neighbor Finding
**Given** a cell
**When** neighbors are requested
**Then** all adjacent cells must be returned

### AC-007: Face Boundary Handling
**Given** subdivided cells
**When** face boundaries are calculated
**Then** boundary cells must be correctly identified

### AC-008: Adjacency Graph Building
**Given** all cells
**When** adjacency graph is built
**Then** graph must contain all cells and their neighbors

### AC-009: Cell Center Calculation
**Given** a cell
**When** center is calculated
**Then** center must be on sphere surface

### AC-010: Cell Vertex Calculation
**Given** a cell
**When** vertices are calculated
**Then** vertices must be on sphere surface

### AC-011: Cell Area Calculation
**Given** a cell
**When** area is calculated
**Then** area must be positive and reasonable

### AC-012: Pentagon Detection
**Given** a cell
**When** edge count is checked
**Then** pentagons must be correctly identified

---

## Test Cases

### AC-001: Icosahedron Initialization

#### TC-001-001: Happy Path - Initialize Base Icosahedron
**Input**:
```typescript
{
  level: 0
}
```
**Expected**: 12 vertices, 20 faces created
**Priority**: P0

#### TC-001-002: Happy Path - Initialize Subdivision Level 1
**Input**:
```typescript
{
  level: 1
}
```
**Expected**: 32 cells (20 hex, 12 pent)
**Priority**: P0

#### TC-001-003: Happy Path - Initialize Subdivision Level 2
**Input**:
```typescript
{
  level: 2
}
```
**Expected**: 132 cells (120 hex, 12 pent)
**Priority**: P0

#### TC-001-004: Edge Case - Invalid Subdivision Level
**Input**:
```typescript
{
  level: 6 // Invalid
}
```
**Expected**: Error thrown, level must be 0-5
**Priority**: P0

#### TC-001-005: Integration - Subdivision Level 3
**Input**:
```typescript
{
  level: 3
}
```
**Expected**: 432 cells (420 hex, 12 pent)
**Priority**: P0

---

### AC-002: Subdivision Algorithm

#### TC-002-001: Happy Path - Subdivide Face
**Input**:
```typescript
{
  face: [0, 8, 4],
  vertices: [/* base vertices */]
}
```
**Expected**: 4 new faces created
**Priority**: P0

#### TC-002-002: Happy Path - Subdivide All Faces
**Input**:
```typescript
{
  faces: [/* all 20 faces */],
  vertices: [/* base vertices */]
}
```
**Expected**: 80 faces created at level 1
**Priority**: P0

#### TC-002-003: Edge Case - Midpoint Cache
**Input**:
```typescript
{
  faces: [0, 8, 4, 0, 8, 4],
  cache: new Map()
}
```
**Expected**: Midpoints cached and reused
**Priority**: P1

#### TC-002-004: Integration - Full Subdivision
**Input**:
```typescript
{
  level: 2
}
```
**Expected**: 132 cells with correct topology
**Priority**: P0

---

### AC-003: Cell Creation

#### TC-003-001: Happy Path - Create Hex Cell
**Input**:
```typescript
{
  face: 0,
  local: { u: 0, v: 0, w: 0 },
  center: [0, 1, 1.618],
  vertices: [/* calculated vertices */]
}
```
**Expected**: Cell created with kind=HEX, edgeCount=6
**Priority**: P0

#### TC-003-002: Happy Path - Create Pentagon Cell
**Input**:
```typescript
{
  face: 0,
  local: { u: 0, v: 0 },
  center: [0, 1, 1.618],
  vertices: [/* 5 vertices */]
}
```
**Expected**: Cell created with kind=PENT, edgeCount=5
**Priority**: P0

#### TC-003-003: Edge Case - Invalid Local Coordinates
**Input**:
```typescript
{
  face: 0,
  local: { u: -1, v: 0 }, // Invalid
  center: [0, 1, 1.618]
}
```
**Expected**: Error thrown, u + v + w must equal 0
**Priority**: P0

#### TC-003-004: Integration - Create All Cells
**Input**:
```typescript
{
  level: 2
}
```
**Expected**: All 132 cells created with correct properties
**Priority**: P0

---

### AC-004: Cell ID Generation

#### TC-004-001: Happy Path - Generate Cell ID
**Input**:
```typescript
{
  face: 0,
  u: 5,
  v: 3
}
```
**Expected**: ID = "c:0:5:3"
**Priority**: P0

#### TC-004-002: Happy Path - Parse Cell ID
**Input**:
```typescript
{
  id: "c:0:5:3"
}
```
**Expected**: Returns { face: 0, u: 5, v: 3 }
**Priority**: P0

#### TC-004-003: Edge Case - Invalid Cell ID Format
**Input**:
```typescript
{
  id: "invalid_id"
}
```
**Expected**: Error thrown, invalid format
**Priority**: P0

#### TC-004-004: Integration - Cell ID Uniqueness
**Input**:
```typescript
{
  existingIds: ["c:0:5:3", "c:0:6:2"]
}
```
**Expected**: New ID generated, uniqueness guaranteed
**Priority**: P0

---

### AC-005: Cell Kind Classification

#### TC-005-001: Happy Path - Identify Hex Cell
**Input**:
```typescript
{
  cell: { edgeCount: 6, vertices: [/* 6 vertices */] }
}
```
**Expected**: kind = "HEX", isPentagon = false
**Priority**: P0

#### TC-005-002: Happy Path - Identify Pentagon Cell
**Input**:
```typescript
{
  cell: { edgeCount: 5, vertices: [/* 5 vertices */] }
}
```
**Expected**: kind = "PENT", isPentagon = true
**Priority**: P0

#### TC-005-003: Edge Case - Invalid Edge Count
**Input**:
```typescript
{
  cell: { edgeCount: 4, vertices: [/* 4 vertices */] }
}
```
**Expected**: Error thrown, edge count must be 5 or 6
**Priority**: P0

#### TC-005-004: Integration - All Cells Classified
**Input**:
```typescript
{
  cells: [/* 132 cells */]
}
```
**Expected**: 120 hex cells, 12 pent cells
**Priority**: P0

---

### AC-006: Neighbor Finding

#### TC-006-001: Happy Path - Find Hex Neighbors
**Input**:
```typescript
{
  cell: {
    id: "c:0:5:3",
    kind: "HEX",
    local: { u: 5, v: 3 },
    face: 0
  },
  allCells: [/* all cells */]
}
```
**Expected**: 6 neighbors returned
**Priority**: P0

#### TC-006-002: Happy Path - Find Pentagon Neighbors
**Input**:
```typescript
{
  cell: {
    id: "c:0:0:0",
    kind: "PENT",
    local: { u: 0, v: 0 },
    face: 0
  },
  allCells: [/* all cells */]
}
```
**Expected**: 5 neighbors returned
**Priority**: P0

#### TC-006-003: Edge Case - Cell at Face Boundary
**Input**:
```typescript
{
  cell: {
    id: "c:0:0:3",
    local: { u: 0, v: 3 },
    face: 0
  },
  allCells: [/* all cells */]
}
```
**Expected**: Neighbors across face boundary correctly handled
**Priority**: P1

#### TC-006-004: Integration - Find All Neighbors
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: All cells have correct neighbor lists
**Priority**: P0

---

### AC-007: Face Boundary Handling

#### TC-007-001: Happy Path - Identify Boundary Cells
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: Boundary cells correctly identified
**Priority**: P0

#### TC-007-002: Happy Path - Build Face Boundaries
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: Each face has correct boundary cells
**Priority**: P0

#### TC-007-003: Edge Case - Empty Cell List
**Input**:
```typescript
{
  cells: []
}
```
**Expected**: Empty boundaries returned
**Priority**: P1

#### TC-007-004: Integration - Face Boundary with Neighbors
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: Boundaries include cross-face neighbor info
**Priority**: P0

---

### AC-008: Adjacency Graph Building

#### TC-008-001: Happy Path - Build Graph
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: Graph contains all cells and edges
**Priority**: P0

#### TC-008-002: Happy Path - Query Graph
**Input**:
```typescript
{
  graph: { /* adjacency graph */ },
  cellId: "c:0:5:3"
}
```
**Expected**: Returns neighbors for cell
**Priority**: P0

#### TC-008-003: Edge Case - Query Non-Existent Cell
**Input**:
```typescript
{
  graph: { /* adjacency graph */ },
  cellId: "non_existent"
}
```
**Expected**: Returns empty set
**Priority**: P1

#### TC-008-004: Integration - Graph Traversal
**Input**:
```typescript
{
  graph: { /* adjacency graph */ },
  startCell: "c:0:0:0",
  endCell: "c:0:5:3"
}
```
**Expected**: Returns shortest path between cells
**Priority**: P0

---

### AC-009: Cell Center Calculation

#### TC-009-001: Happy Path - Calculate Hex Center
**Input**:
```typescript
{
  vertices: [
    [0, 1, 1.618],
    [0.866, 1.5, 1.618],
    [0.5, 1.618, 1.618]
  ]
}
```
**Expected**: Center = [0.455, 1.379, 1.618], normalized
**Priority**: P0

#### TC-009-002: Happy Path - Calculate Pentagon Center
**Input**:
```typescript
{
  vertices: [
    [0, 1, 1.618],
    [0.866, 1.5, 1.618],
    [0.5, 1.618, 1.618],
    [0.134, 1.634, 1.618],
    [0.134, 1.634, 1.618]
  ]
}
```
**Expected**: Center = [0.411, 1.379, 1.618], normalized
**Priority**: P0

#### TC-009-003: Edge Case - Collinear Vertices
**Input**:
```typescript
{
  vertices: [
    [0, 0, 1],
    [1, 0, 1],
    [0.5, 0.5, 1]
  ]
}
```
**Expected**: Warning logged, center calculated
**Priority**: P1

#### TC-009-004: Integration - All Cell Centers
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: All cell centers on sphere surface
**Priority**: P0

---

### AC-010: Cell Vertex Calculation

#### TC-010-001: Happy Path - Calculate Hex Vertices
**Input**:
```typescript
{
  cell: {
    id: "c:0:5:3",
    kind: "HEX",
    local: { u: 5, v: 3 },
    face: 0
  }
}
```
**Expected**: 6 vertices on sphere surface
**Priority**: P0

#### TC-010-002: Happy Path - Calculate Pentagon Vertices
**Input**:
```typescript
{
  cell: {
    id: "c:0:0:0",
    kind: "PENT",
    local: { u: 0, v: 0 },
    face: 0
  }
}
```
**Expected**: 5 vertices on sphere surface
**Priority**: P0

#### TC-010-003: Edge Case - Invalid Face
**Input**:
```typescript
{
  cell: {
    id: "c:0:5:3",
    face: 99 // Invalid
  }
}
```
**Expected**: Error thrown, invalid face
**Priority**: P0

#### TC-010-004: Integration - All Cell Vertices
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: All cell vertices calculated correctly
**Priority**: P0

---

### AC-011: Cell Area Calculation

#### TC-011-001: Happy Path - Calculate Hex Area
**Input**:
```typescript
{
  vertices: [/* hex vertices */],
  radius: 1.0
}
```
**Expected**: Area = positive value
**Priority**: P0

#### TC-011-002: Happy Path - Calculate Pentagon Area
**Input**:
```typescript
{
  vertices: [/* pentagon vertices */],
  radius: 1.0
}
```
**Expected**: Area = positive value
**Priority**: P0

#### TC-011-003: Integration - Total Globe Area
**Input**:
```typescript
{
  cells: [/* all cells */],
  radius: 1.0
}
```
**Expected**: Total area = 4 * PI (sphere area)
**Priority**: P0

---

### AC-012: Pentagon Detection

#### TC-012-001: Happy Path - Detect Pentagon Cell
**Input**:
```typescript
{
  cell: { edgeCount: 5, vertices: [/* 5 vertices */] }
}
```
**Expected**: isPentagon = true
**Priority**: P0

#### TC-012-002: Happy Path - Detect Hex Cell
**Input**:
```typescript
{
  cell: { edgeCount: 6, vertices: [/* 6 vertices */] }
}
```
**Expected**: isPentagon = false
**Priority**: P0

#### TC-012-003: Edge Case - Count Pentagon Cells
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: 12 pentagon cells detected
**Priority**: P0

#### TC-012-004: Integration - Pentagon Locations
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: Pentagon locations match icosahedron vertices
**Priority**: P0

---

## Test Data

### Sample Icosahedron
```typescript
const BASE_ICOSAHEDRON = {
  vertices: [
    [0, 1, 1.618],
    [0, 1, 1.618],
    [0.866, 1.5, 1.618],
    [0.5, 1.618, 1.618],
    [-0.866, 1.5, 1.618],
    [0, 1, 1.618],
    [0.5, 1.618, 1.618],
    [-0.866, 1.5, 1.618],
    [0, 1, 1.618],
    [0.5, 1.618, 1.618]
  ].map(v => normalize(v)),
  faces: [
    [0, 8, 4],
    [0, 4, 9],
    [0, 9, 10],
    [0, 10, 2],
    [0, 2, 6],
    [0, 6, 7],
    [0, 7, 1],
    [0, 1, 3],
    [0, 3, 11],
    [0, 11, 5],
    [0, 5, 12],
    [0, 12, 8],
    [0, 8, 9],
    [0, 9, 10],
    [0, 10, 2],
    [0, 2, 6],
    [0, 6, 7],
    [0, 7, 1],
    [0, 1, 3],
    [0, 3, 11],
    [0, 11, 5],
    [0, 5, 12],
    [0, 12, 8],
    [0, 8, 9],
    [0, 9, 10],
    [0, 10, 2],
    [0, 2, 6],
    [0, 6, 7],
    [0, 7, 1]
  ]
};
```

### Sample Cell
```typescript
const SAMPLE_HEX_CELL: Cell = {
  id: "c:0:5:3",
  kind: "HEX",
  neighbors: ["c:5:2", "c:6:3", "c:4:4", "c:5:2", "c:4:3", "c:3:4"],
  face: 0,
  local: { u: 5, v: 3, w: -8 },
  center: [0.455, 1.379, 1.618],
  vertices: [
    [0.5, 1.379, 1.618],
    [0.134, 1.634, 1.618],
    [0.134, 1.634, 1.618],
    [0.134, 1.634, 1.618],
    [0.134, 1.634, 1.618],
    [0.134, 1.634, 1.618]
  ],
  area: 0.023,
  isPentagon: false,
  edgeCount: 6
};

const SAMPLE_PENT_CELL: Cell = {
  id: "c:0:0:0",
  kind: "PENT",
  neighbors: ["c:0:1:0", "c:0:1:1", "c:0:1:2", "c:0:2:2", "c:0:2:1"],
  face: 0,
  local: { u: 0, v: 0, w: -6 },
  center: [0.411, 1.379, 1.618],
  vertices: [
    [0, 1.379, 1.618],
    [0.866, 1.5, 1.618],
    [0.5, 1.618, 1.618],
    [0.134, 1.634, 1.618],
    [0.134, 1.634, 1.618]
  ],
  area: 0.019,
  isPentagon: true,
  edgeCount: 5
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test icosahedron initialization
- Test subdivision algorithm
- Test cell creation
- Test cell ID generation
- Test cell kind classification
- Test neighbor finding
- Test face boundary handling
- Test adjacency graph building
- Test cell center calculation
- Test cell vertex calculation
- Test cell area calculation
- Test pentagon detection

### Integration Testing Approach
- Test full subdivision pipeline
- Test cell graph generation
- Test neighbor finding across faces
- Test face boundary identification
- Test cell topology consistency
- Test subdivision at different levels

### End-to-End Testing Approach
- Test complete globe generation at level 2
- Test globe generation at level 3
- Test cell connectivity
- Test sphere surface consistency
- Test pentagon distribution

### Performance Testing Approach
- Test subdivision at high levels (4, 5)
- Test neighbor lookup performance
- Test cell iteration performance
- Test memory usage with many cells
- Test subdivision algorithm efficiency

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── geometry/
│   │   ├── Icosahedron.test.ts
│   │   ├── Subdivision.test.ts
│   │   ├── CellCreation.test.ts
│   │   ├── CellIDGeneration.test.ts
│   │   ├── CellKindClassification.test.ts
│   │   ├── NeighborFinding.test.ts
│   │   ├── FaceBoundaryHandling.test.ts
│   │   ├── AdjacencyGraph.test.ts
│   │   ├── CellCenterCalculation.test.ts
│   │   ├── CellVertexCalculation.test.ts
│   │   ├── CellAreaCalculation.test.ts
│   │   └── PentagonDetection.test.ts
├── integration/
│   ├── geometry/
│   │   ├── SubdivisionPipeline.test.ts
│   │   ├── CellGraphGeneration.test.ts
│   │   ├── NeighborFindingIntegration.test.ts
│   │   ├── FaceBoundaryIntegration.test.ts
│   │   ├── TopologyConsistency.test.ts
│   │   └── PentagonDistribution.test.ts
└── e2e/
    ├── geometry/
        │   ├── FullGlobeGeneration.test.ts
        │   ├── CellConnectivity.test.ts
        │   └── SphereSurfaceConsistency.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by geometry component for unit tests
- Group by integration feature for integration tests
- Group by generation scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases

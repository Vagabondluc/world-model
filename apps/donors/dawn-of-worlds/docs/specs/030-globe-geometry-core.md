---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# Globe Geometry Core

## Purpose

This specification defines the core geometry system for the Globe, including icosahedron subdivision, cell graph generation, and Cell data model. The geometry system enables hex-based gameplay on a spherical surface while maintaining compatibility with existing game rules.

## Dependencies

- [`031-globe-coordinate-transform.md`](031-globe-coordinate-transform.md) - Cell ID to 3D vector transformations
- [`032-globe-scale-system.md`](032-globe-scale-system.md) - Region assignment and hierarchical aggregation

---

## Core Principle

> **You do NOT abandon hexes. You embed them onto a sphere.**

Hexes remain the logical grid. The globe is a view + coordinate transform.

---

## Geometry Reality

### Hard Truth

A perfect hex tiling **cannot** cover a sphere.

Every globe solution uses:

- **Mostly hexes**
- **A small number of pentagons** (12, always)

This is not a bug — it is how soccer balls, carbon molecules, and planets work.

---

## Base Geometry: Icosahedron

### Icosahedron Structure

```typescript
interface Icosahedron {
  vertices: Vec3[];
  faces: IcosahedronFace[];
  edges: IcosahedronEdge[];
}

interface IcosahedronFace {
  id: number;
  vertices: [number, number, number]; // Indices into vertices array
  normal: Vec3;
  area: number;
}

interface IcosahedronEdge {
  id: number;
  vertices: [number, number]; // Indices into vertices array
  length: number;
}
```

### Base Icosahedron Vertices

The icosahedron has 12 vertices. In normalized coordinates:

```typescript
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

const BASE_ICOSAHEDRON_VERTICES: Vec3[] = [
  // Top and bottom
  [0, 1, GOLDEN_RATIO],
  [0, -1, GOLDEN_RATIO],
  [0, 1, -GOLDEN_RATIO],
  [0, -1, -GOLDEN_RATIO],

  // Middle ring
  [1, GOLDEN_RATIO, 0],
  [-1, GOLDEN_RATIO, 0],
  [1, -GOLDEN_RATIO, 0],
  [-1, -GOLDEN_RATIO, 0],

  [GOLDEN_RATIO, 0, 1],
  [-GOLDEN_RATIO, 0, 1],
  [GOLDEN_RATIO, 0, -1],
  [-GOLDEN_RATIO, 0, -1]
].map(v => normalize(v));
```

### Base Icosahedron Faces

The icosahedron has 20 triangular faces.

```typescript
const BASE_ICOSAHEDRON_FACES: [number, number, number][] = [
  [0, 8, 4], [0, 5, 10], [2, 4, 9],
  [2, 11, 5], [1, 6, 8], [1, 10, 7],
  [3, 9, 6], [3, 7, 11], [0, 4, 5],
  [2, 9, 11], [1, 8, 10], [3, 6, 7],
  [2, 9, 11], [1, 8, 10], [3, 6, 7],
  [3, 7, 10], [0, 5, 1], [2, 11, 3],
  [0, 8, 5], [2, 4, 11], [1, 6, 9],
  [3, 7, 10], [0, 5, 1], [2, 11, 3],
  // ... additional face definitions
];
```

---

## Subdivision Algorithm

### Subdivision Level

```typescript
type SubdivisionLevel = 0 | 1 | 2 | 3 | 4 | 5;
```

### Default Subdivision Level

**Decision**: Default subdivision level for gameplay is 2.

**Rationale**:
- Level 2 provides 132 cells with ~15° hex side length
- Balances detail with performance
- Provides sufficient granularity for gameplay
- Compatible with existing hex-based mechanics

### Subdivision Level Table

| Level | Hex Cells | Pent Cells | Total Cells | Hex Side Length | Cell Area (km²) |
| ------ | ---------- | ----------- | ----------- | --------------- | ----------------- |
| 0     | 0         | 12          | 12          | N/A             |
| 1     | 20        | 12          | 32          | ~30°            | ~1,500,000       |
| 2     | 120       | 12          | 132         | ~15°            | ~90,000          |
| 3     | 420       | 12          | 432         | ~7.5°           | ~6,000           |
| 4     | 1560      | 12          | 1572        | ~3.75°          | ~800             |
| 5     | 6060      | 12          | 6072        | ~1.875°         | ~200             |

### Cell Size in Real-World Units

**Decision**: Target cell area at level 2 is ~90,000 km².

**Rationale**:
- Earth surface area is ~510,000,000 km²
- Level 2 with 132 cells gives ~3,860,000 km² per cell
- This provides reasonable granularity for world-scale gameplay
- Level 3 would give ~1,180,000 cells (~430 km² each)
- Level 4 would give ~5,000,000 cells (~100 km² each)

### Subdivision Process

```typescript
interface SubdivisionResult {
  cells: Cell[];
  adjacency: AdjacencyGraph;
  faceToCells: Map<number, string[]>; // Face ID to cell IDs
}

function subdivideIcosahedron(
  level: SubdivisionLevel
): SubdivisionResult {
  let faces = [...BASE_ICOSAHEDRON_FACES];
  let vertices = [...BASE_ICOSAHEDRON_VERTICES];

  // Subdivide each face
  for (let i = 0; i < level; i++) {
    const result = subdivideFaces(faces, vertices);
    faces = result.faces;
    vertices = result.vertices;
  }

  // Convert to cells
  const cells = facesToCells(faces, vertices);

  // Build adjacency graph
  const adjacency = buildAdjacencyGraph(cells);

  // Build face-to-cells mapping
  const faceToCells = mapFacesToCells(faces, cells);

  return { cells, adjacency, faceToCells };
}

function subdivideFaces(
  faces: [number, number, number][],
  vertices: Vec3[]
): { faces: [number, number, number][]; vertices: Vec3[] } {
  const newFaces: [number, number, number][] = [];
  const newVertices = [...vertices];
  const midpointCache = new Map<string, number>();

  for (const face of faces) {
    const [v0, v1, v2] = face;

    // Get or create midpoints
    const m01 = getOrCreateMidpoint(v0, v1, newVertices, midpointCache);
    const m12 = getOrCreateMidpoint(v1, v2, newVertices, midpointCache);
    const m20 = getOrCreateMidpoint(v2, v0, newVertices, midpointCache);

    // Create 4 new faces
    newFaces.push([v0, m01, m20]);
    newFaces.push([v1, m12, m01]);
    newFaces.push([v2, m20, m12]);
    newFaces.push([m01, m12, m20]);
  }

  return { faces: newFaces, vertices: newVertices };
}

function getOrCreateMidpoint(
  v1: number,
  v2: number,
  vertices: Vec3[],
  cache: Map<string, number>
): number {
  const key = `${Math.min(v1, v2)}-${Math.max(v1, v2)}`;

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const p1 = vertices[v1];
  const p2 = vertices[v2];
  const midpoint = normalize(lerp3(p1, p2, 0.5));

  const index = vertices.length;
  vertices.push(midpoint);
  cache.set(key, index);

  return index;
}
```

---

## Cell Data Model

### Cell

```typescript
interface Cell {
  id: CellID;
  kind: CellKind;
  neighbors: CellID[];

  // Face information
  face: number;                     // Icosahedron face (0-19)
  local: LocalCoords;               // Face-local coordinates

  // Optional: Legacy axial coordinates for flat map compatibility
  axial?: AxialCoords;

  // Geometry
  center: Vec3;                    // 3D center position on sphere
  vertices: Vec3[];               // 3D vertices
  area: number;                    // Surface area

  // Metadata
  isPentagon: boolean;             // True for 12 pentagon cells
  edgeCount: number;               // 5 or 6
}

type CellKind = "HEX" | "PENT";
type CellID = string;               // Format: "c:face:u:v" or "c:face:index"
interface LocalCoords {
  u: number;
  v: number;
  w: number;                      // u + v + w = 0 for hexes
}

interface AxialCoords {
  q: number;
  r: number;
}
```

### Cell ID Scheme

```typescript
function createCellID(face: number, u: number, v: number): CellID {
  return `c:${face}:${u}:${v}`;
}

function parseCellID(id: CellID): { face: number; u: number; v: number } {
  const parts = id.split(":");
  return {
    face: parseInt(parts[1], 10),
    u: parseInt(parts[2], 10),
    v: parseInt(parts[3], 10)
  };
}
```

### Cell Properties

```typescript
interface CellProperties {
  // Geometry
  isPentagon: boolean;
  edgeCount: number;

  // Position
  latitude: number;               // -90 to 90 degrees
  longitude: number;              // -180 to 180 degrees

  // Adjacency
  neighbors: CellID[];

  // Face membership
  face: number;
  localCoords: LocalCoords;
}
```

---

## Cell Graph Generation

### Adjacency Graph

```typescript
interface AdjacencyGraph {
  nodes: Set<CellID>;
  edges: Map<CellID, Set<CellID>>;
}

function buildAdjacencyGraph(cells: Cell[]): AdjacencyGraph {
  const graph: AdjacencyGraph = {
    nodes: new Set(),
    edges: new Map()
  };

  for (const cell of cells) {
    graph.nodes.add(cell.id);
    graph.edges.set(cell.id, new Set(cell.neighbors));
  }

  return graph;
}
```

### Neighbor Finding

```typescript
function findNeighbors(
  cell: Cell,
  allCells: Map<CellID, Cell>
): CellID[] {
  const neighbors: CellID[] = [];

  // Get face-local neighbor offsets
  const offsets = cell.isPentagon
    ? PENTAGON_NEIGHBOR_OFFSETS
    : HEX_NEIGHBOR_OFFSETS;

  for (const offset of offsets) {
    const neighborLocal = {
      u: cell.local.u + offset.du,
      v: cell.local.v + offset.dv
    };

    // Check if neighbor is within same face
    if (isWithinFace(neighborLocal, cell.face)) {
      const neighborID = createCellID(cell.face, neighborLocal.u, neighborLocal.v);
      if (allCells.has(neighborID)) {
        neighbors.push(neighborID);
      }
    } else {
      // Neighbor is in adjacent face - handle edge case
      const edgeNeighbor = findEdgeNeighbor(cell, offset, allCells);
      if (edgeNeighbor) {
        neighbors.push(edgeNeighbor);
      }
    }
  }

  return neighbors;
}

const HEX_NEIGHBOR_OFFSETS = [
  { du: 1, dv: 0 },   { du: 0, dv: 1 },   { du: -1, dv: 1 },
  { du: -1, dv: 0 },  { du: 0, dv: -1 },  { du: 1, dv: -1 }
];

const PENTAGON_NEIGHBOR_OFFSETS = [
  { du: 1, dv: 0 },   { du: 0, dv: 1 },   { du: -1, dv: 1 },
  { du: -1, dv: 0 },  { du: 0, dv: -1 }
];
```

### Face Boundary Handling

```typescript
interface FaceBoundary {
  face: number;
  edge: number;                    // 0-2 (triangle edges)
  cells: CellID[];
}

function buildFaceBoundaries(cells: Cell[]): FaceBoundary[] {
  const boundaries: FaceBoundary[] = [];
  const faceEdges = new Map<number, Map<number, CellID[]>>();

  for (const cell of cells) {
    const edges = getCellEdges(cell);

    for (const edge of edges) {
      const key = `${cell.face}:${edge}`;
      if (!faceEdges.has(key)) {
        faceEdges.set(key, []);
      }
      faceEdges.get(key)!.push(cell.id);
    }
  }

  // Convert to FaceBoundary objects
  for (const [key, cellIDs] of faceEdges) {
    const [face, edge] = key.split(":").map(Number);
    boundaries.push({ face, edge, cells: cellIDs });
  }

  return boundaries;
}
```

---

## Resolved Ambiguities

### 1. Subdivision Level

**Decision**: Default subdivision level for gameplay is 2.

**Configuration**:

```typescript
interface GeometryConfig {
  defaultSubdivisionLevel: SubdivisionLevel;
  maxSubdivisionLevel: SubdivisionLevel;
  cellSizeTarget: number;           // Target cell area in km²
}

const DEFAULT_GEOMETRY_CONFIG: GeometryConfig = {
  defaultSubdivisionLevel: 2,
  maxSubdivisionLevel: 5,
  cellSizeTarget: 90000             // ~90,000 km²
};
```

**Rationale**:
- Level 2 provides 132 cells with ~15° hex side length
- Balances detail with performance
- Provides sufficient granularity for gameplay
- Compatible with existing hex-based mechanics

---

### 2. Cell Size in Real-World Units

**Decision**: Target cell area at level 2 is ~90,000 km² (~300 km per side).

**Rationale**:
- Earth surface area is ~510,000,000 km²
- Level 2 with 132 cells gives ~3,860,000 km² per cell
- This provides reasonable granularity for world-scale gameplay
- Level 3 would give ~1,180,000 cells (~430 km² each)
- Level 4 would give ~5,000,000 cells (~100 km² each)

---

### 3. Pentagon Visual Distinctness

**Decision**: Pentagons are visually distinct from hexes via edge count and shape.

**Visual Distinction**:

```typescript
interface CellVisualStyle {
  isPentagon: boolean;
  edgeCount: number;
  vertexCount: number;
  shapeType: "HEX" | "PENT";
}

function getCellStyle(cell: Cell): CellVisualStyle {
  return {
    isPentagon: cell.isPentagon,
    edgeCount: cell.edgeCount,
    vertexCount: cell.vertices.length,
    shapeType: cell.isPentagon ? "PENT" : "HEX"
  };
}
```

**Visual Indicators**:
- Pentagons have 5 edges, hexes have 6 edges
- Pentagons have 5 vertices, hexes have 6 vertices
- Pentagons can use different border color
- Pentagons can have different background shade

**Rationale**:
- Visual distinction helps players understand globe geometry
- Pentagons are natural features, not bugs
- Clear visual feedback for different cell types

---

### 4. Edge Wrapping

**Decision**: Edge wrapping is handled via face boundary mapping.

**Edge Wrapping Strategy**:

```typescript
interface EdgeWrappingConfig {
  enabled: boolean;
  wrapAcrossFaces: boolean;         // Allow wrapping between faces
  wrapBehavior: "CONTINUOUS" | "BARRIER";
}

const DEFAULT_EDGE_WRAPPING_CONFIG: EdgeWrappingConfig = {
  enabled: true,
  wrapAcrossFaces: true,
  wrapBehavior: "CONTINUOUS"
};

function findEdgeNeighbor(
  cell: Cell,
  offset: LocalOffset,
  allCells: Map<CellID, Cell>
): CellID | null {
  // Determine which edge we're crossing
  const edge = getCrossedEdge(cell.local, offset);

  // Get face boundary for this edge
  const boundary = getFaceBoundary(cell.face, edge);

  // Find neighbor across boundary
  const neighborCell = findBoundaryNeighbor(cell, boundary, allCells);

  return neighborCell ? neighborCell.id : null;
}

function getCrossedEdge(local: LocalCoords, offset: LocalOffset): number {
  // Determine which edge (0-2) we're crossing
  if (offset.du === 1 && offset.dv === 0) return 0;
  if (offset.du === 0 && offset.dv === 1) return 1;
  if (offset.du === -1 && offset.dv === 0) return 2;
  return -1; // Invalid
}
```

**Rationale**:
- Face boundary mapping provides explicit edge wrapping
- Continuous wrapping maintains gameplay flow
- Barrier wrapping can be used for world boundaries
- Explicit handling prevents ambiguous neighbor resolution

---

### 5. Legacy Compatibility

**Decision**: Axial coordinates are optional and computed from Cell ID for flat map compatibility.

**Axial Coordinate Computation**:

```typescript
interface AxialMappingConfig {
  enabled: boolean;
  mappingStrategy: "FACE_CENTER" | "FACE_ORIGIN";
}

const DEFAULT_AXIAL_MAPPING_CONFIG: AxialMappingConfig = {
  enabled: true,
  mappingStrategy: "FACE_CENTER"
};

function cellToAxial(cell: Cell, config: AxialMappingConfig): AxialCoords {
  if (!config.enabled) {
    return { q: 0, r: 0 }; // No axial coordinates
  }

  // Compute axial coordinates based on face and local coordinates
  // This is a simplified mapping for compatibility
  const faceOffset = getFaceOffset(cell.face);

  return {
    q: cell.local.u + faceOffset.q,
    r: cell.local.v + faceOffset.r
  };
}

function getFaceOffset(face: number): { q: number; r: number } {
  // Pre-computed face offsets for axial mapping
  const FACE_OFFSETS: { q: number; r: number }[] = [
    { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 },
    { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 },
    { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 },
    { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 },
    { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 },
    { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 },
    { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 }, { q: 0, r: 0 }
  ];

  return FACE_OFFSETS[face] || { q: 0, r: 0 };
}
```

**Rationale**:
- Axial coordinates are optional for globe system
- Computed mapping provides compatibility with existing code
- Flat map rendering can use axial coordinates
- Globe rendering uses Cell ID directly

---

## Architecture Decisions

### 1. Cell ID Format

**Decision**: Use format "c:face:u:v" for Cell IDs.

**Rationale**:
- Explicit face and local coordinate information
- Easy to parse and validate
- Unique across all cells
- Face prefix distinguishes from other ID types

---

### 2. Geometry Storage

**Decision**: Store geometry as Cell objects with computed properties.

**Storage Strategy**:

```typescript
interface GeometryStorage {
  cells: Map<CellID, Cell>;
  adjacency: AdjacencyGraph;
  faceBoundaries: Map<string, FaceBoundary>;
  subdivisionLevel: SubdivisionLevel;
}

function createGeometryStorage(
  level: SubdivisionLevel,
  cells: Cell[]
): GeometryStorage {
  const adjacency = buildAdjacencyGraph(cells);
  const faceBoundaries = buildFaceBoundaries(cells);

  return {
    cells: new Map(cells.map(c => [c.id, c])),
    adjacency,
    faceBoundaries,
    subdivisionLevel: level
  };
}
```

**Rationale**:
- Map storage provides O(1) lookups
- Adjacency graph computed once and cached
- Face boundaries computed once and cached
- Efficient for repeated operations

---

## Default Values

### Default Geometry Configuration

```typescript
const DEFAULT_GEOMETRY_CONFIG: {
  subdivisionLevel: 2,
  maxSubdivisionLevel: 5,
  cellAreaTarget: 90000,              // ~90,000 km²
  edgeWrapping: {
    enabled: true,
    wrapAcrossFaces: true,
    wrapBehavior: "CONTINUOUS"
  },
  axialMapping: {
    enabled: true,
    mappingStrategy: "FACE_CENTER"
  },
  pentagonVisuals: {
    distinctEdgeColor: "#FF6B6B",      // Darker border for pentagons
    distinctBackgroundShade: 0.9,     // 10% darker background
    showVertexCount: false
  }
};
```

### Default Cell Properties

```typescript
const DEFAULT_CELL_PROPERTIES: {
  isPentagon: false,
  edgeCount: 6,
  vertexCount: 6,
  face: 0,
  localCoords: { u: 0, v: 0, w: 0 }
};
```

---

## Error Handling

### Degenerate Faces

```typescript
interface GeometryError extends Error {
  type: "DEGENERATE_FACE" | "ZERO_AREA" | "INVALID_COORDS";
  faceIndex: number;
  vertexIndices: [number, number, number];
}

function validateFace(
  face: [number, number, number],
  vertices: Vec3[]
): GeometryError | null {
  const [v0, v1, v2] = face;

  // Check for zero-area faces
  const p0 = vertices[v0];
  const p1 = vertices[v1];
  const p2 = vertices[v2];

  const edge1 = sub3(p1, p0);
  const edge2 = sub3(p2, p1);
  const edge3 = sub3(p0, p2);

  const cross1 = cross(edge1, edge2);
  const area = dot(cross1, edge3) / 2;

  if (Math.abs(area) < EPSILON) {
    return {
      type: "ZERO_AREA",
      faceIndex: -1,
      vertexIndices: face
    };
  }

  return null;
}
```

### Floating Point Errors

```typescript
const EPSILON = 1e-10;

function isApproximatelyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < EPSILON;
}

function normalizeSafe(v: Vec3): Vec3 {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

  if (length < EPSILON) {
    return [0, 1, 0]; // Default to avoid division by zero
  }

  return [v[0] / length, v[1] / length, v[2] / length];
}
```

---

## Performance Requirements

### Geometry Generation

- **Level 0**: < 1ms
- **Level 1**: < 5ms
- **Level 2**: < 20ms
- **Level 3**: < 100ms
- **Level 4**: < 500ms
- **Level 5**: < 2000ms

### Cell Operations

- **Cell lookup**: O(1) via Map
- **Neighbor lookup**: O(1) via pre-computed adjacency
- **Face boundary lookup**: O(1) via Map
- **Cell ID parsing**: O(1) via string split
- **Spherical coordinate conversion**: < 0.1ms per cell

### Memory Usage

| Subdivision Level | Cell Count | Memory Usage (approx) |
| --------------- | ---------- | -------------------- |
| 2                | 132         | ~50 KB               |
| 3                | 432         | ~160 KB              |
| 4                | 1,572       | ~600 KB              |
| 5                | 6,072       | ~2.3 MB             |

---

## Testing Requirements

### Unit Tests

- Icosahedron vertices are correctly normalized
- Base faces have correct vertex indices
- Subdivision produces correct number of cells
- Cell IDs are unique and parseable
- Neighbor finding works for all cell types

### Integration Tests

- Full subdivision produces valid cell graph
- Adjacency graph is correct and complete
- Face boundaries are correctly mapped
- Edge wrapping works across faces
- Axial coordinate mapping is consistent

### Edge Case Tests

- Degenerate faces are detected and removed
- Zero-area cells are handled gracefully
- Floating point precision issues are handled
- Edge neighbors across face boundaries work correctly
- Pentagon cells have correct neighbor counts

---

## Evaluation Findings

### Identified Gaps

#### 1. Missing `findEdgeNeighbor()` Implementation

**Gap**: The specification references `findEdgeNeighbor()` in the neighbor finding logic but does not provide a complete algorithm implementation.

**Priority**: HIGH

**Impact**: Without this function, cross-face neighbor resolution cannot be implemented, breaking the core adjacency system.

---

#### 2. Missing `getCrossedEdge()` Implementation

**Gap**: The specification references `getCrossedEdge()` to determine which edge a neighbor offset crosses, but the implementation is incomplete.

**Priority**: HIGH

**Impact**: Edge wrapping behavior cannot be correctly determined without this function.

---

#### 3. Explicit Edge Neighbor Lookup Logic

**Gap**: No explicit algorithm for finding neighbors across face boundaries is provided. The current implementation assumes a simplified edge crossing model.

**Priority**: MEDIUM

**Impact**: Cross-face neighbor queries may fail or produce incorrect results.

---

#### 4. Face Boundary Validation

**Gap**: No mechanism exists to validate that face boundaries are consistent across the entire icosahedron.

**Priority**: MEDIUM

**Impact**: Inconsistent face boundaries could cause neighbor lookup failures and visual artifacts.

---

### Implementation Details

#### Complete `findEdgeNeighbor()` Algorithm

```typescript
interface EdgeMapping {
  fromFace: number;
  fromEdge: number;
  toFace: number;
  toEdge: number;
  transform: CoordinateTransform;
}

interface CoordinateTransform {
  du: number;
  dv: number;
  rotation: number; // 0, 1, or 2 (120-degree rotations)
}

// Pre-computed edge mappings for icosahedron faces
const ICOSAHEDRON_EDGE_MAPPINGS: EdgeMapping[] = [
  // Face 0 edge mappings
  { fromFace: 0, fromEdge: 0, toFace: 1, toEdge: 2, transform: { du: 1, dv: 0, rotation: 0 } },
  { fromFace: 0, fromEdge: 1, toFace: 2, toEdge: 0, transform: { du: 0, dv: 1, rotation: 1 } },
  { fromFace: 0, fromEdge: 2, toFace: 5, toEdge: 1, transform: { du: -1, dv: 1, rotation: 2 } },
  // ... remaining face mappings (total 30 edges for 20 faces)
];

function findEdgeNeighbor(
  cell: Cell,
  offset: LocalOffset,
  allCells: Map<CellID, Cell>,
  edgeMappings: EdgeMapping[] = ICOSAHEDRON_EDGE_MAPPINGS
): CellID | null {
  // Determine which edge we're crossing
  const crossedEdge = getCrossedEdge(cell.local, offset);
  
  if (crossedEdge < 0) {
    return null; // Not crossing an edge
  }

  // Find the edge mapping for this face and edge
  const mapping = edgeMappings.find(
    m => m.fromFace === cell.face && m.fromEdge === crossedEdge
  );

  if (!mapping) {
    console.warn(`No edge mapping found for face ${cell.face}, edge ${crossedEdge}`);
    return null;
  }

  // Calculate the local coordinates in the adjacent face
  const transformedLocal = transformCoordinates(
    cell.local,
    mapping.transform
  );

  // Create the neighbor cell ID
  const neighborID = createCellID(
    mapping.toFace,
    transformedLocal.u,
    transformedLocal.v
  );

  // Verify the neighbor exists
  if (allCells.has(neighborID)) {
    return neighborID;
  }

  // Fallback: search for nearest cell on adjacent face
  return findNearestCellOnFace(
    mapping.toFace,
    transformedLocal,
    allCells
  );
}

function transformCoordinates(
  local: LocalCoords,
  transform: CoordinateTransform
): LocalCoords {
  // Apply translation
  let u = local.u + transform.du;
  let v = local.v + transform.dv;
  let w = -u - v;

  // Apply rotation (120-degree rotations in barycentric space)
  for (let i = 0; i < transform.rotation; i++) {
    const newU = v;
    const newV = w;
    const newW = u;
    u = newU;
    v = newV;
    w = newW;
  }

  return { u, v, w };
}

function findNearestCellOnFace(
  face: number,
  targetLocal: LocalCoords,
  allCells: Map<CellID, Cell>
): CellID | null {
  let nearestID: CellID | null = null;
  let nearestDistance = Infinity;

  for (const [cellID, cell] of allCells) {
    if (cell.face !== face) continue;

    const distance = localDistance(cell.local, targetLocal);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestID = cellID;
    }
  }

  return nearestID;
}

function localDistance(a: LocalCoords, b: LocalCoords): number {
  const du = a.u - b.u;
  const dv = a.v - b.v;
  const dw = a.w - b.w;
  return Math.sqrt(du * du + dv * dv + dw * dw);
}
```

---

#### Complete `getCrossedEdge()` Algorithm

```typescript
function getCrossedEdge(
  local: LocalCoords,
  offset: LocalOffset,
  subdivisionLevel: number = 2
): number {
  // Triangle edges in barycentric coordinates:
  // Edge 0: v = 0 (u + w = 1)
  // Edge 1: w = 0 (u + v = 1)
  // Edge 2: u = 0 (v + w = 1)

  const newU = local.u + offset.du;
  const newV = local.v + offset.dv;
  const newW = -(newU + newV);

  // Check which edge was crossed
  // Edge 0: v changes sign (crosses v=0 line)
  if (local.v >= 0 && newV < 0) {
    return 0;
  }
  if (local.v < 0 && newV >= 0) {
    return 0;
  }

  // Edge 1: w changes sign (crosses w=0 line)
  if (local.w >= 0 && newW < 0) {
    return 1;
  }
  if (local.w < 0 && newW >= 0) {
    return 1;
  }

  // Edge 2: u changes sign (crosses u=0 line)
  if (local.u >= 0 && newU < 0) {
    return 2;
  }
  if (local.u < 0 && newU >= 0) {
    return 2;
  }

  return -1; // No edge crossed
}
```

---

#### Face Boundary Validation Mechanism

```typescript
interface FaceBoundaryValidator {
  validate(): ValidationResult;
  getInconsistencies(): BoundaryInconsistency[];
}

interface ValidationResult {
  valid: boolean;
  errorCount: number;
}

interface BoundaryInconsistency {
  face1: number;
  edge1: number;
  face2: number;
  edge2: number;
  issue: "MISMATCHED_LENGTH" | "MISSING_MAPPING" | "DUPLICATE_MAPPING";
}

function validateFaceBoundaries(
  edgeMappings: EdgeMapping[],
  icosahedron: Icosahedron
): ValidationResult {
  const inconsistencies: BoundaryInconsistency[] = [];
  const mappingKeySet = new Set<string>();

  // Check each mapping
  for (const mapping of edgeMappings) {
    const key = `${mapping.fromFace}-${mapping.fromEdge}`;
    
    // Check for duplicate mappings
    if (mappingKeySet.has(key)) {
      inconsistencies.push({
        face1: mapping.fromFace,
        edge1: mapping.fromEdge,
        face2: mapping.toFace,
        edge2: mapping.toEdge,
        issue: "DUPLICATE_MAPPING"
      });
    }
    mappingKeySet.add(key);

    // Check that reverse mapping exists
    const reverseKey = `${mapping.toFace}-${mapping.toEdge}`;
    const reverseMapping = edgeMappings.find(
      m => m.fromFace === mapping.toFace && m.fromEdge === mapping.toEdge
    );

    if (!reverseMapping) {
      inconsistencies.push({
        face1: mapping.fromFace,
        edge1: mapping.fromEdge,
        face2: mapping.toFace,
        edge2: mapping.toEdge,
        issue: "MISSING_MAPPING"
      });
    } else if (
      reverseMapping.toFace !== mapping.fromFace ||
      reverseMapping.toEdge !== mapping.fromEdge
    ) {
      inconsistencies.push({
        face1: mapping.fromFace,
        edge1: mapping.fromEdge,
        face2: mapping.toFace,
        edge2: mapping.toEdge,
        issue: "MISMATCHED_LENGTH"
      });
    }
  }

  // Check that all 30 edges have mappings
  const expectedEdgeCount = 30; // 20 faces * 3 edges / 2 (shared)
  if (edgeMappings.length !== expectedEdgeCount) {
    console.warn(
      `Expected ${expectedEdgeCount} edge mappings, found ${edgeMappings.length}`
    );
  }

  return {
    valid: inconsistencies.length === 0,
    errorCount: inconsistencies.length
  };
}
```

---

### Mitigation Strategies

| Priority | Gap | Mitigation Strategy |
|----------|-----|-------------------|
| HIGH | Missing `findEdgeNeighbor()` | Implement complete algorithm with edge mapping table and coordinate transformation |
| HIGH | Missing `getCrossedEdge()` | Implement barycentric edge crossing detection algorithm |
| MEDIUM | Explicit edge neighbor lookup | Add pre-computed edge mappings for all icosahedron faces |
| MEDIUM | Face boundary validation | Implement validation function and run during geometry generation |

---

### Updated Default Values

```typescript
const DEFAULT_GEOMETRY_CONFIG: {
  subdivisionLevel: 2,
  maxSubdivisionLevel: 5,
  cellAreaTarget: 90000,
  edgeWrapping: {
    enabled: true,
    wrapAcrossFaces: true,
    wrapBehavior: "CONTINUOUS"
  },
  axialMapping: {
    enabled: true,
    mappingStrategy: "FACE_CENTER"
  },
  pentagonVisuals: {
    distinctEdgeColor: "#FF6B6B",
    distinctBackgroundShade: 0.9,
    showVertexCount: false
  },
  // New validation configuration
  validation: {
    enableBoundaryValidation: true,
    validateOnGeneration: true,
    failOnInconsistency: false
  }
};
```

---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# TDD: Globe Coordinate Transform

## Specification Reference
- Spec: [`031-globe-coordinate-transform.md`](../specs/031-globe-coordinate-transform.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: Cell to Vector Conversion
**Given** a cell
**When** cellToVector is called
**Then** position, normal, and vertices must be returned

### AC-002: Vector to Cell Conversion
**Given** a 3D position
**When** vectorToCell is called
**Then** nearest cell ID must be returned

### AC-003: Perspective Projection
**Given** a 3D position and camera
**When** projectToScreen is called
**Then** screen coordinates must be returned

### AC-004: Orthographic Projection
**Given** a 3D position and orthographic config
**When** projectOrthographic is called
**Then** 2D screen coordinates must be returned

### AC-005: Mollweide Projection
**Given** a 3D position and Mollweide config
**When** projectMollweide is called
**Then** 2D screen coordinates must be returned

### AC-006: Screen to Vector Conversion
**Given** screen coordinates and camera
**When** screenToVector is called
**When** 3D world position must be returned

### AC-007: Coordinate Transform Manager
**Given** cells, camera, and viewport
**When** TransformManager is created
**Then** manager must support all transform operations

### AC-008: Barycentric Coordinate Conversion
**Given** local coordinates and face
**When** localToBarycentric is called
**Then** barycentric coordinates must be returned

### AC-009: Vector Normalization
**Given** a 3D vector
**When** normalize is called
**Then** unit vector must be returned

### AC-010: Vector Interpolation
**Given** two vectors and interpolation factor
**When** lerp3 is called
**Then** interpolated vector must be returned

---

## Test Cases

### AC-001: Cell to Vector Conversion

#### TC-001-001: Happy Path - Convert Hex Cell
**Input**:
```typescript
{
  cell: {
    id: "c:0:5:3",
    kind: "HEX",
    local: { u: 5, v: 3 },
    face: 0,
    center: [0.455, 1.379, 1.618]
  },
  radius: 1.0
}
```
**Expected**: Position = [0.455, 1.379, 1.618], normal = position, vertices calculated
**Priority**: P0

#### TC-001-002: Happy Path - Convert Pentagon Cell
**Input**:
```typescript
{
  cell: {
    id: "c:0:0:0",
    kind: "PENT",
    local: { u: 0, v: 0 },
    face: 0,
    center: [0.411, 1.379, 1.618]
  },
  radius: 1.0
}
```
**Expected**: Position = [0.411, 1.379, 1.618], normal = position, vertices calculated
**Priority**: P0

#### TC-001-003: Edge Case - Invalid Cell
**Input**:
```typescript
{
  cell: { /* invalid cell */ }
}
```
**Expected**: Error thrown
**Priority**: P0

#### TC-001-004: Integration - Convert All Cells
**Input**:
```typescript
{
  cells: [/* all cells */],
  radius: 1.0
}
```
**Expected**: All cells converted correctly
**Priority**: P0

---

### AC-002: Vector to Cell Conversion

#### TC-002-001: Happy Path - Find Nearest Cell
**Input**:
```typescript
{
  position: [0.5, 0.5, 0.707],
  cells: [/* all cells */]
}
```
**Expected**: Returns nearest cell ID
**Priority**: P0

#### TC-002-002: Happy Path - Position on Cell Center
**Input**:
```typescript
{
  position: [0.455, 1.379, 1.618],
  cells: [/* all cells */]
}
```
**Expected**: Returns exact cell ID
**Priority**: P0

#### TC-002-003: Edge Case - No Cells Available
**Input**:
```typescript
{
  position: [0.5, 0.5, 0.707],
  cells: []
}
```
**Expected**: Returns null
**Priority**: P1

#### TC-002-004: Edge Case - Equidistant Positions
**Input**:
```typescript
{
  position: [0.5, 0.5, 0.707],
  cells: [/* two cells at same distance */]
}
```
**Expected**: Returns one of the equidistant cells
**Priority**: P1

---

### AC-003: Perspective Projection

#### TC-003-001: Happy Path - Project Visible Cell
**Input**:
```typescript
{
  position: [0, 0, 1],
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0],
    up: [0, 1, 0],
    fov: Math.PI / 4,
    near: 0.1,
    far: 100
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: Screen coordinates returned, isVisible=true
**Priority**: P0

#### TC-003-002: Happy Path - Project Behind Camera
**Input**:
```typescript
{
  position: [0, 0, -1],
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0],
    fov: Math.PI / 4,
    near: 0.1,
    far: 100
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: Screen coordinates returned, isVisible=false
**Priority**: P0

#### TC-003-003: Edge Case - Position at Clip Plane
**Input**:
```typescript
{
  position: [0, 0, 0],
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0],
    fov: Math.PI / 4,
    near: 0.1,
    far: 100
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: Screen coordinates returned, isVisible=false
**Priority**: P1

#### TC-003-004: Integration - Project Multiple Cells
**Input**:
```typescript
{
  positions: [
    [0, 0, 1],
    [0, 0, -1],
    [0, 0, -0.5]
  ],
  camera: { /* camera */ },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: All cells projected correctly
**Priority**: P0

---

### AC-004: Orthographic Projection

#### TC-004-001: Happy Path - Project with Rotation
**Input**:
```typescript
{
  position: [0.5, 0.5, 0.707],
  config: {
    rotation: [0, 0, 0],
    center: [400, 300],
    scale: 100
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: 2D coordinates returned
**Priority**: P0

#### TC-004-002: Happy Path - Project Front-Facing
**Input**:
```typescript
{
  position: [0, 0, 1],
  config: {
    rotation: [0, 0, 0],
    center: [400, 300],
    scale: 100
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: 2D coordinates returned
**Priority**: P0

#### TC-004-003: Edge Case - Project Back-Facing
**Input**:
```typescript
{
  position: [0, 0, -1],
  config: {
    rotation: [0, 0, 0],
    center: [400, 300],
    scale: 100
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: Returns null (back-facing)
**Priority**: P0

#### TC-004-004: Integration - Project with Scale
**Input**:
```typescript
{
  position: [0.5, 0.5, 0.707],
  config: { scale: 50 }
}
```
**Expected**: 2D coordinates scaled by 0.5
**Priority**: P0

---

### AC-005: Mollweide Projection

#### TC-005-001: Happy Path - Project Equator
**Input**:
```typescript
{
  position: [0, 0, 1],
  config: {
    scale: 100,
    center: [400, 300]
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: 2D coordinates returned
**Priority**: P0

#### TC-005-002: Happy Path - Project North Pole
**Input**:
```typescript
{
  position: [0, 0, 1],
  config: {
    scale: 100,
    center: [400, 300]
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: 2D coordinates returned
**Priority**: P0

#### TC-005-003: Edge Case - Project South Pole
**Input**:
```typescript
{
  position: [0, 0, -1],
  config: {
    scale: 100,
    center: [400, 300]
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: 2D coordinates returned
**Priority**: P0

#### TC-005-004: Integration - Project Full Globe
**Input**:
```typescript
{
  positions: [/* various positions */],
  config: { scale: 100 }
}
```
**Expected**: All positions projected correctly
**Priority**: P0

---

### AC-006: Screen to Vector Conversion

#### TC-006-001: Happy Path - Convert Screen Center
**Input**:
```typescript
{
  screenPos: [400, 300],
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0],
    fov: Math.PI / 4,
    near: 0.1,
    far: 100
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: 3D position on sphere surface
**Priority**: P0

#### TC-006-002: Happy Path - Convert Screen Edge
**Input**:
```typescript
{
  screenPos: [0, 600],
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0],
    fov: Math.PI / 4,
    near: 0.1,
    far: 100
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: 3D position on sphere surface
**Priority**: P0

#### TC-006-003: Edge Case - Convert Off-Screen
**Input**:
```typescript
{
  screenPos: [-100, -100],
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0],
    fov: Math.PI / 4,
    near: 0.1,
    far: 100
  },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: Returns null (no intersection)
**Priority**: P1

#### TC-006-004: Integration - Convert Multiple Points
**Input**:
```typescript
{
  screenPositions: [
    [400, 300],
    [200, 400],
    [600, 200]
  ],
  camera: { /* camera */ },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: All positions converted correctly
**Priority**: P0

---

### AC-007: Coordinate Transform Manager

#### TC-007-001: Happy Path - Initialize Manager
**Input**:
```typescript
{
  cells: [/* all cells */],
  camera: { /* camera */ },
  viewport: { width: 800, height: 600 },
  projectionMode: "PERSPECTIVE"
}
```
**Expected**: Manager initialized with all transforms
**Priority**: P0

#### TC-007-002: Happy Path - Cell to Screen
**Input**:
```typescript
{
  manager: { /* initialized manager */ },
  cellId: "c:0:5:3"
}
```
**Expected**: Screen coordinates returned
**Priority**: P0

#### TC-007-003: Happy Path - Screen to Cell
**Input**:
```typescript
{
  manager: { /* initialized manager */ },
  screenPos: [400, 300]
}
```
**Expected**: Nearest cell ID returned
**Priority**: P0

#### TC-007-004: Integration - Switch Projection Mode
**Input**:
```typescript
{
  manager: { /* initialized manager */ },
  newMode: "ORTHOGRAPHIC"
}
```
**Expected**: Projection mode switched, orthographic config used
**Priority**: P0

---

### AC-008: Barycentric Coordinate Conversion

#### TC-008-001: Happy Path - Convert Local to Barycentric
**Input**:
```typescript
{
  local: { u: 5, v: 3 },
  face: 0
}
```
**Expected**: Barycentric coordinates { u: 0.167, v: 0.1, w: 0.733 }
**Priority**: P0

#### TC-008-002: Happy Path - Barycentric to Vector
**Input**:
```typescript
{
  barycentric: { u: 0.167, v: 0.1, w: 0.733 },
  faceVertices: [/* face vertices */]
}
```
**Expected**: 3D vector returned
**Priority**: P0

#### TC-008-003: Edge Case - Invalid Local Coordinates
**Input**:
```typescript
{
  local: { u: 5, v: 3 },
  face: 0
}
```
**Expected**: Error thrown, u + v + w must equal 0
**Priority**: P0

#### TC-008-004: Integration - Full Conversion Pipeline
**Input**:
```typescript
{
  cell: { /* cell */ },
  face: 0
}
```
**Expected**: Local → Barycentric → Vector conversion
**Priority**: P0

---

### AC-009: Vector Normalization

#### TC-009-001: Happy Path - Normalize Vector
**Input**:
```typescript
{
  vector: [1, 2, 3]
}
```
**Expected**: Unit vector [0.267, 0.533, 0.8]
**Priority**: P0

#### TC-009-002: Happy Path - Normalize Zero Vector
**Input**:
```typescript
{
  vector: [0, 0, 0]
}
```
**Expected**: Returns [0, 0, 0] or error
**Priority**: P1

#### TC-009-003: Edge Case - Normalize Near-Zero Vector
**Input**:
```typescript
{
  vector: [0.001, 0.001, 0.001]
}
```
**Expected**: Unit vector returned
**Priority**: P1

#### TC-009-004: Integration - Normalize Multiple Vectors
**Input**:
```typescript
{
  vectors: [
    [1, 2, 3],
    [0, 1, 1],
    [3, 0, 1]
  ]
}
```
**Expected**: All vectors normalized
**Priority**: P0

---

### AC-010: Vector Interpolation

#### TC-010-001: Happy Path - Linear Interpolation
**Input**:
```typescript
{
  v1: [0, 0, 0],
  v2: [1, 1, 1],
  t: 0.5
}
```
**Expected**: Result = [0.5, 0.5, 0.5]
**Priority**: P0

#### TC-010-002: Happy Path - Interpolation at t=0
**Input**:
```typescript
{
  v1: [0, 0, 0],
  v2: [1, 1, 1],
  t: 0
}
```
**Expected**: Result = v1
**Priority**: P0

#### TC-010-003: Happy Path - Interpolation at t=1
**Input**:
```typescript
{
  v1: [0, 0, 0],
  v2: [1, 1, 1],
  t: 1
}
```
**Expected**: Result = v2
**Priority**: P0

#### TC-010-004: Edge Case - Invalid t Value
**Input**:
```typescript
{
  v1: [0, 0, 0],
  v2: [1, 1, 1],
  t: 1.5
}
```
**Expected**: Error thrown, t must be 0-1
**Priority**: P0

#### TC-010-005: Integration - Spherical Interpolation
**Input**:
```typescript
{
  positions: [
    [0, 1, 0],
    [1, 0, 0]
  ],
  steps: 10
}
```
**Expected**: Interpolated positions at each step
**Priority**: P0

---

## Test Data

### Sample Camera
```typescript
const SAMPLE_CAMERA: Camera = {
  position: [0, 0, 5],
  target: [0, 0, 0],
  up: [0, 1, 0],
  fov: Math.PI / 4,
  near: 0.1,
  far: 100,
  zoom: 1.0
};
```

### Sample Viewport
```typescript
const SAMPLE_VIEWPORT: Viewport = {
  width: 800,
  height: 600
};
```

### Sample OrthographicConfig
```typescript
const SAMPLE_ORTHO_CONFIG: OrthographicConfig = {
  rotation: [0, 0, 0],
  center: [400, 300],
  scale: 100
};
```

### Sample MollweideConfig
```typescript
const SAMPLE_MOLLWEIDE_CONFIG: ProjectionConfig = {
  scale: 100,
  center: [400, 300]
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test cell to vector conversion
- Test vector to cell conversion
- Test perspective projection
- Test orthographic projection
- Test Mollweide projection
- Test screen to vector conversion
- Test barycentric coordinate conversion
- Test vector normalization
- Test vector interpolation

### Integration Testing Approach
- Test full transform pipeline
- Test coordinate transform manager
- Test projection mode switching
- Test camera integration
- Test viewport changes
- Test multiple coordinate conversions

### End-to-End Testing Approach
- Test cell to screen rendering
- Test screen to cell interaction
- Test projection accuracy
- Test coordinate consistency
- Test camera movement scenarios
- Test zoom functionality

### Performance Testing Approach
- Test projection with many cells
- Test coordinate lookup performance
- Test normalization performance
- Test interpolation performance
- Test transform manager throughput

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── transform/
│   │   ├── CellToVector.test.ts
│   │   ├── VectorToCell.test.ts
│   │   ├── PerspectiveProjection.test.ts
│   │   ├── OrthographicProjection.test.ts
│   │   ├── MollweideProjection.test.ts
│   │   ├── ScreenToVector.test.ts
│   │   ├── BarycentricConversion.test.ts
│   │   ├── VectorNormalization.test.ts
│   │   └── VectorInterpolation.test.ts
├── integration/
│   ├── transform/
│   │   ├── TransformPipeline.test.ts
│   │   ├── TransformManager.test.ts
│   │   ├── ProjectionModeSwitching.test.ts
│   │   ├── CameraIntegration.test.ts
│   │   └── ViewportChanges.test.ts
└── e2e/
    ├── transform/
        │   ├── CellToScreenRendering.test.ts
        │   ├── ScreenToCellInteraction.test.ts
        │   ├── ProjectionAccuracy.test.ts
        │   └── CoordinateConsistency.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by transform operation for unit tests
- Group by integration feature for integration tests
- Group by rendering scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases

---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# TDD: Globe Rendering Layer

## Specification Reference
- Spec: [`033-globe-rendering-layer.md`](../specs/033-globe-rendering-layer.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: Rendering Mode Selection
**Given** a rendering config
**When** renderer is created
**Then** appropriate rendering mode must be used

### AC-002: GlobeMesh Creation
**Given** subdivision results
**When** GlobeMesh is created
**Then** mesh must contain all cells and geometry

### AC-003: Cell Mesh Creation
**Given** a cell
**When** cell mesh is created
**Then** mesh must have correct vertices and indices

### AC-004: GlobeRenderer Initialization
**Given** a container and config
**When** GlobeRenderer is created
**Then** renderer must be ready for rendering

### AC-005: 3D Globe Rendering
**Given** a GlobeRenderer
**When** render is called
**Then** globe must be rendered to canvas

### AC-006: 2D Projection Rendering
**Given** a ProjectionRenderer
**When** render is called
**Then** projection must be rendered to canvas

### AC-007: Visibility Culling
**Given** cells and camera
**When** culling is performed
**Then** only visible cells must be returned

### AC-008: Level of Detail
**Given** a camera distance
**When** render mode is determined
**Then** appropriate scale must be used

### AC-009: Cell Highlighting
**Given** a cell ID
**When** highlight is requested
**Then** cell must be visually highlighted

### AC-010: Cell Selection
**Given** screen coordinates
**When** cell selection is requested
**Then** cell ID must be returned

### AC-011: Viewport Resizing
**Given** new dimensions
**When** resize is called
**Then** viewport and renderer must be updated

---

## Test Cases

### AC-001: Rendering Mode Selection

#### TC-001-001: Happy Path - Initialize 3D Mode
**Input**:
```typescript
{
  config: { mode: "3D_GLOBE", enable3D: true }
}
```
**Expected**: GlobeRenderer created
**Priority**: P0

#### TC-001-002: Happy Path - Initialize 2D Mode
**Input**:
```typescript
{
  config: { mode: "2D_PROJECTION", enable3D: false }
}
```
**Expected**: ProjectionRenderer created
**Priority**: P0

#### TC-001-003: Happy Path - Initialize Hybrid Mode
**Input**:
```typescript
{
  config: { mode: "HYBRID", enable3D: true, enable2D: true }
}
```
**Expected**: Both renderers created
**Priority**: P0

#### TC-001-004: Edge Case - Invalid Mode
**Input**:
```typescript
{
  config: { mode: "INVALID_MODE" }
}
```
**Expected**: Error thrown
**Priority**: P0

#### TC-001-005: Integration - Switch Rendering Mode
**Input**:
```typescript
{
  config: { mode: "2D_PROJECTION" },
  newMode: "3D_GLOBE"
}
```
**Expected**: Renderer switched to 3D mode
**Priority**: P0

---

### AC-002: GlobeMesh Creation

#### TC-002-001: Happy Path - Create Globe Mesh
**Input**:
```typescript
{
  cells: [/* all cells */],
  radius: 1.0
}
```
**Expected**: GlobeMesh created with all cells
**Priority**: P0

#### TC-002-002: Happy Path - Create Mesh with Materials
**Input**:
```typescript
{
  cells: [/* all cells */],
  radius: 1.0,
  material: {
    type: "PHONG",
    colors: { MOUNTAIN: "#8B4513", OCEAN: "#1E90FF", PLAINS: "#90EE90" },
    wireframe: false
  }
}
```
**Expected**: GlobeMesh created with materials
**Priority**: P0

#### TC-002-003: Edge Case - Empty Cells
**Input**:
```typescript
{
  cells: [],
  radius: 1.0
}
```
**Expected**: GlobeMesh created with no cells
**Priority**: P1

#### TC-002-004: Integration - Create Mesh with 132 Cells
**Input**:
```typescript
{
  cells: [/* 132 level 2 cells */],
  radius: 1.0
}
```
**Expected**: GlobeMesh created with 132 cells
**Priority**: P0

---

### AC-003: Cell Mesh Creation

#### TC-003-001: Happy Path - Create Hex Cell Mesh
**Input**:
```typescript
{
  cell: {
    id: "c:0:5:3",
    kind: "HEX",
    center: [0.455, 1.379, 1.618],
    vertices: [/* 6 vertices */]
  }
}
```
**Expected**: Cell mesh created with correct geometry
**Priority**: P0

#### TC-003-002: Happy Path - Create Pentagon Cell Mesh
**Input**:
```typescript
{
  cell: {
    id: "c:0:0:0",
    kind: "PENT",
    center: [0.411, 1.379, 1.618],
    vertices: [/* 5 vertices */]
  }
}
```
**Expected**: Cell mesh created with correct geometry
**Priority**: P0

#### TC-003-003: Edge Case - Invalid Cell
**Input**:
```typescript
{
  cell: { /* invalid cell */ }
}
```
**Expected**: Error thrown
**Priority**: P0

#### TC-003-004: Integration - Create All Cell Meshes
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: All cell meshes created
**Priority**: P0

---

### AC-004: GlobeRenderer Initialization

#### TC-004-001: Happy Path - Initialize GlobeRenderer
**Input**:
```typescript
{
  container: { /* HTML element */ },
  config: {
    mode: "3D_GLOBE",
    enableLighting: true,
    enableShadows: false
  }
}
```
**Expected**: GlobeRenderer initialized
**Priority**: P0

#### TC-004-002: Happy Path - Initialize ProjectionRenderer
**Input**:
```typescript
{
  container: { /* HTML element */ },
  config: {
    mode: "2D_PROJECTION",
    projectionType: "ORTHOGRAPHIC"
  }
}
```
**Expected**: ProjectionRenderer initialized
**Priority**: P0

#### TC-004-003: Edge Case - Invalid Container
**Input**:
```typescript
{
  container: null
}
```
**Expected**: Error thrown
**Priority**: P0

#### TC-004-004: Integration - Switch Renderer
**Input**:
```typescript
{
  renderer: { /* existing renderer */ },
  newMode: "3D_GLOBE"
}
```
**Expected**: Renderer mode switched
**Priority**: P0

---

### AC-005: 3D Globe Rendering

#### TC-005-001: Happy Path - Render Globe
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0]
  }
}
```
**Expected**: Globe rendered to canvas
**Priority**: P0

#### TC-005-002: Happy Path - Render Multiple Frames
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  frames: 2
}
```
**Expected**: Globe rendered twice
**Priority**: P0

#### TC-005-003: Edge Case - Render with Invalid Camera
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  camera: { /* invalid camera */ }
}
```
**Expected**: Error thrown
**Priority**: P0

#### TC-005-004: Integration - Render with Controls
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  controls: { /* controls */ }
}
```
**Expected**: Controls integrated
**Priority**: P0

---

### AC-006: 2D Projection Rendering

#### TC-006-001: Happy Path - Render Orthographic
**Input**:
```typescript
{
  renderer: { /* ProjectionRenderer */ },
  cells: [/* all cells */],
  config: {
    rotation: [0, 0, 0],
    center: [400, 300],
    scale: 100
  }
}
```
**Expected**: Cells projected to 2D
**Priority**: P0

#### TC-006-002: Happy Path - Render Mollweide
**Input**:
```typescript
{
  renderer: { /* ProjectionRenderer */ },
  cells: [/* all cells */],
  config: {
    projectionType: "MOLLWEIDE"
  }
}
```
**Expected**: Cells projected to Mollweide
**Priority**: P0

#### TC-006-003: Edge Case - Invalid Projection Type
**Input**:
```typescript
{
  renderer: { /* ProjectionRenderer */ },
  config: {
    projectionType: "INVALID"
  }
}
```
**Expected**: Error thrown
**Priority**: P0

#### TC-006-004: Integration - Switch Projection Type
**Input**:
```typescript
{
  renderer: { /* ProjectionRenderer */ },
  newProjectionType: "MOLLWEIDE"
}
```
**Expected**: Projection type switched
**Priority**: P0

---

### AC-007: Visibility Culling

#### TC-007-001: Happy Path - Cull Back-Facing Cells
**Input**:
```typescript
{
  cells: [/* all cells */],
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0]
  }
}
```
**Expected**: Only front-facing cells returned
**Priority**: P0

#### TC-007-002: Happy Path - Cull by Viewport
**Input**:
```typescript
{
  cells: [/* all cells */],
  camera: { /* camera */ },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: Only visible cells returned
**Priority**: P0

#### TC-007-003: Edge Case - Empty Cells
**Input**:
```typescript
{
  cells: [],
  camera: { /* camera */ },
  viewport: { width: 800, height: 600 }
}
```
**Expected**: Empty result returned
**Priority**: P1

#### TC-007-004: Integration - Cull All Cells
**Input**:
```typescript
{
  cells: [/* all cells */],
  camera: { /* camera */ }
}
```
**Expected**: Appropriate cells culled
**Priority**: P0

---

### AC-008: Level of Detail

#### TC-008-001: Happy Path - Render S0 at Close Distance
**Input**:
```typescript
{
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0]
  },
  cells: [/* all cells */]
}
```
**Expected**: S0 cells rendered
**Priority**: P0

#### TC-008-002: Happy Path - Render S1 at Medium Distance
**Input**:
```typescript
{
  camera: {
    position: [0, 0, 10],
    target: [0, 0, 0]
  },
  cells: [/* all cells */]
}
```
**Expected**: S1 regions rendered
**Priority**: P0

#### TC-008-003: Happy Path - Render S2 at Far Distance
**Input**:
```typescript
{
  camera: {
    position: [0, 0, 20],
    target: [0, 0, 0]
  },
  cells: [/* all cells */]
}
```
**Expected**: S2 regions rendered
**Priority**: P0

#### TC-008-004: Edge Case - Invalid Distance for Scale
**Input**:
```typescript
{
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0]
  },
  cells: [/* all cells */],
  scale: 3 // Invalid for distance 5
}
```
**Expected**: S2 regions rendered (no S3 available)
**Priority**: P1

#### TC-008-005: Integration - Distance-Based LOD
**Input**:
```typescript
{
  camera: { /* camera */ },
  cells: [/* all cells */]
}
```
**Expected**: Appropriate scale for distance
**Priority**: P0

---

### AC-009: Cell Highlighting

#### TC-009-001: Happy Path - Highlight Cell
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  cellId: "c:0:5:3",
  color: "#FF0000"
}
```
**Expected**: Cell highlighted with red color
**Priority**: P0

#### TC-009-002: Happy Path - Clear Highlight
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  cellId: "c:0:5:3"
}
```
**Expected**: Cell highlight removed
**Priority**: P0

#### TC-009-003: Edge Case - Highlight Non-Existent Cell
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  cellId: "non_existent"
}
```
**Expected**: No change or error logged
**Priority**: P1

#### TC-009-004: Integration - Highlight Multiple Cells
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  cellIds: ["c:0:5:3", "c:0:6:2"]
}
```
**Expected**: Both cells highlighted
**Priority**: P0

---

### AC-010: Cell Selection

#### TC-010-001: Happy Path - Select Cell by Screen Position
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  screenPos: [400, 300]
}
```
**Expected**: Cell ID returned
**Priority**: P0

#### TC-010-002: Happy Path - Select Cell by 2D Projection
**Input**:
```typescript
{
  renderer: { /* ProjectionRenderer */ },
  screenPos: [400, 300]
}
```
**Expected**: Cell ID returned
**Priority**: P0

#### TC-010-003: Edge Case - Select Off-Screen
**Input**:
```typescript
{
  renderer: { /* ProjectionRenderer */ },
  screenPos: [-100, -100]
}
```
**Expected**: Returns null
**Priority**: P1

#### TC-010-004: Integration - Select Multiple Cells
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  screenPositions: [
    [400, 300],
    [410, 290],
    [390, 310]
  ]
}
```
**Expected**: All cell IDs returned
**Priority**: P0

---

### AC-011: Viewport Resizing

#### TC-011-001: Happy Path - Resize Viewport
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  newWidth: 1024,
  newHeight: 768
}
```
**Expected**: Viewport and renderer updated
**Priority**: P0

#### TC-011-002: Happy Path - Resize Projection Viewport
**Input**:
```typescript
{
  renderer: { /* ProjectionRenderer */ },
  newWidth: 1024,
  newHeight: 768
}
```
**Expected**: Viewport and renderer updated
**Priority**: P0

#### TC-011-003: Edge Case - Resize to Zero
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  newWidth: 0,
  newHeight: 0
}
```
**Expected**: Error thrown, invalid dimensions
**Priority**: P0

#### TC-011-004: Integration - Resize During Render
**Input**:
```typescript
{
  renderer: { /* GlobeRenderer */ },
  resizeDuringRender: true
}
```
**Expected**: Resize handled gracefully
**Priority**: P1

---

## Test Data

### Sample GlobeMesh
```typescript
const SAMPLE_GLOBE_MESH = {
  geometry: {
    vertices: [/* all vertices */],
    indices: [/* all indices */]
  },
  material: {
    type: "PHONG",
    colors: {
      MOUNTAIN: "#8B4513",
      OCEAN: "#1E90FF",
      PLAINS: "#90EE90"
    },
    wireframe: false
  },
  cells: new Map<string, CellMesh>()
};
```

### Sample CellMesh
```typescript
const SAMPLE_CELL_MESH: CellMesh = {
  cellId: "c:0:5:3",
  mesh: { /* THREE.Mesh */ },
  highlightMesh: { /* THREE.Mesh */ }
};
```

### Sample Camera
```typescript
const SAMPLE_CAMERA: Camera = {
  position: [0, 0, 5],
  target: [0, 0, 0],
  up: [0, 1, 0],
  fov: Math.PI / 4,
  near: 0.1,
  far: 100
};
```

### Sample Viewport
```typescript
const SAMPLE_VIEWPORT: Viewport = {
  width: 800,
  height: 600
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test rendering mode selection
- Test GlobeMesh creation
- Test cell mesh creation
- Test GlobeRenderer initialization
- Test ProjectionRenderer initialization
- Test 3D globe rendering
- Test 2D projection rendering
- Test visibility culling
- Test level of detail
- Test cell highlighting
- Test cell selection
- Test viewport resizing

### Integration Testing Approach
- Test full rendering pipeline
- Test renderer switching
- Test camera integration
- Test culling with different scales
- Test highlight management
- Test cell selection across renderers
- Test viewport changes

### End-to-End Testing Approach
- Test complete 3D rendering workflow
- Test complete 2D rendering workflow
- Test LOD transitions
- Test camera movement scenarios
- Test cell interaction scenarios
- Test resize scenarios

### Performance Testing Approach
- Test rendering with many cells
- Test culling performance
- Test LOD switching performance
- Test highlight performance
- Test viewport resize performance
- Test frame rate consistency

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── rendering/
│   │   ├── RenderingModeSelection.test.ts
│   │   ├── GlobeMeshCreation.test.ts
│   │   ├── CellMeshCreation.test.ts
│   │   ├── GlobeRendererInitialization.test.ts
│   │   ├── ProjectionRendererInitialization.test.ts
│   │   ├── Globe3DRendering.test.ts
│   │   ├── Projection2DRendering.test.ts
│   │   ├── VisibilityCulling.test.ts
│   │   ├── LevelOfDetail.test.ts
│   │   ├── CellHighlighting.test.ts
│   │   ├── CellSelection.test.ts
│   │   └── ViewportResizing.test.ts
├── integration/
│   ├── rendering/
│   │   ├── RenderingPipeline.test.ts
│   │   ├── RendererSwitching.test.ts
│   │   ├── CameraIntegration.test.ts
│   │   ├── CullingIntegration.test.ts
│   │   ├── LODTransitions.test.ts
│   │   ├── HighlightManagement.test.ts
│   │   ├── CellSelectionIntegration.test.ts
│   │   └── ViewportChanges.test.ts
└── e2e/
    ├── rendering/
        │   ├── Complete3DWorkflow.test.ts
        │   ├── Complete2DWorkflow.test.ts
        │   ├── LODScenarios.test.ts
        │   ├── CameraMovementScenarios.test.ts
        │   ├── CellInteractionScenarios.test.ts
        │   └── ResizeScenarios.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by rendering component for unit tests
- Group by integration feature for integration tests
- Group by rendering scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases

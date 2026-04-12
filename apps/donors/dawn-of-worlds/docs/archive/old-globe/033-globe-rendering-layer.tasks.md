---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# Task List: Globe Rendering Layer

**TDD Reference:** [033-globe-rendering-layer.tdd.md](../tdd/033-globe-rendering-layer.tdd.md)

---

## Phase 1: Rendering Types

### Task 1.1: Create RenderingMode Enum
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Rendering mode selection)
**Implementation Steps:**
1. Create file `logic/globe/rendering/types.ts`
2. Define `RenderingMode` enum with values: `THREE_D`, `TWO_D_PROJECTION`
3. Export enum
**Test Mapping:** TC-001-001, TC-001-002 (Rendering mode tests)

### Task 1.2: Create CellMesh Interface
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-002 (Cell mesh creation)
**Implementation Steps:**
1. In `logic/globe/rendering/types.ts`, define `CellMesh` interface with fields:
   - `cellId: string`
   - `vertices: Float32Array`
   - `indices: Uint16Array`
   - `normals: Float32Array`
   - `uvs: Float32Array`
2. Export interface
**Test Mapping:** TC-002-001, TC-002-002 (Cell mesh tests)

### Task 1.3: Create GlobeMesh Interface
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-003 (GlobeMesh creation)
**Implementation Steps:**
1. In `logic/globe/rendering/types.ts`, define `GlobeMesh` interface with fields:
   - `cells: Map<string, CellMesh>`
   - `vertices: Float32Array`
   - `indices: Uint16Array`
   - `normals: Float32Array`
   - `uvs: Float32Array`
2. Export interface
**Test Mapping:** TC-003-001, TC-003-002 (Globe mesh tests)

---

## Phase 2: Rendering Mode Selection

### Task 2.1: Create RenderingModeSelector Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (Rendering mode selection)
**Implementation Steps:**
1. Create file `logic/globe/rendering/mode.ts`
2. Implement `RenderingModeSelector` class
3. Add `selectMode(): RenderingMode` method
4. Add `setMode(mode: RenderingMode): void` method
5. Export class
**Test Mapping:** TC-001-001, TC-001-002 (Selector tests)

### Task 2.2: Implement Mode Selection
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Rendering mode selection)
**Implementation Steps:**
1. In `RenderingModeSelector`, implement `selectMode()` method
2. Return current rendering mode
3. Export method
**Test Mapping:** TC-001-001, TC-001-002 (Selection tests)

### Task 2.3: Implement Mode Switching
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Rendering mode selection)
**Implementation Steps:**
1. In `RenderingModeSelector`, implement `setMode()` method
2. Update current rendering mode
3. Trigger mode change event
4. Export method
**Test Mapping:** TC-001-003, TC-001-004 (Switching tests)

---

## Phase 3: Cell Mesh Creation

### Task 3.1: Create CellMeshBuilder Class
**Priority:** P0
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-002 (Cell mesh creation)
**Implementation Steps:**
1. Create file `logic/globe/rendering/cell-mesh.ts`
2. Implement `CellMeshBuilder` class
3. Add `build(cell: Cell): CellMesh` method
4. Export class
**Test Mapping:** TC-002-001, TC-002-002 (Builder tests)

### Task 3.2: Implement Cell Vertex Generation
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Cell mesh creation)
**Implementation Steps:**
1. In `CellMeshBuilder`, implement vertex generation
2. Extract vertices from cell
3. Convert to Float32Array
4. Export vertices
**Test Mapping:** TC-002-001, TC-002-002 (Vertex tests)

### Task 3.3: Implement Cell Index Generation
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Cell mesh creation)
**Implementation Steps:**
1. In `CellMeshBuilder`, implement index generation
2. Triangulate cell vertices
3. Convert to Uint16Array
4. Export indices
**Test Mapping:** TC-002-003, TC-002-004 (Index tests)

### Task 3.4: Implement Cell Normal Generation
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Cell mesh creation)
**Implementation Steps:**
1. In `CellMeshBuilder`, implement normal generation
2. Calculate normals from vertices
3. Convert to Float32Array
4. Export normals
**Test Mapping:** TC-002-005, TC-002-006 (Normal tests)

### Task 3.5: Implement Cell UV Generation
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Cell mesh creation)
**Implementation Steps:**
1. In `CellMeshBuilder`, implement UV generation
2. Calculate UV coordinates from vertices
3. Convert to Float32Array
4. Export UVs
**Test Mapping:** TC-002-007, TC-002-008 (UV tests)

---

## Phase 4: Globe Mesh Creation

### Task 4.1: Create GlobeMeshBuilder Class
**Priority:** P0
**Dependencies:** Task 1.3, Task 3.1
**Acceptance Criteria:** AC-003 (GlobeMesh creation)
**Implementation Steps:**
1. Create file `logic/globe/rendering/globe-mesh.ts`
2. Implement `GlobeMeshBuilder` class
3. Add `build(cells: Cell[]): GlobeMesh` method
4. Export class
**Test Mapping:** TC-003-001, TC-003-002 (Builder tests)

### Task 4.2: Implement Globe Mesh Assembly
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-003 (GlobeMesh creation)
**Implementation Steps:**
1. In `GlobeMeshBuilder`, implement `build()` method
2. Build cell meshes for all cells
3. Assemble into globe mesh
4. Return globe mesh
5. Export method
**Test Mapping:** TC-003-001, TC-003-002 (Assembly tests)

---

## Phase 5: Globe Renderer Initialization

### Task 5.1: Create GlobeRenderer Class
**Priority:** P0
**Dependencies:** Task 1.1, Task 4.1
**Acceptance Criteria:** AC-004 (GlobeRenderer initialization)
**Implementation Steps:**
1. Create file `logic/globe/rendering/renderer.ts`
2. Implement `GlobeRenderer` class
3. Add `initialize(canvas: HTMLCanvasElement): void` method
4. Add `setMode(mode: RenderingMode): void` method
5. Add `render(): void` method
6. Export class
**Test Mapping:** TC-004-001, TC-004-002 (Renderer tests)

### Task 5.2: Implement Renderer Initialization
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-004 (GlobeRenderer initialization)
**Implementation Steps:**
1. In `GlobeRenderer`, implement `initialize()` method
2. Initialize WebGL context
3. Create shader programs
4. Create buffers
5. Export method
**Test Mapping:** TC-004-001, TC-004-002 (Initialization tests)

---

## Phase 6: 3D Globe Rendering

### Task 6.1: Create ThreeDGlobeRenderer Class
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-005 (3D globe rendering)
**Implementation Steps:**
1. Create file `logic/globe/rendering/three-d.ts`
2. Implement `ThreeDGlobeRenderer` class
3. Add `render(mesh: GlobeMesh, camera: Camera): void` method
4. Export class
**Test Mapping:** TC-005-001, TC-005-002 (3D renderer tests)

### Task 6.2: Implement 3D Rendering
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-005 (3D globe rendering)
**Implementation Steps:**
1. In `ThreeDGlobeRenderer`, implement `render()` method
2. Set up 3D matrices
3. Draw globe mesh
4. Export method
**Test Mapping:** TC-005-001, TC-005-002 (Rendering tests)

---

## Phase 7: 2D Projection Rendering

### Task 7.1: Create TwoDGlobeRenderer Class
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-006 (2D projection rendering)
**Implementation Steps:**
1. Create file `logic/globe/rendering/two-d.ts`
2. Implement `TwoDGlobeRenderer` class
3. Add `render(mesh: GlobeMesh, projection: ProjectionBase): void` method
4. Export class
**Test Mapping:** TC-006-001, TC-006-002 (2D renderer tests)

### Task 7.2: Implement 2D Rendering
**Priority:** P0
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-006 (2D projection rendering)
**Implementation Steps:**
1. In `TwoDGlobeRenderer`, implement `render()` method
2. Project 3D vertices to 2D
3. Draw projected mesh
4. Export method
**Test Mapping:** TC-006-001, TC-006-002 (Rendering tests)

---

## Phase 8: Visibility Culling

### Task 8.1: Create VisibilityCuller Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-007 (Visibility culling)
**Implementation Steps:**
1. Create file `logic/globe/rendering/culling.ts`
2. Implement `VisibilityCuller` class
3. Add `cull(mesh: GlobeMesh, camera: Camera): string[]` method
4. Export class
**Test Mapping:** TC-007-001, TC-007-002 (Culler tests)

### Task 8.2: Implement Visibility Culling
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-007 (Visibility culling)
**Implementation Steps:**
1. In `VisibilityCuller`, implement `cull()` method
2. Check cell visibility against camera
3. Return visible cell IDs
4. Export method
**Test Mapping:** TC-007-001, TC-007-002 (Culling tests)

---

## Phase 9: Level of Detail

### Task 9.1: Create LODManager Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-008 (Level of detail)
**Implementation Steps:**
1. Create file `logic/globe/rendering/lod.ts`
2. Implement `LODManager` class
3. Add `getLODLevel(cell: Cell, camera: Camera): number` method
4. Export class
**Test Mapping:** TC-008-001, TC-008-002 (LOD tests)

### Task 9.2: Implement LOD Calculation
**Priority:** P0
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-008 (Level of detail)
**Implementation Steps:**
1. In `LODManager`, implement `getLODLevel()` method
2. Calculate distance from camera
3. Return appropriate LOD level
4. Export method
**Test Mapping:** TC-008-001, TC-008-002 (LOD tests)

---

## Phase 10: Cell Highlighting

### Task 10.1: Create CellHighlighter Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-009 (Cell highlighting)
**Implementation Steps:**
1. Create file `logic/globe/rendering/highlight.ts`
2. Implement `CellHighlighter` class
3. Add `highlight(cellId: string, color: string): void` method
4. Add `clearHighlight(cellId: string): void` method
5. Export class
**Test Mapping:** TC-009-001, TC-009-002 (Highlighter tests)

### Task 10.2: Implement Cell Highlighting
**Priority:** P0
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-009 (Cell highlighting)
**Implementation Steps:**
1. In `CellHighlighter`, implement `highlight()` method
2. Set cell highlight color
3. Update rendering state
4. Export method
**Test Mapping:** TC-009-001, TC-009-002 (Highlight tests)

### Task 10.3: Implement Highlight Clearing
**Priority:** P0
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-009 (Cell highlighting)
**Implementation Steps:**
1. In `CellHighlighter`, implement `clearHighlight()` method
2. Remove cell highlight
3. Update rendering state
4. Export method
**Test Mapping:** TC-009-003, TC-009-004 (Clear tests)

---

## Phase 11: Cell Selection

### Task 11.1: Create CellSelector Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-010 (Cell selection)
**Implementation Steps:**
1. Create file `logic/globe/rendering/selection.ts`
2. Implement `CellSelector` class
3. Add `select(cellId: string): void` method
4. Add `deselect(): void` method
5. Add `getSelected(): string | null` method
6. Export class
**Test Mapping:** TC-010-001, TC-010-002 (Selector tests)

### Task 11.2: Implement Cell Selection
**Priority:** P0
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-010 (Cell selection)
**Implementation Steps:**
1. In `CellSelector`, implement `select()` method
2. Set selected cell ID
3. Update rendering state
4. Export method
**Test Mapping:** TC-010-001, TC-010-002 (Selection tests)

### Task 11.3: Implement Cell Deselection
**Priority:** P0
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-010 (Cell selection)
**Implementation Steps:**
1. In `CellSelector`, implement `deselect()` method
2. Clear selected cell ID
3. Update rendering state
4. Export method
**Test Mapping:** TC-010-003, TC-010-004 (Deselection tests)

---

## Phase 12: Viewport Resizing

### Task 12.1: Create ViewportResizer Class
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-011 (Viewport resizing)
**Implementation Steps:**
1. Create file `logic/globe/rendering/viewport.ts`
2. Implement `ViewportResizer` class
3. Add `resize(width: number, height: number): void` method
4. Export class
**Test Mapping:** TC-011-001, TC-011-002 (Resizer tests)

### Task 12.2: Implement Viewport Resizing
**Priority:** P0
**Dependencies:** Task 12.1
**Acceptance Criteria:** AC-011 (Viewport resizing)
**Implementation Steps:**
1. In `ViewportResizer`, implement `resize()` method
2. Update WebGL viewport
3. Update projection matrix
4. Export method
**Test Mapping:** TC-011-001, TC-011-002 (Resize tests)

---

## Phase 13: Test Files

### Task 13.1: Create RenderingModeTests
**Priority:** P0
**Dependencies:** Task 2.3
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/mode.test.ts`
2. Write tests for mode selection
3. Write tests for mode switching
**Test Mapping:** TC-001-001, TC-001-002

### Task 13.2: Create CellMeshTests
**Priority:** P0
**Dependencies:** Task 3.5
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/cell-mesh.test.ts`
2. Write tests for cell mesh creation
3. Write tests for vertex generation
4. Write tests for index generation
5. Write tests for normal generation
6. Write tests for UV generation
**Test Mapping:** TC-002-001, TC-002-002

### Task 13.3: Create GlobeMeshTests
**Priority:** P0
**Dependencies:** Task 4.2
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/globe-mesh.test.ts`
2. Write tests for globe mesh creation
3. Write tests for globe mesh assembly
**Test Mapping:** TC-003-001, TC-003-002

### Task 13.4: Create GlobeRendererTests
**Priority:** P0
**Dependencies:** Task 5.2
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/renderer.test.ts`
2. Write tests for renderer initialization
3. Write tests for renderer state
**Test Mapping:** TC-004-001, TC-004-002

### Task 13.5: Create ThreeDGlobeRendererTests
**Priority:** P0
**Dependencies:** Task 6.2
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/three-d.test.ts`
2. Write tests for 3D globe rendering
3. Write tests for 3D matrix setup
**Test Mapping:** TC-005-001, TC-005-002

### Task 13.6: Create TwoDGlobeRendererTests
**Priority:** P0
**Dependencies:** Task 7.2
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/two-d.test.ts`
2. Write tests for 2D projection rendering
3. Write tests for projection calculation
**Test Mapping:** TC-006-001, TC-006-002

### Task 13.7: Create VisibilityCullingTests
**Priority:** P0
**Dependencies:** Task 8.2
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/culling.test.ts`
2. Write tests for visibility culling
3. Write tests for culling accuracy
**Test Mapping:** TC-007-001, TC-007-002

### Task 13.8: Create LODTests
**Priority:** P0
**Dependencies:** Task 9.2
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/lod.test.ts`
2. Write tests for LOD calculation
3. Write tests for LOD accuracy
**Test Mapping:** TC-008-001, TC-008-002

### Task 13.9: Create CellHighlightingTests
**Priority:** P0
**Dependencies:** Task 10.3
**Acceptance Criteria:** AC-009
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/highlight.test.ts`
2. Write tests for cell highlighting
3. Write tests for highlight clearing
**Test Mapping:** TC-009-001, TC-009-002

### Task 13.10: Create CellSelectionTests
**Priority:** P0
**Dependencies:** Task 11.3
**Acceptance Criteria:** AC-010
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/selection.test.ts`
2. Write tests for cell selection
3. Write tests for cell deselection
4. Write tests for selected cell retrieval
**Test Mapping:** TC-010-001, TC-010-002

### Task 13.11: Create ViewportResizingTests
**Priority:** P0
**Dependencies:** Task 12.2
**Acceptance Criteria:** AC-011
**Implementation Steps:**
1. Create file `logic/globe/rendering/__tests__/viewport.test.ts`
2. Write tests for viewport resizing
3. Write tests for viewport update
**Test Mapping:** TC-011-001, TC-011-002

---

## Summary

**Total Tasks:** 50
**P0 Tasks:** 50 (Types, Rendering mode, Cell mesh, Globe mesh, Renderer initialization, 3D/2D rendering, Visibility culling, LOD, Highlighting, Selection, Viewport, Tests)

**Phases:** 13
- Phase 1: Rendering Types (3 tasks)
- Phase 2: Rendering Mode Selection (3 tasks)
- Phase 3: Cell Mesh Creation (5 tasks)
- Phase 4: Globe Mesh Creation (2 tasks)
- Phase 5: Globe Renderer Initialization (2 tasks)
- Phase 6: 3D Globe Rendering (2 tasks)
- Phase 7: 2D Projection Rendering (2 tasks)
- Phase 8: Visibility Culling (2 tasks)
- Phase 9: Level of Detail (2 tasks)
- Phase 10: Cell Highlighting (3 tasks)
- Phase 11: Cell Selection (3 tasks)
- Phase 12: Viewport Resizing (2 tasks)
- Phase 13: Test Files (11 tasks)

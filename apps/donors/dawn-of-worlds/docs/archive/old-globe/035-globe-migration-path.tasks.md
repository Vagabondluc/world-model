---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# Task List: Globe Migration Path

**TDD Reference:** [035-globe-migration-path.tdd.md](../tdd/035-globe-migration-path.tdd.md)

---

## Phase 1: Horizontal Wrapping

### Task 1.1: Create HorizontalWrapper Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Horizontal wrapping)
**Implementation Steps:**
1. Create file `logic/globe/migration/wrapping.ts`
2. Implement `HorizontalWrapper` class
3. Add `wrapCellId(cellId: string): string` method
4. Add `unwrapCellId(cellId: string): string` method
5. Export class
**Test Mapping:** TC-001-001, TC-001-002 (Wrapper tests)

### Task 1.2: Implement Horizontal Wrapping
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (Horizontal wrapping)
**Implementation Steps:**
1. In `HorizontalWrapper`, implement `wrapCellId()` method
2. Detect cells at horizontal boundaries
3. Wrap cell ID to opposite side
4. Return wrapped ID
5. Export method
**Test Mapping:** TC-001-001, TC-001-002 (Wrapping tests)

### Task 1.3: Implement Horizontal Unwrapping
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (Horizontal wrapping)
**Implementation Steps:**
1. In `HorizontalWrapper`, implement `unwrapCellId()` method
2. Detect wrapped cell IDs
3. Unwrap to original cell ID
4. Return unwrapped ID
5. Export method
**Test Mapping:** TC-001-003, TC-001-004 (Unwrapping tests)

---

## Phase 2: North/South Caps

### Task 2.1: Create PolarCapHandler Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-002 (North/South caps)
**Implementation Steps:**
1. Create file `logic/globe/migration/polar.ts`
2. Implement `PolarCapHandler` class
3. Add `handleNorthCap(cellId: string): string` method
4. Add `handleSouthCap(cellId: string): string` method
5. Export class
**Test Mapping:** TC-002-001, TC-002-002 (Polar tests)

### Task 2.2: Implement North Cap Handling
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (North/South caps)
**Implementation Steps:**
1. In `PolarCapHandler`, implement `handleNorthCap()` method
2. Detect cells at north pole
3. Map to appropriate polar cap cell
4. Return mapped cell ID
5. Export method
**Test Mapping:** TC-002-001, TC-002-002 (North cap tests)

### Task 2.3: Implement South Cap Handling
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (North/South caps)
**Implementation Steps:**
1. In `PolarCapHandler`, implement `handleSouthCap()` method
2. Detect cells at south pole
3. Map to appropriate polar cap cell
4. Return mapped cell ID
5. Export method
**Test Mapping:** TC-002-003, TC-002-004 (South cap tests)

---

## Phase 3: Cap Visual Distortion

### Task 3.1: Create CapDistortionHandler Class
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-003 (Cap visual distortion)
**Implementation Steps:**
1. Create file `logic/globe/migration/distortion.ts`
2. Implement `CapDistortionHandler` class
3. Add `applyDistortion(cellId: string, position: Vector3): Vector3` method
4. Export class
**Test Mapping:** TC-003-001, TC-003-002 (Distortion tests)

### Task 3.2: Implement Cap Distortion
**Priority:** P1
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-003 (Cap visual distortion)
**Implementation Steps:**
1. In `CapDistortionHandler`, implement `applyDistortion()` method
2. Detect polar cap cells
3. Apply visual distortion to position
4. Return distorted position
5. Export method
**Test Mapping:** TC-003-001, TC-003-002 (Distortion tests)

---

## Phase 4: Backward Compatibility

### Task 4.1: Create CompatibilityChecker Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-004 (Backward compatibility)
**Implementation Steps:**
1. Create file `logic/globe/migration/compatibility.ts`
2. Implement `CompatibilityChecker` class
3. Add `checkCompatibility(saveData: unknown): CompatibilityResult` method
4. Export class
**Test Mapping:** TC-004-001, TC-004-002 (Compatibility tests)

### Task 4.2: Implement Compatibility Check
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-004 (Backward compatibility)
**Implementation Steps:**
1. In `CompatibilityChecker`, implement `checkCompatibility()` method
2. Check save data format version
3. Return compatibility result
4. Export method
**Test Mapping:** TC-004-001, TC-004-002 (Check tests)

---

## Phase 5: Cell Graph Generation

### Task 5.1: Create CellGraphGenerator Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-005 (Cell graph generation)
**Implementation Steps:**
1. Create file `logic/globe/migration/graph.ts`
2. Implement `CellGraphGenerator` class
3. Add `generateGraph(cells: Cell[]): CellGraph` method
4. Export class
**Test Mapping:** TC-005-001, TC-005-002 (Graph tests)

### Task 5.2: Implement Cell Graph Generation
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-005 (Cell graph generation)
**Implementation Steps:**
1. In `CellGraphGenerator`, implement `generateGraph()` method
2. Build adjacency graph from cells
3. Include wrapped connections
4. Return cell graph
5. Export method
**Test Mapping:** TC-005-001, TC-005-002 (Generation tests)

---

## Phase 6: Flat to Globe Migration

### Task 6.1: Create FlatToGlobeMigrator Class
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-006 (Flat to globe migration)
**Implementation Steps:**
1. Create file `logic/globe/migration/flat-to-globe.ts`
2. Implement `FlatToGlobeMigrator` class
3. Add `migrate(flatData: FlatWorldData): GlobeWorldData` method
4. Export class
**Test Mapping:** TC-006-001, TC-006-002 (Migrator tests)

### Task 6.2: Implement Flat to Globe Migration
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-006 (Flat to globe migration)
**Implementation Steps:**
1. In `FlatToGlobeMigrator`, implement `migrate()` method
2. Convert flat coordinates to spherical
3. Map flat tiles to globe cells
4. Preserve world state
5. Return globe data
6. Export method
**Test Mapping:** TC-006-001, TC-006-002 (Migration tests)

---

## Phase 7: Axial Coordinate Preservation

### Task 7.1: Create AxialCoordinatePreserver Class
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-007 (Axial coordinate preservation)
**Implementation Steps:**
1. Create file `logic/globe/migration/axial.ts`
2. Implement `AxialCoordinatePreserver` class
3. Add `preserveAxialCoordinates(flatData: FlatWorldData, globeData: GlobeWorldData): void` method
4. Export class
**Test Mapping:** TC-007-001, TC-007-002 (Preserver tests)

### Task 7.2: Implement Axial Coordinate Preservation
**Priority:** P0
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-007 (Axial coordinate preservation)
**Implementation Steps:**
1. In `AxialCoordinatePreserver`, implement `preserveAxialCoordinates()` method
2. Extract axial coordinates from flat data
3. Store in globe cell metadata
4. Export method
**Test Mapping:** TC-007-001, TC-007-002 (Preservation tests)

---

## Phase 8: Neighbor Lookup

### Task 8.1: Create NeighborLookup Class
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-008 (Neighbor lookup)
**Implementation Steps:**
1. Create file `logic/globe/migration/neighbor-lookup.ts`
2. Implement `NeighborLookup` class
3. Add `getNeighbors(cellId: string, graph: CellGraph): string[]` method
4. Export class
**Test Mapping:** TC-008-001, TC-008-002 (Lookup tests)

### Task 8.2: Implement Neighbor Lookup
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-008 (Neighbor lookup)
**Implementation Steps:**
1. In `NeighborLookup`, implement `getNeighbors()` method
2. Query cell graph for neighbors
3. Include wrapped neighbors
4. Return neighbor IDs
5. Export method
**Test Mapping:** TC-008-001, TC-008-002 (Lookup tests)

---

## Phase 9: 3D Globe Rendering

### Task 9.1: Create Globe3DRenderer Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-009 (3D globe rendering)
**Implementation Steps:**
1. Create file `logic/globe/migration/rendering-3d.ts`
2. Implement `Globe3DRenderer` class
3. Add `render(globeData: GlobeWorldData): void` method
4. Export class
**Test Mapping:** TC-009-001, TC-009-002 (Renderer tests)

### Task 9.2: Implement 3D Globe Rendering
**Priority:** P0
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-009 (3D globe rendering)
**Implementation Steps:**
1. In `Globe3DRenderer`, implement `render()` method
2. Create 3D globe mesh
3. Apply world data to mesh
4. Render to WebGL context
5. Export method
**Test Mapping:** TC-009-001, TC-009-002 (Rendering tests)

---

## Phase 10: View Toggle

### Task 10.1: Create ViewToggle Class
**Priority:** P0
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-010 (View toggle)
**Implementation Steps:**
1. Create file `logic/globe/migration/view-toggle.ts`
2. Implement `ViewToggle` class
3. Add `toggleTo3D(): void` method
4. Add `toggleTo2D(): void` method
5. Export class
**Test Mapping:** TC-010-001, TC-010-002 (Toggle tests)

### Task 10.2: Implement View Toggle to 3D
**Priority:** P0
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-010 (View toggle)
**Implementation Steps:**
1. In `ViewToggle`, implement `toggleTo3D()` method
2. Switch rendering to 3D mode
3. Update camera for 3D view
4. Export method
**Test Mapping:** TC-010-001, TC-010-002 (Toggle tests)

### Task 10.3: Implement View Toggle to 2D
**Priority:** P0
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-010 (View toggle)
**Implementation Steps:**
1. In `ViewToggle`, implement `toggleTo2D()` method
2. Switch rendering to 2D mode
3. Update camera for 2D view
4. Export method
**Test Mapping:** TC-010-003, TC-010-004 (Toggle tests)

---

## Phase 11: Shared State

### Task 11.1: Create SharedStateManager Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-011 (Shared state)
**Implementation Steps:**
1. Create file `logic/globe/migration/shared-state.ts`
2. Implement `SharedStateManager` class
3. Add `getState(): SharedState` method
4. Add `updateState(state: Partial<SharedState>): void` method
5. Export class
**Test Mapping:** TC-011-001, TC-011-002 (State tests)

### Task 11.2: Implement Shared State Management
**Priority:** P0
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-011 (Shared state)
**Implementation Steps:**
1. In `SharedStateManager`, implement state management
2. Share state between 2D and 3D views
3. Sync state changes
4. Export methods
**Test Mapping:** TC-011-001, TC-011-002 (State tests)

---

## Phase 12: Migration Rollback

### Task 12.1: Create MigrationRollback Class
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-012 (Migration rollback)
**Implementation Steps:**
1. Create file `logic/globe/migration/rollback.ts`
2. Implement `MigrationRollback` class
3. Add `rollback(globeData: GlobeWorldData): FlatWorldData` method
4. Export class
**Test Mapping:** TC-012-001, TC-012-002 (Rollback tests)

### Task 12.2: Implement Migration Rollback
**Priority:** P0
**Dependencies:** Task 12.1
**Acceptance Criteria:** AC-012 (Migration rollback)
**Implementation Steps:**
1. In `MigrationRollback`, implement `rollback()` method
2. Convert globe data back to flat format
3. Preserve world state
4. Return flat data
5. Export method
**Test Mapping:** TC-012-001, TC-012-002 (Rollback tests)

---

## Phase 13: Save Format Detection

### Task 13.1: Create SaveFormatDetector Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-013 (Save format detection)
**Implementation Steps:**
1. Create file `logic/globe/migration/format-detector.ts`
2. Implement `SaveFormatDetector` class
3. Add `detectFormat(saveData: unknown): SaveFormat` method
4. Export class
**Test Mapping:** TC-013-001, TC-013-002 (Detector tests)

### Task 13.2: Implement Save Format Detection
**Priority:** P0
**Dependencies:** Task 13.1
**Acceptance Criteria:** AC-013 (Save format detection)
**Implementation Steps:**
1. In `SaveFormatDetector`, implement `detectFormat()` method
2. Analyze save data structure
3. Determine format type (flat or globe)
4. Return format
5. Export method
**Test Mapping:** TC-013-001, TC-013-002 (Detection tests)

---

## Phase 14: Error Handling

### Task 14.1: Create MigrationErrorHandler Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-014 (Error handling)
**Implementation Steps:**
1. Create file `logic/globe/migration/error-handler.ts`
2. Implement `MigrationErrorHandler` class
3. Add `handleError(error: Error): MigrationErrorResult` method
4. Export class
**Test Mapping:** TC-014-001, TC-014-002 (Handler tests)

### Task 14.2: Implement Migration Error Handling
**Priority:** P0
**Dependencies:** Task 14.1
**Acceptance Criteria:** AC-014 (Error handling)
**Implementation Steps:**
1. In `MigrationErrorHandler`, implement `handleError()` method
2. Categorize error type
3. Generate user-friendly message
4. Suggest recovery action
5. Return error result
6. Export method
**Test Mapping:** TC-014-001, TC-014-002 (Error handling tests)

---

## Phase 15: Scale Transition Smoothness

### Task 15.1: Create ScaleTransitionAnimator Class
**Priority:** P1
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-015 (Scale transition smoothness)
**Implementation Steps:**
1. Create file `logic/globe/migration/transition.ts`
2. Implement `ScaleTransitionAnimator` class
3. Add `animateTransition(fromScale: number, toScale: number, duration: number): void` method
4. Export class
**Test Mapping:** TC-015-001, TC-015-002 (Animator tests)

### Task 15.2: Implement Scale Transition Animation
**Priority:** P1
**Dependencies:** Task 15.1
**Acceptance Criteria:** AC-015 (Scale transition smoothness)
**Implementation Steps:**
1. In `ScaleTransitionAnimator`, implement `animateTransition()` method
2. Use easing function for smooth transition
3. Animate scale changes over duration
4. Export method
**Test Mapping:** TC-015-001, TC-015-002 (Animation tests)

---

## Phase 16: Test Files

### Task 16.1: Create HorizontalWrappingTests
**Priority:** P0
**Dependencies:** Task 1.3
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/wrapping.test.ts`
2. Write tests for horizontal wrapping
3. Write tests for horizontal unwrapping
**Test Mapping:** TC-001-001, TC-001-002

### Task 16.2: Create PolarCapTests
**Priority:** P0
**Dependencies:** Task 2.3
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/polar.test.ts`
2. Write tests for north cap handling
3. Write tests for south cap handling
**Test Mapping:** TC-002-001, TC-002-002

### Task 16.3: Create CapDistortionTests
**Priority:** P1
**Dependencies:** Task 3.2
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/distortion.test.ts`
2. Write tests for cap visual distortion
3. Write tests for distortion accuracy
**Test Mapping:** TC-003-001, TC-003-002

### Task 16.4: Create CompatibilityTests
**Priority:** P0
**Dependencies:** Task 4.2
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/compatibility.test.ts`
2. Write tests for compatibility checking
3. Write tests for version detection
**Test Mapping:** TC-004-001, TC-004-002

### Task 16.5: Create CellGraphTests
**Priority:** P0
**Dependencies:** Task 5.2
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/graph.test.ts`
2. Write tests for cell graph generation
3. Write tests for graph accuracy
**Test Mapping:** TC-005-001, TC-005-002

### Task 16.6: Create FlatToGlobeTests
**Priority:** P0
**Dependencies:** Task 6.2
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/flat-to-globe.test.ts`
2. Write tests for flat to globe migration
3. Write tests for coordinate conversion
4. Write tests for state preservation
**Test Mapping:** TC-006-001, TC-006-002

### Task 16.7: Create AxialCoordinateTests
**Priority:** P0
**Dependencies:** Task 7.2
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/axial.test.ts`
2. Write tests for axial coordinate preservation
3. Write tests for coordinate accuracy
**Test Mapping:** TC-007-001, TC-007-002

### Task 16.8: Create NeighborLookupTests
**Priority:** P0
**Dependencies:** Task 8.2
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/neighbor-lookup.test.ts`
2. Write tests for neighbor lookup
3. Write tests for wrapped neighbors
**Test Mapping:** TC-008-001, TC-008-002

### Task 16.9: Create Globe3DRenderingTests
**Priority:** P0
**Dependencies:** Task 9.2
**Acceptance Criteria:** AC-009
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/rendering-3d.test.ts`
2. Write tests for 3D globe rendering
3. Write tests for mesh creation
**Test Mapping:** TC-009-001, TC-009-002

### Task 16.10: Create ViewToggleTests
**Priority:** P0
**Dependencies:** Task 10.3
**Acceptance Criteria:** AC-010
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/view-toggle.test.ts`
2. Write tests for view toggle to 3D
3. Write tests for view toggle to 2D
**Test Mapping:** TC-010-001, TC-010-002

### Task 16.11: Create SharedStateTests
**Priority:** P0
**Dependencies:** Task 11.2
**Acceptance Criteria:** AC-011
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/shared-state.test.ts`
2. Write tests for shared state management
3. Write tests for state synchronization
**Test Mapping:** TC-011-001, TC-011-002

### Task 16.12: Create RollbackTests
**Priority:** P0
**Dependencies:** Task 12.2
**Acceptance Criteria:** AC-012
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/rollback.test.ts`
2. Write tests for migration rollback
3. Write tests for rollback accuracy
**Test Mapping:** TC-012-001, TC-012-002

### Task 16.13: Create SaveFormatTests
**Priority:** P0
**Dependencies:** Task 13.2
**Acceptance Criteria:** AC-013
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/format-detector.test.ts`
2. Write tests for save format detection
3. Write tests for format accuracy
**Test Mapping:** TC-013-001, TC-013-002

### Task 16.14: Create ErrorHandlingTests
**Priority:** P0
**Dependencies:** Task 14.2
**Acceptance Criteria:** AC-014
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/error-handler.test.ts`
2. Write tests for migration error handling
3. Write tests for error categorization
**Test Mapping:** TC-014-001, TC-014-002

### Task 16.15: Create ScaleTransitionTests
**Priority:** P1
**Dependencies:** Task 15.2
**Acceptance Criteria:** AC-015
**Implementation Steps:**
1. Create file `logic/globe/migration/__tests__/transition.test.ts`
2. Write tests for scale transition animation
3. Write tests for transition smoothness
**Test Mapping:** TC-015-001, TC-015-002

---

## Summary

**Total Tasks:** 59
**P0 Tasks:** 54 (Wrapping, Polar caps, Compatibility, Graph generation, Migration, Axial coordinates, Neighbor lookup, 3D rendering, View toggle, Shared state, Rollback, Format detection, Error handling, Tests)
**P1 Tasks:** 5 (Cap distortion, Scale transition, Tests)

**Phases:** 16
- Phase 1: Horizontal Wrapping (3 tasks)
- Phase 2: North/South Caps (3 tasks)
- Phase 3: Cap Visual Distortion (2 tasks)
- Phase 4: Backward Compatibility (2 tasks)
- Phase 5: Cell Graph Generation (2 tasks)
- Phase 6: Flat to Globe Migration (2 tasks)
- Phase 7: Axial Coordinate Preservation (2 tasks)
- Phase 8: Neighbor Lookup (2 tasks)
- Phase 9: 3D Globe Rendering (2 tasks)
- Phase 10: View Toggle (3 tasks)
- Phase 11: Shared State (2 tasks)
- Phase 12: Migration Rollback (2 tasks)
- Phase 13: Save Format Detection (2 tasks)
- Phase 14: Error Handling (2 tasks)
- Phase 15: Scale Transition Smoothness (2 tasks)
- Phase 16: Test Files (15 tasks)

---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# Task List: Globe Scale System

**TDD Reference:** [032-globe-scale-system.tdd.md](../tdd/032-globe-scale-system.tdd.md)

---

## Phase 1: Scale Types

### Task 1.1: Create Region Interface
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Region creation)
**Implementation Steps:**
1. Create file `logic/globe/scale/types.ts`
2. Define `Region` interface with fields:
   - `id: string`
   - `name: string`
   - `level: number`
   - `cells: string[]`
   - `center: Vector3`
   - `area: number`
   - `neighbors: string[]`
   - `parent: string | null`
   - `children: string[]`
3. Export interface
**Test Mapping:** TC-001-001, TC-001-002 (Region tests)

### Task 1.2: Create ScaleLevel Enum
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-007 (Scale hierarchy building)
**Implementation Steps:**
1. In `logic/globe/scale/types.ts`, define `ScaleLevel` enum with values: `GLOBAL`, `CONTINENT`, `COUNTRY`, `PROVINCE`, `LOCAL`
2. Export enum
**Test Mapping:** TC-007-001, TC-007-002 (Scale level tests)

---

## Phase 2: Region Creation

### Task 2.1: Create RegionFactory Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (Region creation)
**Implementation Steps:**
1. Create file `logic/globe/scale/factory.ts`
2. Implement `RegionFactory` class
3. Add `createRegion(id: string, level: number, cells: string[]): Region` method
4. Export class
**Test Mapping:** TC-001-001, TC-001-002 (Factory tests)

### Task 2.2: Implement Region Creation
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Region creation)
**Implementation Steps:**
1. In `RegionFactory`, implement `createRegion()` method
2. Initialize region with provided cells
3. Calculate region center
4. Calculate region area
5. Initialize empty neighbors, parent, children
6. Return region object
7. Export method
**Test Mapping:** TC-001-001, TC-001-002 (Creation tests)

---

## Phase 3: Anchor Selection

### Task 3.1: Create AnchorSelector Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-002 (Anchor selection)
**Implementation Steps:**
1. Create file `logic/globe/scale/anchor.ts`
2. Implement `AnchorSelector` class
3. Add `selectAnchor(cells: Cell[]): string` method
4. Export class
**Test Mapping:** TC-002-001, TC-002-002 (Selector tests)

### Task 3.2: Implement Anchor Selection Algorithm
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Anchor selection)
**Implementation Steps:**
1. In `AnchorSelector`, implement `selectAnchor()` method
2. Find cell closest to geometric center
3. Return cell ID as anchor
4. Export method
**Test Mapping:** TC-002-001, TC-002-002 (Selection tests)

---

## Phase 4: Hex Assignment

### Task 4.1: Create HexAssigner Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-003 (Hex assignment)
**Implementation Steps:**
1. Create file `logic/globe/scale/hex.ts`
2. Implement `HexAssigner` class
3. Add `assignHexes(region: Region, allCells: Cell[]): void` method
4. Export class
**Test Mapping:** TC-003-001, TC-003-002 (Assigner tests)

### Task 4.2: Implement Hex Assignment Algorithm
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-003 (Hex assignment)
**Implementation Steps:**
1. In `HexAssigner`, implement `assignHexes()` method
2. Grow region from anchor cell
3. Add neighboring hexes until target size reached
4. Assign cells to region
5. Export method
**Test Mapping:** TC-003-001, TC-003-002 (Assignment tests)

---

## Phase 5: Region Center Calculation

### Task 5.1: Implement Region Center Calculation
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-004 (Region center calculation)
**Implementation Steps:**
1. In `RegionFactory`, implement `calculateRegionCenter(cells: Cell[]): Vector3` function
2. Average all cell centers
3. Normalize to unit sphere
4. Return center vector
5. Export function
**Test Mapping:** TC-004-001, TC-004-002 (Center tests)

---

## Phase 6: Region Area Calculation

### Task 6.1: Implement Region Area Calculation
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-005 (Region area calculation)
**Implementation Steps:**
1. In `RegionFactory`, implement `calculateRegionArea(cells: Cell[]): number` function
2. Sum all cell areas
3. Return total area
4. Export function
**Test Mapping:** TC-005-001, TC-005-002 (Area tests)

---

## Phase 7: Region Neighbor Finding

### Task 7.1: Create RegionNeighborFinder Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-006 (Region neighbor finding)
**Implementation Steps:**
1. Create file `logic/globe/scale/neighbor.ts`
2. Implement `RegionNeighborFinder` class
3. Add `findNeighbors(region: Region, allRegions: Region[]): string[]` method
4. Export class
**Test Mapping:** TC-006-001, TC-006-002 (Finder tests)

### Task 7.2: Implement Region Neighbor Finding Algorithm
**Priority:** P0
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-006 (Region neighbor finding)
**Implementation Steps:**
1. In `RegionNeighborFinder`, implement `findNeighbors()` method
2. Find regions sharing cells
3. Find regions with adjacent cells
4. Collect neighbor IDs
5. Return neighbor array
6. Export method
**Test Mapping:** TC-006-001, TC-006-002 (Finding tests)

---

## Phase 8: Scale Hierarchy Building

### Task 8.1: Create ScaleHierarchyBuilder Class
**Priority:** P0
**Dependencies:** Task 1.1, Task 1.2
**Acceptance Criteria:** AC-007 (Scale hierarchy building)
**Implementation Steps:**
1. Create file `logic/globe/scale/hierarchy.ts`
2. Implement `ScaleHierarchyBuilder` class
3. Add `buildHierarchy(cells: Cell[]): Map<number, Region[]>` method
4. Export class
**Test Mapping:** TC-007-001, TC-007-002 (Builder tests)

### Task 8.2: Implement Global Level Building
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-007 (Scale hierarchy building)
**Implementation Steps:**
1. In `ScaleHierarchyBuilder`, implement `buildGlobalLevel(cells: Cell[]): Region` function
2. Create single global region containing all cells
3. Return global region
4. Export function
**Test Mapping:** TC-007-001, TC-007-002 (Global tests)

### Task 8.3: Implement Continent Level Building
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-007 (Scale hierarchy building)
**Implementation Steps:**
1. In `ScaleHierarchyBuilder`, implement `buildContinentLevel(globalRegion: Region, cells: Cell[]): Region[]` function
2. Divide global region into continents
3. Return continent regions
4. Export function
**Test Mapping:** TC-007-003, TC-007-004 (Continent tests)

### Task 8.4: Implement Lower Level Building
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-007 (Scale hierarchy building)
**Implementation Steps:**
1. In `ScaleHierarchyBuilder`, implement `buildLowerLevel(parentRegions: Region[], cells: Cell[]): Region[]` function
2. Divide parent regions into child regions
3. Return child regions
4. Export function
**Test Mapping:** TC-007-005, TC-007-006 (Lower level tests)

### Task 8.5: Implement Hierarchy Building Pipeline
**Priority:** P0
**Dependencies:** Task 8.1, Task 8.2, Task 8.3, Task 8.4
**Acceptance Criteria:** AC-007 (Scale hierarchy building)
**Implementation Steps:**
1. In `ScaleHierarchyBuilder`, implement `buildHierarchy()` method
2. Build global level
3. Build continent level
4. Build country level
5. Build province level
6. Build local level
7. Link parent-child relationships
8. Return hierarchy map
9. Export method
**Test Mapping:** TC-007-001, TC-007-002 (Pipeline tests)

---

## Phase 9: Scale-Based Rendering

### Task 9.1: Create ScaleRenderer Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-008 (Scale-based rendering)
**Implementation Steps:**
1. Create file `logic/globe/scale/renderer.ts`
2. Implement `ScaleRenderer` class
3. Add `getVisibleRegions(scale: ScaleLevel, camera: Camera): Region[]` method
4. Export class
**Test Mapping:** TC-008-001, TC-008-002 (Renderer tests)

### Task 9.2: Implement Visible Region Calculation
**Priority:** P0
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-008 (Scale-based rendering)
**Implementation Steps:**
1. In `ScaleRenderer`, implement `getVisibleRegions()` method
2. Get all regions at specified scale
3. Filter by camera view
4. Return visible regions
5. Export method
**Test Mapping:** TC-008-001, TC-008-002 (Visible tests)

---

## Phase 10: Region Naming

### Task 10.1: Create RegionNamer Class
**Priority:** P1
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-009 (Region naming)
**Implementation Steps:**
1. Create file `logic/globe/scale/namer.ts`
2. Implement `RegionNamer` class
3. Add `nameRegion(region: Region): string` method
4. Export class
**Test Mapping:** TC-009-001, TC-009-002 (Namer tests)

### Task 10.2: Implement Region Naming Algorithm
**Priority:** P1
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-009 (Region naming)
**Implementation Steps:**
1. In `RegionNamer`, implement `nameRegion()` method
2. Generate name based on region level
3. Use procedural name generation
4. Return generated name
5. Export method
**Test Mapping:** TC-009-001, TC-009-002 (Naming tests)

---

## Phase 11: Scale Manager

### Task 11.1: Create ScaleManager Class
**Priority:** P0
**Dependencies:** Task 8.1, Task 9.1
**Acceptance Criteria:** AC-007, AC-008
**Implementation Steps:**
1. Create file `logic/globe/scale/manager.ts`
2. Implement `ScaleManager` class
3. Add `initialize(cells: Cell[]): void` method
4. Add `getRegionsAtLevel(level: ScaleLevel): Region[]` method
5. Add `getRegion(id: string): Region | null` method
6. Add `getVisibleRegions(scale: ScaleLevel, camera: Camera): Region[]` method
7. Export class
**Test Mapping:** TC-007-001, TC-008-001 (Manager tests)

### Task 11.2: Implement ScaleManager Initialization
**Priority:** P0
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-007 (Scale hierarchy building)
**Implementation Steps:**
1. In `ScaleManager`, implement `initialize()` method
2. Build scale hierarchy
3. Store regions by level
4. Store regions by ID
5. Export method
**Test Mapping:** TC-007-001, TC-007-002 (Initialization tests)

### Task 11.3: Implement ScaleManager Query Methods
**Priority:** P0
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-007, AC-008
**Implementation Steps:**
1. In `ScaleManager`, implement query methods
2. Return regions at specified level
3. Return region by ID
4. Return visible regions
5. Export methods
**Test Mapping:** TC-007-001, TC-008-001 (Query tests)

---

## Phase 12: Test Files

### Task 12.1: Create RegionTests
**Priority:** P0
**Dependencies:** Task 2.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/globe/scale/__tests__/region.test.ts`
2. Write tests for region creation
3. Write tests for region properties
**Test Mapping:** TC-001-001, TC-001-002

### Task 12.2: Create AnchorSelectionTests
**Priority:** P0
**Dependencies:** Task 3.2
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/globe/scale/__tests__/anchor.test.ts`
2. Write tests for anchor selection
3. Write tests for anchor selection algorithm
**Test Mapping:** TC-002-001, TC-002-002

### Task 12.3: Create HexAssignmentTests
**Priority:** P0
**Dependencies:** Task 4.2
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/globe/scale/__tests__/hex.test.ts`
2. Write tests for hex assignment
3. Write tests for hex assignment algorithm
**Test Mapping:** TC-003-001, TC-003-002

### Task 12.4: Create RegionCenterTests
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/globe/scale/__tests__/center.test.ts`
2. Write tests for region center calculation
3. Write tests for center accuracy
**Test Mapping:** TC-004-001, TC-004-002

### Task 12.5: Create RegionAreaTests
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `logic/globe/scale/__tests__/area.test.ts`
2. Write tests for region area calculation
3. Write tests for area accuracy
**Test Mapping:** TC-005-001, TC-005-002

### Task 12.6: Create RegionNeighborTests
**Priority:** P0
**Dependencies:** Task 7.2
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/globe/scale/__tests__/neighbor.test.ts`
2. Write tests for region neighbor finding
3. Write tests for neighbor accuracy
**Test Mapping:** TC-006-001, TC-006-002

### Task 12.7: Create HierarchyTests
**Priority:** P0
**Dependencies:** Task 8.5
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/globe/scale/__tests__/hierarchy.test.ts`
2. Write tests for global level building
3. Write tests for continent level building
4. Write tests for lower level building
5. Write tests for hierarchy pipeline
**Test Mapping:** TC-007-001, TC-007-002

### Task 12.8: Create ScaleRenderingTests
**Priority:** P0
**Dependencies:** Task 9.2
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/globe/scale/__tests__/renderer.test.ts`
2. Write tests for visible region calculation
3. Write tests for scale-based rendering
**Test Mapping:** TC-008-001, TC-008-002

### Task 12.9: Create RegionNamingTests
**Priority:** P1
**Dependencies:** Task 10.2
**Acceptance Criteria:** AC-009
**Implementation Steps:**
1. Create file `logic/globe/scale/__tests__/namer.test.ts`
2. Write tests for region naming
3. Write tests for name uniqueness
**Test Mapping:** TC-009-001, TC-009-002

### Task 12.10: Create ScaleManagerTests
**Priority:** P0
**Dependencies:** Task 11.3
**Acceptance Criteria:** AC-007, AC-008
**Implementation Steps:**
1. Create file `logic/globe/scale/__tests__/manager.test.ts`
2. Write tests for manager initialization
3. Write tests for query methods
4. Write tests for manager state
**Test Mapping:** TC-007-001, TC-008-001

---

## Summary

**Total Tasks:** 41
**P0 Tasks:** 38 (Types, Region creation, Anchor selection, Hex assignment, Center/area calculation, Neighbor finding, Hierarchy building, Scale rendering, Manager, Tests)
**P1 Tasks:** 3 (Region naming, Tests)

**Phases:** 12
- Phase 1: Scale Types (2 tasks)
- Phase 2: Region Creation (2 tasks)
- Phase 3: Anchor Selection (2 tasks)
- Phase 4: Hex Assignment (2 tasks)
- Phase 5: Region Center Calculation (1 task)
- Phase 6: Region Area Calculation (1 task)
- Phase 7: Region Neighbor Finding (2 tasks)
- Phase 8: Scale Hierarchy Building (5 tasks)
- Phase 9: Scale-Based Rendering (2 tasks)
- Phase 10: Region Naming (2 tasks)
- Phase 11: Scale Manager (3 tasks)
- Phase 12: Test Files (10 tasks)

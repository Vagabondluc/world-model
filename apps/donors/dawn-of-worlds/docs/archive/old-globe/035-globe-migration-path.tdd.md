---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# TDD: Globe Migration Path

## Specification Reference
- Spec: [`035-globe-migration-path.md`](../specs/035-globe-migration-path.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: Phase 1 Horizontal Wrapping
**Given** a flat hex map with horizontal wrap enabled
**When** a neighbor lookup is performed at the eastern edge
**Then** the neighbor should be the corresponding cell at the western edge

### AC-002: Phase 1 North/South Caps
**Given** a flat hex map with polar caps enabled
**When** cap cells are retrieved
**Then** the correct number of rows at the north and south extremes should be identified as cap cells

### AC-003: Phase 1 Cap Visual Distortion
**Given** a cap cell is being rendered
**When** the cell is projected for display
**Then** the cell should be visually compressed based on its latitude

### AC-004: Phase 1 Backward Compatibility
**Given** an existing flat map save file
**When** Phase 1 is enabled
**Then** the map should render correctly with horizontal wrapping and polar caps without data loss

### AC-005: Phase 2 Cell Graph Generation
**Given** a subdivision level is specified
**When** the icosahedron is subdivided
**Then** a correct adjacency graph with 12 pentagon cells should be generated

### AC-006: Phase 2 Flat to Globe Migration
**Given** an existing flat map with axial coordinates
**When** migration to true topology is performed
**Then** each flat cell should map to the nearest globe cell and preserve its properties

### AC-007: Phase 2 Axial Coordinate Preservation
**Given** a flat map is migrated to true topology
**When** the migrated cells are inspected
**Then** the original axial coordinates should be preserved as metadata

### AC-008: Phase 2 Neighbor Lookup Across Faces
**Given** a cell graph with true spherical topology
**When** a neighbor lookup is performed across an icosahedron face boundary
**Then** the correct neighbor should be returned regardless of face

### AC-009: Phase 3 3D Globe Rendering
**Given** a cell graph with true topology
**When** 3D view is enabled
**Then** cells should be rendered on a sphere using Three.js or WebGL

### AC-010: Phase 3 View Toggle
**Given** both flat and globe renderers are available
**When** the user toggles between views
**Then** the view should switch seamlessly with the same underlying cell data

### AC-011: Phase 3 Shared State
**Given** flat and globe views are available
**When** a game event occurs
**Then** both views should reflect the same cell state changes

### AC-012: Migration Rollback
**Given** a migration is in progress or completed
**When** a rollback is triggered
**Then** the system should restore the previous state from backup

### AC-013: Save Format Detection
**Given** a save file is loaded
**When** the save format is detected
**Then** the correct version and format should be identified

### AC-014: Migration Error Handling
**Given** a migration operation is in progress
**When** an error occurs
**Then** the error should be caught, logged, and the user should be notified with rollback option

### AC-015: Scale Transition Smoothness
**Given** a scale level change is requested
**When** the transition is animated
**Then** the visual change should use linear interpolation for smooth appearance

---

## Test Cases

### AC-001: Phase 1 Horizontal Wrapping

#### TC-001-001: Happy Path - Wrap East to West
**Input**:
```typescript
{
  cellId: "h:10:0",
  direction: 0, // East
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Returns cell at q: -10 (wrapped from q: 11)
**Priority**: P0

#### TC-001-002: Happy Path - Wrap West to East
**Input**:
```typescript
{
  cellId: "h:-10:0",
  direction: 3, // West
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Returns cell at q: 10 (wrapped from q: -11)
**Priority**: P0

#### TC-001-003: Edge Case - No Wrap Needed
**Input**:
```typescript
{
  cellId: "h:0:0",
  direction: 0, // East
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Returns cell at q: 1 (no wrapping)
**Priority**: P0

#### TC-001-004: Error Case - Invalid Cell ID
**Input**:
```typescript
{
  cellId: "invalid",
  direction: 0,
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Returns null
**Priority**: P1

---

### AC-002: Phase 1 North/South Caps

#### TC-002-001: Happy Path - Get North Cap Cells
**Input**:
```typescript
{
  config: { enableNorthSouthCaps: true, capHeight: 5 },
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Returns all cells with r from -10 to -5
**Priority**: P0

#### TC-002-002: Happy Path - Get South Cap Cells
**Input**:
```typescript
{
  config: { enableNorthSouthCaps: true, capHeight: 5 },
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Returns all cells with r from 5 to 10
**Priority**: P0

#### TC-002-003: Edge Case - Caps Disabled
**Input**:
```typescript
{
  config: { enableNorthSouthCaps: false, capHeight: 5 },
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Returns empty array
**Priority**: P1

#### TC-002-004: Edge Case - Zero Cap Height
**Input**:
```typescript
{
  config: { enableNorthSouthCaps: true, capHeight: 0 },
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Returns empty array
**Priority**: P2

---

### AC-003: Phase 1 Cap Visual Distortion

#### TC-003-001: Happy Path - North Pole Compression
**Input**:
```typescript
{
  cell: {
    id: "h:0:-10",
    axial: { q: 0, r: -10 },
    center: [100, 0, 0]
  },
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Cell center is compressed based on latitude (~90°)
**Priority**: P0

#### TC-003-002: Happy Path - Equator No Compression
**Input**:
```typescript
{
  cell: {
    id: "h:0:0",
    axial: { q: 0, r: 0 },
    center: [100, 0, 0]
  },
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Cell center is unchanged (latitude ~0°)
**Priority**: P0

#### TC-003-003: Edge Case - South Pole Compression
**Input**:
```typescript
{
  cell: {
    id: "h:0:10",
    axial: { q: 0, r: 10 },
    center: [100, 0, 0]
  },
  mapBounds: { minQ: -10, maxQ: 10, minR: -10, maxR: 10 }
}
```
**Expected**: Cell center is compressed based on latitude (~-90°)
**Priority**: P0

---

### AC-004: Phase 1 Backward Compatibility

#### TC-004-001: Happy Path - Load Existing Save
**Input**:
```typescript
{
  saveData: {
    version: "1.0",
    cells: [/* existing flat map cells */],
    events: [/* existing events */]
  },
  config: { enableHorizontalWrap: true, enableNorthSouthCaps: true, capHeight: 20 }
}
```
**Expected**: Save loads successfully, map renders with wrapping and caps
**Priority**: P0

#### TC-004-002: Integration - Existing Actions Work
**Input**:
```typescript
{
  saveData: { /* existing save */ },
  action: { type: "PLACE_CITY", cellId: "h:5:3" }
}
```
**Expected**: Action executes correctly in Phase 1 mode
**Priority**: P0

#### TC-004-003: Edge Case - Save Without Version
**Input**:
```typescript
{
  saveData: {
    cells: [/* cells without version */]
  },
  config: { enableHorizontalWrap: true, enableNorthSouthCaps: true, capHeight: 20 }
}
```
**Expected**: Save loads as version 1.0 (default)
**Priority**: P1

---

### AC-005: Phase 2 Cell Graph Generation

#### TC-005-001: Happy Path - Generate Level 4 Subdivision
**Input**:
```typescript
{
  subdivisionLevel: 4
}
```
**Expected**: Generates ~2560 cells with correct adjacency graph and 12 pentagons
**Priority**: P0

#### TC-005-002: Happy Path - Verify Pentagon Count
**Input**:
```typescript
{
  subdivisionLevel: 4
}
```
**Expected**: Exactly 12 cells have 5 neighbors (pentagons)
**Priority**: P0

#### TC-005-003: Edge Case - Level 0 Subdivision
**Input**:
```typescript
{
  subdivisionLevel: 0
}
```
**Expected**: Generates 12 cells (icosahedron vertices)
**Priority**: P1

#### TC-005-004: Edge Case - High Subdivision Level
**Input**:
```typescript
{
  subdivisionLevel: 10
}
```
**Expected**: Generates cells without errors (performance may be slow)
**Priority**: P2

---

### AC-006: Phase 2 Flat to Globe Migration

#### TC-006-001: Happy Path - Migrate Small Map
**Input**:
```typescript
{
  flatMap: new Map([
    ["h:0:0", { id: "h:0:0", axial: { q: 0, r: 0 }, terrain: "PLAIN" }],
    ["h:1:0", { id: "h:1:0", axial: { q: 1, r: 0 }, terrain: "FOREST" }]
  ]),
  globeCells: /* generated from subdivision */
}
```
**Expected**: Each flat cell maps to nearest globe cell with properties preserved
**Priority**: P0

#### TC-006-002: Happy Path - Migration Result Includes Mapping
**Input**:
```typescript
{
  flatMap: /* existing map */,
  globeCells: /* generated globe */
}
```
**Expected**: Result includes migrated cells, mapping (oldId -> newId), and unmapped list
**Priority**: P0

#### TC-006-003: Edge Case - Empty Flat Map
**Input**:
```typescript
{
  flatMap: new Map(),
  globeCells: /* generated globe */
}
```
**Expected**: Returns empty migrated map, empty mapping, empty unmapped
**Priority**: P1

#### TC-006-004: Error Case - Globe Cells Empty
**Input**:
```typescript
{
  flatMap: new Map([["h:0:0", { id: "h:0:0", axial: { q: 0, r: 0 } }]]),
  globeCells: new Map()
}
```
**Expected**: Returns empty migrated map, all cells in unmapped
**Priority**: P1

---

### AC-007: Phase 2 Axial Coordinate Preservation

#### TC-007-001: Happy Path - Preserve Axial on Migration
**Input**:
```typescript
{
  flatCell: {
    id: "h:5:3",
    axial: { q: 5, r: 3 },
    terrain: "MOUNTAIN",
    settlement: { id: "city_1", name: "Peak City" }
  },
  globeCell: {
    id: "g:123",
    center: [/* 3D coords */],
    kind: "HEX"
  }
}
```
**Expected**: Migrated cell includes axial: { q: 5, r: 3 } in metadata
**Priority**: P0

#### TC-007-002: Edge Case - Cell Without Axial
**Input**:
```typescript
{
  flatCell: {
    id: "h:5:3",
    terrain: "PLAIN"
    // no axial
  },
  globeCell: {
    id: "g:123",
    center: [/* 3D coords */],
    kind: "HEX"
  }
}
```
**Expected**: Migrated cell does not include axial metadata
**Priority**: P2

---

### AC-008: Phase 2 Neighbor Lookup Across Faces

#### TC-008-001: Happy Path - Neighbor Across Face Boundary
**Input**:
```typescript
{
  cellId: "g:123",
  adjacency: /* graph with face boundary connections */,
  direction: 0
}
```
**Expected**: Returns correct neighbor even across icosahedron face
**Priority**: P0

#### TC-008-002: Happy Path - Pentagon Neighbor
**Input**:
```typescript
{
  cellId: "g:1", // pentagon
  adjacency: /* graph */,
  direction: 0
}
```
**Expected**: Returns correct neighbor (pentagon has 5 neighbors)
**Priority**: P0

#### TC-008-003: Edge Case - No Neighbor in Direction
**Input**:
```typescript
{
  cellId: "g:1", // pentagon
  adjacency: /* graph */,
  direction: 5 // pentagon only has 5 neighbors
}
```
**Expected**: Returns null
**Priority**: P1

---

### AC-009: Phase 3 3D Globe Rendering

#### TC-009-001: Happy Path - Render Globe View
**Input**:
```typescript
{
  cells: /* cell graph with 3D centers */,
  config: { enable3D: true, defaultView: "GLOBE" }
}
```
**Expected**: Globe renders with cells positioned on sphere surface
**Priority**: P0

#### TC-009-002: Integration - Globe with Three.js
**Input**:
```typescript
{
  cells: /* cell graph */,
  renderer: new GlobeRenderer(/* Three.js setup */)
}
```
**Expected**: Three.js scene created with sphere and cell meshes
**Priority**: P0

#### TC-009-003: Edge Case - 3D Disabled
**Input**:
```typescript
{
  cells: /* cell graph */,
  config: { enable3D: false, defaultView: "FLAT" }
}
```
**Expected**: Globe renderer not initialized, flat renderer used
**Priority**: P1

---

### AC-010: Phase 3 View Toggle

#### TC-010-001: Happy Path - Toggle Flat to Globe
**Input**:
```typescript
{
  currentView: "FLAT",
  config: { enableViewToggle: true }
}
```
**Expected**: View switches to "GLOBE", globe renderer renders
**Priority**: P0

#### TC-010-002: Happy Path - Toggle Globe to Flat
**Input**:
```typescript
{
  currentView: "GLOBE",
  config: { enableViewToggle: true }
}
```
**Expected**: View switches to "FLAT", flat renderer renders
**Priority**: P0

#### TC-010-003: Edge Case - Toggle Disabled
**Input**:
```typescript
{
  currentView: "FLAT",
  config: { enableViewToggle: false }
}
```
**Expected**: toggleView() does nothing, view remains "FLAT"
**Priority**: P1

---

### AC-011: Phase 3 Shared State

#### TC-011-001: Happy Path - Event Updates Both Views
**Input**:
```typescript
{
  event: { type: "PLACE_CITY", cellId: "g:123", data: { name: "New City" } },
  cells: /* shared cell map */,
  flatRenderer: /* initialized */,
  globeRenderer: /* initialized */
}
```
**Expected**: Cell "g:123" updated in shared map, both renderers reflect change
**Priority**: P0

#### TC-011-002: Integration - Inspector Works in Both Views
**Input**:
```typescript
{
  cellId: "g:123",
  currentView: "GLOBE"
}
```
**Expected**: Inspector shows same cell data regardless of view
**Priority**: P0

#### TC-011-003: Edge Case - View Change During Event
**Input**:
```typescript
{
  event: /* long-running event */,
  viewToggle: true
}
```
**Expected**: Event completes, then view toggles, no data corruption
**Priority**: P1

---

### AC-012: Migration Rollback

#### TC-012-001: Happy Path - Rollback After Phase 2
**Input**:
```typescript
{
  currentPhase: 2,
  backupPath: "./backup/",
  backupData: /* Phase 1 state */
}
```
**Expected**: System restores to Phase 1 state from backup
**Priority**: P0

#### TC-012-002: Happy Path - Auto Backup Before Migration
**Input**:
```typescript
{
  config: { autoBackupBeforeMigration: true },
  dataBackupPath: "./backup/"
}
```
**Expected**: Backup created before migration starts
**Priority**: P0

#### TC-012-003: Error Case - Rollback Failure
**Input**:
```typescript
{
  backupPath: "./nonexistent/",
  backupData: /* missing */
}
```
**Expected**: Error logged, user notified, system in degraded state
**Priority**: P1

#### TC-012-004: Edge Case - Rollback Disabled
**Input**:
```typescript
{
  config: { canRollback: false }
}
```
**Expected**: Rollback not available, user warned before migration
**Priority**: P1

---

### AC-013: Save Format Detection

#### TC-013-001: Happy Path - Detect Version 1.0
**Input**:
```typescript
{
  saveData: {
    version: "1.0",
    cells: [/* flat map cells */]
  }
}
```
**Expected**: Returns format FLAT_MAP, version "1.0"
**Priority**: P0

#### TC-013-002: Happy Path - Detect Version 2.0
**Input**:
```typescript
{
  saveData: {
    version: "2.0",
    cells: [/* globe cells */]
  }
}
```
**Expected**: Returns format GLOBE, version "2.0"
**Priority**: P0

#### TC-013-003: Edge Case - No Version Field
**Input**:
```typescript
{
  saveData: {
    cells: [/* cells */]
    // no version
  }
}
```
**Expected**: Returns default format (FLAT_MAP, version "1.0")
**Priority**: P1

#### TC-013-004: Error Case - Unknown Version
**Input**:
```typescript
{
  saveData: {
    version: "99.9",
    cells: [/* cells */]
  }
}
```
**Expected**: Returns latest known format (GLOBE, version "3.0")
**Priority**: P1

---

### AC-014: Migration Error Handling

#### TC-014-001: Happy Path - Handle Save Load Error
**Input**:
```typescript
{
  error: {
    phase: 2,
    errorType: "SAVE_LOAD",
    message: "File not found"
  }
}
```
**Expected**: Error logged, user notified, no migration performed
**Priority**: P0

#### TC-014-002: Happy Path - Handle Data Corruption
**Input**:
```typescript
{
  error: {
    phase: 1,
    errorType: "DATA_CORRUPTION",
    message: "Invalid cell data"
  }
}
```
**Expected**: Error logged, user notified, rollback attempted
**Priority**: P0

#### TC-014-003: Integration - User Can Retry
**Input**:
```typescript
{
  error: /* previous error */,
  userAction: "RETRY"
}
```
**Expected**: Migration restarts from failed phase
**Priority**: P1

---

### AC-015: Scale Transition Smoothness

#### TC-015-001: Happy Path - Linear Interpolation
**Input**:
```typescript
{
  fromScale: 0,
  toScale: 2,
  progress: 0.5
}
```
**Expected**: Returns interpolated value at 50% between scales
**Priority**: P0

#### TC-015-002: Happy Path - Complete Transition
**Input**:
```typescript
{
  fromScale: 0,
  toScale: 2,
  progress: 1.0
}
```
**Expected**: Returns value at target scale
**Priority**: P0

#### TC-015-003: Edge Case - No Transition
**Input**:
```typescript
{
  fromScale: 1,
  toScale: 1,
  progress: 0.0
}
```
**Expected**: Returns value at source scale (no change)
**Priority**: P1

---

## Test Data

### FakeGlobeConfig
```typescript
interface FakeGlobeConfig {
  enableHorizontalWrap: boolean;
  enableNorthSouthCaps: boolean;
  capHeight: number;
}

const DEFAULT_FAKE_GLOBE_CONFIG: FakeGlobeConfig = {
  enableHorizontalWrap: true,
  enableNorthSouthCaps: true,
  capHeight: 20
};
```

### TrueTopologyConfig
```typescript
interface TrueTopologyConfig {
  subdivisionLevel: SubdivisionLevel;
  preserveAxialCoords: boolean;
}

const DEFAULT_TRUE_TOPOLOGY_CONFIG: TrueTopologyConfig = {
  subdivisionLevel: 4,
  preserveAxialCoords: true
};
```

### Phase3Config
```typescript
interface Phase3Config {
  enable3D: boolean;
  defaultView: "FLAT" | "GLOBE";
  enableViewToggle: boolean;
}

const DEFAULT_PHASE_3_CONFIG: Phase3Config = {
  enable3D: true,
  defaultView: "GLOBE",
  enableViewToggle: true
};
```

### MigrationResult
```typescript
interface MigrationResult {
  success: boolean;
  phase: MigrationPhase;
  errors: string[];
  warnings: string[];
  migrated?: Map<CellID, Cell>;
  mapping?: Map<CellID, CellID>;
  unmapped?: CellID[];
}

type MigrationPhase = 1 | 2 | 3;
```

### SaveFormat
```typescript
interface SaveFormat {
  version: string;
  cellDataFormat: "FLAT_MAP" | "CELL_GRAPH" | "GLOBE";
  eventFormat: "FLAT_EVENTS" | "GLOBE_EVENTS";
}
```

### MigrationError
```typescript
interface MigrationError {
  phase: MigrationPhase;
  errorType: "SAVE_LOAD" | "DATA_CORRUPTION" | "ROLLBACK_FAILURE";
  message: string;
  details?: any;
}
```

---

## Testing Strategy

### Unit Tests

**Phase 1 Tests:**
- `FakeGlobeRenderer.getWrappedNeighbor()` - Test all 6 directions with wrapping
- `FakeGlobeRenderer.getCapCells()` - Test north/south cap identification
- `FakeGlobeRenderer.distortForCap()` - Test visual compression at different latitudes
- `FakeGlobeRenderer.getLatitude()` - Test latitude calculation

**Phase 2 Tests:**
- `TrueTopologyRenderer.migrateFromFlat()` - Test migration with various map sizes
- `TrueTopologyRenderer.findNearestCell()` - Test nearest neighbor algorithm
- `TrueTopologyRenderer.flatToSpherical()` - Test coordinate conversion
- Cell graph generation - Verify pentagon count and adjacency correctness

**Phase 3 Tests:**
- `Phase3Renderer.toggleView()` - Test view switching
- `Phase3Renderer.handleEvent()` - Test event handling in both views
- `Phase3Renderer.syncState()` - Verify state synchronization

**Migration Tests:**
- `executeMigration()` - Test full three-phase migration
- `detectSaveFormat()` - Test format detection for all versions
- `handleMigrationError()` - Test error handling for all error types
- `validateSaveData()` - Test save data validation

### Integration Tests

**Migration Flow:**
1. Load existing flat map save
2. Enable Phase 1 - verify wrapping and caps work
3. Migrate to Phase 2 - verify cell graph and migration
4. Enable Phase 3 - verify 3D rendering and view toggle
5. Test rollback at each phase

**Cross-Phase Tests:**
- Events work across all phases
- Inspector works across all phases
- Actions work across all phases
- Save/load works across all phases

**Rollback Tests:**
- Rollback from Phase 3 to Phase 2
- Rollback from Phase 2 to Phase 1
- Rollback after data corruption
- Rollback failure handling

### E2E Tests

**User Journey:**
1. User loads existing campaign (flat map)
2. User enables globe features (Phase 1)
3. User plays game with wrapping and caps
4. User migrates to true topology (Phase 2)
5. User enables 3D view (Phase 3)
6. User toggles between flat and globe views
7. User experiences issue and rolls back

**Performance Tests:**
- Phase 1 migration < 1 second
- Phase 2 migration < 5 seconds (large maps)
- Phase 3 migration < 10 seconds (with 3D data)
- Cell lookup O(1) performance
- Save validation < 100ms

### Performance Tests

**Migration Performance:**
```typescript
describe('Migration Performance', () => {
  it('Phase 1 migration completes in < 1s', async () => {
    const start = performance.now();
    await migratePhase1(largeFlatMap);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(1000);
  });

  it('Phase 2 migration completes in < 5s for large maps', async () => {
    const start = performance.now();
    await migratePhase2(largeFlatMap, subdivisionLevel4);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(5000);
  });

  it('Phase 3 migration completes in < 10s with 3D data', async () => {
    const start = performance.now();
    await migratePhase3(cellGraph);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(10000);
  });
});
```

**Runtime Performance:**
```typescript
describe('Runtime Performance', () => {
  it('Cell lookup is O(1)', () => {
    const cells = new Map(/* 10000 cells */);
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      cells.get(`cell_${i}`);
    }
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(10); // Very fast
  });

  it('Save validation completes in < 100ms', () => {
    const saveData = generateLargeSave();
    const start = performance.now();
    validateSaveData(saveData);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });
});
```

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── migration/
│   │   ├── phase1/
│   │   │   ├── fake-globe-renderer.test.ts
│   │   │   ├── horizontal-wrap.test.ts
│   │   │   └── cap-distortion.test.ts
│   │   ├── phase2/
│   │   │   ├── true-topology-renderer.test.ts
│   │   │   ├── cell-graph-generation.test.ts
│   │   │   └── flat-to-globe-migration.test.ts
│   │   ├── phase3/
│   │   │   ├── phase3-renderer.test.ts
│   │   │   ├── view-toggle.test.ts
│   │   │   └── shared-state.test.ts
│   │   └── common/
│   │       ├── migration-strategy.test.ts
│   │       ├── save-format-detection.test.ts
│   │       └── error-handling.test.ts
│   └── performance/
│       ├── migration-performance.test.ts
│       └── runtime-performance.test.ts
├── integration/
│   ├── full-migration-flow.test.ts
│   ├── cross-phase-events.test.ts
│   └── rollback-tests.test.ts
└── e2e/
    ├── user-journey-migration.test.ts
    └── performance-benchmarks.test.ts
```

### Naming Conventions

**Test Files:**
- Unit tests: `{feature}.test.ts`
- Integration tests: `{feature}-integration.test.ts`
- E2E tests: `{scenario}-e2e.test.ts`

**Test Suites:**
- `describe('{Feature}', () => { ... })`
- `describe('{Feature} - {Scenario}', () => { ... })`

**Test Cases:**
- `it('should {expected behavior}', () => { ... })`
- `it('should {expected behavior} when {condition}', () => { ... })`

**Fixtures:**
- `fixtures/{feature}/{fixture-name}.ts`
- Example: `fixtures/migration/flat-map-small.ts`

---

## Mock Data

### Sample Flat Map
```typescript
export const SAMPLE_FLAT_MAP: Map<CellID, Cell> = new Map([
  ["h:0:0", {
    id: "h:0:0",
    kind: "HEX",
    axial: { q: 0, r: 0 },
    center: [0, 0, 0],
    terrain: "PLAIN",
    elevation: 0,
    moisture: 50,
    neighbors: ["h:1:0", "h:0:1", "h:-1:1", "h:-1:0", "h:0:-1", "h:1:-1"]
  }],
  ["h:1:0", {
    id: "h:1:0",
    kind: "HEX",
    axial: { q: 1, r: 0 },
    center: [1, 0, 0],
    terrain: "FOREST",
    elevation: 100,
    moisture: 70,
    neighbors: ["h:2:0", "h:1:1", "h:0:1", "h:0:0", "h:1:-1", "h:2:-1"]
  }]
]);
```

### Sample Globe Cells
```typescript
export const SAMPLE_GLOBE_CELLS: Map<CellID, Cell> = new Map([
  ["g:1", {
    id: "g:1",
    kind: "PENTAGON",
    center: [0, 0, 1],
    terrain: "PLAIN",
    elevation: 0,
    moisture: 50,
    neighbors: ["g:2", "g:3", "g:4", "g:5", "g:6"]
  }],
  ["g:2", {
    id: "g:2",
    kind: "HEX",
    center: [0.5, 0.866, 0],
    terrain: "MOUNTAIN",
    elevation: 500,
    moisture: 30,
    neighbors: ["g:1", "g:3", "g:7", "g:8", "g:9", "g:10"]
  }]
]);
```

### Sample Save Data
```typescript
export const SAMPLE_SAVE_V1 = {
  version: "1.0",
  cells: Array.from(SAMPLE_FLAT_MAP.values()),
  events: [
    {
      id: "evt_001",
      type: "FOUND_CITY",
      timestamp: 10,
      cellId: "h:0:0",
      data: { name: "Ashkel" }
    }
  ]
};

export const SAMPLE_SAVE_V2 = {
  version: "2.0",
  cellDataFormat: "GLOBE",
  eventFormat: "GLOBE_EVENTS",
  cells: Array.from(SAMPLE_GLOBE_CELLS.values()),
  events: [
    {
      id: "evt_001",
      type: "FOUND_CITY",
      timestamp: 10,
      cellId: "g:1",
      data: { name: "Ashkel" }
    }
  ]
};
```

---

## Test Utilities

### Migration Test Helpers
```typescript
export async function migratePhase1(
  flatMap: Map<CellID, Cell>,
  config: FakeGlobeConfig = DEFAULT_FAKE_GLOBE_CONFIG
): Promise<MigrationResult> {
  const renderer = new FakeGlobeRenderer(flatMap, config);
  return {
    success: true,
    phase: 1,
    errors: [],
    warnings: []
  };
}

export async function migratePhase2(
  flatMap: Map<CellID, Cell>,
  config: TrueTopologyConfig = DEFAULT_TRUE_TOPOLOGY_CONFIG
): Promise<MigrationResult> {
  const renderer = new TrueTopologyRenderer(config);
  return renderer.migrateFromFlat(flatMap);
}

export async function migratePhase3(
  cells: Map<CellID, Cell>,
  config: Phase3Config = DEFAULT_PHASE_3_CONFIG
): Promise<MigrationResult> {
  return {
    success: true,
    phase: 3,
    errors: [],
    warnings: []
  };
}
```

### Performance Test Helpers
```typescript
export function measurePerformance<T>(
  fn: () => T,
  maxDuration: number
): { result: T; duration: number } {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  return { result, duration };
}

export async function measureAsyncPerformance<T>(
  fn: () => Promise<T>,
  maxDuration: number
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}
```

### Assertion Helpers
```typescript
export function expectMigrationSuccess(result: MigrationResult) {
  expect(result.success).toBe(true);
  expect(result.errors).toHaveLength(0);
}

export function expectMigrationFailure(result: MigrationResult) {
  expect(result.success).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
}

export function expectPentagonCount(cells: Map<CellID, Cell>, expected: number) {
  const pentagons = Array.from(cells.values()).filter(c => c.kind === "PENTAGON");
  expect(pentagons.length).toBe(expected);
}
```

---

## Coverage Goals

### Phase 1 Coverage
- Horizontal wrapping: 100%
- North/south caps: 100%
- Cap distortion: 100%
- Backward compatibility: 100%

### Phase 2 Coverage
- Cell graph generation: 100%
- Flat to globe migration: 100%
- Axial coordinate preservation: 100%
- Neighbor lookup: 100%

### Phase 3 Coverage
- 3D rendering: 90% (Three.js integration)
- View toggle: 100%
- Shared state: 100%

### Migration Coverage
- Migration strategy: 100%
- Save format detection: 100%
- Error handling: 100%
- Rollback: 100%

### Performance Coverage
- Migration performance: 100%
- Runtime performance: 100%

---

## Notes

1. **Three.js Integration**: Phase 3 tests may need to mock Three.js for unit tests, but should use actual Three.js for integration tests.

2. **Large Map Testing**: Performance tests should use realistic map sizes (1000+ cells) to validate performance requirements.

3. **Browser Testing**: 3D rendering tests should run in actual browser environments (via Playwright or similar) for accurate performance measurement.

4. **Backup Testing**: Rollback tests should verify that backup files are created correctly and can be restored.

5. **Version Compatibility**: Save format detection tests should include edge cases like missing version fields and unknown versions.

6. **Visual Testing**: Cap distortion and 3D rendering may benefit from visual regression testing to ensure correct appearance.

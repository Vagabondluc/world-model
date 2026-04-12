---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# TDD: Globe Scale System

## Specification Reference
- Spec: [`032-globe-scale-system.md`](../specs/032-globe-scale-system.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: Region Creation
**Given** anchor hexes are selected
**When** regions are created
**Then** each region must have valid ID, scale, and member hexes

### AC-002: Anchor Selection
**Given** a scale level and cells
**When** anchors are selected
**Then** anchors must be at minimum distance apart

### AC-003: Hex Assignment
**Given** regions are created
**When** hexes are assigned
**Then** each hex must be assigned to nearest region

### AC-004: Region Center Calculation
**Given** a region with member hexes
**When** center is calculated
**Then** center must be on sphere surface

### AC-005: Region Area Calculation
**Given** a region with member hexes
**When** area is calculated
**Then** area must be sum of hex areas

### AC-006: Region Neighbor Finding
**Given** regions are created
**When** neighbors are requested
**Then** adjacent regions must be returned

### AC-007: Scale Hierarchy Building
**Given** all regions at all scales
**When** hierarchy is built
**Then** parent-child relationships must be correct

### AC-008: Scale-Based Rendering
**Given** a zoom level
**When** rendering is requested
**Then** appropriate scale must be used

### AC-009: Region Naming
**Given** a region
**When** name is generated
**Then** name must follow naming convention

---

## Test Cases

### AC-001: Region Creation

#### TC-001-001: Happy Path - Create S0 Regions
**Input**:
```typescript
{
  cells: [/* all cells */],
  config: { scale: 0, minDistance: 1 }
}
```
**Expected**: Each cell assigned to S0 region
**Priority**: P0

#### TC-001-002: Happy Path - Create S1 Regions
**Input**:
```typescript
{
  cells: [/* all cells */],
  config: { scale: 1, minDistance: 3 }
}
```
**Expected**: 7-hex clusters created as S1 regions
**Priority**: P0

#### TC-001-003: Happy Path - Create S2 Regions
**Input**:
```typescript
{
  cells: [/* all cells */],
  config: { scale: 2, minDistance: 8 }
}
```
**Expected**: 49-hex clusters created as S2 regions
**Priority**: P0

#### TC-001-004: Edge Case - Invalid Scale
**Input**:
```typescript
{
  cells: [/* all cells */],
  config: { scale: 5 } // Invalid
}
```
**Expected**: Error thrown, scale must be 0-4
**Priority**: P0

#### TC-001-005: Integration - Create All Scales
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: S0, S1, S2, S3 regions created
**Priority**: P0

---

### AC-002: Anchor Selection

#### TC-002-001: Happy Path - Select S0 Anchors
**Input**:
```typescript
{
  cells: [/* all cells */],
  config: { scale: 0, minDistance: 1 }
}
```
**Expected**: 132 anchors selected (one per cell)
**Priority**: P0

#### TC-002-002: Happy Path - Select S1 Anchors
**Input**:
```typescript
{
  cells: [/* all cells */],
  config: { scale: 1, minDistance: 3 }
}
```
**Expected**: Approximately 19 anchors selected
**Priority**: P0

#### TC-002-003: Edge Case - All Cells Same Distance
**Input**:
```typescript
{
  cells: [/* all cells at same distance */]
}
```
**Expected**: Deterministic tie-breaking
**Priority**: P1

#### TC-002-004: Integration - Anchor Selection with Existing Regions
**Input**:
```typescript
{
  cells: [/* all cells */],
  existingRegions: [/* S0 regions */]
}
```
**Expected**: New anchors selected, existing preserved
**Priority**: P0

---

### AC-003: Hex Assignment

#### TC-003-001: Happy Path - Assign Hexes to Nearest Region
**Input**:
```typescript
{
  cells: [/* all cells */],
  regions: [/* S1 regions */]
}
```
**Expected**: Each hex assigned to nearest S1 region
**Priority**: P0

#### TC-003-002: Happy Path - Assign Hexes Across Scales
**Input**:
```typescript
{
  cells: [/* all cells */],
  regions: { S0: [], S1: [], S2: [], S3: [] }
}
```
**Expected**: All hexes assigned to appropriate scale
**Priority**: P0

#### TC-003-003: Edge Case - No Regions Available
**Input**:
```typescript
{
  cells: [/* all cells */],
  regions: {}
}
```
**Expected**: Error thrown, regions required
**Priority**: P0

#### TC-003-004: Integration - All Hexes Assigned
**Input**:
```typescript
{
  cells: [/* all cells */],
  regions: [/* all scales */]
}
```
**Expected**: All hexes assigned to regions
**Priority**: P0

---

### AC-004: Region Center Calculation

#### TC-004-001: Happy Path - Calculate S0 Region Center
**Input**:
```typescript
{
  region: {
    id: "r0:c:0:0:0",
    scale: 0,
    memberHexes: ["c:0:0:0"]
  }
}
```
**Expected**: Center = cell center
**Priority**: P0

#### TC-004-002: Happy Path - Calculate S1 Region Center
**Input**:
```typescript
{
  region: {
    id: "r1:c:0:5:3",
    scale: 1,
    memberHexes: ["c:0:5:3", "c:0:6:3", /* ... 7 hexes */]
  }
}
```
**Expected**: Center = average of hex centers
**Priority**: P0

#### TC-004-003: Edge Case - Empty Region
**Input**:
```typescript
{
  region: {
    id: "r0:c:0:0:0",
    scale: 0,
    memberHexes: []
  }
}
```
**Expected**: Error thrown, region must have hexes
**Priority**: P0

#### TC-004-004: Integration - All Region Centers
**Input**:
```typescript
{
  regions: [/* all regions */]
}
```
**Expected**: All region centers calculated
**Priority**: P0

---

### AC-005: Region Area Calculation

#### TC-005-001: Happy Path - Calculate S0 Region Area
**Input**:
```typescript
{
  region: {
    id: "r0:c:0:0:0",
    scale: 0,
    memberHexes: ["c:0:0:0"]
  }
}
```
**Expected**: Area = hex area
**Priority**: P0

#### TC-005-002: Happy Path - Calculate S1 Region Area
**Input**:
```typescript
{
  region: {
    id: "r1:c:0:5:3",
    scale: 1,
    memberHexes: ["c:0:5:3", /* ... 7 hexes */]
  }
}
```
**Expected**: Area = sum of 7 hex areas
**Priority**: P0

#### TC-005-003: Edge Case - Hex with Zero Area
**Input**:
```typescript
{
  region: {
    memberHexes: ["c:0:0:0"],
    cells: [/* cells with areas */]
  }
}
```
**Expected**: Region area = 0, warning logged
**Priority**: P1

#### TC-005-004: Integration - Total S4 Region Area
**Input**:
```typescript
{
  region: {
    id: "r4:planetary",
    scale: 4,
    memberHexes: [/* all cells */]
  }
}
```
**Expected**: Area = sphere surface area
**Priority**: P0

---

### AC-006: Region Neighbor Finding

#### TC-006-001: Happy Path - Find S0 Region Neighbors
**Input**:
```typescript
{
  region: {
    id: "r0:c:0:0:0",
    memberHexes: ["c:0:0:0", "c:0:1:0", "c:1:0:0"]
  },
  allRegions: [/* all regions */]
}
```
**Expected**: 6 neighboring regions returned
**Priority**: P0

#### TC-006-002: Happy Path - Find S1 Region Neighbors
**Input**:
```typescript
{
  region: {
    id: "r1:c:0:5:3",
    memberHexes: ["c:0:5:3", /* ... */]
  },
  allRegions: [/* all regions */]
}
```
**Expected**: Adjacent regions returned
**Priority**: P0

#### TC-006-003: Edge Case - No Neighbors
**Input**:
```typescript
{
  region: {
    id: "r0:c:0:0:0",
    memberHexes: ["c:0:0:0"]
  },
  allRegions: [/* all regions */]
}
```
**Expected**: Empty neighbor list returned
**Priority**: P1

#### TC-006-004: Integration - Region Adjacency Graph
**Input**:
```typescript
{
  regions: [/* all regions */]
}
```
**Expected**: Adjacency graph built
**Priority**: P0

---

### AC-007: Scale Hierarchy Building

#### TC-007-001: Happy Path - Build Hierarchy
**Input**:
```typescript
{
  s0Regions: [/* S0 regions */],
  s1Regions: [/* S1 regions */],
  s2Regions: [/* S2 regions */],
  s3Regions: [/* S3 regions */],
  s4Region: { /* S4 region */ }
}
```
**Expected**: Parent-child relationships established
**Priority**: P0

#### TC-007-002: Happy Path - Find Parent Region
**Input**:
```typescript
{
  region: {
    id: "r1:c:0:5:3",
    scale: 1
  },
  allRegions: [/* all regions */]
}
```
**Expected**: Parent = r0:c:0:0:0
**Priority**: P0

#### TC-007-003: Happy Path - Find Child Regions
**Input**:
```typescript
{
  region: {
    id: "r0:c:0:0:0",
    scale: 0
  },
  allRegions: [/* all regions */]
}
```
**Expected**: Children = all S1 regions
**Priority**: P0

#### TC-007-004: Edge Case - Orphan Region
**Input**:
```typescript
{
  region: {
    id: "r2:c:0:5:3",
    scale: 2,
    memberHexes: [/* hexes */]
  },
  allRegions: [/* all regions except S0 */]
}
```
**Expected**: Error thrown, S2 region has no parent
**Priority**: P0

#### TC-007-005: Integration - Complete Hierarchy
**Input**:
```typescript
{
  cells: [/* all cells */]
}
```
**Expected**: Full hierarchy with all scales
**Priority**: P0

---

### AC-008: Scale-Based Rendering

#### TC-008-001: Happy Path - Render S0 Scale
**Input**:
```typescript
{
  cameraDistance: 25,
  scale: 0
}
```
**Expected**: S0 cells rendered
**Priority**: P0

#### TC-008-002: Happy Path - Render S1 Scale
**Input**:
```typescript
{
  cameraDistance: 100,
  scale: 1
}
```
**Expected**: S1 regions rendered
**Priority**: P0

#### TC-008-003: Happy Path - Render S2 Scale
**Input**:
```typescript
{
  cameraDistance: 200,
  scale: 2
}
```
**Expected**: S2 regions rendered
**Priority**: P0

#### TC-008-004: Edge Case - Invalid Scale for Distance
**Input**:
```typescript
{
  cameraDistance: 150,
  scale: 5
}
```
**Expected**: S4 region rendered (no scale 5)
**Priority**: P0

#### TC-008-005: Integration - Scale Transition
**Input**:
```typescript
{
  cameraDistance: 50,
  fromScale: 1,
  toScale: 2
}
```
**Expected**: Appropriate scale used
**Priority**: P0

---

### AC-009: Region Naming

#### TC-009-001: Happy Path - Generate S0 Region Name
**Input**:
```typescript
{
  region: {
    id: "r0:c:0:0:0",
    scale: 0,
    anchorHex: { id: "c:0:0:0" }
  }
}
```
**Expected**: Name = "Tactical c:0:0:0"
**Priority**: P0

#### TC-009-002: Happy Path - Generate S1 Region Name
**Input**:
```typescript
{
  region: {
    id: "r1:c:0:5:3",
    scale: 1,
    anchorHex: { id: "c:0:5:3" }
  }
}
```
**Expected**: Name = "Local Northern 1"
**Priority**: P0

#### TC-009-003: Happy Path - Generate S3 Region Name
**Input**:
```typescript
{
  region: {
    id: "r3:c:0:10:5",
    scale: 3,
    anchorHex: { id: "c:0:10:5" }
  }
}
```
**Expected**: Name = "Continental 3"
**Priority**: P0

#### TC-009-004: Edge Case - Generate S4 Region Name
**Input**:
```typescript
{
  region: {
    id: "r4:planetary",
    scale: 4
  }
}
```
**Expected**: Name = "The World"
**Priority**: P0

#### TC-009-005: Integration - All Region Names
**Input**:
```typescript
{
  regions: [/* all regions */]
}
```
**Expected**: All regions named according to convention
**Priority**: P0

---

## Test Data

### Sample Region
```typescript
const SAMPLE_REGION: Region = {
  id: "r1:c:0:5:3",
  scale: 1,
  name: "Local Northern 1",
  anchorHex: "c:0:5:3",
  memberHexes: [
    "c:0:5:3",
    "c:0:6:3",
    "c:0:4:4",
    "c:0:5:2",
    "c:0:5:4",
    "c:1:5:3",
    "c:1:4:3"
    "c:1:5:2"
    "c:1:6:3"
    "c:1:6:2"
    "c:1:6:4"
  ],
  center: [0.455, 1.379, 1.618],
  area: 0.16,
  neighbors: ["r0:c:0:0:0", "r0:c:0:1:0", "r0:c:1:0:0", "r0:c:1:1:1", "r0:c:1:1:2", "r0:c:1:2:2"]
};
```

### Sample ScaleInfo
```typescript
const SCALE_INFO: Record<ScaleLevel, ScaleInfo> = {
  0: { level: 0, name: "Tactical", baseHexCount: 1, approximateSize: "3 miles", zoomLevel: 1.0 },
  1: { level: 1, name: "Local", baseHexCount: 7, approximateSize: "~10 miles", zoomLevel: 0.5 },
  2: { level: 2, name: "Regional", baseHexCount: 49, approximateSize: "~30 miles", zoomLevel: 0.25 },
  3: { level: 3, name: "Continental", baseHexCount: 343, approximateSize: "~100 miles", zoomLevel: 0.125 },
  4: { level: 4, name: "Planetary", baseHexCount: -1, approximateSize: "globe", zoomLevel: 0.0625 }
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test region creation
- Test anchor selection
- Test hex assignment
- Test region center calculation
- Test region area calculation
- Test region neighbor finding
- Test scale hierarchy building
- Test region naming
- Test scale-based rendering

### Integration Testing Approach
- Test full region creation pipeline
- Test anchor selection with existing regions
- Test hex assignment across scales
- Test region adjacency
- Test scale hierarchy
- Test region naming consistency
- Test scale transition

### End-to-End Testing Approach
- Test complete scale system setup
- Test multi-scale rendering
- Test region navigation
- Test zoom-based transitions
- Test region hierarchy queries

### Performance Testing Approach
- Test region creation with many cells
- Test anchor selection performance
- Test hex assignment performance
- Test neighbor lookup performance
- Test scale-based rendering performance
- Test hierarchy traversal performance

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── scale/
│   │   ├── RegionCreation.test.ts
│   │   ├── AnchorSelection.test.ts
│   │   ├── HexAssignment.test.ts
│   │   ├── RegionCenterCalculation.test.ts
│   │   ├── RegionAreaCalculation.test.ts
│   │   ├── RegionNeighborFinding.test.ts
│   │   ├── ScaleHierarchyBuilding.test.ts
│   │   ├── RegionNaming.test.ts
│   │   └── ScaleBasedRendering.test.ts
├── integration/
│   ├── scale/
│   │   ├── RegionCreationPipeline.test.ts
│   │   ├── AnchorSelectionIntegration.test.ts
│   │   ├── HexAssignmentIntegration.test.ts
│   │   ├── RegionAdjacency.test.ts
│   │   ├── ScaleHierarchyIntegration.test.ts
│   │   ├── ScaleBasedRendering.test.ts
│   │   └── RegionNamingIntegration.test.ts
└── e2e/
    ├── scale/
        │   ├── CompleteScaleSystemSetup.test.ts
        │   ├── MultiScaleRendering.test.ts
        │   ├── RegionNavigation.test.ts
        │   ├── ZoomBasedTransitions.test.ts
        │   └── RegionHierarchyQueries.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by scale component for unit tests
- Group by integration feature for integration tests
- Group by rendering scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases

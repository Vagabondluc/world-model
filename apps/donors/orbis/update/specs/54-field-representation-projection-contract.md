# 🔒 FIELD REPRESENTATION & PROJECTION CONTRACT v1.0

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Deterministic • Physics-First • Hybrid Architecture)

This specification defines the architectural separation between:
* **Continuous planet physics** (mathematical state representation)
* **Numerical discretization** (simulation grid choice)
* **Rendering/projection layer** (view model and gameplay topology)

The canonical sphere discretization used in the engine is an **Icosahedral / hex sphere** (geodesic hexagonal grid, dual of a subdivided icosahedron). However, this grid is **not the physics**—it is a discretization strategy.

---

## 0️⃣ Overview

### Core Principle

The grid is a **discretization strategy**, not the physics itself. We decouple:

> **Mathematical state representation**
> from
> **Spatial projection / visualization topology**

This is the mature architecture that enables:
* Clean physics equations without grid artifacts
* Efficient numerical solvers on appropriate discretizations
* Beautiful, uniform gameplay topology for species migration and visualization
* No trade-offs between simulation accuracy and gameplay experience

### Key Distinction

There are three layers that must remain architecturally distinct:

1. **Continuous Planet Physics (conceptual)** — Mathematical field definitions
2. **Numerical Discretization (simulation grid)** — Internal solver choice
3. **Rendering / Gameplay Projection** — View model and gameplay topology

These layers do NOT need to be the same.

---

## 1️⃣ Clean Architecture Model

### Layer 1 — Continuous State (Abstract)

Planet state defined as continuous fields over spherical coordinates:

```ts
interface ContinuousFields {
  // Thermodynamic fields
  T: (theta: number, phi: number) => number      // Temperature K
  P: (theta: number, phi: number) => number      // Precipitation m/s
  A: (theta: number, phi: number) => number      // Albedo 0-1
  
  // Ecological fields
  B: (theta: number, phi: number) => number      // Biomass kg/m²
  Si: (theta: number, phi: number) => number[]   // Species densities
  
  // Surface properties
  E: (theta: number, phi: number) => number      // Elevation m
  I: (theta: number, phi: number) => number      // Ice fraction 0-1
}
```

Where:
* `theta` = latitude (radians, -π/2 to π/2)
* `phi` = longitude (radians, 0 to 2π)

These fields are conceptually continuous—discretization happens at the solver layer.

### Layer 2 — Simulation Discretization (Internal)

This is where we choose the numerical representation. This is an **internal choice** and does not need to match visuals.

Supported discretization strategies:

```ts
type DiscretizationStrategy =
  | "lat_lon_grid"           // Regular lat/lon grid
  | "icosahedral_grid"       // Geodesic hex sphere
  | "spectral_harmonics"     // Spherical harmonics basis
  | "zonal_bands"           // 1D latitude bands
  | "hybrid_bands_diffusion" // Zonal bands + lateral diffusion
```

This choice is a **solver implementation detail** and can be changed without affecting:
* The continuous field definitions
* The projection layer
* The gameplay topology

### Layer 3 — Projection Layer (View Model)

We map simulation cells to the gameplay topology:

```ts
interface ProjectionLayer {
  // Topology choice
  topology: "hex_sphere" | "voxel_grid" | "chunked_terrain"
  
  // Mapping from simulation space to gameplay space
  mapToSurfaceCells: (simSpace: SimCell[]) => SurfaceCell[]
  
  // Area normalization
  normalizeAreas: (cells: SurfaceCell[]) => SurfaceCell[]
  
  // Conservation enforcement
  enforceConservation: (fields: FieldState) => FieldState
}
```

The projection layer can use:
* Hex tiles (canonical choice for gameplay)
* Regions
* Biomes
* Encounter zones
* Player map

---

## 2️⃣ Hybrid Approach (Canonical Implementation)

### Architecture Decision

The canonical implementation uses a **hybrid approach**:

* **Keep**: Icosahedral hex sphere as visual/gameplay topology
* **Compute**: Climate using latitude band energy balance internally
* **Project**: Band results onto hex cells by area-weighted interpolation

This is common in scientific modeling:
* Coarse climate solver (zonal bands)
* Fine surface representation (hex sphere)

### Why This Works

**Physics benefits:**
* ✅ Clean snowball Earth math
* ✅ Easy albedo band logic
* ✅ Elegant ice-edge hysteresis
* ✅ Efficient mixing math
* ✅ Vector-friendly operations

**Gameplay benefits:**
* ✅ Clean adjacency for species migration
* ✅ Beautiful uniform map
* ✅ Consistent cell areas
* ✅ Clean neighbor graph
* ✅ No polar distortion

**No trade-off.**

### Implementation Pattern

```ts
// Step 1: Solve climate in band space
const bandState = climateSolver.solve(bandGrid);

// Step 2: Project band values to hex cells
const hexState = projection.project(bandState, hexGrid);

// Step 3: Enforce conservation
const finalState = conservation.enforce(hexState);
```

---

## 3️⃣ Field Projection Contract

### 3.1 Mapping Definition

The projection contract defines how continuous or zonal values map to surface cells:

```ts
interface ProjectionContract {
  // Area-weighted interpolation from bands to cells
  interpolateBandToCell: (
    bandValue: number,
    bandArea: number,
    cellArea: number,
    overlapFraction: number
  ) => number
  
  // Cell area normalization
  normalizeCellArea: (cell: SurfaceCell) => number
  
  // Conservation enforcement
  enforceEnergyConservation: (fields: FieldState) => FieldState
  enforceMassConservation: (fields: FieldState) => FieldState
  enforceIceConservation: (fields: FieldState) => FieldState
}
```

### 3.2 Area-Weighted Interpolation

For each surface cell, compute interpolated values from overlapping latitude bands:

```ts
function interpolateBandToCell(
  cell: SurfaceCell,
  bands: Band[]
): CellValues {
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const band of bands) {
    const overlap = calculateOverlap(cell, band);
    const weight = overlap * band.areaWeight;
    
    weightedSum += band.value * weight;
    totalWeight += weight;
  }
  
  return weightedSum / totalWeight;
}
```

### 3.3 Cell Area Normalization

All cell areas must be normalized to ensure consistent flux calculations:

```ts
function normalizeCellArea(
  cell: SurfaceCell,
  totalPlanetArea: number
): SurfaceCell {
  
  const normalizedArea = cell.area / totalPlanetArea;
  
  return {
    ...cell,
    normalizedArea,
    // Scale fluxes by normalized area
    flux: cell.flux * normalizedArea
  };
}
```

---

## 4️⃣ Conservation Constraints

### 4.1 Energy Conservation

Total planetary energy must be conserved across projections:

```ts
interface EnergyConservation {
  // Verify energy conservation
  verify: (before: FieldState, after: FieldState) => boolean
  
  // Enforce energy conservation
  enforce: (fields: FieldState) => FieldState
  
  // Calculate total energy
  totalEnergy: (fields: FieldState) => number
}

function totalEnergy(fields: FieldState): number {
  let sum = 0;
  
  for (const cell of fields.cells) {
    // E = C * T (simplified)
    sum += cell.heatCapacity * cell.temperature * cell.area;
  }
  
  return sum;
}
```

### 4.2 Mass/Biomass Conservation

Total biomass must be conserved (except for growth/death processes):

```ts
interface MassConservation {
  // Verify mass conservation
  verify: (before: FieldState, after: FieldState) => boolean
  
  // Enforce mass conservation
  enforce: (fields: FieldState) => FieldState
  
  // Calculate total biomass
  totalBiomass: (fields: FieldState) => number
}

function totalBiomass(fields: FieldState): number {
  let sum = 0;
  
  for (const cell of fields.cells) {
    sum += cell.biomass * cell.area;
  }
  
  return sum;
}
```

### 4.3 Ice Fraction Conservation

Ice fraction must integrate correctly over surface area:

```ts
interface IceConservation {
  // Verify ice conservation
  verify: (before: FieldState, after: FieldState) => boolean
  
  // Enforce ice conservation
  enforce: (fields: FieldState) => FieldState
  
  // Calculate global ice fraction
  globalIceFraction: (fields: FieldState) => number
}

function globalIceFraction(fields: FieldState): number {
  let iceArea = 0;
  let totalArea = 0;
  
  for (const cell of fields.cells) {
    iceArea += cell.iceFraction * cell.area;
    totalArea += cell.area;
  }
  
  return iceArea / totalArea;
}
```

### 4.4 Diffusion Consistency

Diffusion operators must be consistent across projections:

```ts
interface DiffusionConsistency {
  // Apply diffusion in solver space
  applyInSolverSpace: (fields: FieldState) => FieldState
  
  // Project diffused fields to cell space
  projectToCellSpace: (fields: FieldState) => FieldState
  
  // Verify diffusion preserves conservation laws
  verifyConservation: (before: FieldState, after: FieldState) => boolean
}
```

---

## 5️⃣ Solver Basis

### 5.1 Band Space Fields

The following fields live primarily in **band space** (zonal discretization):

```ts
interface BandSpaceFields {
  // Thermodynamic fields
  bandTemperature: Float32Array      // K, per band
  bandAlbedo: Float32Array           // 0-1, per band
  bandIceFraction: Float32Array      // 0-1, per band
  
  // Solar forcing
  bandInsolation: Float32Array       // W/m², per band
  
  // Transport
  bandHeatFlux: Float32Array         // W/m², per band
}
```

These fields are computed using:
* 1D energy balance equations
* Zonal diffusion operators
* Temperature-dependent albedo with hysteresis

### 5.2 Cell Space Fields

The following fields live primarily in **cell space** (hex sphere discretization):

```ts
interface CellSpaceFields {
  // Surface properties
  cellElevation: Float32Array        // m, per cell
  cellSlope: Float32Array            // radians, per cell
  cellAspect: Float32Array           // radians, per cell
  
  // Ecological fields
  cellBiomass: Float32Array          // kg/m², per cell
  cellSpeciesDensity: Float32Array[] // per species, per cell
  
  // Biome classification
  cellBiomeType: Uint16Array         // biome ID, per cell
  cellTags: TagInstance[][]          // per cell
}
```

These fields are computed using:
* Surface elevation and terrain data
* Local ecological processes
* Biome classification rules

### 5.3 Hybrid Fields

The following fields require **hybrid computation** (both band and cell space):

```ts
interface HybridFields {
  // Temperature: computed in bands, projected to cells
  cellTemperature: Float32Array      // K, per cell
  
  // Precipitation: computed in bands, modified by terrain
  cellPrecipitation: Float32Array    // m/s, per cell
  
  // Ice: computed in bands, refined by elevation
  cellIceFraction: Float32Array      // 0-1, per cell
}
```

These fields follow the pattern:
1. Compute base value in band space
2. Project to cell space via area-weighted interpolation
3. Apply local modifiers (elevation, terrain, etc.)
4. Enforce conservation constraints

---

## 6️⃣ Data Structures

### 6.1 Band Definition

```ts
interface Band {
  bandId: uint16
  
  // Geometry
  latCenter: number          // radians
  latMin: number             // radians
  latMax: number             // radians
  area: number               // m²
  areaWeight: number         // fraction of total surface
  
  // Climate state
  temperature: number        // K
  albedo: number             // 0-1
  iceFraction: number        // 0-1
  insolation: number         // W/m²
  
  // Transport
  heatFlux: number           // W/m²
}
```

### 6.2 Surface Cell Definition

```ts
interface SurfaceCell {
  cellId: uint64
  
  // Geometry (hex sphere)
  centerLat: number          // radians
  centerLon: number          // radians
  area: number               // m²
  normalizedArea: number     // fraction of total surface
  
  // Neighbors
  neighborCellIds: uint64[]  // adjacent cells
  
  // Climate state (projected)
  temperature: number       // K
  precipitation: number     // m/s
  albedo: number             // 0-1
  iceFraction: number        // 0-1
  
  // Surface properties
  elevation: number          // m
  slope: number              // radians
  aspect: number             // radians
  
  // Ecological state
  biomass: number            // kg/m²
  speciesDensities: number[] // per species
  
  // Biome classification
  biomeTypeId: uint16
  tags: TagInstance[]
}
```

### 6.3 Field State

```ts
interface FieldState {
  // Band space
  bands: Band[]
  
  // Cell space
  cells: SurfaceCell[]
  
  // Conservation tracking
  totalEnergy: number
  totalBiomass: number
  globalIceFraction: number
  
  // Metadata
  version: string
  lastUpdated: AbsTime
}
```

---

## 7️⃣ Implementation Guidelines

### 7.1 Separation of Concerns

Each layer must remain independent:

```ts
// Climate solver (Layer 2) - knows only about bands
class ClimateSolver {
  solve(bands: Band[]): Band[] {
    // Pure band-based computation
    // No knowledge of hex cells
  }
}

// Projection layer (Layer 3) - knows about both
class ProjectionLayer {
  project(bands: Band[], cells: SurfaceCell[]): SurfaceCell[] {
    // Map band values to cells
    // Enforce conservation
  }
}

// View model (Layer 3) - knows only about cells
class ViewModel {
  render(cells: SurfaceCell[]): void {
    // Visualize hex sphere
    // No knowledge of bands
  }
}
```

### 7.2 Determinism Requirements

All projections must be deterministic:

```ts
function projectDeterministically(
  bands: Band[],
  cells: SurfaceCell[],
  seed: number
): SurfaceCell[] {
  
  // Process cells in consistent order
  const sortedCells = [...cells].sort((a, b) => 
    a.cellId - b.cellId
  );
  
  // Use seeded interpolation
  return sortedCells.map(cell => 
    interpolateCellFromBands(cell, bands, seed)
  );
}
```

### 7.3 Performance Considerations

```ts
// Use Structure-of-Arrays for band data
interface BandStateSoA {
  bandIds: Uint16Array
  temperatures: Float32Array
  albedos: Float32Array
  iceFractions: Float32Array
  insolation: Float32Array
}

// Use Structure-of-Arrays for cell data
interface CellStateSoA {
  cellIds: Uint64Array
  temperatures: Float32Array
  precipitations: Float32Array
  biomass: Float32Array
}
```

---

## 8️⃣ Integration Points

### 8.1 Climate System

Climate engine computes band-space fields:

```ts
// See: docs/03-climate-system.md
const bandState = climateSystem.update(bandGrid);
```

### 8.2 Voxel Projection

Voxel system uses cell-space fields for vertical projection:

```ts
// See: docs/23-voxel-projection.md
const voxelColumns = voxelSystem.project(cellState);
```

### 8.3 Spatial Query System

Spatial queries operate on cell-space topology:

```ts
// See: docs/53-spatial-query-biome-region-tagging.md
const neighbors = spatialQuery.getNeighborCells(cellId);
```

---

## 9️⃣ Testing Requirements

### 9.1 Conservation Tests

```ts
test("energy is conserved across projection", () => {
  const before = createFieldState();
  const after = projection.project(before.bands, before.cells);
  
  expect(conservation.totalEnergy(before))
    .toBeCloseTo(conservation.totalEnergy(after));
});

test("biomass is conserved across projection", () => {
  const before = createFieldState();
  const after = projection.project(before.bands, before.cells);
  
  expect(conservation.totalBiomass(before))
    .toBeCloseTo(conservation.totalBiomass(after));
});
```

### 9.2 Determinism Tests

```ts
test("projection is deterministic", () => {
  const bands = createBands();
  const cells = createCells();
  
  const result1 = projection.project(bands, cells, seed);
  const result2 = projection.project(bands, cells, seed);
  
  expect(result1).toEqual(result2);
});
```

### 9.3 Interpolation Tests

```ts
test("area-weighted interpolation preserves totals", () => {
  const bands = createBands();
  const cells = createCells();
  
  const projected = projection.project(bands, cells);
  
  const bandTotal = bands.reduce((sum, b) => sum + b.value * b.area, 0);
  const cellTotal = cells.reduce((sum, c) => sum + c.value * c.area, 0);
  
  expect(bandTotal).toBeCloseTo(cellTotal);
});
```

---

## 🔟 Error Handling

### 10.1 Projection Errors

```ts
class ProjectionError extends Error {
  constructor(
    message: string,
    public details: {
      cellId?: uint64
      bandId?: uint16
      conservationViolation?: string
    }
  ) {
    super(message);
  }
}
```

### 10.2 Conservation Violations

```ts
function enforceConservation(fields: FieldState): FieldState {
  const energyBefore = conservation.totalEnergy(fields);
  const biomassBefore = conservation.totalBiomass(fields);
  
  // Apply projection
  const projected = projection.project(fields.bands, fields.cells);
  
  // Verify conservation
  const energyAfter = conservation.totalEnergy(projected);
  const biomassAfter = conservation.totalBiomass(projected);
  
  if (!isClose(energyBefore, energyAfter)) {
    throw new ProjectionError(
      "Energy conservation violated",
      { conservationViolation: "energy" }
    );
  }
  
  if (!isClose(biomassBefore, biomassAfter)) {
    throw new ProjectionError(
      "Biomass conservation violated",
      { conservationViolation: "biomass" }
    );
  }
  
  return projected;
}
```

---

## 1️⃣1️⃣ Migration Guide

### 11.1 From Single-Grid Architecture

**Before (single grid):**

```ts
// Everything lives on hex cells
const cells = hexGrid.cells;
cells.forEach(cell => {
  cell.temperature = computeTemperature(cell);
  cell.albedo = computeAlbedo(cell);
});
```

**After (hybrid architecture):**

```ts
// Climate in band space
const bands = bandGrid.bands;
bands.forEach(band => {
  band.temperature = climateSolver.computeTemperature(band);
});

// Project to cell space
const cells = projection.project(bands, hexGrid.cells);
```

### 11.2 From Direct Cell Access

**Before:**

```ts
// Direct cell access for climate
const cell = getCell(lat, lon);
const temp = cell.temperature;
const precip = cell.precipitation;
```

**After:**

```ts
// Access via appropriate layer
const band = getBandForLat(lat);
const bandTemp = band.temperature;

// Or access projected cell value
const cell = getCell(lat, lon);
const cellTemp = cell.temperature; // projected from band
```

---

## 1️⃣2️⃣ Future Extensions

### 12.1 Potential v2 Features

* Multi-scale projection (adaptive refinement)
* Spectral basis for high-resolution climates
* GPU-accelerated projection
* Dynamic topology changes

### 12.2 Backward Compatibility

Any v2 changes must:
* Maintain v1 projection contract
* Preserve v1 conservation guarantees
* Add new features via extension, not replacement

---

## Summary

This specification establishes the foundational architecture for separating continuous physics from numerical discretization and rendering projection:

* **Three-layer architecture** enables clean separation of concerns
* **Hybrid approach** provides physics accuracy and gameplay experience without trade-offs
* **Field projection contract** defines deterministic mapping between layers
* **Conservation constraints** guarantee physical consistency across projections
* **Solver basis** clarifies which fields live in which space

The canonical implementation uses:
* **Band space** for climate computation (1D energy balance, zonal diffusion)
* **Cell space** for gameplay topology (hex sphere, species migration, visualization)
* **Projection layer** to map between spaces while enforcing conservation

This architecture is the "architect's move" that makes the engine genuinely advanced—choosing "physics basis vs projection topology" rather than "Hex vs LatLon."

---

## Related Documentation

* [`docs/03-climate-system.md`](docs/03-climate-system.md) - Climate engine (band space computation)
* [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md) - Surface to volume projection
* [`docs/53-spatial-query-biome-region-tagging.md`](docs/53-spatial-query-biome-region-tagging.md) - Spatial query API (cell space)


## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

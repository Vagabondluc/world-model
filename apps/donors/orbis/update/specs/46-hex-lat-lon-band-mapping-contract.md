# 🔒 HEX → LAT/LON BAND MAPPING CONTRACT v1

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Deterministic • Climate-Hex Integration • Projection-Based)

This specification defines the mapping between hexagonal surface cells and latitude/longitude bands for climate computation. It enables latitude-first climate physics (EBM bands, snowball Earth, ice-albedo hysteresis) while maintaining hex cells as the canonical world topology for migration, tectonics, and rivers.

---

## 0️⃣ Overview

### Core Principle

The mapping is a **projection layer**, not a change in world topology. We maintain:

> **Hex cells as world topology** (neighbors, migration, tectonics, rivers)
>
> **Latitude bands as climate discretization** (EBM physics, diffusion, albedo)

This projection-based approach enables:
- Clean latitude-first climate math without inventing "fake latitude rings" on the hex mesh
- Deterministic, reproducible results from baked cell data
- Fast zonal aggregation for climate operations
- Consistent visualization across band graphs and cell maps

### Key Distinction

There are two distinct spatial representations:

1. **Hex Grid** — Canonical surface topology for gameplay systems
2. **Latitude Bands** — Climate discretization for physics operations

The mapping between them is precomputed once per mesh configuration and remains deterministic.

---

## 1️⃣ Precomputed Per-Cell Data

### 1.1 Cell Attributes

For each cell `c` (hex or pentagon), the following attributes are precomputed once during mesh bake:

| Attribute | Type | Description |
|-----------|------|-------------|
| `centerVec` | `Vec3` (unit) | Center position on unit sphere |
| `latQ` | `int16` | Quantized latitude (degrees) |
| `lonQ` | `int16` | Quantized longitude (degrees) |
| `latBandId` | `uint16` | Latitude band index |
| `lonSliceId` | `uint16` | Longitude slice index |
| `areaWeightPPM` | `uint32` | Cell area / planet area (parts per million) |

### 1.2 Quantization Formulas

```ts
// Latitude band assignment
latBandId = floor((latQ + 90°) / bandHeight)

// Longitude slice assignment
lonSliceId = floor((lonQ + 180°) / sliceWidth)

// Area weight (quantized to PPM)
areaWeightPPM = floor((cellArea / planetArea) * 1_000_000)
```

Where:
- `bandHeight` = 180° / `numLatBands`
- `sliceWidth` = 360° / `numLonSlices` (optional, for 2D fields)

### 1.3 Compact Storage Format

Store as compact arrays indexed by `cellId`:

```ts
// Compact per-cell data structures
cellLatBand: Uint16Array    // cellId → latBandId
cellLonSlice: Uint16Array   // cellId → lonSliceId (optional)
cellAreaW: Uint32Array      // cellId → areaWeightPPM
```

### 1.4 Determinism Rules

- All floats are used **only during mesh bake**
- Runtime uses only fixed-point integer arithmetic
- `centerVec` is the single source of truth for band assignment
- Band membership never changes unless mesh configuration changes

---

## 2️⃣ Zonal Aggregation Tables

### 2.1 Purpose

Precompute aggregation tables to enable fast climate operations on latitude bands without iterating over all cells.

### 2.2 Precomputed Tables

```ts
// Band-to-cell mapping
bandCells: Uint16Array[]       // latBandId → cellId[] (sorted)
bandAreaSumPPM: Uint32Array    // latBandId → total area (PPM)

// Optional 2D mapping for full lat/lon fields
bandSliceCells: Map<string, Uint16Array>  // "band,slice" → cellId[]
```

### 2.3 Sorting Invariant

All cell lists are stored sorted by `cellId`:

```ts
// Invariant: bandCells[b] is always sorted
assert(isSorted(bandCells[b]));
```

This ensures deterministic iteration order and reproducible results.

### 2.4 Benefits

- **Fast EBM operations**: Iterate only over cells in a band
- **Area-weighted reduction**: Precomputed area sums enable efficient averaging
- **Deterministic aggregation**: Sorted cell lists guarantee reproducible results

---

## 3️⃣ Projection Operators

### 3.1 Cell → Band (Reduce)

Converts a cell-space field to a band-space field using area-weighted averaging.

#### Formula

```
X_band[b] = Σ (X_cell[c] * areaW[c]) / Σ areaW[c]
           for c in bandCells[b]
```

#### Implementation

```ts
function reduceCellToBand(
  X_cell: Float32Array,      // cell-space field
  bandCells: Uint16Array[],  // precomputed cell lists
  cellAreaW: Uint32Array,    // precomputed area weights
  numBands: number
): Float32Array {
  const X_band = new Float32Array(numBands);

  for (let b = 0; b < numBands; b++) {
    let numerator = 0n;      // int64 for precision
    let denominator = 0n;

    for (const cellId of bandCells[b]) {
      numerator += BigInt(Math.round(X_cell[cellId] * 1_000_000)) * BigInt(cellAreaW[cellId]);
      denominator += BigInt(cellAreaW[cellId]);
    }

    // Quantize back to field scale
    X_band[b] = Number(numerator / denominator) / 1_000_000;
  }

  return X_band;
}
```

#### Fixed-Point Arithmetic

- Numerator and denominator use `int64` (BigInt in TypeScript)
- Intermediate values scaled to preserve precision
- Output quantized to target field scale

### 3.2 Band → Cell (Expand)

Converts a band-space field back to cell-space. Two safe options are available.

#### Option A: Piecewise-Constant (Default)

Fastest and most stable. Each cell receives the value of its containing band.

```ts
function expandBandToCellConstant(
  X_band: Float32Array,      // band-space field
  cellLatBand: Uint16Array,  // precomputed band IDs
  numCells: number
): Float32Array {
  const X_cell = new Float32Array(numCells);

  for (let c = 0; c < numCells; c++) {
    X_cell[c] = X_band[cellLatBand[c]];
  }

  return X_cell;
}
```

**Advantages:**
- Simple, fast, deterministic
- No interpolation artifacts
- Energy-conserving (area-weighted round-trip)

#### Option B: Linear Band Interpolation

Smoother gradients by interpolating between adjacent bands.

```ts
function expandBandToCellLinear(
  X_band: Float32Array,      // band-space field
  cellLatBand: Uint16Array,  // precomputed band IDs
  cellLatQ: Int16Array,      // quantized latitude
  bandHeight: number,        // degrees per band
  numCells: number
): Float32Array {
  const X_cell = new Float32Array(numCells);

  for (let c = 0; c < numCells; c++) {
    const bandId = cellLatBand[c];
    const latQ = cellLatQ[c];

    // Normalized position within band [0, 1]
    const bandLatMin = -90 + bandId * bandHeight;
    const t = (latQ - bandLatMin) / bandHeight;

    // Clamp to [0, 1]
    const tClamped = Math.max(0, Math.min(1, t));

    // Interpolate between current and next band
    const nextBandId = Math.min(bandId + 1, X_band.length - 1);
    X_cell[c] = X_band[bandId] * (1 - tClamped) + X_band[nextBandId] * tClamped;
  }

  return X_cell;
}
```

**Advantages:**
- Smoother visual gradients
- Still deterministic
- Uses quantized interpolation

**Trade-off:**
- Slightly more computation
- Potential for small energy drift (mitigate with periodic renormalization)

#### Selection Criteria

- **Choose Option A** if optimizing for correctness, determinism, and performance
- **Choose Option B** if visual smoothness is critical and energy conservation can be managed

**Lock one option** and use it consistently throughout the simulation.

---

## 4️⃣ Diffusion & Mixing in Band Space

### 4.1 Purpose

Energy Balance Models (EBMs) require latitudinal heat transport via diffusion. This operation is performed in band space for efficiency and simplicity.

### 4.2 Diffusion Formula

```
T_band[b] += k * (T_band[b-1] - T_band[b])
T_band[b] += k * (T_band[b+1] - T_band[b])
```

Where:
- `k` = diffusion coefficient (quantized)
- Boundary conditions handle poles (b=0 and b=N-1)

### 4.3 Implementation

```ts
function applyBandDiffusion(
  T_band: Float32Array,      // temperature by band
  k: number,                 // diffusion coefficient
  dt: number                 // time step
): Float32Array {
  const T_new = new Float32Array(T_band.length);
  const numBands = T_band.length;

  for (let b = 0; b < numBands; b++) {
    let flux = 0;

    // Diffusion from south neighbor
    if (b > 0) {
      flux += k * (T_band[b-1] - T_band[b]);
    }

    // Diffusion from north neighbor
    if (b < numBands - 1) {
      flux += k * (T_band[b+1] - T_band[b]);
    }

    T_new[b] = T_band[b] + flux * dt;
  }

  return T_new;
}
```

### 4.4 Advantages of Band-Space Diffusion

- **No fake latitude rings**: Diffusion operates on natural latitude bands
- **Fast computation**: O(N) complexity vs O(M) for hex cells (N << M)
- **Deterministic**: Simple, well-defined neighbor relationships
- **Physically accurate**: Matches standard EBM formulations

### 4.5 Workflow

1. Reduce cell temperature to bands: `T_band = reduce(T_cell)`
2. Apply diffusion: `T_band = diffuse(T_band, k, dt)`
3. Expand back to cells: `T_cell = expand(T_band)`

---

## 5️⃣ Determinism & Stability Rules

### 5.1 Core Invariants

| Invariant | Description |
|-----------|-------------|
| `latBandId` derived from `centerVec` only | Band assignment depends only on baked cell center |
| Band membership stable | Never changes unless mesh configuration changes |
| Cell lists sorted | `bandCells[b]` always sorted by `cellId` |
| Area-weighted reduction | All reductions use precomputed `areaWeightPPM` |
| Fixed-point runtime | No floating-point arithmetic at runtime |

### 5.2 Determinism Guarantees

Given the same:
- Mesh configuration (resolution, orientation)
- Seed for mesh generation
- Field values (initial state)

The mapping and all projections produce identical results across:
- Different runs
- Different platforms
- Different compilers

### 5.3 Stability Requirements

1. **Mesh Bake**: Compute all per-cell data once and serialize
2. **Immutable Mapping**: Never recompute band assignments at runtime
3. **Sorted Iteration**: Always iterate cell lists in sorted order
4. **Quantized Math**: Use fixed-point arithmetic for all reductions
5. **Consistent Expansion**: Lock one expansion method (constant or linear)

### 5.4 Validation

```ts
function validateMapping(
  cellLatBand: Uint16Array,
  bandCells: Uint16Array[],
  cellAreaW: Uint32Array,
  bandAreaSumPPM: Uint32Array
): boolean {
  // Check sorted order
  for (const cells of bandCells) {
    if (!isSorted(cells)) return false;
  }

  // Check area sums
  for (let b = 0; b < bandCells.length; b++) {
    let sum = 0;
    for (const cellId of bandCells[b]) {
      sum += cellAreaW[cellId];
    }
    if (sum !== bandAreaSumPPM[b]) return false;
  }

  return true;
}
```

---

## 6️⃣ Pentagon Handling

### 6.1 Pentagon as Normal Cell

Pentagons are treated identically to hex cells in the mapping:

- They have a `centerVec` (computed from mesh geometry)
- They receive a `latBandId` and `lonSliceId`
- They have an `areaWeightPPM` (typically different from hexes)
- They participate in all band operations

### 6.2 No Special Cases

The climate system does **not** distinguish between pentagons and hexes:

```ts
// Same code path for all cells
for (const cellId of bandCells[bandId]) {
  // Works for both hexes and pentagons
  const areaW = cellAreaW[cellId];
  const value = X_cell[cellId];
  // ...
}
```

### 6.3 Why This Works

- Pentagons have valid spherical coordinates
- Their area is correctly accounted for in `areaWeightPPM`
- Band assignment depends only on `centerVec`, not neighbor count
- Climate physics operates on bands, not cell topology

---

## 7️⃣ Integration with Climate System

### 7.1 Climate Workflow

The mapping enables a clean climate workflow:

```
Hex Surface (canonical topology)
    ↓ reduce
Latitude Bands (climate discretization)
    ↓ EBM physics
Temperature, Albedo, Ice
    ↓ expand
Hex Surface (visualization, ecology)
```

### 7.2 Climate-Hex Integration Points

| Climate Operation | Space | Projection |
|-------------------|-------|------------|
| Solar insolation | Bands | N/A (computed per band) |
| Temperature evolution | Bands | N/A (EBM operates here) |
| Diffusion | Bands | N/A (neighbor mixing) |
| Albedo feedback | Bands | N/A (ice-albedo hysteresis) |
| Biome assignment | Cells | `T_band → T_cell` |
| Hydrology | Cells | `P_band → P_cell` |
| Species ranges | Cells | `T_cell, P_cell` |

### 7.3 Cross-References

- **Climate System**: [`docs/03-climate-system.md`](docs/03-climate-system.md) — EBM physics, albedo, diffusion
- **Field Representation**: [`docs/54-field-representation-projection-contract.md`](docs/54-field-representation-projection-contract.md) — General projection architecture
- **Voxel Projection**: [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md) — Surface-to-volume mapping
- **Biome Tagging**: [`docs/53-spatial-query-biome-region-tagging.md`](docs/53-spatial-query-biome-region-tagging.md) — Biome cell definitions

---

## 8️⃣ Performance Considerations

### 8.1 Complexity Analysis

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Mesh bake | O(M) | One-time cost |
| Cell → Band reduce | O(M) | M = number of cells |
| Band → Cell expand (constant) | O(M) | Simple lookup |
| Band → Cell expand (linear) | O(M) | With interpolation |
| Band diffusion | O(N) | N = number of bands (N << M) |

### 8.2 Memory Usage

```ts
// Per-cell data (M cells)
cellLatBand: 2 * M bytes      // Uint16Array
cellLonSlice: 2 * M bytes     // Uint16Array (optional)
cellAreaW: 4 * M bytes        // Uint32Array

// Band tables (N bands)
bandCells: ~M * 2 bytes       // Uint16Array (each cell appears once)
bandAreaSumPPM: 4 * N bytes   // Uint32Array
```

For a typical configuration (M=12,000 cells, N=24 bands):
- Per-cell data: ~96 KB
- Band tables: ~48 KB
- Total: ~144 KB (negligible)

### 8.3 Optimization Tips

1. **Cache band cell lists**: Avoid recomputing cell membership
2. **Use typed arrays**: `Uint16Array`, `Uint32Array`, `Float32Array`
3. **Precompute area sums**: Enable fast averaging without per-cell division
4. **Batch reductions**: Process multiple fields in a single pass over cells
5. **SIMD-friendly**: Band operations are vectorizable

---

## 9️⃣ Configuration Parameters

### 9.1 Band Configuration

```ts
interface BandConfig {
  numLatBands: number;        // 8, 12, 16, 20, or 24
  numLonSlices?: number;      // Optional, for 2D fields
  quantizationBits: number;   // Latitude/longitude quantization (default: 16)
}
```

### 9.2 Recommended Values

| Use Case | numLatBands | numLonSlices |
|----------|-------------|--------------|
| Fast simulation | 8-12 | N/A |
| Balanced | 16-20 | N/A |
| High fidelity | 24 | Optional |

### 9.3 Quantization

Latitude and longitude are quantized to avoid floating-point drift:

```ts
// Quantize to 16-bit fixed-point
latQ = Math.round(lat * (1 << quantizationBits));
lonQ = Math.round(lon * (1 << quantizationBits));
```

---

## 🔟 Example Usage

### 10.1 Complete Workflow

```ts
// 1. Mesh bake (one-time)
const meshData = bakeHexMesh(resolution);
const mapping = precomputeBandMapping(meshData, { numLatBands: 16 });

// 2. Climate simulation loop
function simulateClimateStep(
  T_cell: Float32Array,      // cell temperature
  A_cell: Float32Array,      // cell albedo
  dt: number
): Float32Array {
  // Reduce to bands
  const T_band = reduceCellToBand(T_cell, mapping.bandCells, mapping.cellAreaW, 16);
  const A_band = reduceCellToBand(A_cell, mapping.bandCells, mapping.cellAreaW, 16);

  // EBM physics (in band space)
  const S_band = computeSolarInsolation(16);  // per band
  const T_new_band = evolveTemperatureEBM(T_band, S_band, A_band, dt);

  // Diffusion (in band space)
  const T_diffused_band = applyBandDiffusion(T_new_band, 0.1, dt);

  // Expand back to cells
  const T_new_cell = expandBandToCellConstant(T_diffused_band, mapping.cellLatBand, T_cell.length);

  return T_new_cell;
}
```

### 10.2 Biome Assignment

```ts
function assignBiomes(
  T_cell: Float32Array,
  P_cell: Float32Array,
  mapping: BandMapping
): Uint16Array {
  const biomes = new Uint16Array(T_cell.length);

  for (let c = 0; c < T_cell.length; c++) {
    const bandId = mapping.cellLatBand[c];
    const latQ = mapping.cellLatQ[c];

    // Use both cell-level values and band context
    biomes[c] = computeBiomeType(T_cell[c], P_cell[c], latQ, bandId);
  }

  return biomes;
}
```

---

## 1️⃣1️⃣ Testing & Validation

### 11.1 Unit Tests

```ts
// Test 1: Band assignment consistency
assert(latBandId === floor((latQ + 90) / bandHeight));

// Test 2: Sorted cell lists
assert(isSorted(bandCells[b]));

// Test 3: Area sum conservation
let totalArea = 0;
for (let b = 0; b < numBands; b++) {
  totalArea += bandAreaSumPPM[b];
}
assert(totalArea === 1_000_000);  // PPM sum

// Test 4: Round-trip conservation
const X_cell = generateRandomField(numCells);
const X_band = reduceCellToBand(X_cell, ...);
const X_cell_recovered = expandBandToCellConstant(X_band, ...);
assert(areaWeightedError(X_cell, X_cell_recovered) < tolerance);
```

### 11.2 Integration Tests

```ts
// Test 1: Climate-hex integration
const planet = generatePlanet(seed);
const climate = runClimateSimulation(planet, years);
assert(validateClimateOutput(climate));

// Test 2: Determinism across runs
const run1 = simulateClimate(seed, years);
const run2 = simulateClimate(seed, years);
assert(deepEqual(run1, run2));

// Test 3: Biome consistency
const biomes = assignBiomes(climate.T_cell, climate.P_cell, mapping);
assert(validateBiomeDistribution(biomes));
```

---

## 1️⃣2️⃣ Migration Guide

### 12.1 From Pure Hex Climate

If you previously implemented climate directly on hex cells:

1. **Add band mapping**: Precompute `cellLatBand`, `bandCells`, `cellAreaW`
2. **Move physics to bands**: Convert EBM operations to band space
3. **Add projections**: Implement `reduceCellToBand` and `expandBandToCell`
4. **Update visualization**: Use `T_cell` (expanded) for rendering
5. **Validate**: Ensure round-trip conservation and determinism

### 12.2 From Pure Band Climate

If you previously used only bands:

1. **Add hex topology**: Generate hex mesh for migration, tectonics
2. **Precompute mapping**: Bake cell-to-band relationships
3. **Project for visualization**: Expand band fields to cells for rendering
4. **Integrate ecology**: Use cell-space values for species, biomes
5. **Validate**: Ensure consistency between band and cell representations

---

## 1️⃣3️⃣ Appendix: Data Structures

### 13.1 BandMapping

```ts
interface BandMapping {
  // Per-cell data
  cellLatBand: Uint16Array;     // cellId → latBandId
  cellLonSlice: Uint16Array;    // cellId → lonSliceId (optional)
  cellLatQ: Int16Array;         // cellId → quantized latitude
  cellLonQ: Int16Array;         // cellId → quantized longitude
  cellAreaW: Uint32Array;       // cellId → areaWeightPPM

  // Band tables
  bandCells: Uint16Array[];     // latBandId → cellId[] (sorted)
  bandAreaSumPPM: Uint32Array;  // latBandId → total area (PPM)

  // Configuration
  numLatBands: number;
  numLonSlices: number;
  bandHeight: number;           // degrees per band
  sliceWidth: number;          // degrees per slice
}
```

### 13.2 ClimateState

```ts
interface ClimateState {
  // Cell-space (for ecology, visualization)
  T_cell: Float32Array;         // temperature (K)
  P_cell: Float32Array;         // precipitation (m/s)
  A_cell: Float32Array;         // albedo (0-1)
  I_cell: Float32Array;         // ice fraction (0-1)

  // Band-space (for physics)
  T_band: Float32Array;         // temperature (K)
  A_band: Float32Array;         // albedo (0-1)
  S_band: Float32Array;         // solar insolation (W/m²)
}
```

---

## Summary

The Hex → Lat/Lon Band Mapping Contract provides:

✅ **Deterministic projection** from hex cells to latitude bands
✅ **Fast climate operations** via precomputed aggregation tables
✅ **Clean separation** between topology (hex) and physics (bands)
✅ **Energy-conserving** round-trip projections
✅ **Pentagon-compatible** (no special cases)
✅ **Performance-optimized** with O(N) band operations
✅ **Well-integrated** with climate, ecology, and visualization systems

This architecture enables latitude-first climate physics (snowball Earth, ice-albedo hysteresis, EBM diffusion) while maintaining hex cells as the canonical world topology for all other systems.

---

**Related Documentation:**
- [`docs/03-climate-system.md`](docs/03-climate-system.md) — Climate physics and EBM implementation
- [`docs/54-field-representation-projection-contract.md`](docs/54-field-representation-projection-contract.md) — General projection architecture
- [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md) — Surface-to-volume mapping
- [`docs/53-spatial-query-biome-region-tagging.md`](docs/53-spatial-query-biome-region-tagging.md) — Biome cell definitions


## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

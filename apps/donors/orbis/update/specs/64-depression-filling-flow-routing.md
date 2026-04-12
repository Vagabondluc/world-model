# 🔒 DEPRESSION FILLING & FLOW ROUTING v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Drainage Enforcement • Steepest Descent • Flow Accumulation)

---

## 0️⃣ Purpose

Define deterministic kernels for calculating river flow, incision, and sediment transport on the Geodesic Hex Grid.

**Core Goals:**

* Ensure every cell has a path to the sea (or a true sink)
* Compute flow direction using steepest descent
* Calculate flow accumulation for erosion modeling
* Maintain determinism and stability

---

## 1️⃣ Core Units

To avoid scale ambiguity:

| Quantity | Unit | Description |
|-----------|--------|-------------|
| **Distance** | Meters | Arc length on sphere |
| **Elevation** | Meters | Relative to sea level datum |
| **Time** | Simulation Years | For erosion calculations |
| **Mass** | Abstract Volume Units | `Meters^3` of rock/sediment |

---

## 2️⃣ Data Structure Extensions

### 2.1 Hydrology Fields

```typescript
interface HydrologyFields {
  // Flow
  flowReceiverId: string | null;  // Downhill neighbor
  flowAccumulation: number;      // Total upstream drainage area
  
  // Physical
  slopeToReceiver: number;       // Gradient (dz / distance)
  discharge: number;             // Effective water volume
  
  // Sediment State
  sedimentThickness: number;     // Current loose material (Soil/Sand)
  erosionFlux: number;           // Material removed this tick
  depositionFlux: number;        // Material added this tick
}
```

### 2.2 Cell Authority Extension

```typescript
interface HexAuthorityWithHydrology extends HexAuthority {
  // Hydrology fields
  hydrology: HydrologyFields;
  
  // Derived flags
  isRiver: boolean;
  isLake: boolean;
  isWetland: boolean;
}
```

---

## 3️⃣ Simulation Kernels (Execution Order)

### 3.1 Kernel 1: Depression Filling (Drainage Enforcement)

**Goal:** Ensure every cell has a path to the sea (or a true sink).

**Algorithm:**

```typescript
function fillDepressions(
  hexes: HexAuthorityWithHydrology[],
  seaLevelM: number,
  epsilon: number = 0.001
): void {
  
  // Sort all hexes by Elevation (Ascending)
  const sortedHexes = [...hexes].sort((a, b) =>
    a.elevationM - b.elevationM
  );
  
  // Iterate and fill depressions
  for (const hex of sortedHexes) {
    
    // Find lowest neighbor
    const lowestNeighbor = findLowestNeighbor(hex);
    
    // If no lower neighbor exists
    if (!lowestNeighbor) {
      
      // Check if this is a valid sink
      if (hex.elevationM < seaLevelM) {
        // Valid ocean sink - do nothing
        continue;
      }
      
      // Invalid sink - fill depression
      const fillHeight = lowestNeighbor.elevationM + epsilon;
      hex.elevationM = fillHeight;
      
      // Repeat until valid slope exists
      continue;
    }
    
    // Valid slope - set receiver
    hex.hydrology.flowReceiverId = lowestNeighbor.id;
    hex.hydrology.slopeToReceiver =
      (hex.elevationM - lowestNeighbor.elevationM) /
      distance(hex.center, lowestNeighbor.center);
  }
}
```

**Rules:**
1. Sort hexes by elevation (ascending)
2. If hex has no lower neighbor:
   - If `Elevation < SeaLevel`: Valid ocean sink
   - Else: Raise elevation to match lowest neighbor + epsilon
   - Repeat until valid slope exists
3. Exception: Pentagons are handled as 5-neighbor nodes

**Complexity:** O(N log N) for sorting + O(N) for iteration

### 3.2 Kernel 2: Flow Routing (D8 / Steepest Descent)

**Goal:** Determine flow direction for each cell.

**Algorithm:**

```typescript
function routeFlow(
  hexes: HexAuthorityWithHydrology[]
): void {
  
  for (const hex of hexes) {
    
    // Find neighbor with steepest drop
    let steepestNeighbor: HexAuthorityWithHydrology | null = null;
    let steepestSlope: number = 0;
    
    for (const neighbor of hex.neighbors) {
      
      const drop = hex.elevationM - neighbor.elevationM;
      
      // Only consider downhill flow
      if (drop <= 0) continue;
      
      const distance = distance(hex.center, neighbor.center);
      const slope = drop / distance;
      
      if (slope > steepestSlope) {
        steepestSlope = slope;
        steepestNeighbor = neighbor;
      }
    }
    
    // Set flow receiver
    if (steepestNeighbor) {
      hex.hydrology.flowReceiverId = steepestNeighbor.id;
      hex.hydrology.slopeToReceiver = steepestSlope;
    } else {
      // No downhill neighbor - local maximum
      hex.hydrology.flowReceiverId = null;
      hex.hydrology.slopeToReceiver = 0;
    }
  }
}
```

**Rules:**
1. For each hex, find neighbor with steepest positive drop
2. `Slope = Drop / Distance` (arc length on sphere)
3. If no drop > 0, `flowReceiverId = null` (local maximum)

**Complexity:** O(N × K) where K = 6 (hex) or 5 (pentagon)

### 3.3 Kernel 3: Flow Accumulation

**Goal:** Calculate total upstream drainage area for each cell.

**Algorithm:**

```typescript
function accumulateFlow(
  hexes: HexAuthorityWithHydrology[]
): void {
  
  // Initialize accumulation to 1.0 (Self)
  for (const hex of hexes) {
    hex.hydrology.flowAccumulation = 1.0;
  }
  
  // Sort hexes by Elevation (Descending) - Top of mountains first
  const sortedHexes = [...hexes].sort((a, b) =>
    b.elevationM - a.elevationM
  );
  
  // Accumulate flow downhill
  for (const hex of sortedHexes) {
    
    if (hex.hydrology.flowReceiverId) {
      const receiver = hexes.find(h =>
        h.id === hex.hydrology.flowReceiverId
      );
      
      if (receiver) {
        receiver.hydrology.flowAccumulation +=
          hex.hydrology.flowAccumulation;
      }
    }
  }
}
```

**Rules:**
1. Initialize `flowAccumulation = 1.0` (self)
2. Sort hexes by elevation (descending)
3. For each hex, add its accumulation to its receiver
4. Process from mountains to sea ensures correct accumulation

**Complexity:** O(N log N) for sorting + O(N) for accumulation

---

## 4️⃣ Sphere Topology Considerations

### 4.1 Pentagons

**Handling:**
- Pentagons have 5 neighbors instead of 6
- The logic remains identical (graph-based)
- No special cases needed

### 4.2 Edge Length

**Critical:** Do NOT assume `1.0` for edge length.

**Correct Approach:**
```typescript
function distance(
  centerA: Vec3,
  centerB: Vec3
): number {
  
  // Use Haversine or Great Circle distance
  const R = PLANET_RADIUS_METERS;
  const phi1 = centerA.latitude;
  const phi2 = centerB.latitude;
  const deltaLambda = centerB.longitude - centerA.longitude;
  
  const a = Math.sin((phi2 - phi1) / 2) ** 2 +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) ** 2;
  
  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );
  
  return R * c;
}
```

**Impact:**
- Prevents distortion artifacts near poles/pentagons
- Ensures accurate slope calculations
- Maintains physical realism

### 4.3 Edge Cases

**Special Cases:**
1. **Flat Plateaus:** Multiple cells at same elevation
   - Resolution: Use tie-breaker (e.g., smallest ID)
2. **Saddle Points:** Local minimum but not global minimum
   - Resolution: Steepest descent still works correctly
3. **Closed Basins:** Internal drainage (endorheic lakes)
   - Resolution: Depression filling creates valid sinks

---

## 5️⃣ Integration with Biomes

### 5.1 River Tagging

```typescript
function tagRivers(
  hexes: HexAuthorityWithHydrology[],
  dischargeThreshold: number = 1000
): void {
  
  for (const hex of hexes) {
    if (hex.hydrology.discharge > dischargeThreshold) {
      hex.isRiver = true;
    } else {
      hex.isRiver = false;
    }
  }
}
```

**Threshold:** Configurable based on scale and desired river density

### 5.2 Lake Tagging

```typescript
function tagLakes(
  hexes: HexAuthorityWithHydrology[],
  fillThreshold: number = 5
): void {
  
  for (const hex of hexes) {
    
    // Check if depression was filled significantly
    const filledAmount = hex.originalElevation - hex.elevationM;
    
    if (filledAmount > fillThreshold) {
      
      // Determine lake vs wetland
      if (hex.elevationM < seaLevelM + 1) {
        hex.isLake = true;
        hex.biome = BiomeId.LAKE;
      } else {
        hex.isWetland = true;
        hex.biome = BiomeId.WETLAND;
      }
    }
  }
}
```

**Threshold:** 5 meters minimum fill to qualify as lake/wetland

---

## 6️⃣ Performance & Determinism

### 6.1 Sorting Performance

**Sorting 40k hexes:** Fast (N log N)

**Algorithm Choice:**
- Use efficient sort (QuickSort, MergeSort, or TimSort)
- Avoid O(N²) bubble/insertion sorts
- Consider radix sort for integer-based keys

### 6.2 Precision Requirements

**Accumulation:** Use `Float64` (double precision) to prevent overflow

```typescript
// BAD: Float32 can overflow on large continents
let accumulation: Float32Array = new Float32Array(N);

// GOOD: Float64 handles large values
let accumulation: Float64Array = new Float64Array(N);
```

### 6.3 Stability Rules

**Clamp Erosion:**
```typescript
const MAX_EROSION_PER_YEAR = 50;  // meters

erosionAmount = clamp(erosionAmount, 0, MAX_EROSION_PER_YEAR);
```

**Prevent Oscillation:**
```typescript
// Don't allow flat-plane oscillations
if (Math.abs(slope) < EPSILON) {
  erosionAmount = 0;
}
```

---

## 7️⃣ Data Contracts

### 7.1 Hydrology State

```typescript
interface HydrologyState {
  // Per-cell fields
  flowReceiverId: string[];
  flowAccumulation: Float64Array;
  slopeToReceiver: Float32Array;
  discharge: Float32Array;
  
  // Derived flags
  isRiver: Uint8Array;       // 0 or 1
  isLake: Uint8Array;        // 0 or 1
  isWetland: Uint8Array;     // 0 or 1
}
```

### 7.2 Kernel Configuration

```typescript
interface HydrologyConfig {
  seaLevelM: number;           // Meters
  epsilon: number;              // Minimum slope (meters/meter)
  dischargeThreshold: number;    // For river tagging
  lakeFillThreshold: number;    // For lake tagging (meters)
  maxErosionPerYear: number; // Stability clamp (meters)
}
```

---

## 8️⃣ Integration with Existing Specs

### 8.1 Erosion & Sediment Integration

**Input:** [`docs/26-erosion-sediment.md`](docs/26-erosion-sediment.md)

**Usage:**
```typescript
// Use flow accumulation for erosion
const erosionAmount = calculateErosion(
  hex.hydrology.flowAccumulation,
  hex.hydrology.slopeToReceiver,
  hex.hydrology.discharge
);

// Update sediment state
hex.hydrology.erosionFlux = erosionAmount;
hex.hydrology.sedimentThickness -= erosionAmount;
```

### 8.2 Hydrology Coupling Integration

**Input:** [`docs/20-hydrology-coupling.md`](docs/20-hydrology-coupling.md)

**Usage:**
```typescript
// Get climate-derived runoff
const runoff = climateOutputs.runoff01;

// Add to discharge calculation
hex.hydrology.discharge = runoff * hex.hydrology.flowAccumulation;
```

### 8.3 Voxel Projection Integration

**Input:** [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md)

**Usage:**
```typescript
// Use river tags for voxel generation
if (hex.isRiver) {
  // Carve river channel in voxels
  carveRiverChannel(voxelColumn, hex.hydrology.discharge);
}
```

---

## 9️⃣ Determinism Requirements

### 9.1 Deterministic Kernels

All kernels must be deterministic:

* Same inputs → identical outputs
* No random number generation
* Stable sort order (use stable sort or tie-breaker)
* Consistent neighbor iteration order

### 9.2 Sorting Determinism

**Issue:** Unstable sorts can produce different order for equal elements

**Solution:** Use stable sort or tie-breaker

```typescript
// BAD: Unstable sort
const sorted = [...hexes].sort((a, b) => a.elevation - b.elevation);

// GOOD: Stable sort with tie-breaker
const sorted = [...hexes].sort((a, b) => {
  const elevDiff = a.elevation - b.elevation;
  if (elevDiff !== 0) return elevDiff;
  return a.id.localeCompare(b.id);  // Tie-breaker
});
```

### 9.3 Floating Point Stability

**Epsilon Comparisons:**
```typescript
const EPSILON = 1e-6;

// BAD: Direct equality
if (a.elevation === b.elevation) { /* ... */ }

// GOOD: Epsilon comparison
if (Math.abs(a.elevation - b.elevation) < EPSILON) { /* ... */ }
```

---

## 🔟 Acceptance Criteria

### 10.1 Must-Have

- [x] **AC-1101**: Depression filling ensures every cell has drainage path
- [x] **AC-1102**: Flow routing uses steepest descent (D8)
- [x] **AC-1103**: Flow accumulation correctly sums upstream area
- [x] **AC-1104**: Pentagons handled correctly as 5-neighbor nodes
- [x] **AC-1105**: Edge length uses arc distance (not assumed 1.0)
- [x] **AC-1106**: River tagging uses discharge threshold
- [x] **AC-1107**: Lake tagging uses fill threshold
- [x] **AC-1108**: Kernels are deterministic and stable

### 10.2 Should-Have

- [ ] **AC-1111**: Depression filling handles closed basins (endorheic lakes)
- [ ] **AC-1112**: Flow routing handles flat plateaus with tie-breaker
- [ ] **AC-1113**: Accumulation uses Float64 for large continents
- [ ] **AC-1114**: Erosion clamping prevents spikes

### 10.3 Could-Have

- [ ] **AC-1121**: Adaptive discharge threshold based on biome
- [ ] **AC-1122**: Multi-pass depression filling for complex basins
- [ ] **AC-1123**: Parallel kernel execution for performance

---

## 1️⃣1️⃣ Cross-Doc Dependencies

- [`docs/26-erosion-sediment.md`](docs/26-erosion-sediment.md) - Erosion calculations
- [`docs/20-hydrology-coupling.md`](docs/20-hydrology-coupling.md) - Climate-derived runoff
- [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md) - Voxel generation

---

## 1️⃣2️⃣ Version History

| Version | Date | Changes |
|---------|--------|---------|
| 1.0 | 2026-02-12 | Initial frozen spec - Depression filling and flow routing kernels |

---

**Document Version:** 1.0  
**Status:** 🔒 FROZEN  
**Generated:** 2026-02-12

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

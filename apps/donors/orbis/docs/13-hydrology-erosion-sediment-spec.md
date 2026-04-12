# Hydrology & Erosion Spec (v1)

## 1. Purpose
Define the deterministic kernels for calculating river flow, incision (cutting valleys), and sediment transport on the Geodesic Hex Grid.

## 2. Core Units
To avoid scale ambiguity:
*   **Distance**: Meters (Arc length on sphere).
*   **Elevation**: Meters (Relative to sea level datum).
*   **Time**: Simulation Years.
*   **Mass**: Abstract Volume Units (`Meters^3` of rock/sediment).

## 3. Data Structure Extensions
We extend the `HexData` object (conceptually or via a companion map) with transient simulation fields.

```typescript
interface HydrologyFields {
  // 1. Flow
  flowReceiverId: string | null; // Downhill neighbor
  flowAccumulation: number;      // Total upstream drainage area
  
  // 2. Physical
  slopeToReceiver: number;       // Gradient (dz / distance)
  discharge: number;             // Effective water volume
  
  // 3. Sediment State
  sedimentThickness: number;     // Current loose material (Soil/Sand)
  erosionFlux: number;           // Material removed this tick
  depositionFlux: number;        // Material added this tick
}
```

## 4. Simulation Kernels (Execution Order)

### Kernel 1: Depression Filling (Drainage Enforcement)
*Goal*: Ensure every cell has a path to the sea (or a true sink).
1.  Sort all hexes by Elevation (Ascending).
2.  Iterate. If a hex has no lower neighbor:
    *   It is a **Sink**.
    *   **Action**: Raise its elevation to match its lowest neighbor + `epsilon`.
    *   **Repeat** until valid slope exists.
    *   *Exception*: If `Elevation < SeaLevel`, it is a valid sink (Ocean).

### Kernel 2: Flow Routing (D8 / Steepest Descent)
*   For each hex `H`:
    *   Find neighbor `N` with steepest drop `(H.elev - N.elev) / Dist(H, N)`.
    *   If no drop > 0, `flowReceiverId = null`.
    *   Else `flowReceiverId = N.id`.

### Kernel 3: Accumulation
*   Initialize `flowAccumulation = 1.0` (Self).
*   Sort hexes by Elevation (Descending) - Top of mountains first.
*   For each hex `H`:
    *   If `H.flowReceiverId` exists:
        *   `Receiver.flowAccumulation += H.flowAccumulation`.

### Kernel 4: Stream Power Incision (Erosion)
*   Formula: `Erosion = K * (Accumulation ^ m) * (Slope ^ n) * dt`
*   Parameters (Default Earth-like):
    *   `K` (Erodibility): `1.0e-5` (Hard Rock) to `1.0e-4` (Soft Sediment).
    *   `m` (Area Exponent): `0.5`.
    *   `n` (Slope Exponent): `1.0`.
*   Application:
    1.  Compute `ErosionAmount` (Meters).
    2.  Subtract from `Hex.biomeData.height` (converted to meters).
    3.  Add `ErosionAmount` to `GlobalSedimentBudget` or pass to Transport kernel.

## 5. Integration with Biomes
*   **River Tagging**: If `discharge > Threshold`, set `HexData.isRiver = true`.
*   **Lake Tagging**: If a depression was filled significantly (>5m) to drain, set `HexData.biome = LAKE` (if water visible) or `WETLAND`.

## 6. Sphere Topology Considerations
*   **Pentagons**: Handle strictly as 5-neighbor nodes. The logic remains identical (graph-based).
*   **Edge Length**: Do **not** assume `1.0`.
    *   Use `Haversine` or Great Circle distance between `Hex.center` and `Neighbor.center`.
    *   This prevents distortion artifacts near poles/pentagons.

## 7. Performance & Determinism
*   **Sorting**: Sorting 40k hexes is fast (N log N). Essential for artifact-free accumulation.
*   **Precision**: Use `Float64` for accumulation to prevent overflow on continents.
*   **Limits**: Clamp erosion per tick to prevent spikes (e.g., max 50m / year).

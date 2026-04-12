# 🔒 EROSION & SEDIMENT TRANSPORT SPEC v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/50-hydrology-solver-contract.md`](./50-hydrology-solver-contract.md)
- `Owns`: [`ElevationDeltaCell`, `SedimentFieldCell`, `LithologyClass`]
- `Writes`: [`ElevationCell`]

---

## 0️⃣ Purpose

Define a deterministic, height-redistribution system driven by fluvial incision and hillslope diffusion. This system produces believable valleys, deltas, and plains without simulating complex fluid physics.

---

## 1️⃣ Inputs / Outputs

### 1.1 Inputs (Read-Only)
* `ElevationCell`: `int32` (absolute elevation in cm)
* `RiverFlowCell`: `uint32` (PPM flow accumulation)
* `SlopeCell`: `uint32` (PPM local slope)
* `WaterMaskCell`: `uint8` (0=land, 1=ocean)
* `RockHardnessCell`: `uint32` (PPM modifier, default 1M)
* `CrustFloorCell`: `int32` (minimum allowable elevation in cm)

### 1.2 Outputs
* `ElevationDeltaCell`: `int32` (total change in elevation in cm)
* `SedimentFieldCell`: `uint32` (available sediment in PPM units)

```ts
type ElevationDeltaCell = int32
type SedimentFieldCell = uint32
```

---

## 2️⃣ Locked Constants

```ts
const K_RIVER_PPM: uint32 = 50_000        // Base incision rate
const K_DIFF_PPM: uint32 = 10_000         // Hillslope diffusion rate
const K_SEDIMENT_PPM: uint32 = 200_000    // Incision-to-sediment conversion rate
const SLOPE_THRESHOLD_PPM: uint32 = 5_000 // Minimum slope for incision
const DEPOSITION_RATE_PPM: uint32 = 200_000 // Rate of sediment dropout

// Lithology Classification
enum LithologyClass {
  SOFT_SOIL,
  SEDIMENTARY,
  METAMORPHIC,
  IGNEOUS
}

// Critical Shear Thresholds (tau_c) in PPM.
// Calibration (Pa -> PPM):
// - 1.0 Pa ≈ 1,000 PPM (Base Soil)
// - 10.0 Pa ≈ 10,000 PPM (Cohesive)
// - 100.0 Pa ≈ 100,000 PPM (Sedimentary)
// - 1,000.0 Pa+ ≈ 1,000,000 PPM (Crystalline)
const CRITICAL_SHEAR_TABLE: Record<LithologyClass, uint32> = {
  [LithologyClass.SOFT_SOIL]:   5_000,   // ~5.0 Pa
  [LithologyClass.SEDIMENTARY]: 50_000,  // ~50.0 Pa
  [LithologyClass.METAMORPHIC]: 500_000, // ~500.0 Pa
  [LithologyClass.IGNEOUS]:     800_000  // ~800.0 Pa
}
```

---

## 3️⃣ Fluvial Erosion (River Incision)

### 3.1 Stream Power Law Implementation

For each cell where `RiverFlowCell > 0` and `SlopeCell > SLOPE_THRESHOLD_PPM`:

```ts
// m=0.5 (sqrt), n=1.0 (linear slope)
// StreamPower represents the local shear potential
StreamPower = (SlopeCell * sqrt_PPM(RiverFlowCell)) / 1_000_000
Threshold = CRITICAL_SHEAR_TABLE[LithologyClass]

// Incision occurs only if StreamPower exceeds Threshold
ExcessPower = max(0, StreamPower - Threshold)
incision_cm = (K_RIVER_PPM * ExcessPower) / 1_000_000
```

**Constraints:**
* `incision_cm` is capped such that `ElevationCell - incision_cm >= CrustFloorCell`.
* Incision is only applied to non-ocean cells (`WaterMaskCell == 0`).

---

## 4️⃣ Hillslope Diffusion (Smoothing)

For each cell, apply gravity-driven smoothing to neighbors:

```ts
diff_cm = (K_DIFF_PPM * (AvgNeighborElevation - ElevationCell)) / 1_000_000
```

**Constraints:**
* Diffusion cannot invert local slopes.
* Applied only to land cells.

---

## 5️⃣ Sediment Transport & Deposition

### 5.1 Production
```ts
sedimentProduced = (incision_cm * K_SEDIMENT_PPM) / 100 // Scale to PPM
```

### 5.2 Routing
Sediment follows the `flowDir` (downhill neighbor) defined in the Hydrology domain. Processing occurs in **descending elevation order** (topological sort).

### 5.3 Deposition
Sediment deposits at coastal cells, lakes, or where `SlopeCell < SLOPE_THRESHOLD_PPM`.

```ts
deposit_cm = (currentSediment * DEPOSITION_RATE_PPM) / 1_000_000
```

---

## 6️⃣ Compliance Test Vector

To ensure cross-platform parity, an implementation must pass this test:

**Inputs:**
- `ElevationCell`: `100_000` (1000m)
- `SlopePPM`: `100_000` (10% grade)
- `RiverFlowCell`: `1_000_000` (Full scale flow)
- `K_RIVER_PPM`: `50_000`
- `sqrt_PPM(1,000,000)`: `1,000,000`

**Calculation:**
1. `num = 50,000 * 100,000 * 1,000,000 = 5,000,000,000,000`
2. `incision = 5,000,000,000,000 / 1,000,000,000,000 = 5`

**Expected Result:** `ElevationDeltaCell` = `-5` (cm)

---

## 7️⃣ Determinism Rules

* Process cells in stable topological order (descending elevation, then ascending cellId).
* No use of floating point math in authoritative update paths.
* All division uses `divFloor64` as defined in the numeric contract.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

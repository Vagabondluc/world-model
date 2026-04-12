# 🧪 TDD Specification: Hydrology & Erosion Solver

**Target**: Orbis 2.0 Hydrology Domain
**Reference**: Orbis 1.0 `hydrology.ts` (applyHydrology, performGeologicStep)

## 1. Flow Accumulation (ABCD Model)
- [ ] **HYD-01: Soil Moisture Saturation**
  - `Input`: `PrecipPPM = 100,000`, `param_b = 50,000`.
  - `Action`: Run ABCD Step 1.
  - `Expected`: `ActualEvap` and `Recharge` must follow `50-hydrology-solver-contract.md` formulas.
- [ ] **HYD-02: Baseflow Persistence**
  - `Input`: `GroundwaterPPM = 500,000`, `PrecipPPM = 0`.
  - `Expected`: `Baseflow` must remain positive according to `param_d`, simulating river flow during dry eras.

## 2. River Graph Synthesis
- [ ] **RIVER-01: Mouth Selection Determinism**
  - `Input`: 10 coastal cells with `oceanFraction` ranging from 0.1 to 0.9.
  - `Action`: Selection algorithm with `mouthCount = 3`.
  - `Expected`: Identical `MouthId` assignments across multiple runs with the same `worldSeed`.
- [ ] **RIVER-02: Topographic Sorting**
  - `Setup`: Complex mountain terrain.
  - `Verification`: `RiverNode` processing order must be strictly `Elevation desc`, then `CellId asc`. No cycles allowed.

## 3. Erosion Physics (Stream Power Law)
- [ ] **ERO-01: Incision Accuracy**
  - `Setup`: `Slope = 50,000 PPM`, `Flow = 1,000,000 PPM`.
  - `Reference 1.0 Logic`: `erosion = K * moisture * Flow^m * Slope^n`.
  - `Expected`: 2.0 implementation must match 1.0 result within ±0.01% using `sqrtPPM` and `Fixed64Q32`.
- [ ] **ERO-02: Critical Shear (Lithology)**
  - `Setup`: `Lithology = IGNEOUS` (Threshold = 800k PPM).
  - `Action`: Apply `StreamPower = 500k PPM`.
  - `Expected`: `ElevationDelta` = 0 (No erosion on hard rock).

## 4. Legacy Feature Regression (Orbis 1.0)
- [ ] **LEG-01: Fjord Synthesis**
  - `Input`: Coastal cell, `Temp < 5C`, `Flow > 1.5M PPM`.
  - `Expected`: `CoastalFeature.FJORD` assigned and elevation dropped below `seaLevel`.
- [ ] **LEG-02: Barrier Island / Lagoon Chain**
  - `Input`: Shallow coastal shelf with high accumulation.
  - `Expected`: Correct tagging of `BARRIER` island and `LAGOON` neighbor with `MANGROVE` biome.

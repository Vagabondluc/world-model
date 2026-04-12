# 🧪 TDD Specification: Tectonics & Crustal Stability

**Target**: Orbis 2.0 Geology Domain
**Reference**: Orbis 1.0 `tectonics.ts`, `useWorldStore.ts` (runTectonicDrift)

## 1. Plate Drift Determinism
- [ ] **TEC-01: Velocity Integration**
  - `Input`: `PlateVelocity` (3D Vector from 1.0), `dt = 100,000 years`.
  - `Action`: Run drift step.
  - `Expected`: Plate position update must be bit-identical across runs given same `AbsTime`.
- [ ] **TEC-02: Boundary Stress Logic**
  - `Setup`: Convergent boundary (Continental vs. Oceanic).
  - `Expected`: `CrustalThickening` delta emitted; elevation adjusted toward `seaLevel - 0.5` for oceanic subduction.

## 2. Crustal Realization
- [ ] **CRUST-01: Material Assignment**
  - `Setup`: High-age surface (`surfaceAge > 1.0 Ga`).
  - `Expected`: `METAMORPHIC_ROCK` tag intensity increases in lower crust voxels.
- [ ] **CRUST-02: Impact Fracture Cone**
  - `Input`: Meteor strike at `Cell X`.
  - `Action`: Project 3D fracture cone.
  - `Expected`: `FRACTURED_ROCK` and `RESOURCE_EXPOSURE` tags assigned to all voxels within the cone radius.

## 3. Fossil & Remnant Record
- [ ] **FOS-01: Extinction Burial**
  - `Trigger`: `MassExtinctionEvent` at `Tick T`.
  - `Action`: Record species presence in `SnapshotV1`.
  - `Expected`: SpeciesId available in `FossilLayer` query for that stratum at `Tick T+100`.

# 🧪 TDD Specification: Atmosphere & Climate Transport

**Target**: Orbis 2.0 Climate Domain
**Reference**: Orbis 1.0 `atmosphereLogic.ts`, `types.ts` (AirMassType)

## 1. Air Mass Dynamics
- [ ] **AIR-01: Type Classification**
  - `Input`: `TempBand = POLAR`, `Surface = OCEAN`.
  - `Expected`: `AirMassType = mP` (Maritime Polar) assigned to regional buffer.
- [ ] **AIR-02: Front Generation**
  - `Setup`: Meeting of `cP` (Continental Polar) and `mT` (Maritime Tropical) air masses.
  - `Expected`: `FrontType = COLD` emitted at boundary; `stormIntensity` increased.

## 2. Zonal Transport (EBM Level 4)
- [ ] **TRANS-01: Heat Diffusion**
  - `Setup`: High temperature gradient between Band 10 and Band 11.
  - `Formula`: `D * (Ti-1 - 2Ti + Ti+1)`.
  - `Expected`: Net energy flux must be toward the cooler band; verify global energy sum is conserved within 1 PPM.
- [ ] **TRANS-02: Rotation Scale**
  - `Setup`: `RotationRate = 2.0x` (Fast rotation).
  - `Expected`: Heat diffusion coefficient `D` must scale down (stronger Hadley cells, less meridional mixing).

## 3. Atmospheric Composition (Carbon Integration)
- [ ] **CHEM-01: CO2 Forcing**
  - `Input`: `CO2Proxy = 800,000 PPM` (Hothouse).
  - `Action`: Run EBM solver.
  - `Expected`: `sigmaTilde` (effective emissivity) decreased; global mean temperature rises by predictable PPM amount.

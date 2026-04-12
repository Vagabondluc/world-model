# 🔒 CLIMATE SYSTEM v1 — FROZEN SPEC

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Related Solver`: [`docs/49-climate-solver-contract-ebm.md`](./49-climate-solver-contract-ebm.md)
- `Owns`: `[]`
- `Writes`: `[]`

---

**1D latitude bands + diffusion + temp-dependent albedo + hysteresis**
Greenhouse is **1-parameter emissivity** (not full emission-height), but we keep a hook.

---

## 0️⃣ Overview

This spec defines a modular, deterministic climate system that:

* Uses 1D latitude bands for spatial discretization
* Implements temperature-dependent albedo with hysteresis (snowball Earth mechanism)
* Uses a simple 1-parameter greenhouse model (effective emissivity)
* Includes latitudinal heat transport via diffusion
* Provides deterministic outputs for biomes, hydrology, and resources

The system is designed to be:
* Game-feasible (not a research simulator)
* Performance-optimized (vector-friendly)
* Deterministic and reproducible
* Modular and testable

---

## 1️⃣ Climate Grid Spec

### Purpose
Spatial discretization (cheap)

### Types

```ts
type BandCount = 8 | 12 | 16 | 20 | 24
type BandIndex = number // 0..N-1 (validated)
```

### Data (SoA)

* `latRad: Float32Array` (N)
* `areaW: Float32Array` (N)
* `mu: Float32Array` (N)  // cos(latitude)

### Lock

* band count options
* band geometry formula (equal-area bands)
* stable band ordering

---

## 2️⃣ Forcing Spec

### Purpose
Incoming solar per band

### Types

```ts
type SolarScalar = number // W/m²
type SolarMult = number   // 0.5..1.5
type TiltRad = number
```

### Data

* `S0: number`
* `solarMult: number`
* `tiltRad: number`
* `seasonPhase: number` (0..1) optional

### Outputs

* `Sin: Float32Array` (N)

### Lock

* `Sin[i] = (S0/4)*solarMult*insolation(mu[i], tilt, season)`
* insolation function (simple cosine-based, deterministic)

---

## 3️⃣ Greenhouse Spec (A+)

### Purpose
Outgoing IR modifier (cheap)

We do **effective emissivity** only.

### Types

```ts
type Emissivity = number // 0..1
type GHGIndex = number   // 0..1 (gameplay knob)
```

### Data

* `eps0: number` baseline
* `ghg: number` gameplay value 0..1
* `eps = eps0 + ghg*k` clamped

### Lock

* mapping from ghg→eps
* clamp range

(Hook for later: replace with emission height model without breaking APIs.)

---

## 4️⃣ Albedo Ice Spec (Snowball Core)

### Purpose
Albedo + ice fraction, with hysteresis

### Types

```ts
type Albedo = number // 0..1
type IceFrac = number // 0..1
```

### State

* `ice: Float32Array` (N)  // 0..1, not boolean
* `alpha: Float32Array` (N)

### Params

* `alphaIce`, `alphaWater`, `alphaLand`
* `TfFreeze`, `TmMelt` (K)
* `iceRelax` (0..1) per step

### Rules (locked)

* Ice target per band:

  * if `T <= TfFreeze` → targetIce=1
  * if `T >= TmMelt` → targetIce=0
  * else linear blend
* Update with relaxation:

  * `ice = mix(ice, targetIce, iceRelax)`
* Albedo:

  * `alpha = mix(alphaBase, alphaIce, ice)`
  * `alphaBase` comes from `SurfaceMaskSpec` (land/ocean fraction per band)

### Why this works

* Ice has memory → hysteresis appears naturally.

---

## 5️⃣ Radiation ODE Spec

### Purpose
Per-band temperature tendency

### State

* `T: Float32Array` (N) in Kelvin

### Params

* `C: number` heat capacity per band (or per surface type later)
* `sigma: number`
* outgoing law:

  * A-tier: linearized `A + B*T`
  * A+/B: Stefan-Boltzmann `eps*sigma*T^4`

### Lock decision

To stay A→B without cost explosion:

* Use **T⁴** but keep it vectorized and clamped.

### Equation (locked)

```
dT = ( Sin*(1-alpha) - eps*sigma*T^4 + Transport ) / C
```

---

## 6️⃣ Heat Transport Spec

### Purpose
Latitudinal mixing (the 1D "diffusion")

### Params

* `D: number` diffusion coefficient

### Operator

Use a simple second-difference Laplacian:

```
Transport[i] = D * (T[i-1] - 2T[i] + T[i+1])
```

Boundary:

* Neumann (no-flux): mirror endpoints

This is cheap, stable, and gives polar moderation.

---

## 7️⃣ Integrator Spec

### Purpose
Numerical stepping, deterministic

### Types

```ts
type Integrator = "Euler" | "RK2"
type Dt = number
```

### Lock

* Euler by default (fast)
* RK2 optional (still cheap)
* Fixed dt
* Fixed step count per "climate tick"

---

## 8️⃣ Climate Outputs Spec

### Purpose
What other systems consume

### Outputs per band

* `Tmean`
* `precipProxy`
* `ice`
* `alpha`
* `windBandId` (optional tie-in to your existing wind model)

### Downsampling

We then downsample/upsample to surface cells deterministically:

* each cell maps to its latitude band

---

## 9️⃣ Performance Optimizations

### Structure-of-Arrays Only

* never `Band { T, alpha, ice }[]`
* always Float32Array

### Type Branding (Zero Runtime Cost)

```ts
type Kelvin = number & {__k:"K"}
type BandId = number & {__k:"BandId"}
type Unit01 = number & {__k:"U01"}
```

### Quantized Params for Caching

For gameplay knobs, store as uint16:

* `ghgQ: uint16` (0..65535)
* `solarQ: uint16`
* convert to float only inside update

This makes saves smaller and diff-friendly.

---

## 🔒 Climate Architecture Decomposition

### Core Principle

We break the climate into **atomic deterministic subsystems**, each with its own data type and update contract.

Think in terms of:

> "What becomes a stable data structure?"

Not "what equation do I implement?"

---

### SPEC GROUP A — Radiative Core

This is the thermodynamic base.

#### Data Type

```ts
type RadiativeParams = {
  solarConstant: number      // W/m²
  stefanBoltzmann: number    // constant
  emissivity: number         // effective IR emissivity
  heatCapacity: number       // J/m²K
}
```

#### State

```ts
type RadiativeState = {
  globalMeanTemp: number     // Kelvin
}
```

#### Responsibility

* Balance incoming vs outgoing radiation
* No geography
* No bands
* No transport

This can run alone.

---

### SPEC GROUP B — Albedo System

This is not thermodynamics.
This is a **surface property function**.

#### Data Type

```ts
type AlbedoParams = {
  iceAlbedo: number
  oceanAlbedo: number
  landAlbedo: number
  freezeThreshold: number
  meltThreshold: number
}
```

#### State

```ts
type SurfaceState = {
  iceCoverageFraction: number
  albedo: number
}
```

#### Responsibility

* Compute albedo from temperature
* Handle ice state transitions
* No radiation math here

Albedo is a derived property, not a radiative engine.

---

### SPEC GROUP C — Latitude Grid System

This is spatial discretization only.

#### Data Type

```ts
type LatitudeBand = {
  index: number
  latitudeCenter: number
  areaWeight: number
}
```

#### State

```ts
type LatitudeClimateState = {
  bandTemps: Float32Array
  bandAlbedo: Float32Array
}
```

#### Responsibility

* Hold temperature per band
* Provide geometry for solar distribution
* No greenhouse logic here

This allows:

* switching from 0D → 1D without touching radiation
* GPU vectorization
* performance control via band count

---

### SPEC GROUP D — Heat Transport System

This is diffusion only.

#### Data Type

```ts
type HeatTransportParams = {
  diffusionCoefficient: number
}
```

#### Responsibility

Apply:

```
[
D \nabla^2 T
]
```

This system:

* reads bandTemps
* writes bandTemps

No radiation.
No albedo.
No CO₂.

Isolated.

---

### SPEC GROUP E — Greenhouse Model

Do not mix this into radiative core.

It is a modifier.

#### Data Type

```ts
type GreenhouseParams = {
  co2ppm: number
  baseEmissivity: number
  sensitivity: number
}
```

#### Derived

```ts
effectiveEmissivity = f(CO2)
```

Or

```ts
emissionHeight = g(CO2)
```

This system outputs:

* modified emissivity
* modified outgoing radiation factor

Nothing else.

---

### SPEC GROUP F — Solar Forcing System

This is orbital/stellar layer.

```ts
type SolarForcing = {
  luminosityMultiplier: number
  axialTilt: number
  orbitalEccentricity: number
}
```

It modifies solarConstant per band.

Independent from radiation math.

---

### SPEC GROUP G — Ice State Machine

This must be explicit.

Snowball Earth is a **state transition system**.

```ts
enum IceState {
  IceFree,
  Partial,
  Snowball
}
```

Why separate this?

Because:

* Hysteresis depends on history
* It is not purely temperature-driven
* Gameplay may interact with it

Never bury this inside albedo function.

---

### SPEC GROUP H — Numerical Integration Engine

Never mix solver logic into climate logic.

```ts
type IntegratorParams = {
  timestep: number
  method: "Euler" | "RK4"
  convergenceThreshold: number
}
```

This engine:

* integrates any differential system
* does not know climate meaning

This makes climate testable.

---

## 🔒 Why This Decomposition Matters

Now your climate becomes:

```
SolarForcing
    ↓
RadiativeCore
    ↓
AlbedoSystem
    ↓
GreenhouseModifier
    ↓
LatitudeGrid
    ↓
HeatTransport
    ↓
IceStateMachine
    ↓
Integrator
```

Each one:

* testable
* swappable
* benchmarkable
* serializable
* vectorizable

---

## 🧠 Performance Advantage

Now you can:

* store bandTemps in Float32Array
* run diffusion in one loop
* precompute solar distribution
* cache albedo transitions
* switch 1D → 0D for low detail planets
* disable greenhouse for moons

Without rewriting code.

---

## 🧩 Most Important Design Principle

Every system must answer:

> "Can this become a separate data component?"

If yes → separate spec.

If no → refactor.

---

## ⚠️ What NOT To Do

Do not implement:

```
updateClimate() {
   computeSolar();
   computeAlbedo();
   computeGreenhouse();
   diffuse();
   updateIce();
}
```

That becomes a monolith.

Instead:

```
solar.update()
radiation.update()
albedo.update()
transport.update()
ice.update()
integrator.step()
```

Modular.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

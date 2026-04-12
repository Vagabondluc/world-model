# 🔒 CLIMATE SOLVER CONTRACT (EBM LEVELS 1–4) v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## 0) Goal

A deterministic climate domain that:

* updates Band fields each ClimateTick
* supports 4 sophistication levels (0D → 1-layer atm → variable albedo → 1D lat bands)
* produces Snowball hysteresis (path dependence)
* exposes parameters cleanly for dashboards & modding
* uses quantized math only

This is not GCM fluid dynamics. It is an energy-balance + diffusion model.

---

# 1) Inputs / Outputs (Hard)

## Inputs (read-only)

* Scalars:

  * SolarStrengthPPM
  * AxialTiltµdeg
  * yearPhasePPM (0..1M representing orbital position)
  * RotationRatePPM (optional, influences diffusion proxy)
  * SeaLevelcm (optional)
* Band fields:

  * ElevMeanBand (optional for lapse-rate term)
* Cell cache (optional, reduced to bands):

  * LandCover fractions (forest/farm/urban) if used for albedo
* Parameters (see section 6)

## Outputs (authoritative Band)

* TempBand (1001)
* AlbedoBand (1002)
* IceFracBand (1003)
* PrecipBand (1004) (zonal proxy)
* HumidityBand (1005) (optional)

Then expands caches to:

* TempCell, AlbedoCell, IceFracCell, PrecipCell

---

# 2) Level Selection (LOCKED)

```ts
enum ClimateLevel { L1_0D, L2_0D_Atm, L3_0D_Albedo, L4_1D_LatBands }
```

Only one level active at a time.

Switching levels is a **scenario event**, not silent.

---

# 3) Shared Constants & Quantized Units

* `σ̃` (sigma-tilde): combined outgoing coefficient (includes greenhouse)
* Temperature stored in mK
* Fluxes represented as PPM proxies (since we're not in Watts/m²)
* All coefficients are PPM-scaled

The solver is a **dimensionless EBM** that can be calibrated to Earth.

---

# 4) Level 1 — 0D No Atmosphere (Baseline)

**Equation (equilibrium form)**:

```
In = (S/4) * (1 - α)
Out = σ * T^4
```

In dynamic form:

```
dT/dt = k * (In - Out)
```

Where:

* `k` is thermal inertia inverse (PPM per tick)

Implementation details:

* use integer approximation for T^4 via fixed-point (see section 9)

Outputs:

* TempBand is constant across bands (or only band[all] exists)

---

# 5) Level 2 — 0D One-Layer Atmosphere

Uses an "effective greenhouse" parameter `ε`.

Instead of simulating atmosphere temperature explicitly, use `σ̃` coefficient.

```
Out = σ̃(ε) * T^4
```

So L2 is L1 with `σ` replaced by `σ̃`.

This level targets global mean surface temperature in the `285K..290K` band under default greenhouse configuration.

---

# 6) Level 3 — 0D Variable Albedo (Ice-Albedo Feedback)

Albedo is no longer constant:

```ts
alpha(T) =
  alphaIce when T <= T_ice
  alphaWater when T >= T_warm
  linear between
```

Quantized:

* alphaIcePPM (e.g., 600k)
* alphaWaterPPM (e.g., 300k)
* thresholds in mK:

  * T_ice_mK
  * T_warm_mK

This produces:

* two stable equilibria
* one unstable equilibrium
* hysteresis in response to S

This implements the mandatory snowball state-transition behavior for climate hysteresis validation.

Outputs:

* AlbedoBand updated from TempBand
* IceFracBand derived from TempBand thresholding (see section 8)

---

# 7) Level 4 — 1D Latitude Band Model (Zonal EBM)

Now we run the same dynamic equation per latitude band:

```
dT_i/dt = k_i * (In_i - Out_i) + Mix_i
```

Where:

### 7.1 Insolation per band

`In_i` depends on latitude + axial tilt + orbital eccentricity + season phase.

We support 2 modes:

* **AnnualMeanMode** (default v1): no seasons, stable
* **SeasonalMode**: uses `sinPPM32` and `cosPPM32` phase shifts

For SeasonalMode:

```ts
// lambda: orbital longitude = 2*pi * yearPhase
lambda = (2 * PI_PPM * yearPhasePPM) / 1_000_000

// delta: solar declination
delta = (AxialTilt * sinPPM32(lambda)) / 1_000_000

// r_sq_inv: inverse square of distance (eccentricity effect)
// omega: longitude of perihelion (constant per planet)
r_inv = (1_000_000 + (eccentricityPPM * cosPPM32(lambda - perihelionPPM)) / 1_000_000)
r_sq_inv = (r_inv * r_inv) / 1_000_000

In_i = (SolarStrength * r_sq_inv * cosPPM32(phi_i - delta)) / 1_000_000
```

(Note: `cosPPM32` and `sinPPM32` are fixed-point primitives from `68-*.md`)

### 7.2 Outgoing radiation

```
Out_i = σ̃ * T_i^4
```

### 7.3 Mixing term (diffusion proxy)

Two allowed mixing forms (choose one for v1):

**A) Mean-relaxation**

```
Mix_i = f * (T_avg - T_i)
```

**B) Neighbor diffusion**

```
Mix_i = D * (T_{i-1} - 2T_i + T_{i+1})
```

✅ v1 default: **B** (diffusion), because it matches classic 1D EBM usage.

`D` is a PPM coefficient.

### 7.4 Altitude lapse-rate proxy (optional)

If enabled:

```
T_i -= lapsePPM * ElevMeanBand_i
```

Elevation in cm, lapse converts cm to mK.
This is an `O(1)` per-band lapse-rate adjustment to reduce temperature with elevation.

---

# 8) Ice Fraction & Albedo in Level 4

IceFracBand is derived from temperature:

* `IceFrac = 1` if `T <= T_freeze`
* `IceFrac = 0` if `T >= T_melt`
* linear between

This makes partial ice caps possible.

Then AlbedoBand is computed as:

```
Albedo_i =
  lerp(alphaWater, alphaIce, IceFrac_i)
  + landCoverAdjust_i (optional)
```

Clamp 0..1,000,000.

This is the mechanism that produces advancing ice caps and snowball lock.

---

# 9) Numeric Method & Stability (Hard)

We use explicit Euler integration in BandSpace:

```
T_i_next = T_i + dtPPM * dT_i
```

Where:

* dtPPM is a stability knob per ClimateTick
* dT_i is scaled to mK per tick

Hard stability rule:

* clamp max delta per tick to exactly `±5000 mK (5K)` for v1

### T^4 approximation

We do not compute real K^4.
We use a fixed-point polynomial approximation around a reference temperature.

Contract:

* choose reference `T0` (e.g., 288150 mK)
* compute `x = (T - T0)` in mK
* approximate `T^4` as:

  * `T0^4 + 4T0^3 x + 6T0^2 x^2 + ...` truncated
* coefficients precomputed in int64

This is deterministic and fast.

---

# 10) Events & Hysteresis Tracking

Climate must emit events when crossing regimes:

* `ICE_EDGE_ADVANCE(bandId, tick)` if iceFrac crosses threshold
* `SNOWBALL_ENTER(tick)` if IceFrac global mean > 0.99
* `SNOWBALL_EXIT(tick)` if IceFrac global mean < 0.95
* `ALBEDO_CLAMPED(bandId, tick)` if clamps hit

This is crucial for narrative triggers and dashboards.

---

# 11) Parameter Set (Numeric Parameter Table v1)

All parameters are integers and versioned:

```ts
interface ClimateParamsV1 {
  level: ClimateLevel
  eccentricityPPM: uint32    // 0..1M (0.0167 for Earth)
  perihelionPPM: uint32      // Longitude of perihelion (0..2*PI PPM)

  // albedo
  alphaIcePPM: uint32
  alphaWaterPPM: uint32
  T_ice_mK: int32
  T_warm_mK: int32

  // ice fraction thresholds (can be same as above)
  T_freeze_mK: int32
  T_melt_mK: int32

  // outgoing radiation coefficient
  sigmaTildePPM: uint32      // default: 620,000 (eff emissivity 0.62)

  // mixing
  diffusionDPPM: uint32      // default: 600,000 (0.6 W m⁻² K⁻¹)

  // inertia and step
  thermalInertiaPPM: uint32  // larger = slower temp change
  dtPPM: uint32              // integrator step scaling

  // altitude coupling (optional)
  useLapse: boolean
  lapse_mK_per_cm_PPM: uint32

  // precip proxy
  precipEquatorPeakPPM: uint32
  desertDipLatBand: uint16
  desertDipDepthPPM: uint32
  precipRecoveryPPM: uint32
}
```

---

# 12) Precipitation Proxy (Zonal, Deterministic)

For v1 you can keep your earlier approach but band-based:

* high near equator
* dip at subtropics
* rise toward poles

This is purely a function of:

* latitude band
* temperature band
* optional noise (deterministic hash per band)

No fluid simulation.

Outputs PrecipBand as PPM.

---

# 13) Integration with Hex Cells

After band update:

* expand TempBand → TempCell (piecewise constant)
* expand IceFracBand → IceFracCell
* expand PrecipBand → PrecipCell
* compute biomeTypeId per cell via quantized mapping table

Biome changes are produced by the spatial layer, not climate solver.

---

# 14) Dashboard / Onboarding Requirements

Climate dashboard must show:

* TempBand graph vs latitude
* AlbedoBand graph vs latitude
* IceFracBand graph vs latitude
* a slider for SolarStrengthPPM
* a slider for sigmaTildePPM (greenhouse)
* a "Snowball hysteresis" plot: avgTemp vs solarStrength (optional, sampled)

Plus:

* current climate level (L1–L4)
* last SNOWBALL_ENTER/EXIT tick
* validity flags if dt too large (instability)

---

## ✅ Result

You now have a deterministic, typed, quantized climate engine contract that can reproduce:

* baseline equilibrium temps
* greenhouse effect tuning
* ice-albedo feedback
* snowball hysteresis and path dependence
* zonal diffusion and polar/equator gradients

# 🔒 CLIMATE v1 → HYDROLOGY COUPLING SPEC (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Related Solver`: [`docs/50-hydrology-solver-contract.md`](./50-hydrology-solver-contract.md)
- `Owns`: `[]`
- `Writes`: `[]`

---

## 0️⃣ Purpose

Convert climate outputs into exact hydrology inputs needed to:

* seed river sources
* compute flow accumulation
* form lakes and deltas
* freeze water consistently
* drive erosion/sediment later

This spec is **pure** (no randomness), cheap, and chunk-safe.

---

## 1️⃣ Inputs

From climate engine:

* `bandTempK[i]`
* `bandPrecip01[i]`
* `bandIceFrac[i]`
* `globalIceState` enum (`IceFree | Partial | Snowball`)
* `bandAlbedo[i]` (optional, only for modifiers)

From surface simulation:

* `cell.latRad`
* `cell.elevationM`
* `cell.isOcean`
* `cell.neighbors[]`
* `seaLevelM`

Optional (already in your world pipeline):

* `biomeId` (only for modifiers, not required)

---

## 2️⃣ Outputs (Hydrology-Ready Fields)

Per surface cell:

```ts
type HydroClimateFields = {
  tempK: Float32Array        // per cell
  precip01: Float32Array     // per cell
  snowFrac: Float32Array     // derived from temp
  evap01: Float32Array       // derived from temp
  freezeMask: Uint8Array     // 0/1
}
```

These fields feed the **ABCD 2-bucket model** defined in [`docs/50-hydrology-solver-contract.md`](./50-hydrology-solver-contract.md).

---

## 3️⃣ Temperature to Cell Mapping

For each cell, interpolate from climate bands:

```
cellTempK = interpolateBandTemp(cell.latRad)
cellPrecip01 = interpolateBandPrecip(cell.latRad)
```

Deterministic interpolation.

---

## 4️⃣ Snow Fraction from Temperature

```
if cellTempK < 273.15:
  snowFrac = clamp01((273.15 - cellTempK) / 20)
else:
  snowFrac = 0
```

---

## 5️⃣ Evaporation from Temperature

Simple model:

```
if cellTempK < 273.15:
  evap01 = 0
else:
  evap01 = clamp01((cellTempK - 273.15) / 40)
```

---

## 6️⃣ Authoritative Runoff (ABCD Reference)

The primary runoff contract is no longer `precip - evap`. Authoritative runoff is produced by the Hydrology Solver using:
* `SoilStorageCell`
* `GroundwaterStorageCell`
* `Baseflow`

See [`docs/50-hydrology-solver-contract.md`](./50-hydrology-solver-contract.md) for the exact discrete integration steps.

---

## 7️⃣ Freeze Mask

```
if cellTempK < 273.15:
  freezeMask = 1
else:
  freezeMask = 0
```

---

## 8️⃣ Snowball Override

If `globalIceState == Snowball`:

All land cells get `freezeMask = 1`.

---

## 9️⃣ Albedo Modifier (Optional)

If `biomeId` indicates vegetation:

```
cellAlbedo = bandAlbedo[cellBand] * 0.95
```

Reduces albedo for vegetated areas.

---

## 🔟 Determinism Contract

* No RNG in this layer
* Sort operations by cellId
* Fixed thresholds & percentiles
* Floating comparisons use epsilon

Resource maps must be identical across runs given same inputs.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

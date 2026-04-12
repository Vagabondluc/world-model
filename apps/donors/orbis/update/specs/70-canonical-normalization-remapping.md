# 🔒 CANONICAL NORMALIZATION & REMAPPING SPEC v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Define shared normalized axes so all domains and LUTs consume consistent numeric ranges.

Canonical dependencies:
* `docs/68-numerical-stability-fixed-point-math-contract.md`
* `docs/69-deterministic-curve-lut-library.md`

---

## Normalized Axes

```ts
interface NormalizedAxesV1 {
  latitudeAbsPPM: int32
  elevationNormPPM: int32
  tempNormPPM: int32
  precipNormPPM: int32
  slopeNormPPM: int32
  insolationNormPPM: int32
  biomassNormPPM: int32
}
```

All normalized values are clamped to `[0..1_000_000]`.

---

## Remap Contract

```ts
interface RemapDefV1 {
  id: uint16
  inputUnit: UnitFamilyV1
  outputUnit: UnitFamilyV1
  minIn: int32
  maxIn: int32
  minOut: int32
  maxOut: int32
  clampInput: boolean
}
```

Hard rules:
* remap parameters are data-driven and digestable
* normalization functions must be deterministic and platform-independent



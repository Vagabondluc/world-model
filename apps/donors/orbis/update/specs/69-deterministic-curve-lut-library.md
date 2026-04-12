# 🔒 DETERMINISTIC CURVE & LUT LIBRARY SPEC v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Standardize deterministic function primitives (curves/LUTs) as data, not ad-hoc runtime math.

Canonical dependencies:
* `docs/68-numerical-stability-fixed-point-math-contract.md`
* `docs/48-field-id-registry-scale-table.md`

---

## Registry

```ts
interface CurveLUTRegistryV1 {
  registryVersion: uint32
  curves1D: Curve1DDefV1[]
  luts1D: LUT1DDefV1[]
  luts2D: LUT2DDefV1[]
}

interface FuncMetaV1 {
  id: uint16
  name: string
  xUnit: UnitFamilyV1
  yUnit: UnitFamilyV1
  domainOwner: DomainId
  affectsDeterminism: boolean
}
```

---

## Curves and LUTs

```ts
enum CurveKindV1 {
  PiecewiseLinear,
  PiecewiseConstant,
  SmoothStepLinear
}

enum SampleModeV1 {
  Nearest,
  Linear
}

enum CurveClampModeV1 {
  ClampToEndpoints,
  ExtrapolateLinear
}

interface CurvePointV1 {
  x: int32
  y: int32
}

interface Curve1DDefV1 {
  meta: FuncMetaV1
  kind: CurveKindV1
  points: CurvePointV1[]
  clampMode: CurveClampModeV1
}

interface LUT1DDefV1 {
  meta: FuncMetaV1
  xMin: int32
  xMax: int32
  steps: uint16
  values: int32[]
  sampleMode: SampleModeV1
  clampMode: CurveClampModeV1
}

interface LUT2DDefV1 {
  meta: FuncMetaV1
  xMin: int32
  xMax: int32
  yMin: int32
  yMax: int32
  xSteps: uint16
  ySteps: uint16
  values: int32[]
  sampleMode: SampleModeV1
  clampMode: CurveClampModeV1
}
```

---

## 🔒 Compliance Test Vector

To ensure cross-platform parity, an implementation must pass these tests:

**Test 1: Curve1D (PiecewiseLinear)**
- `points`: `[{x:0, y:0}, {x:1000, y:5000}]`
- `eval(500)`
- `expected`: `2500`

**Test 2: LUT1D (Linear Interpolation)**
- `values`: `[0, 1000, 2000]`
- `xMin`: `0`, `xMax`: `1000`, `steps`: `2` (Indices 0, 1, 2)
- `eval(250)`
- `expected`: `500` (Linear between index 0 and 1)

**Test 3: LUT2D (Bilinear Interpolation)**
- `values`: `[0, 1000, 2000, 3000]` (2x2 grid)
- `xSteps`: `1`, `ySteps`: `1` (Indices 0..1 in x, 0..1 in y)
- `eval(0.5, 0.5)` (normalized coords)
- `expected`: `1500` (Average of 0, 1000, 2000, 3000)

Note: All evaluations must use fixed-point arithmetic as defined in `docs/68-*.md`.



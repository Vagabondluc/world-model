# 🔒 FIELD REPRESENTATION & SOLVER BASIS SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## 0) Goal

For every simulated quantity ("field"), we must define:

* canonical basis: **CellSpace** (hex cells) or **BandSpace** (latitude bands)
* projection rules: Cell→Band and Band→Cell (from your mapping contract)
* update cadence: which domain tick updates it
* conservation rules: what must be preserved when projecting
* validity/invalidation: what triggers recomputation

This lets you mix precise math (bands) with hex topology (cells) safely.

---

# 1) Two Canonical Bases (LOCKED)

## 1.1 CellSpace

Indexed by `cellId` (hex/pent):

* used when adjacency/flow/path matters
* uses neighbor graph

## 1.2 BandSpace

Indexed by `latBandId` (1D zonal):

* used for radiation balance, ice-albedo bifurcation, zonal mixing
* uses band neighbor chain

---

# 2) Field Declaration (Must Exist for Every Field)

```ts
enum FieldBasis { Cell, Band }

interface FieldDef {
  fieldId: uint32
  name: string
  basis: FieldBasis

  scale: FieldScale         // PPM, milliKelvin, etc (quantized)
  clampMin: int32
  clampMax: int32

  reducer: ReducerKind      // when aggregating deltas (SUM/MAX/MIN)
  projection: ProjectionPolicy

  updateDomain: DomainId
  updateCadence: CadenceId

  conservation: ConservationPolicy
  invalidationSources: DomainId[]
}
```

---

# 3) ProjectionPolicy (LOCKED OPTIONS)

```ts
enum ProjectionPolicy {
  None,                 // basis never projected
  CellToBand_ReduceOnly,
  BandToCell_ExpandOnly,
  RoundTrip_BandSolver, // reduce -> solve -> expand
  RoundTrip_CellSolver  // expand -> solve -> reduce (rare)
}
```

Default for climate: `RoundTrip_BandSolver`.

---

# 4) ConservationPolicy (LOCKED OPTIONS)

```ts
enum ConservationPolicy {
  None,
  AreaWeightedMean,     // temperature-like
  AreaWeightedSum,      // energy-like / mass-like
  ClampOnly,
}
```

Rules:

* Temperature fields: `AreaWeightedMean`
* Albedo: `AreaWeightedMean`
* IceFraction: `AreaWeightedMean`
* CO2Proxy total: usually `AreaWeightedSum` (if you treat it as global stock), otherwise mean if it's "concentration proxy"

You must choose per field.

---

# 5) Authoritative "Where It Lives" (Must-Lock Starter Set)

## 5.1 Climate Core (BandSpace authoritative)

These are computed in bands and expanded to cells:

* `InsolationBand` (Band)
* `TempBand` (Band)
* `AlbedoBand` (Band)
* `IceFracBand` (Band)
* `PrecipBand` (Band) *(if you keep it zonal)*

Policy: `RoundTrip_BandSolver`

Cell-space versions are caches:

* `TempCell = expand(TempBand)`
* `IceFracCell = expand(IceFracBand)`
* `PrecipCell = expand(PrecipBand)` (optional)

---

## 5.2 Surface / Terrain (CellSpace authoritative)

* `ElevationCell`
* `SlopeCell`
* `WaterMaskCell`
* `RiverFlowCell`
* `SoilQualityCell`
* `LandCoverCell` (forest/farm/urban)

Climate reads these via Cell→Band reductions when needed:

* altitude affects temp band via mean elevation per band

---

## 5.3 Ecology (CellSpace authoritative)

Ecology depends on locality:

* `BiomassCell`
* `PrimaryProductionCell`
* `SpeciesPopCell(speciesId)` (sparse)
* `NPPCell` (net primary productivity)
* `CarryingCapacityCell`

But ecology may consume climate caches:

* TempCell, PrecipCell, IceFracCell

---

## 5.4 Global Scalars (Scalar authoritative)

Some values are planet scalars, not fields:

* solarStrengthPPM
* axialTiltQ
* rotationRatePPM
* magnetosphereStrengthPPM

These can influence band solvers directly.

---

# 6) The RoundTrip Pattern (Band Solver)

At a climate tick:

1. **Reduce** (if needed)

   * `ElevationBand = reduceMean(ElevationCell)`
   * `LandCoverBand = reduceMean(LandCoverCell)` (optional)
   * `AlbedoBand` may combine ice + land cover

2. **Solve in BandSpace**

   * EBM / 1D diffusion / ice-albedo feedback
   * outputs new TempBand, IceFracBand, AlbedoBand, PrecipBand

3. **Expand caches to CellSpace**

   * TempCell = expand(TempBand)
   * IceFracCell = expand(IceFracBand)
   * PrecipCell = expand(PrecipBand)

4. Emit:

   * `FIELD_UPDATED(TempBand, tick)`
   * `DOMAIN_INVALIDATE(Ecology, reason=ClimateChanged)` if thresholds exceeded

---

# 7) When Projection Happens (Hard Rule)

Projections happen only at:

* domain commit boundaries
* never mid-tick
* never "whenever someone queries it"

No lazy projection unless you cache + version it.

---

# 8) Field Versioning & Cache Validity

Each field carries:

```ts
fieldVersion: uint64
lastUpdatedTick: AbsTime
```

Cell caches include:

* `sourceBandVersion`

If mismatch → recompute expand at next boundary.

---

# 9) Numeric Precision Policy (Must Follow)

* internal accumulation uses int64
* divide once per band reduce
* clamp to field range
* store in int32 arrays

Avoid repeated divide cycles.

---

# 10) API Contract for Domains

Domains may only read fields via:

```ts
getFieldCell(fieldId): Int32Array
getFieldBand(fieldId): Int32Array
getScalar(scalarId): int32
```

No domain accesses mesh geometry directly.
Only the spatial layer does.

---

# 11) Debug/Onboarding Requirements

Dashboard must display, per field:

* basis (Cell/Band)
* last updated tick
* source dependencies
* projection method
* conservation policy
* min/max clamps hit

This is how you teach the science.

---

# 12) Default Policy Choices (Locked Now)

For Band→Cell expansion:

* **Piecewise constant** (each cell gets its band value)

Reason:

* stable
* cheap
* avoids interpolation artifacts that look like "fake currents"

If you want pretty later, add a v2 policy.

---

## ✅ Result

You can now keep **hex as world topology** while running **latitude-accurate climate math** in bands, with deterministic projections and conserved quantities.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

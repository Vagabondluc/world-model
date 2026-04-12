# 🔒 FIELD ID REGISTRY & SCALE TABLE v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## 0) Goal

Define the **first-wave canonical fields** with:

* stable `fieldId`
* basis (Cell/Band/Scalar)
* quantized units & scale
* clamp ranges
* reducer (SUM/MAX/MIN)
* projection policy
* update domain + cadence
* conservation policy

These IDs must never be reused.

---

# 1) ID Ranges (LOCKED)

```ts
type FieldId = uint32
```

FieldId partition:

* `0x0000_0000–0x0000_FFFF` Core fields (engine)
* `0x0001_0000–0x000F_FFFF` Official expansions
* `0x0010_0000–0x00FF_FFFF` Mods
* `0xFFFF_FFFF` Invalid

---

# 2) Quantized Unit Conventions (LOCKED)

### PPM scale (default)

* `0..1_000_000` = 0..1.0

### Temperature

* **milliKelvin** in `int32` (mK)

  * Example: 288.150K ⇒ `288150`

### Angles

* **microdegrees** (µdeg) in `int32`

  * 23° ⇒ `23_000_000`

### Elevation

* **centimeters** in `int32` (cm)

### Rates

* PPM per domain-tick (explicit)

No floats in stored fields.

---

# 3) Registry Table (v1 Starter Set)

## 3.1 Scalars (not fields, but registered similarly)

| ScalarId | Name                  | Unit | Clamp                   |
| -------: | --------------------- | ---- | ----------------------- |
|        1 | WorldSeed             | u64  | n/a                     |
|        2 | SolarStrength         | PPM  | 0..2,000,000            |
|        3 | AxialTilt             | µdeg | 0..90,000,000           |
|        4 | RotationRate          | PPM  | 0..2,000,000            |
|        5 | SeaLevel              | cm   | -10,000,000..10,000,000 |
|        6 | MagnetosphereStrength | PPM  | 0..1,000,000            |

(Scalars are optional here; included because every domain reads them.)

---

## 3.2 Band Fields (Climate authoritative)

### FID 1000–1999 reserved for BandSpace

| FieldId | Name           | Unit | Clamp                   | Reducer | Projection            | Conservation     | Update Domain |
| ------: | -------------- | ---- | ----------------------- | ------- | --------------------- | ---------------- | ------------- |
|    1000 | InsolationBand | PPM  | 0..2,000,000            | SUM     | None                  | AreaWeightedMean | Climate       |
|    1001 | TempBand       | mK   | 150000..400000          | SUM     | RoundTrip_BandSolver  | AreaWeightedMean | Climate       |
|    1002 | AlbedoBand     | PPM  | 0..1,000,000            | SUM     | RoundTrip_BandSolver  | AreaWeightedMean | Climate       |
|    1003 | IceFracBand    | PPM  | 0..1,000,000            | SUM     | RoundTrip_BandSolver  | AreaWeightedMean | Climate       |
|    1004 | PrecipBand     | PPM  | 0..1,000,000            | SUM     | RoundTrip_BandSolver  | AreaWeightedMean | Climate       |
|    1005 | HumidityBand   | PPM  | 0..1,000,000            | SUM     | RoundTrip_BandSolver  | AreaWeightedMean | Climate       |
|    1006 | ElevMeanBand   | cm   | -50,000,000..50,000,000 | SUM     | CellToBand_ReduceOnly | AreaWeightedMean | Surface       |

Notes:

* `ElevMeanBand` is derived; still a field for caching.

---

## 3.3 Cell Fields (Surface authoritative)

### FID 2000–2999 reserved for CellSpace surface/hydrology

| FieldId | Name                | Unit | Clamp                   | Reducer | Projection | Conservation | Update Domain |
| ------: | ------------------- | ---- | ----------------------- | ------- | ---------- | ------------ | ------------- |
|    2000 | ElevationCell       | cm   | -50,000,000..50,000,000 | SUM     | None       | None         | Surface       |
|    2001 | SlopeCell           | PPM  | 0..1,000,000            | MAX     | None       | None         | Surface       |
|    2002 | WaterMaskCell       | PPM  | 0..1,000,000            | MAX     | None       | None         | Hydrology     |
|    2003 | RiverFlowCell       | PPM  | 0..1,000,000            | SUM     | None       | None         | Hydrology     |
|    2004 | SoilQualityCell     | PPM  | 0..1,000,000            | SUM     | None       | None         | Surface       |
|    2005 | LandCoverForestCell | PPM  | 0..1,000,000            | SUM     | None       | None         | Biosphere     |
|    2006 | LandCoverFarmCell   | PPM  | 0..1,000,000            | SUM     | None       | None         | Civilization  |
|    2007 | LandCoverUrbanCell  | PPM  | 0..1,000,000            | SUM     | None       | None         | Civilization  |

---

## 3.4 Cell Fields (Climate caches expanded from bands)

### FID 3000–3999 reserved for expanded caches

| FieldId | Name        | Unit | Clamp          | Reducer | Projection            | Conservation     | Update Domain |
| ------: | ----------- | ---- | -------------- | ------- | --------------------- | ---------------- | ------------- |
|    3000 | TempCell    | mK   | 150000..400000 | SUM     | BandToCell_ExpandOnly | AreaWeightedMean | Climate       |
|    3001 | AlbedoCell  | PPM  | 0..1,000,000   | SUM     | BandToCell_ExpandOnly | AreaWeightedMean | Climate       |
|    3002 | IceFracCell | PPM  | 0..1,000,000   | SUM     | BandToCell_ExpandOnly | AreaWeightedMean | Climate       |
|    3003 | PrecipCell  | PPM  | 0..1,000,000   | SUM     | BandToCell_ExpandOnly | AreaWeightedMean | Climate       |

These are caches: authoritative source is Band fields.

---

## 3.5 Ecology / Life Fields (Cell authoritative)

### FID 4000–4999 reserved for ecology

| FieldId | Name                     | Unit | Clamp        | Reducer | Projection | Conservation | Update Domain |
| ------: | ------------------------ | ---- | ------------ | ------- | ---------- | ------------ | ------------- |
|    4000 | BiomassCell              | PPM  | 0..1,000,000 | SUM     | None       | None         | Biosphere     |
|    4001 | NPPCell                  | PPM  | 0..1,000,000 | SUM     | None       | None         | Biosphere     |
|    4002 | CarryingCapacityCell     | PPM  | 0..1,000,000 | SUM     | None       | None         | Biosphere     |
|    4003 | BiodiversityPressureCell | PPM  | 0..1,000,000 | SUM     | None       | None         | Biosphere     |
|    4004 | RadiationLoadCell        | PPM  | 0..1,000,000 | SUM     | None       | None         | Magnetosphere |
|    4005 | ToxinLoadCell            | PPM  | 0..1,000,000 | SUM     | None       | None         | Pollution     |

Species population fields are sparse layers, not fixed FieldIds:

* `SpeciesPopLayer(speciesId)` lives in a separate typed store.

---

## 3.6 Civilization Fields (Cell + Region)

### FID 5000–5999 reserved for civilization

| FieldId | Name                 | Unit | Clamp        | Reducer | Projection             | Conservation | Update Domain |
| ------: | -------------------- | ---- | ------------ | ------- | ---------------------- | ------------ | ------------- |
|    5000 | SettlementLevelCell  | PPM  | 0..1,000,000 | MAX     | None                   | None         | Civilization  |
|    5001 | InfrastructureCell   | PPM  | 0..1,000,000 | SUM     | None                   | None         | Civilization  |
|    5002 | ConflictPressureCell | PPM  | 0..1,000_000 | SUM     | None                   | None         | Conflict      |
|    5003 | CohesionRegion       | PPM  | 0..1_000_000 | SUM     | CellToBand_ReduceOnly* | None         | Civilization  |

* Region fields may reuse "reduce" concept but through Region membership lists.

---

# 4) Cadence Table (LOCKED v1 Defaults)

Cadence IDs (example):

* 1 = ClimateTick (e.g., 1 year)
* 2 = HydroTick (e.g., 1 month)
* 3 = BioTick (e.g., 1 month)
* 4 = CivTick (e.g., 1 year)
* 5 = CombatTick (6 seconds for DnD client, plugin-controlled)

FieldDef must reference a cadence id.

---

# 5) Extension Rules (Hard)

To add a new field:

* allocate new FieldId (never reuse)
* declare basis + unit + clamp
* declare authoritative domain
* declare projection + conservation
* bump FIELD_REGISTRY_VERSION

```ts
FIELD_REGISTRY_VERSION = 1
```

---

# 6) Minimal Must-Have Indexes

Engine must maintain:

* `cellId -> latBandId`
* `bandId -> cellId[]`
* `regionId -> cellId[]`
* `tagId -> biomeId[]` (optional index)

Without these, queries become O(n).

---

## ✅ Result

You now have a first-wave *typed, stable, quantized field registry* that:

* supports your band climate solvers
* supports hex-cell local ecology and gameplay
* supports deterministic caching
* supports dashboards + onboarding
* supports mod-safe extension later

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

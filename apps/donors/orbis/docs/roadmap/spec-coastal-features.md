
# **SPEC — Coastal Features: Barrier Islands, Lagoons, Fjords**

## Status

**Draft – Ready for Implementation**

## Scope

This specification defines **long-term coastal feature evolution** for an Earth-like planet simulation, specifically:

1. **Barrier islands & lagoons**
2. **Fjords via glacial overdeepening**

The system operates on an existing **hex-based planetary authority grid** and integrates with:

* river incision
* sediment transport
* depression filling / breaching
* long-term coastline evolution

It is **deterministic**, **scale-agnostic**, and **unit-clean** (meters internally).

---

## 1. Goals & Non-Goals

### Goals

* Produce realistic coastal landforms over geologic time
* Integrate sediment supply, wave energy, climate, and tectonics
* Avoid voxel storage or fluid simulation
* Allow consistent visualization in both hex-globe and voxel views

### Non-Goals

* No real-time wave simulation
* No shoreline polygon extraction
* No short-term (storm-scale) morphology
* No biological/ecological modeling (handled elsewhere)

---

## 2. Preconditions & Dependencies

### Required upstream systems

* Hex grid with neighbor graph
* Elevation field (meters)
* Sea level (meters, global)
* Sediment transport system
* River flow graph (`receiver`, `accumulation`)
* Depression resolution (fill + breach)
* Climate fields: temperature, moisture
* Tectonic regime classification

### Units

* **All distances, elevations, thicknesses: meters**
* **All time: years**
* External/UI unit conversion is handled elsewhere

---

## 3. Data Model Extensions

### 3.1 Coastal Feature Enumeration

```ts
export type CoastalFeature =
  | "NONE"
  | "BARRIER"
  | "LAGOON"
  | "INLET"
  | "FJORD";
```

---

### 3.2 Coastal Cell Extension

```ts
export type CoastalCell = {
  id: string;
  neighbors: string[];

  elevation: number;          // meters
  sediment: number;           // meters of unconsolidated sediment
  moisture: number;           // 0..1
  temperature: number;        // 0..1
  tectonicZone: TectonicZone; // existing enum

  // River-related (already present upstream)
  recv?: string | null;
  acc?: number;

  // Coastal / marine
  waterLevel?: number;        // meters; defined for lakes/lagoons
  waveEnergy?: number;        // 0..1 proxy

  // Feature state
  coastalFeature?: CoastalFeature;

  // Barrier-specific
  sandStore?: number;         // meters of mobile sand
  channelBedOffset?: number;  // meters relative to floodplain (negative = incised)

  // Glacial-specific
  isGlaciated?: boolean;
  valleyScore?: number;
};
```

---

## 4. Coastal Regime Classification

```ts
export type CoastalRegime =
  | "PASSIVE_MARGIN"
  | "ACTIVE_MARGIN"
  | "RIFTING_MARGIN"
  | "STABLE_CRATON";
```

### Regime derivation rule

* `SUBDUCTION`, `OROGENIC` → `ACTIVE_MARGIN`
* `RIFT` → `RIFTING_MARGIN`
* otherwise → `PASSIVE_MARGIN`

---

## 5. Barrier Islands & Lagoons

### 5.1 Formation Preconditions

A coastal cell **may form a BARRIER** if all conditions are met:

| Condition                | Requirement                 |
| ------------------------ | --------------------------- |
| Coastal adjacency        | ≥1 neighbor below sea level |
| Regime                   | PASSIVE_MARGIN              |
| Shelf slope              | ≤ configured threshold      |
| Wave energy              | ≥ minimum                   |
| Sand availability        | sandStore ≥ minimum         |
| Relative sea-level trend | stable or rising            |

---

### 5.2 Barrier Parameters

```ts
export type BarrierParams = {
  dtYears: number;

  seaLevel: number;

  minWaveEnergy: number;        // 0..1
  maxShelfSlope: number;        // dimensionless proxy
  minSandStore: number;         // meters

  barrierCrestHeight: number;   // meters above sea (typ. 1–3)
  lagoonDepth: number;          // meters below sea (typ. 1–5)

  inletSpacingCells: number;    // deterministic spacing
};
```

---

### 5.3 Barrier Formation Effects

When a barrier forms:

* Cell feature → `BARRIER`
* Cell elevation raised to `seaLevel + barrierCrestHeight`
* `sandStore` reduced accordingly
* One landward neighbor becomes `LAGOON`
* Lagoon elevation set to `seaLevel - lagoonDepth`
* Lagoon `waterLevel` set to seaLevel

---

### 5.4 Inlets

* Every N barrier cells, deterministically create an `INLET`
* Inlets:

  * maintain lagoon ↔ ocean connectivity
  * reduce sediment trapping efficiency locally

---

### 5.5 Barrier Migration (Rollover)

Triggered by **sea-level rise**:

* If barrier crest < target crest:

  * sand overwash moves landward
  * lagoon sediment increases
  * barrier crest re-established near sea level

This produces:

* landward barrier migration
* gradual lagoon infilling

---

## 6. Fjords & Glacial Overdeepening

### 6.1 Glaciation Detection

A cell is considered **glaciated** if:

| Condition   | Threshold                       |
| ----------- | ------------------------------- |
| Temperature | < cold threshold (e.g. 0.2)     |
| Elevation   | > alpine threshold (e.g. 300 m) |

---

### 6.2 Valley Detection

* Use **flow accumulation** as valley proxy
* Normalize using `log(1 + acc)`
* Fjord carving applies only where:

  * valleyScore ≥ threshold
  * downstream path reaches ocean

---

### 6.3 Fjord Parameters

```ts
export type FjordParams = {
  dtYears: number;
  seaLevel: number;

  minValleyScore: number;
  carveRate: number;           // m / kyr
  maxCarvePerStep: number;     // meters

  coastalBoost: number;        // increased carving near coast
  fjordWidth: number;          // neighbor spread iterations
};
```

---

### 6.4 Overdeepening Rules

For qualifying cells:

* Remove sediment first
* Then lower bedrock elevation
* Apply neighbor spreading to widen fjord
* If carved below sea level near coast:

  * cell feature → `FJORD`
  * water occupies valley automatically

Optional enhancement:

* create a shallow sill at fjord mouth

---

## 7. Integration Order (Per Geologic Tick)

Recommended execution order:

1. Depression resolution (fill + breach)
2. River graph & accumulation
3. River incision
4. Sediment transport & deposition
5. Lake / reservoir trapping
6. **Fjord overdeepening**
7. **Barrier & lagoon formation**
8. Barrier migration & inlet maintenance
9. Long-term coastline balance (uplift / erosion)

---

## 8. Outputs & Invariants

### Outputs

* Updated `elevation`
* Updated `sediment`
* Assigned `coastalFeature`
* Stable drainage to ocean

### Invariants

* No inland drainage dead-ends
* No negative sediment
* Barrier crest remains near sea level
* Fjords only form in cold, steep coastal valleys

---

## 9. Visualization Contracts

### Hex-globe view

* Render `coastalFeature` overlays
* Optional: lagoon water tint, barrier sand color

### Voxel view

* Barrier → sandy ridge voxels
* Lagoon → shallow water + mud
* Fjord → deep, steep rock walls + water

No special voxel logic required beyond existing material resolver.

---

## 10. Determinism & Save Rules

* No random numbers at runtime
* All stochastic placement (inlets) uses deterministic hash
* Save state contains only:

  * elevation
  * sediment
  * coastalFeature
  * channelBedOffset (if present)

---

## 11. Open Extension Points (Explicit)

* Barrier breaching during storms
* Estuarine salinity gradients
* Fjord sill dynamics
* Human modification (dams, reclamation)
* Non-Earth presets

---

### End of SPEC

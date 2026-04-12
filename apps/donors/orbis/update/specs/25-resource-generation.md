# 🔒 RESOURCE GENERATION FROM GEOLOGICAL HISTORY SPEC v1.0

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Deterministic • Gameplay-First • Geology-Causal)

This layer converts your already-locked systems into **resource fields** that are:

* reproducible from seed
* spatially coherent
* explainable (cause → effect)
* useful for gameplay (settlement, trade, conflict)

---

## 0️⃣ Inputs (Frozen Dependencies)

Resource layer reads only:

```ts
PlateLayer (plateId, boundaryType, stress)
ElevationLayer (final H or component fields)
HydrologyLayer (basinId, rivers, flowAccum, floodplain, delta)
ImpactLayer (events, crater type, ejecta mask)
VolcanicLayer (resurfacing mask)  // if present
SurfaceAgeLayer
ClimateLayer (temp, precipitation, biome)  // for renewables & fertility
```

No feedback loops. No randomness here.

---

## 1️⃣ Output Model

We store **continuous fields** + derived discrete nodes.

Per surface cell:

```ts
type ResourceCell = {
  fertility: number
  freshWater: number
  timber: number
  fish: number

  metals: number        // copper/iron/etc lumped or split
  rareMetals: number    // gold/rare earths etc
  hydrocarbons: number
  stone: number

  geothermal: number
  solar: number
  wind: number

  hazard: number        // volcano, quake proxy, radiation proxy, etc
}
```

Optional: extracted "sites" (mines, springs, ports) as nodes later.

---

## 2️⃣ Deterministic Composition Strategy

We do NOT place resources randomly.

We compute them as weighted sums of causal signals:

```
resource = clamp01( Σ weight_i * signal_i )
```

All signals are already deterministic.

---

## 3️⃣ Core Geological Signals (Must-Have)

These signals are derived fields you can reuse everywhere.

### 3.1 Plate Boundary Proximity

* `nearConvergent`
* `nearDivergent`
* `nearTransform`

Derived from your boundary kernel + classification.

### 3.2 Basin Type

* `isSedimentaryBasin` (large basinId area + low slope)
* `isFloodplain`
* `isDelta`

### 3.3 Impact Signals

* `isCentralPeak`
* `isEjecta`
* `isYoungCrater`
* `isBasinImpact`

### 3.4 Volcanic / Resurfacing

* `isYoungLava`
* `isOldLava`

### 3.5 Climate Productivity

* `wetWarmIndex`
* `aridityIndex`
* `freezeIndex`

---

## 4️⃣ Resource Rules (Locked Mappings)

### 4.1 Fertility

Cause: moisture + warmth + floodplains + deltas + surface age

```
fertility =
  wetWarmIndex
  + floodplainBoost
  + deltaBoost
  + ageSoilBoost
  - steepSlopePenalty
  - desertPenalty
```

Hard rule:

* Deserts can still be fertile near rivers (oasis effect): add `freshWater` coupling.

### 4.2 Fresh Water

Cause: rivers + lakes + precipitation

```
freshWater =
  riverPresence * f(flowAccum)
  + lakeProximity
  + precipitation
  - freezePenalty
```

If no freshwater within radius R:

* heavy penalty.

### 4.3 Timber

Cause: biome + precipitation + temperature

```
timber = biomeForestMask * wetWarmIndex
```

No timber in tundra/desert unless near water.

### 4.4 Fish

Cause: coastal productivity + river mouths + shelf depth

```
fish =
  coastProximity
  + deltaBoost
  + coldUpwellingBoost (optional)
```

### 4.5 Hard-Rock Resources

#### 4.5.1 Metals (general ore)

Cause: convergent margins + uplift + erosion exposure + old crust

```
metals =
  nearConvergent * upliftIndex
  + erosionExposure
  + oldCrustBonus
  - youngLavaPenalty  // lava can bury veins
```

Gameplay intent:

* Mountains produce mines.

#### 4.5.2 Rare Metals (gold/rare earths style)

Cause: impacts + hydrothermal + old crust

```
rareMetals =
  centralPeakBoost
  + ejectaBoost (young)
  + geothermalBoost
  + oldCrustBonus
```

Impacts matter here on purpose:

* Central peaks expose deep material.
* Young ejecta spreads rare metals.

#### 4.5.3 Stone

Cause: everywhere, but best in mountains and crater rims

```
stone =
  slopeIndex
  + craterRimBoost
  + tectonicRidgeBoost
```

---

## 5️⃣ Energy Resources

### 5.1 Geothermal

Cause: divergent boundaries + volcanism + young crust

```
geothermal =
  nearDivergent
  + youngLava
  + thinCrustIndex
```

### 5.2 Solar

Cause: arid + low cloud proxy (use precipitation inverse) + latitude weighting

```
solar =
  aridityIndex
  + lowPrecipBonus
  - polarPenalty
```

### 5.3 Wind

Cause: latitudinal bands + coastlines + mountain passes (optional)

```
wind =
  latitudeWindBand
  + coastBoost
  + mountainPassBoost
```

---

## 6️⃣ Hazards

Hazards are gameplay levers.

### 6.1 Volcanic Hazard

```
hazardVolcano = nearDivergent + nearConvergentSubduction + youngLava
```

Combine:

```
hazard = max(hazardVolcano, hazardQuake) + craterRadiationProxy(optional)
```

### 6.2 Seismic Hazard

```
hazardQuake = nearTransform + stressIndex
```

---

## 7️⃣ Normalization & Tuning (Must-Have)

All fields are clamped:

* 0..1 per cell

Global balancing knobs:

* weights per resource
* target density percentiles per resource

Important: tuning happens by weights only, never by injecting randomness.

---

## 8️⃣ "Site Extraction" (Discrete Nodes)

After fields exist, you can extract points of interest deterministically:

* Mines: local maxima of metals/rareMetals
* Springs: freshWater maxima near elevation drop
* Ports: delta + coast + low hazard
* Cities: fertility + freshWater + trade access

Tie-break:

* highest value
* lowest cellId for determinism

---

## 9️⃣ Determinism Contract

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

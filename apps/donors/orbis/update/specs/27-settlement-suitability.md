# 🔒 SETTLEMENT SUITABILITY & CITY PLACEMENT SPEC v1.0

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Deterministic • Geography-Causal • Strategy-Ready)

This layer produces:

* Settlement suitability score per cell
* Ranked candidate city sites
* Natural early expansion clusters
* Trade hubs
* Strategic capitals

No randomness.
Purely geography-driven.

---

## 0️⃣ Inputs

Reads only:

```
BiomeLayer
ResourceLayer
HydrologyLayer (basinId, rivers, flowAccum, floodplain, delta)
MovementCostField
Elevation
BiomeLayer
HazardLayer
Coast/River/Delta flags
```

Outputs:

```
settlementScore[cell]
cityCandidates[]
```

---

## 1️⃣ Core Suitability Components

Each cell gets a normalized score:

```
S = w_food * foodScore
  + w_water * waterScore
  + w_trade * tradeScore
  + w_resources * resourceScore
  - w_hazard * hazardScore
  - w_slope * slopePenalty
```

All components deterministic.

---

## 2️⃣ Food Score

Derived from:

* fertility
* floodplain/delta bonus
* biome productivity
* climate stability (low T_range optional)

Example:

```
foodScore =
    fertility
  + floodplainBonus
  + deltaBonus
  - desertPenalty
  - alpinePenalty
```

Hard rule:

* Polar ice cells cannot exceed minimal threshold.

---

## 3️⃣ Water Score

```
waterScore =
    freshWater
  + riverProximity
  + lakeProximity
```

If no freshwater within radius R:

* heavy penalty.

---

## 4️⃣ Trade Score

Weighted sum of:

* river trade
* coast trade
* junction bonus (river confluence)

```
tradeScore = riverTrade + coastTrade + junctionBonus
```

River confluences become natural hubs.

---

## 5️⃣ Resource Score

Weighted sum of:

* metals
* rareMetals
* stone
* timber
* fish

We lock that:

ResourceScore uses diminishing returns:

```
resourceScore = Σ sqrt(resource_i)
```

Prevents single resource domination.

---

## 6️⃣ Hazard Penalty

From hazard field:

```
hazardPenalty = hazardValue
```

Optional rule:

* Floodplains have mild periodic hazard but not disqualifying.

---

## 7️⃣ Slope Penalty

Settlements prefer flat terrain.

Slope measure:

```
localSlope = max elevation difference with neighbors
```

Penalty:

```
slopePenalty = clamp01(localSlope / slopeMax)
```

Mountains strongly penalized.

---

## 8️⃣ Global Normalization

After computing S for all cells:

* Normalize 0..1
* Optionally clip bottom X% to zero

This produces settlement suitability heatmap.

---

## 9️⃣ City Candidate Extraction

We now extract discrete city sites.

### 9.1 Local Maxima Rule

A cell is candidate if:

```
S[cell] > S[neighbors]
AND S[cell] > threshold
```

Tie-break:

* highest S
* lowest cellId for determinism

---

### 9.2 Minimum Distance Rule

To prevent clustering:

* sort candidates descending by S
* greedily accept
* reject any candidate within radius D of accepted one

D locked per tier.

This produces evenly spaced major sites.

---

## 🔟 Settlement Tiers

Classify sites:

* **Village**: S > 0.4
* **Town**: S > 0.6
* **City**: S > 0.75
* **Capital-grade**: S > 0.85 + tradeScore high

No randomness.

---

## 1️⃣1️⃣ Derived Strategic Effects

From city placement you get:

* Natural civilizations forming along rivers
* Delta megacities
* Mountain mining towns
* Coastal trade empires
* Desert oases

All emergent from earlier layers.

---

## 1️⃣ Inputs / Outputs

### Inputs (Read-Only)
* `BiomeIdCell`: `uint8`
* `FertilityCell`: `uint32` (PPM)
* `FreshWaterCell`: `uint8` (0/1 flag)
* `RiverProximityCell`: `uint32` (PPM, 1M = adjacent)
* `TradeNodeCell`: `uint32` (PPM hub potential)
* `SlopeCell`: `uint32` (PPM)

### Outputs
* `SettlementSuitabilityCell`: `uint32` (PPM score)
* `CityCandidateRegistry`: `uint32[]` (Sorted array of cellIds)

---

## 2️⃣ Locked Constants (Weights)

```ts
const W_FOOD_PPM: uint32 = 400_000
const W_WATER_PPM: uint32 = 300_000
const W_TRADE_PPM: uint32 = 200_000
const W_RESOURCE_PPM: uint32 = 100_000
const SLOPE_PENALTY_MAX_PPM: uint32 = 500_000
```

---

## 3️⃣ Suitability Calculation (Fixed-Point)

```ts
score = (W_FOOD * Fertility) + (W_WATER * RiverProx) + (W_TRADE * TradeNode)
score = score / 1_000_000
penalty = (Slope * SLOPE_PENALTY_MAX_PPM) / 1_000_000
finalScore = clampPPM(score - penalty)
```

---

## 9️⃣ City Candidate Selection

### 9.1 Deterministic Selection Rule

1. Collect all cells where `finalScore > 750_000`.
2. Sort by `(finalScore desc, cellId asc)`.
3. Iterate through sorted list:
   - Accept candidate if no existing city within `MinCityDistance`.
   - `MinCityDistance` is fixed at `10` units for v1.

---

## 1️⃣0️⃣ Compliance Test Vector

**Inputs:**
- `Fertility`: `800_000`
- `RiverProx`: `1_000_000`
- `TradeNode`: `200_000`
- `Slope`: `50_000`

**Calculation:**
1. `base = (0.4 * 800k) + (0.3 * 1M) + (0.2 * 200k) = 320k + 300k + 40k = 660k`
2. `penalty = (0.05 * 500k) = 25k`
3. `finalScore = 635k`

**Result:** `635_000` (Town-grade suitability)

---

## 1️⃣3️⃣ Interaction With Epoch System

If time-stepped mode enabled:

Settlement suitability can update every N steps:

* Climate shifts affect fertility
* River migration (if enabled later)
* Volcanic resurfacing reduces S locally

But v1 lock:

* Settlement placement computed at "present epoch" only.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

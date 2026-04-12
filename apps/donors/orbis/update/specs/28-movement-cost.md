# 🔒 MOVEMENT & TRAVEL COST FIELD SPEC v1.0

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Deterministic • Terrain-Causal • Civ-Ready • Pathfinding-Stable)

This converts:

* Elevation
* Slope
* Biome
* Rivers
* Coastlines
* Ice
* Hazard

into a stable, deterministic **cost field** usable for:

* A* pathfinding
* Trade route evaluation
* AI expansion
* Migration
* Supply lines
* Strategic choke detection

---

## 0️⃣ Design Goals

Must:

* Be deterministic
* Avoid discontinuities
* Produce realistic route corridors
* Reflect geography causally
* Be stable across LOD tier (macro consistency)
* Provide hooks for minigames

---

## 1️⃣ Inputs / Outputs

### Inputs (Read-Only)
* `ElevationCell`: `int32` (cm)
* `BiomeIdCell`: `uint8`
* `RiverEdgeMask`: `uint8` (0=none, 1=minor, 2=major crossing)
* `TempCCell`: `int32` (milliCelsius)

### Outputs
* `MovementCostEdge`: `uint32` (PPM cost multiplier, 1M = base)

---

## 2️⃣ Locked Constants (Multipliers)

```ts
const UPHILL_K_PPM: uint32 = 50_000        // Cost increase per % slope
const RIVER_CROSSING_MAJOR_PPM: uint32 = 2_000_000 // 2x cost
const BIOME_DESERT_PPM: uint32 = 1_800_000
const BIOME_FOREST_PPM: uint32 = 1_200_000
```

---

## 3️⃣ Edge Cost Calculation (Fixed-Point)

Movement cost is defined **per cell-to-neighbor edge**, not per cell.

For neighbor edge `(A → B)`:

```
cost(A→B) = baseCost
          * slopeFactor
          * biomeFactor
          * riverFactor
          * climateFactor
          * hazardFactor
```

Multiplicative, not additive.

This keeps relative geography meaningful.

---

## 2️⃣ Base Cost (Locked)

Default land cost:

```
baseCost = 1.0
```

Ocean travel uses separate naval cost model (later).

---

## 3️⃣ Slope Factor (Critical)

Slope computed as:

```
slope = (elevB - elevA) / angularDistance(A,B)
```

We define:

### Uphill

```
if slope > 0:
    slopeFactor = 1 + uphillK * slope
```

### Downhill

```
if slope < 0:
    slopeFactor = 1 + downhillK * abs(slope) * downhillPenaltyScale
```

Constraint:

```
slopeFactor >= 1.0
```

---

## 4️⃣ Biome Factor

```ts
const biomeCosts: Record<BiomeId, number> = {
  PolarIce: 2.0,
  Tundra: 1.5,
  BorealForest: 1.2,
  TemperateForest: 1.0,
  Grassland: 1.0,
  Desert: 1.8,
  Savanna: 1.3,
  TropicalForest: 0.9,
  Alpine: 2.5,
  Ocean: 0.5
}
```

---

## 5️⃣ River Factor

### 5.1 Crossing Large River

If crossing large river:

```
riverFactor = 2.0
```

### 5.2 Along River

If expanding between coastal cells:

```
riverFactor = 0.7
```

This produces:

* River-valley civilizations
* Natural cross-river border tension

---

## 6️⃣ Climate Factor

Based on temperature and precipitation:

```
if tempC < 0:
    climateFactor = 2.0
elif tempC > 35:
    climateFactor = 1.5
else:
    climateFactor = 1.0
```

---

## 7️⃣ Hazard Limiting Rule

High hazard zones reduce expansion but do not fully block.

```
expansionCost *= (1 + hazardValue)
```

Volcanic belts become frontier regions.

---

## 8️⃣ Natural Barrier Effects

Mountains, deserts, dense forest become expensive → slow expansion.

Major rivers influence expansion:

* Along river: reduced cost
* Crossing: extra penalty

---

## 9️⃣ Compliance Test Vector

To ensure cross-platform parity, an implementation must pass this calculation test:

**Inputs:**
- `SlopePPM`: `100_000` (10% grade)
- `Biome`: `Desert` (`1.8x`)
- `River`: `Major Crossing` (`2.0x`)

**Calculation:**
1. `slopeFactor = 1M + (100k * 50k / 1M) = 1M + 5k = 1.005`
2. `base_with_slope = 1.005`
3. `with_biome = 1.005 * 1.8 = 1.809`
4. `with_river = 1.809 * 2.0 = 3.618`

**Result:** `3_618_000` (PPM cost)

---

## 🔟 Determinism Contract

* Factions processed in ascending factionId
* Dijkstra uses stable priority queue (tie-break by cellId)
* No randomness
* Same inputs → identical borders

---

## 1️⃣1️⃣ Emergent Effects

This system guarantees:

* Mountain ridges form borders
* River valleys unify regions
* Deserts create buffer zones
* Islands form separate states
* Basins form cultural cores

Without scripting.
---

## 1️⃣2️⃣ Interaction With Future Systems

Later you can layer:

* Technology reduces movement cost
* Naval ability enables sea crossing
* Roads modify movement cost graph
* Culture modifies basin penalty

But v1 locks purely geography-driven expansion.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

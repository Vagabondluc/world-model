# 🔒 CLIMATE v1 → BIOME STABILITY CONTRACT (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

---

## 0️⃣ Purpose

Convert:

* `tempK[cell]`
* `precip01[cell]`
* `elevationM`
* `freezeMask`
* `runoff01`

into:

```
biomeId[cell]
```

in a way that is:

* deterministic
* stable
* hysteresis-aware
* resistant to small oscillations

---

## 1️⃣ Biome Input Fields (Strict)

Biome system may only read:

```ts
type BiomeClimateInputs = {
  tempK: Float32Array
  precip01: Float32Array
  runoff01: Float32Array
  freezeMask: Uint8Array
  elevationM: Float32Array
}
```

Biome cannot access:

* raw solar
* band index
* greenhouse
* albedo directly

Prevents circular logic.

---

## 2️⃣ Temperature Normalization (Frozen)

We convert temp to Celsius for biome thresholds only:

```
tempC = tempK - 273.15
```

---

## 3️⃣ Biome Axes Definition (2D Core)

Biome determined by:

* Mean annual temperature (tempC)
* Precipitation (precip01)

We define 2D climate space:

```
X = clamp(tempC, -20, 40)
Y = precip01
```

---

## 4️⃣ Primary Biome Classes (Locked v1 Set)

We freeze this minimal but realistic set:

```ts
enum BiomeId {
  PolarIce,
  Tundra,
  BorealForest,
  TemperateForest,
  Grassland,
  Desert,
  Savanna,
  TropicalForest,
  Alpine,
  Ocean
}
```

No expansion until v2.

---

## 5️⃣ Base Biome Decision Table (Frozen)

### 5.1 Ocean

If `cell.isOcean`:
→ `Ocean`

---

### 5.2 Polar Ice

If:

```
tempC <= -5
AND freezeMask == 1
```

→ `PolarIce`

---

### 5.3 Alpine

If:

```
elevationM > 2500
AND tempC < 10
```

→ `Alpine`

---

### 5.4 Desert

If:

```
precip01 < 0.15
AND tempC > 5
```

→ `Desert`

---

### 5.5 Tundra

If:

```
tempC <= 2
AND precip01 >= 0.15
```

→ `Tundra`

---

### 5.6 Boreal Forest

If:

```
2 < tempC <= 10
AND precip01 >= 0.25
```

→ `BorealForest`

---

### 5.7 Temperate Forest

If:

```
10 < tempC <= 22
AND precip01 >= 0.35
```

→ `TemperateForest`

---

### 5.8 Grassland

If:

```
10 < tempC <= 25
AND 0.15 <= precip01 < 0.35
```

→ `Grassland`

---

### 5.9 Savanna

If:

```
tempC > 22
AND 0.15 <= precip01 < 0.35
```

→ `Savanna`

---

### 5.10 Tropical Forest

If:

```
tempC > 22
AND precip01 >= 0.35
```

→ `TropicalForest`

---

Fallback rule:

If none match → Grassland.

---

## 6️⃣ Biome Hysteresis Layer (Critical)

To prevent flicker:

We add memory.

Each cell stores:

```
previousBiomeId
```

Transitions require crossing thresholds by margin.

---

### 6.1 Schmitt Trigger Thresholds (Per-Biome)

Instead of global margins, each biome defines an **Entry Threshold** (to become this biome) and an **Exit Threshold** (to leave this biome). 

Default Hysteresis Buffer: 15% PPM / 1.5°C.

| Biome | Temp Entry | Temp Exit | Precip Entry | Precip Exit |
| :--- | :--- | :--- | :--- | :--- |
| **Desert** | > 5.0 | < 3.5 | < 0.15 | > 0.20 |
| **Tropical** | > 22.0 | < 20.5 | > 0.35 | < 0.30 |
| **Tundra** | < 2.0 | > 3.5 | > 0.15 | < 0.10 |

**Rule:** A cell only switches `biomeId` if the climate variables cross the **Entry** threshold of the new biome while simultaneously crossing the **Exit** threshold of the current biome.

---

## 7️⃣ Snowball Override Rule

If globalIceState == Snowball:

All land biomes forced to:

```
PolarIce
```

except:

* equatorial band if tempC > -2

This gives realistic partial melt behavior during recovery.

---

## 8️⃣ River Influence Modifier

If:

```
runoff01 > 0.5
AND biome == Desert
```

Override to:

```
Savanna
```

Simulates Nile-like river corridors.

Deterministic.

---

## 9️⃣ Stability Contract

Biome update order:

1. Compute candidateBiome
2. Compare to previousBiome
3. Apply hysteresis margin
4. Apply overrides (snowball, river)
5. Commit biome

No random factors.

---

## 🔟 Data Structure

```ts
type BiomeClassificationState = {
  biomeId: Uint8Array
}
```

Uint8 ensures compact memory.

---

## 1️⃣1️⃣ Determinism Rules

* No noise
* No randomness
* Fixed order evaluation
* Stable threshold comparison
* Margins fixed

Same climate → same biomes always.

---

## 1️⃣2️⃣ Emergent Behaviors Guaranteed

This system produces:

* Stable desert belts
* Stable tundra margins
* Tropical band near equator
* Rainforest collapse if precip drops
* Desertification if climate dries
* Snowball biome collapse
* River green corridors

Without flicker.

---

## 📦 Memory Cost

Per 1M cells:

* biomeId: 1 MB
* previousBiomeId: 1 MB

Extremely cheap.

---

## ✅ Climate → Biome layer is now LOCKED.

---

## 🔥 At This Point You Have:

✔ Deterministic climate
✔ Snowball hysteresis
✔ Precipitation proxy
✔ Hydrology coupling
✔ Stable biome system

Your planet simulator now has a **fully causal climate pipeline**.

---

## 🔒 Carbon Cycle Feedback Spec

(because it closes Snowball escape loop and connects tectonics, volcanism, erosion, and civilization)

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

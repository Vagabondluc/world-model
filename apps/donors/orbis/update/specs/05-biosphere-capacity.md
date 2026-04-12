# 🔒 BIOSPHERE CAPACITY LAYER (FROZEN v1)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

This is the **life envelope model**.

It answers one question:

> How much complex life can this planet sustain right now?

---

## 1️⃣ Core Definition

```ts
type BiosphereCapacity01 = number   // 0..1
```

Interpretation:

| Value | Meaning               |
| ----- | --------------------- |
| 0.0   | Sterile world         |
| 0.2   | Microbial only        |
| 0.4   | Simple multicellular  |
| 0.6   | Complex ecosystems    |
| 0.8   | Biodiverse planet     |
| 1.0   | Peak stable biosphere |

---

## 2️⃣ Inputs (Cross-Domain Dependencies)

This layer depends on:

```ts
meanTempK
precipitation01
radiationStress01
atmosphereDensity01
oceanCoverage01
```

Optional later:

```ts
tectonicActivity01
```

---

## 3️⃣ Normalize Climate Suitability

We first define climate envelope fitness.

### Temperature Fitness

Optimal band:

```
288K ± 20K
```

Function:

```
tempFitness = clamp(
  1 - abs(meanTempK - 288) / 40,
  0,
  1
)
```

Hard extinction:

```
if meanTempK < 240 or > 330 → tempFitness = 0
```

### Precipitation Fitness

```
precipFitness = precipitation01
```

If precipitation < 0.1 → desert collapse penalty:

```
precipFitness *= 0.5
```

### Radiation Fitness

```
radiationFitness = 1 - radiationStress01
```

Hard extinction:

```
if radiationStress01 > 0.8 → radiationFitness = 0
```

### Atmosphere Fitness

```
atmFitness = atmosphereDensity01
```

Hard extinction:

```
if atmosphereDensity01 < 0.1 → atmFitness = 0
```

### Ocean Modifier

Life emergence probability increases with water:

```
oceanBonus = clamp(oceanCoverage01 * 0.5 + 0.5, 0.5, 1)
```

Meaning:

* No ocean = 0.5 multiplier
* 50% ocean = 0.75
* 100% ocean = 1

---

## 4️⃣ Combine Fitness

We use multiplicative collapse model:

```
rawCapacity =
    tempFitness *
    precipFitness *
    radiationFitness *
    atmFitness *
    oceanBonus
```

Then:

```
biosphereCapacity01 = clamp(rawCapacity, 0, 1)
```

Multiplicative ensures:

* one catastrophic variable collapses system
* no unrealistic compensation

---

## 5️⃣ Time Evolution

This is not instant.

```ts
dB/dt = (targetCapacity - currentCapacity) * recoveryRate
```

Default:

```
recoveryRate = 0.01 per 1k years
```

Meaning:

* Biosphere lags climate
* Snowball recovery takes millions of years
* Extinction events leave scars

---

## 6️⃣ Stability Feedback (Locked)

Biosphere feeds back into:

### Carbon Cycle

Higher biosphere → CO₂ drawdown:

```
co2RemovalRate ∝ biosphereCapacity01
```

### Albedo Modifier

Vegetation lowers albedo:

```
alpha -= biosphereCapacity01 * 0.05
```

Small but systemic.

---

## 7️⃣ Extinction Events

If:

```
biosphereCapacity01 drops > 0.4 in < 100k years
```

Trigger:

`MassExtinctionEvent` is canonically defined in `docs/14-mass-extinction.md`.
This layer consumes that event contract.

Recovery time scales inversely with tectonics + oceans.

---

## 8️⃣ Dashboard Abstraction

Expose:

```ts
interface BiosphereViewModel {
  vitality01: number
  dominantTier:
    | "Sterile"
    | "Microbial"
    | "Simple"
    | "Complex"
    | "Advanced"
  collapseRisk: "Low" | "Moderate" | "High"
}
```

Mapping:

```
vitality01 = biosphereCapacity01
```

Tier thresholds:

```
0.0–0.1  → Sterile
0.1–0.3  → Microbial
0.3–0.5  → Simple
0.5–0.75 → Complex
0.75–1   → Advanced
```

---

## 9️⃣ Life Gate Rule (Magnetosphere Tie-In)

If:

```
magnetosphereHealth01 < 0.15
```

Apply:

```
radiationStress01 += 0.3
```

Thus surface collapse becomes automatic.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

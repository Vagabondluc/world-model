# 🔒 CARBON CYCLE v1 LITE SPEC (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Snowball escape • Volcanism link • Weathering sink • Gameplay-safe)

## 0️⃣ Purpose

Maintain one scalar atmospheric greenhouse driver that:

* increases with volcanism
* decreases with weathering (requires liquid water + warmth)
* stalls weathering in Snowball → CO₂ accumulates → eventual melt

This recreates the classic escape mechanism in a game-friendly way.

---

## 1️⃣ Types

```ts
type CarbonUnit01 = number   // [0..1]
type PPM = number      // optional display
type Years = number
```

We store CO₂ as a compact uint16 for saves:

```ts
type CO2Q = number // uint16 0..65535
```

Conversion:

```
co2 = CO2Q / 65535  // CarbonUnit01
```

---

## 2️⃣ State (Minimal)

```ts
interface CarbonState {
  co2Q: CO2Q           // main driver (CarbonUnit01 quantized)
  lastEquilibriumHash: number // optional cache key
}
```

No per-cell carbon in v1.

---

## 3️⃣ Inputs

From existing systems:

* `globalIceState` (IceFree | Partial | Snowball)
* `meanTempK` (global mean or band-weighted)
* `meanRunoff01` (global mean runoff from hydro coupling)
* `volcanismIndex01` (from tectonics; can be constant per planet or time-varying)
* `landFracGlobal` (derived from surface mask)

---

## 4️⃣ Outputs

* Updates `co2Q`
* Feeds greenhouse:

```
ghg = co2   // directly
```

That plugs into your already locked emissivity mapping.

---

## 5️⃣ Update Rate

Carbon updates on a **slow clock** (not every climate tick).

Locked:

```
carbonStepYears = 1
```

So once per in-game year, update CO₂.

---

## 6️⃣ Source Term: Volcanic Outgassing

Deterministic:

```
source = kOutgas * volcanismIndex01
```

Locked defaults:

* `kOutgas = 0.012` per year (Unit01 scale)

This means: high volcanism can raise CO₂ meaningfully over centuries.

---

## 7️⃣ Sink Term: Silicate Weathering (Walker Feedback)

Weathering is the primary stabilizer of deep-time climate.

### 7.1 Mathematical Form

```ts
W = W0 * (Runoff/Runoff0) ^ 0.3 * exp( (Ea/Rg) * (1/T0 - 1/T) )
```

Locked constants:
* `Rg` (Gas Constant): `8.314 J mol⁻¹ K⁻¹`
* `Ea` (Activation Energy): `38,250 J mol⁻¹`
* `T0` (Reference Temp): `288,150 mK`
* `Runoff Exponent`: `0.3` (power-law)

### 7.2 Discrete Sink Calculation

In the quantized v1 model:

```ts
tempFactor = exp_PPM( (4600 * (T - 288150)) / (T * 288) )
runoffFactor = pow_PPM(meanRunoff01, 300_000) // R ^ 0.3
sink = (kWeath * co2 * runoffFactor * tempFactor * landGate * iceGate) / 1_000_000
```

Locked defaults:
* `kWeath = 0.010` per year

Key property:

* In Snowball, `iceGate=0` ⇒ sink ~ 0 ⇒ CO₂ accumulates.

---

## 8️⃣ CO₂ Integration (Deterministic, Stable)

Work in float:

```
co2 = co2Q / 65535
co2' = clamp01(co2 + source - sink)
co2Q = round(co2' * 65535)
```

No randomness, no drift.

---

## 9️⃣ Coupling Into Greenhouse (Frozen)

You already have:

```
eps = clamp(eps0 + ghg * ghgStrength, 0.5, 1.0)
```

We now lock:

```
ghg := co2
```

So CO₂ is the single driver of greenhouse in v1.

---

## 🔟 Snowball Escape Guarantee

With defaults:

* Snowball ⇒ sink ~ 0
* source continues
* co2 rises year after year
* greenhouse increases
* climate warms
* once Partial starts, weathering returns (iceGate 0.35), slowing growth
* once IceFree, weathering can exceed outgassing and stabilize

This creates a **limit cycle / stable equilibrium** depending on parameters — exactly what you want for emergent history.

---

## 1️⃣1️⃣ Gameplay Hooks (Optional, Still Deterministic)

You can safely expose:

* `volcanismIndex01` as world trait
* `co2Q` as "atmospheric thickness"
* "terraforming" actions that nudge `co2Q` (bounded, quantized)

But must respect clamp and quantization.

---

---

## 1️⃣3️⃣ Multi-Mode Calibration (Dual Parameter Sets)

The carbon cycle supports two simulation modes defined in [`docs/75-benchmark-scenario-contract.md`](./75-benchmark-scenario-contract.md).

### 13.1 Parameter Profiles

| Constant | `strict_science` | `gameplay_accelerated` | Unit |
| :--- | :--- | :--- | :--- |
| `kOutgas` | 0.00005 | 0.012 | unit01/yr |
| `kWeath` | 0.00004 | 0.010 | unit01/yr |
| `maxDeltaPPM` | 100 | 50,000 | PPM/step |
| `smoothing` | 0.0 | 0.2 | factor |

### 13.2 Jitter Guard (Accelerated Mode)

In `gameplay_accelerated` mode, the following guard is enforced to prevent feedback oscillation artifacts:

```ts
// Bounded delta + Simple Moving Average
rawDelta = source - sink
safeDelta = clamp(rawDelta, -maxDeltaPPM, maxDeltaPPM)
co2' = lerp(co2, co2 + safeDelta, 1.0 - smoothing)
```

This ensures that even with 100x acceleration, the atmosphere remains stable across year-boundaries.

You now have:

* Planet habitability score
* Extinction simulation
* Snowball lock behavior
* Mars outcome
* Venus runaway
* Life-climate feedback
* Regeneration after catastrophe
* Deterministic behavior
* Plugin-ready abstraction

Without simulating species.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

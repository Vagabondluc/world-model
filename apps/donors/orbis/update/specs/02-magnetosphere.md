# 🔒 MAGNETOSPHERE v1 — FROZEN SPEC

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Max-scale habitability permit)

## 1️⃣ State

```ts
interface MagnetosphereState {
  health01: number        // 0..1
  polarity: 1 | -1
  phase01: number         // 0..1 (flip oscillator)
  lastFlipTimeMs: AbsTime
}
```

`health01` is master "habitability permit" driver.

---

## 2️⃣ Drivers

```ts
interface MagnetosphereDrivers {
  coreHeat01: number          // 0..1
  rotation01: number          // 0..1
  tectonicHeatFlux01: number  // 0..1
}
```

These come from your long-scale planet engine.

---

## 3️⃣ Update Mode

Magnetosphere runs in **regenerate** or **very sparse simulate** mode.

Recommended:

* domain quantum = **10,000 years** or **100,000 years**
* update is O(1)

---

## 4️⃣ Health Evolution (Deterministic)

We define:

```
dHealth = +kDynamo * coreHeat01 * rotation01
        - kDecay
        - kInstability * (1 - tectonicHeatFlux01)
```

Then clamp 0..1.

This gives:

* gradual decay without replenishment
* long-lived planets if drivers strong

---

## 5️⃣ Polarity Reversals (No RNG)

We want reversals without randomness.

Use a deterministic oscillator based on AbsTime + drivers:

* compute a phase accumulator that speeds up when health is low (more chaotic field)
* flip when phase crosses 1.0

Example contract:

```ts
phase += baseFlipRate * (1 + flipChaos*(1 - health01))
if phase >= 1: polarity *= -1; phase -= 1
```

All deterministic.

---

## 6️⃣ Life Gate Contract

Define a threshold:

```
if health01 < 0.25 → "magnetosphere weak"
if health01 < 0.10 → "life collapse pressure"
```

This doesn't instantly kill life; it increases radiation stress.

So we output:

```ts
// Scientific scaling: stress proportional to 1/sqrt(B)
// where B is approximated by health01
stressFactor = 1 / sqrt(max(0.01, health01))
radiationStress01 = clamp01( baseStress * stressFactor )
```

Downstream systems use radiationStress as a penalty.

---

## 7️⃣ Biosphere Dependency

Your biosphere system (later) must treat radiationStress as a primary driver of:

* mutation rate
* extinction pressure
* surface habitability zones

This gives you "planet lifecycle" arc you want.

---

# 🔒 SPEC: Magnetosphere as a Max Scale "Life Permit"

This is your top-of-stack gate:

> "Life can emerge / persist only while magnetosphere health is above threshold."

We keep it game-feasible.

---

## 1) Magnetosphere State

Reuse the canonical `MagnetosphereState` declared in section `1️⃣ State` above.

`health01` is the master "habitability permit" driver.

---

## 2) Inputs (Geological)

Magnetosphere depends on a few slow variables:

* core heat (or a proxy)
* rotation rate proxy
* tectonic activity proxy (helps core cooling / dynamo sustaining in many models)

We keep it abstract:

Reuse the canonical `MagnetosphereDrivers` declared in section `2️⃣ Drivers` above.

These come from your long-scale planet engine.

---

## 3) Update Mode

Magnetosphere runs in **regenerate** or **very sparse simulate** mode.

Recommended:

* domain quantum = **10,000 years** or **100,000 years**
* update is O(1)

---

## 4) Health Evolution (Deterministic)

We define:

```
dHealth = +kDynamo * coreHeat01 * rotation01
        - kDecay
        - kInstability * (1 - tectonicHeatFlux01)
```

Then clamp 0..1.

This gives:

* gradual decay without replenishment
* long-lived planets if drivers strong

---

## 5) Polarity Reversals (No RNG)

We want reversals without randomness.

Use a deterministic oscillator based on AbsTime + drivers:

* compute a phase accumulator that speeds up when health is low (more chaotic field)
* flip when phase crosses 1.0

Example contract:

```ts
phase += baseFlipRate * (1 + flipChaos*(1 - health01))
if phase >= 1: polarity *= -1; phase -= 1
```

All deterministic.

---

## 6) Life Gate Contract

Define a threshold:

```
if health01 < 0.25 → "magnetosphere weak"
if health01 < 0.10 → "life collapse pressure"
```

This doesn't instantly kill life; it increases radiation stress.

So we output:

```ts
// Scientific scaling: stress proportional to 1/sqrt(B)
// where B is approximated by health01
stressFactor = 1 / sqrt(max(0.01, health01))
radiationStress01 = clamp01( baseStress * stressFactor )
```

Downstream systems use radiationStress as a penalty.

---

## 7) Biosphere Dependency

Your biosphere system (later) must treat radiationStress as a primary driver of:

* mutation rate
* extinction pressure
* surface habitability zones

This gives you "planet lifecycle" arc you want.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

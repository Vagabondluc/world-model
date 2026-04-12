# 🔒 NUMERICAL STABILITY & FIXED-POINT MATH CONTRACT v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Define global numeric conventions that guarantee deterministic, overflow-safe, cross-platform simulation math.

Canonical dependencies:
* `docs/35-deterministic-rng.md` (deterministic primitives)
* `docs/59-worlddelta-validation-invariant-enforcement.md` (invariant enforcement)
* `docs/48-field-id-registry-scale-table.md` (field/value registry alignment)

---

## Core Numeric Formats

```ts
type MathPPM = int32                // nominal 0..1_000_000
type Fixed32Q16 = int32             // value / 65536
type Fixed64Q32 = int64             // value / 2^32

interface NumericBudgetV1 {
  maxMagnitude32: int32
  maxMagnitude64: int64
  maxDeltaPerTick32: int32
  maxDeltaPerTick64: int64
}
```

Hard rule:
* aggregate sums across many cells/entities must use `int64`.

---

## Global Constants

```ts
const PPM_ONE: int32 = 1_000_000
const MUL_MAX_PPM: int32 = 2_000_000
const Q16: int32 = 65_536
const Q32: int64 = 4_294_967_296
```

---

## Rounding and Division Rules

All domains must use shared deterministic helpers:

```ts
interface NumericHelpersV1 {
  divFloor64(a: int64, b: int64): int64
  mulPPM32(x: int32, ppm: int32): int32
  mulQ16(a: int32, b: int32): int32
  addSat32(a: int32, b: int32): int32
  subSat32(a: int32, b: int32): int32
  clamp32(x: int32, lo: int32, hi: int32): int32
  clamp64(x: int64, lo: int64, hi: int64): int64
  
  // Scientific primitives (PPM base)
  sqrtPPM32(x: int32): int32
  powPPM32(base: int32, expPPM: int32): int32
  sinPPM32(radPPM: int32): int32
}
```

Locked policies:
* signed division uses floor semantics
* Q-format shift/multiply uses deterministic round-half-away-from-zero
* PPM multiply uses int64 intermediate then deterministic nearest rounding

---

## Overflow Policy

* authoritative simulation math: saturating arithmetic at conversion boundaries
* hash/digest/seed paths: wraparound arithmetic only
* int64 accumulators clamp only at final write boundary

---

## Unit Family Alignment

```ts
enum UnitFamilyV1 {
  Meters,
  KelvinQ16,
  PPM,
  JoulesQ32,
  Count,
  Id,
  Boolean
}
```

Every field/layer/scalar definition must declare a matching unit family.

---

## 🔒 Compliance Test Vector

To ensure cross-platform parity, an implementation must pass these tests:

**Test 1: mulPPM32 (Rounding)**
- `x`: `100_000`
- `ppm`: `1_234_567`
- `expected`: `123_457` (Nearest rounding: 123456.7 -> 123457)

**Test 2: divFloor64 (Negative)**
- `a`: `-10n`
- `b`: `3n`
- `expected`: `-4n` (Floor(-3.33) = -4)

**Test 3: addSat32 (Overflow)**
- `a`: `2_147_483_640`
- `b`: `100`
- `expected`: `2_147_483_647` (Saturates to `int32` max)

**Test 4: clampPPM**
- `x`: `1_500_000`
- `expected`: `1_000_000` (assuming `clampPPM` is 0..1M)

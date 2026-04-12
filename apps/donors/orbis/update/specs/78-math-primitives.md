# 🔒 MATH PRIMITIVES & CLAMP RULES (CORE CONTRACT)

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`00-data-types.md`]
- `Owns`: [`CoreMathPPM`, `CoreFixed64Q32`, `ClampMode`]
- `Writes`: `[]`

---

## 1. Fixed-Point Standard
Orbis 2.0 uses **Fixed-Point PPM** (Parts Per Million) for all authoritative simulation math.

```ts
type CoreMathPPM = uint32 // 1,000,000 = 1.0
type CoreFixed64Q32 = uint64  // fixed-point intermediate container
```

## 2. Authorized Primitives
Solvers must use these primitives to ensure bit-identical results.

### 2.1 Multi-Product Chain
```ts
function mulPPM(a: uint32, b: uint32): uint32 {
  const intermediate = BigInt(a) * BigInt(b)
  return Number(intermediate / 1_000_000n)
}
```

### 2.2 Square Root (PPM)
```ts
function sqrtPPM(a: uint32): uint32 {
  const val = BigInt(a) * 1_000_000n
  return Number(integerSqrt(val))
}
```

### 2.3 Division (Floor Rounding)
```ts
function divPPM(a: uint32, b: uint32): uint32 {
  if (b === 0) return 0 // Triggers ReasonCode 0x0003 elsewhere
  return Number((BigInt(a) * 1_000_000n) / BigInt(b))
}
```

## 3. Global Clamp Rules
Every field in the simulation must have an associated `ClampRange`.

```ts
enum ClampMode {
  SATURATE, // Stop at min/max
  WRAP,     // Loop (e.g. degrees)
  REJECT    // Emit ERR_INTERNAL_CLAMP and ignore delta
}
```

## 4. Determinism Rules
- **No Float**: `Math.sqrt`, `Math.pow`, and `/` operator are forbidden in solvers.
- **Stable Rounding**: Always use Floor (towards -Infinity) for consistency across platforms.
- **Overflow**: High-precision intermediates must use `CoreFixed64Q32` (uint64).

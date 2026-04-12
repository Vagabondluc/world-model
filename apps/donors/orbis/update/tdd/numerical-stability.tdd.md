# 🧪 TDD Specification: Numerical Stability & Fixed-Point Math

**Target**: Orbis 2.0 Core Math Engine
**Reference**: Orbis 1.0 `hydrology.ts` (performGeologicStep), `biomeLogic.ts`

## 1. Unit Conversion (Float -> PPM)
*Goal: Ensure legacy 1.0 float data maps deterministically to 2.0 uint32 PPM.*

| Test ID | Input (Orbis 1.0) | Logic | Expected Output (2.0) |
| :--- | :--- | :--- | :--- |
| **CONV-01** | `height: 0.0` | Midpoint mapping | `500,000 PPM` |
| **CONV-02** | `height: 1.0` | Max positive | `1,000,000 PPM` |
| **CONV-03** | `height: -1.0` | Max negative | `0 PPM` |
| **CONV-04** | `temp: 0.288` | Direct scale | `288,000 PPM` |
| **CONV-05** | `moisture: 0.5` | Direct scale | `500,000 PPM` |

## 2. Fixed-Point Arithmetic Accuracy
*Goal: Verify bit-identical results for common simulation operations.*

- [ ] **MATH-01: Multiplication Clamping**
  - `A`: 800,000 PPM (0.8)
  - `B`: 800,000 PPM (0.8)
  - `Operation`: `mulPPM(A, B)`
  - `Expected`: `640,000 PPM` (0.64)
- [ ] **MATH-02: Division Rounding**
  - `A`: 1,000,000 PPM (1.0)
  - `B`: 3 PPM
  - `Operation`: `divPPM(A, B)`
  - `Expected`: `333,333 PPM` (Floor rounding required)
- [ ] **MATH-03: Square Root (SPL Basis)**
  - `A`: 1,000,000 PPM
  - `Operation`: `sqrtPPM(A)`
  - `Expected`: `1,000,000 PPM`
- [ ] **MATH-04: Power Function (SPL Basis)**
  - `Base`: 500,000 PPM (0.5)
  - `Exp`: 2.0 (via `powPPM`)
  - `Expected`: `250,000 PPM`

## 3. High-Precision Intermediates (Fixed64Q32)
*Goal: Prevent overflow during multi-step equations like the Stream Power Law.*

- [ ] **PREC-01: Large Product Chain**
  - `Slope`: 200,000 PPM
  - `Flow`: 1,000,000,000 PPM (Accumulated)
  - `K`: 50,000 PPM
  - `Action`: Calculate `Slope * sqrt(Flow) * K` using `Fixed64Q32` intermediate.
  - `Expected`: Correct `uint32` PPM result without 32-bit wrap-around.

## 4. Determinism Verification
- [ ] **DET-01**: Execute `MATH-01` through `MATH-04` on 3 different JS engines (V8, Spidermonkey, JavaScriptCore).
- [ ] **Requirement**: All 16 bytes of output state must be identical.
- [ ] **DET-02**: Verify `divFloor64` handles negative results with consistent floor behavior (toward negative infinity).

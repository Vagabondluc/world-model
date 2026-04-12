# 🔒 98: Dice Box & Three.js Integration (Hardened Contract)

SpecTier: Contract

## Spec Header
- `Version`: `v1.0-hardened`
- `DependsOn`: [`docs/specs/30-runtime-determinism/35-deterministic-rng.md`, `docs/specs/40-actions-gameplay/99-dice-orchestration-bridge.md`]
- `Owns`: [`DiceRenderRequestV1`, `DiceRenderResultV1`, `DiceRenderStatusV1`, `DiceProfileV1`, `DiceNotation`]
- `Writes`: []

---

## 1. Core Principle: Result-First Authority
The **Simulation Engine** (Orbis) owns the mathematical result of every roll. The **Realizer** (Three.js) is strictly a visualization layer.
- **Rule**: The result is calculated using `DeterministicRNG` *before* the request is sent to the renderer.
- **Physics**: `cannon-es` or `ammo.js` forces the dice to land on the pre-determined face using calculated impulses.

## 2. Data Structures

```ts
type DiceNotation = string; // e.g. "2d20+5"

interface DiceRenderRequestV1 {
  requestId: string;      // ULID/UUID for idempotency
  notation: DiceNotation;
  precomputedResults: uint8[]; // The authoritative results from Simulation
  profile: DiceProfileV1;
}

interface DiceRenderResultV1 {
  requestId: string;
  status: DiceRenderStatusV1;
  durationMs: uint32;
}

enum DiceRenderStatusV1 {
  SUCCESS,
  DEGRADED,
  FAILED_FALLBACK_TEXT
}

enum DiceProfileV1 {
  DESKTOP_FULL,   // High-poly, full shadows, cannon-es
  MOBILE_LITE,    // Low-poly, shadow-only, simplified collision
  FALLBACK_2D     // Sprite-based / Text-only
}
```

## 3. Constraints & Validation
- **Max Dice**: 20 per request.
- **Face Bounds**: Values must match die type (e.g. 1-20 for d20).
- **Notation**: Must pass regex `^[0-9]+d[0-9]+(\+[0-9]+)?$`.

## 4. Compliance Vectors

### SUCCESS_PATH (Vector 98-A)
- **Input**: `notation: "1d20"`, `precomputedResults: [20]`.
- **Action**: Desktop profile active.
- **Expected**: Dice animates, lands on 20. `DiceRenderResult.status` = `SUCCESS`.

### FAILURE_PATH (Vector 98-B)
- **Input**: `notation: "1d20"`, `precomputedResults: [20]`.
- **Action**: WebGL context lost or mobile browser crash.
- **Expected**: System catches error, emits `ERR_RENDERER_UNAVAILABLE` (Reason 0x0007), displays text result "20". `status` = `FAILED_FALLBACK_TEXT`.

## 5. Promotion Notes
- Supersedes policy-only brainstorm version.
- Linked to Spec 99 for orchestration.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

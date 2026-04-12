
# 🔒 DOMAIN MODE POLICY v1 (FROZEN)

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/01-time-clock-system.md`]
- `Owns`: [`DomainMode`]
- `Writes`: `[]`

---

## 0. Purpose
Define the strict behaviors and transition rules for simulation domains operating in different temporal modes. This ensures determinism and performance stability under varying load and time-scale conditions.

## 1. Domain Modes

### 1.1 Frozen (Zero-Order Hold)
*   **Behavior**: The domain performs **no updates**.
*   **Reads**: External systems read the *last committed state*.
*   **Writes**: None.
*   **Use Case**: Paused simulation, or domains inactive at current `TimeScale`.
*   **Lag**: Accumulates `tNow - lastStepTime`. Lag is ignored until mode changes.

### 1.2 Step (Discrete Integration)
*   **Behavior**: The domain advances by fixed `stepUs` increments.
*   **Logic**: `while (lag >= stepUs) { step(); lag -= stepUs; }`
*   **Constraint**: Must respect `maxCatchupSteps`.
*   **Use Case**: Standard simulation execution (Climate, Civ, Ecology).

### 1.3 HighRes (Fine-Grained Integration)
*   **Behavior**: The domain advances by `quantumUs` (minimal resolution) instead of `stepUs`.
*   **Logic**: Similar to Step, but `dt = quantumUs`.
*   **Use Case**: Focused inspection (e.g., watching a city grow day-by-day), or rapid tactical simulation.
*   **Constraint**: Extremely high computational cost; usually requires low `TimeScale`.

### 1.4 Regenerate (Procedural Catch-up)
*   **Behavior**: The domain discards intermediate history and computes state directly for `tNow`.
*   **Logic**: `regenerateTo(tNow); lastStepTime = tNow;`
*   **Constraint**: Domain must support analytical or procedural state derivation (Stateless or semi-stateless).
*   **Use Case**: Hydrology (rebuild from terrain), or recovering from massive lag (Lag Escalation).

## 2. Transition Policy

### 2.1 Lag Escalation (Auto-Regeneration)
If a domain in `Step` or `HighRes` mode falls behind by more than `maxCatchupSteps`:
1.  **Trigger**: `dueSteps > maxCatchupSteps`
2.  **Action**: Force immediate transition to `Regenerate` logic for this tick.
3.  **Outcome**: State jumps to `tNow`. Intermediate events are **lost** (unless domain handles event backfilling during regeneration).

### 2.2 Mode Switching
*   **Frozen -> Step**: Resume stepping. Lag handling applies immediately (likely triggering Escalation if frozen for long).
*   **Step -> HighRes**: Decrease integration `dt`. Sim precision increases.
*   **HighRes -> Step**: Increase integration `dt`. Sim precision decreases.
*   **Any -> Frozen**: Stop updates. State remains at `lastStepTime`.

## 3. Invariants
1.  **Monotonicity**: `lastStepTime` never decreases.
2.  **Alignment**: `lastStepTime` is always a multiple of `quantumUs` (assuming start at 0).
3.  **Determinism**: Given the same `DomainMode` history and `tNow`, the resulting state sequence is identical (up to the resolution of `Regenerate` simplifications).


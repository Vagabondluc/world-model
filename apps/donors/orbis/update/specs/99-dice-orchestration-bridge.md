# 🔒 99: Dice Orchestration Bridge (Hardened Contract)

SpecTier: Contract

## Spec Header
- `Version`: `v1.0-hardened`
- `DependsOn`: [`docs/specs/00-core-foundation/01-time-clock-system.md`, `docs/specs/40-actions-gameplay/100-roguejs-orbis-responsibility-matrix.md`]
- `Owns`: [`DiceOrchestrationStateV1`, `DiceEventV1`]
- `Writes`: [`DomainClockState`]

---

## 1. Authoritative State Machine
Transitions are strictly governed by this table. Illegal jumps trigger a simulation halt.
All transitions are deterministic for a given ordered event stream and request id set.

```ts
interface DiceOrchestrationStateV1 {
  currentState: "IDLE" | "ANIMATING" | "RESOLVED";
  activeRequestId: string | null;
  startTimeUs: AbsTime;
}

enum DiceEventV1 {
  ROLL_START,
  USER_SKIP,
  TIMEOUT,
  CANCEL,
  CLEANUP
}
```

| Current State | Allowed Event | Next State | Priority |
| :--- | :--- | :--- | :--- |
| `IDLE` | `ROLL_START` | `ANIMATING` | 1 |
| `ANIMATING` | `USER_SKIP` | `RESOLVED` | 10 (Highest) |
| `ANIMATING` | `TIMEOUT` | `RESOLVED` | 5 |
| `ANIMATING` | `CANCEL` | `IDLE` | 1 |
| `RESOLVED` | `CLEANUP` | `IDLE` | 1 |

### 1.1 Precedence Rules
If multiple events arrive in the same tick:
**SKIP > TIMEOUT > CANCEL**.
- A user clicking "Skip" during a background timeout process force-clears the timeout.

## 2. Idempotency Contract
Every `DiceRenderRequestV1` (Spec 98) must carry a unique `requestId`.
- **Constraint**: If the Bridge receives a `requestId` that has already been processed, it returns the previous `DiceRenderResultV1` immediately without re-triggering physics or updating clocks.

## 3. Scheduler Gate (Deadlock Prevention)
- **Pause Condition**: `CORE_TIME` advance is blocked while in `ANIMATING` state.
- **Deadlock Timeout**: Default `5,000ms`. If no state change occurs, the Bridge force-emits a `TIMEOUT` event to resume the simulation.

## 4. Compliance Vectors

### SUCCESS_PATH (Vector 99-A)
- **Input**: `ROLL_START`.
- **Action**: No user interference.
- **Expected**: `ANIMATING` -> (Physics finishes) -> `RESOLVED`. Simulation resumes.

### CONFLICT_PATH (Vector 99-B)
- **Input**: `TIMEOUT` event and `USER_SKIP` event in same frame.
- **Action**: Apply precedence.
- **Expected**: `USER_SKIP` wins. `RESOLVED` state entered. `requestId` stored as processed.

## 5. Promotion Notes
- Linked to Spec 100 for boundary enforcement.
- Integrated into Domain Scheduler (Spec 01).

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

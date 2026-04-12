# 🧪 TDD Specification: Time & Multi-Domain Scheduler

**Target**: Orbis 2.0 Time Engine
**Reference**: Orbis 1.0 `useWorldStore.ts` (planetAge), `useTimeStore.ts`

## 1. Absolute Time Mapping
*Goal: Bridge the year-based 1.0 time to microsecond-based 2.0 time.*

| Test ID | Input (Years) | Calculation | Expected (AbsTime) |
| :--- | :--- | :--- | :--- |
| **TIME-01** | `1` | `years * 31,536,000,000,000` | `31,536,000,000,000 us` |
| **TIME-02** | `0.00000019` | `1 / 31,536,000` | `6,000,000 us` (D&D 6s Tick) |
| **TIME-03** | `10,000,000,000`| Planetary max | `315,360,000,000,000,000,000 us` (No overflow) |

## 2. Scheduler Step Logic
- [ ] **SCHED-01: Discrete Stepping**
  - `Domain`: `PLANET_PHYSICS` (stepUs = 10k years)
  - `Start`: `lastStepTimeUs = 0`
  - `Advance`: `tNowUs = 25,000 years`
  - `Expected`: `step()` called 2 times; `lastStepTimeUs` ends at `20,000 years`.
- [ ] **SCHED-02: Catch-up Policy (Step)**
  - `Setup`: `due = 500 steps`; `maxCatchupSteps = 200`.
  - `Action`: Tick.
  - `Expected`: Exactly 200 steps run; Domain remains 300 steps behind.
- [ ] **SCHED-03: Catch-up Escalation (Regenerate)**
  - `Setup`: `due = 1,000,000 steps`; `maxCatchupSteps = 200`.
  - `Action`: Tick.
  - `Expected`: `regenerateTo(tNowUs)` called once; `lastStepTimeUs` snaps to `tNowUs`.

## 3. Cross-Domain Synchronization
- [ ] **SYNC-01: Invalidation Propagation**
  - `Trigger`: `ClimateChanged` event at `t=1000`.
  - `Verification`: `HYDROLOGY` domain must set `isValid = false` and skip `step()` in favor of `regenerateTo(1000)`.
- [ ] **SYNC-02: Dependency Ordering**
  - `Setup`: `CIVILIZATION` depends on `BIOME`.
  - `Action`: Tick both.
  - `Expected`: `BIOME` update completes and commits to state *before* `CIVILIZATION` reads inputs.

## 4. Deterministic Jitter
- [ ] **JIT-01**: In `HighRes` mode, verify sub-quantum updates use ZOH (Zero-Order Hold) from the last committed step.
- [ ] **JIT-02**: Verify that rapid UI-driven time skips do not result in variable step counts across different hardware speeds.

# 🔒 81: Regime Transition State Machine (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `PressureState` ([`Spec 80`](./80-impact-propagation-engine.md)): Societal metrics.
    - `LegitimacyPPM` ([`Spec 84`](./84-institution-elite-layer.md)): Institutional trust.
- **Outputs**:
    - `RegimeIdV1`: Current government type.
    - `TransitionEvent`: Triggers narrative updates and rule shifts.
- **Parameters**:
    - `HYSTERESIS_BUFFER`: 100,000 PPM (10%).

## 2. Mathematical Kernels

### 2.1 Schmitt Trigger Logic
Transitions are hysteretic to prevent flickering at boundaries.
- **Entry Condition**: `Metric > (Threshold + HYSTERESIS_BUFFER)`.
- **Exit Condition**: `Metric < (Threshold - HYSTERESIS_BUFFER)`.

### 2.2 Decision Conflict Resolution
When multiple transitions are valid in a single tick:
```text
Priority = mulPPM(DeltaThreshold, Rules.BasePriority)
Winner = Argmax(Priority)
```
*Logic: The "strongest" transition (highest threshold violation) wins. Tie-break by lowest RegistryId.*

## 3. Determinism & Flow
- **Evaluation Order**: Step 5 of the `CivTick` sequence (Post-Propagation).
- **Cooldown**: Minimum 10 Ticks in any state before eligible for transition.
- **State Invariance**: Regime state must be stored in the authoritative snapshot (Spec 57).

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `REGIME_SHIFT_TRACE`
- **Primary Drivers**:
    - `PRESSURE_TRIGGER`: Which axis forced the transition (e.g., Unrest -> Revolution).
    - `STABILITY_COLLAPSE`: Impact of legitimacy loss.

## 5. Failure Modes & Bounds
- **Saturated Result**: If all exit conditions fail but no new entry conditions trigger, default to `Collapse` (Anarchy).
- **Invalid Transition**: If `from` and `to` are identical, ignore.


## Hardening Addendum (2026-02-12)
- `SpecTier`: `Brainstorm Draft`
- `Status`: `Promotion Candidate after canonical header rewrite`
- `CanonicalizationTarget`: `docs/specs/* (TBD)`
- `DeterminismNote`: `Use fixed-point/PPM conventions from runtime determinism canon before promotion.`

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm draft.

Expected:
- deterministic output for identical inputs and evaluation order.
- explicit tie-break and clamp behavior is documented before promotion.

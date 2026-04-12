# 🔒 87: Player Control Bridge (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `InferenceEngine` ([`Spec 88`](./88-db-ai-ux-implementation-bridge.md)): Causal trace data.
    - `ConfidencePPM`: Function of institutional efficiency and truth stability.
- **Outputs**:
    - `ActionPreviewV1`: Visualization of consequence horizons.
    - `EmergencyPower`: Overrides for systemic vetoes.
- **Parameters**:
    - `HORIZON_MID`: 50 Ticks.
    - `HORIZON_LONG`: 200 Ticks.

## 2. Mathematical Kernels

### 2.1 Confidence Calculation
The accuracy of the player's "Preview" is limited by institutional health.
```text
PreviewErrorRange = ±(1,000,000 - ConfidencePPM)
```
*Logic: If the government is corrupt or information is distorted, the player's UI will show wider, less certain "Consequence Bands."*

### 2.2 Emergency Powers (The Veto)
Unlocked when `StabilityPPM < 200,000`.
- **Effect**: Instantly apply any `ActionSelected` regardless of Faction/Institution opposition.
- **Permanent Cost**: `LegitimacyPPM` drops by 2x per tick active.

## 3. Determinism & Flow
- **Evaluation Order**: Final stage of the loop.
- **Preview Stability**: Action previews must be re-run deterministically every time a parameter changes.
- **Outcome Driver**: Every negative event must trigger the `OutcomeDriverTraceV1` interface for attribution.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `CONTROL_BRIDGE_TRACE`
- **Primary Drivers**:
    - `PREVIEW_UNCERTAINTY`: Why the predicted result was wrong.
    - `OVERRIDE_BACKLASH`: Explaining the legitimacy loss from emergency powers.

## 5. Failure Modes & Bounds
- **Saturated Result**: If `ConfidencePPM` is 0, the player's UI blanks out (Total Fog of War).
- **Invalid Action**: Rejections on actions lacking a valid `WorldDelta` envelope.

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

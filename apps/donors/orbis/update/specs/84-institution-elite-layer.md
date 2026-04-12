# 🔒 84: Institution Elite Layer (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `PressureState` ([`Spec 80`](./80-impact-propagation-engine.md)): Systemic load.
    - `Regime` ([`Spec 81`](./81-regime-transition-state-machine.md)): Political container.
- **Outputs**:
    - `InstitutionStateV1`: Durable power structures.
    - `FrictionDelta`: Modifier applied to all policy deltas.
- **Parameters**:
    - `EFFICIENCY_DECAY`: -1,000 PPM/Tick.
    - `INERTIA_ACCRETION`: +2,000 PPM/Tick.

## 2. Mathematical Kernels

### 2.1 Aging & Decay Rules
Institutions grow rigid and corrupt as they age.
```text
EfficiencyNext = EfficiencyPrev + EFFICIENCY_DECAY
CorruptionNext = CorruptionPrev + mulPPM(CaptureShare, 100,000) + 500
InertiaNext = min(800,000, InertiaPrev + INERTIA_ACCRETION)
```

### 2.2 Policy Friction
Every player or AI action is filtered through institutional inertia.
```text
EffectiveAction = mulPPM(ActionPPM, (1,000,000 - InertiaPPM))
```
*Logic: Established bureaucracies effectively "swallow" a portion of any rapid reform effort.*

## 3. Determinism & Flow
- **Evaluation Order**: Runs once per `GeoTick` (or summarized `CivTick`).
- **Remnants**: Upon institution collapse, a `Remnant` entity is created with `0.1x` influence to preserve historical data.
- **Tie-Breaking**: Lowest `InstitutionId` for budget jurisdiction conflicts.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `INSTITUTIONAL_TRACE`
- **Primary Drivers**:
    - `STRUCTURAL_RIGIDITY`: The impact of Inertia on policy failure.
    - `SYSTEMIC_CAPTURE`: Explain why growth is leading to inequality.

## 5. Failure Modes & Bounds
- **Saturated Result**: If `CorruptionPPM > 900,000`, the institution automatically triggers a `Fragment` or `Dissolve` event.
- **Invalid State**: Rejections on unknown `InstitutionType` via `ERR_AUTH_VIOLATION`.

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

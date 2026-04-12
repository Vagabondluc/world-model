# 🔒 80: Impact Propagation Engine (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `ImpactVector` ([`Spec 79`](./79-tech-impact-matrix-contract.md)): Forces emitted by tech.
    - `IdeologyLens` ([`Spec 82`](./82-sociological-ideology-tree.md)): Interpretation modifiers.
- **Outputs**:
    - `PressureStateV1`: Persistent societal metrics (Inequality, Unrest).
- **Parameters**:
    - `GLOBAL_FRICTION`: 0.95x (Baseline decay).
    - `INTERACTION_CAP`: ±200,000 PPM.

## 2. Mathematical Kernels

### 2.1 Propagation Formula (Fixed-Point)
Societal axes interact according to a stable interaction matrix.
```text
PressureNext = mulPPM(PressurePrev + Force, GLOBAL_FRICTION) 
             + mulPPM(StructuralInteraction, IdeologyModifier)
```

### 2.2 Global Friction & Dampening
To prevent positive feedback death spirals:
1. **Dampening**: Every recursive interaction (e.g., Unrest feeding Inequality) is multiplied by `0.5x`.
2. **Friction**: Every tick, axes drift 5% toward `0` (Neutral baseline).

## 3. Determinism & Flow
- **Evaluation Order**: Step 2 of the `CivTick` sequence.
- **Topological Sorting**: Equations are evaluated in a fixed order: `Economy -> Governance -> Military -> Population -> Culture`.
- **Math**: Integer-only arithmetic using `Fixed64Q32` for intermediate sums.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `PRESSURE_PROPAGATION_TRACE`
- **Primary Drivers**:
    - `DIRECT_EMISSION`: Direct impact from Spec 79.
    - `STRUCTURAL_FEEDBACK`: Cascade from one axis to another (e.g., Inequality -> Unrest).
    - `IDEOLOGICAL_BENDING`: Modifier from Spec 82 value systems.

## 5. Failure Modes & Bounds
- **Saturated Result**: If an axis reaches 1,000,000 (100%), emit `SATURATED` flag.
- **Invalid Equation**: If a coefficient is missing, default to `0` (Isolated axis).

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

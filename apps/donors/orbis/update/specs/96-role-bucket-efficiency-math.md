# 🔒 96: Role Bucket Efficiency Math (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `PopSharePPM` ([`Spec 91`](./91-population-task-assignment.md)): % of population assigned to this role.
    - `TechLevel` ([`Spec 79`](./79-tech-impact-matrix-contract.md)): Systemic tech multipliers.
    - `CorruptionPPM` ([`Spec 84`](./84-institution-elite-layer.md)): Institutional efficiency loss.
    - `InfrastructurePPM` ([`Spec 93`](./93-settlement-urban-realizer.md)): Capital investment multiplier.
- **Outputs**:
    - `YieldDelta`: Periodic resource or point emission.
    - `MaintenanceNeed`: Resource consumption required to maintain efficiency.
- **Parameters**: ([`Spec 56`](../specs/30-runtime-determinism/56-unified-parameter-registry-schema-contract.md))
    - `PRODUCTION_EXPONENT (alpha)`: 0.7 (Work weight).
    - `TECH_EXPONENT (beta)`: 0.3 (Capital/Tech weight).

## 2. Mathematical Kernels

### 2.1 Primary Formula (Cobb-Douglas Production)
Orbis uses a fixed-point approximation of the Cobb-Douglas production function to model non-linear scaling.
```text
RawYield = mulPPM(PopSharePPM ^ alpha, TechLevel.Efficiency ^ beta)
```
*Logic: Doubling the population assigned to a task (e.g., Mining) only increases yield by ~60%, modeling diminishing returns and logistical crowding.*

### 2.2 Scaling Functions
Base yield is modified by local infrastructure and institutional health.
```text
EfficiencyMult = mulPPM(InfrastructurePPM, (1,000,000 - CorruptionPPM))
EffectiveYield = mulPPM(RawYield, EfficiencyMult)
```

### 2.3 Complexity Tax (Overcrowding)
If population share exceeds an optimal threshold, a non-linear "Friction" term is applied.
```text
LogisticalFriction = (PopSharePPM > 800,000) ? mulPPM(PopSharePPM, 200,000) : 0
FinalYield = max(0, EffectiveYield - LogisticalFriction)
```

## 3. Determinism & Flow
- **Evaluation Order**: Runs in Phase B (Resolution) after Task Assignment (Spec 91).
- **Hysteresis**: Efficiency shifts are dampened by a rolling average window (10 ticks) to prevent massive output swings from single-tick pop shifts.
- **Rounding**: All power functions are implemented via `powPPM` ([`Spec 68`](../specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md)) with floor rounding.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `ECON_EFFICIENCY_TRACE`
- **Primary Drivers**:
    - `DIMINISHING_RETURNS`: The impact of the `alpha` exponent.
    - `INSTITUTIONAL_DECAY`: Yield loss due to `CorruptionPPM`.
    - `INFRA_BONUS`: Gains from local buildings.

## 5. Failure Modes & Bounds
- **Saturated Result**: Total output is capped at `LocalResourceCapacityPPM`.
- **Invalid Input**: If `PopSharePPM` sum across all roles != 1,000,000, emit `ERR_CONSERVATION_FAIL` (Reason 0x0006) and scale roles proportionally.

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

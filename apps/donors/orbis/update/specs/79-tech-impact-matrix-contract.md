# 🔒 79: Tech Impact Matrix (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `TechNodes` ([`Spec 78`](./78-tech-tree-dataset-v1.md)): List of researched technologies.
- **Outputs**:
    - `ImpactVectorV1`: Discrete force emissions into societal axes.
- **Parameters**: ([`Spec 56`](../specs/30-runtime-determinism/56-unified-parameter-registry-schema-contract.md))
    - `UNIT_CONVERSION_PPM`: 50,000 PPM (Value of 1 Impact Point).

## 2. Mathematical Kernels

### 2.1 Emission Formula
Tech impacts are additive within a single tick.
```text
TotalForce(Axis) = sum(Tech.ImpactValue * UNIT_CONVERSION_PPM)
```

### 2.2 Scaling Functions
Impact values scale with the **Inertia Scaling** rule:
- **Early Eras (1-5)**: `1.0x` Multiplier.
- **Late Eras (20+)**: `4.0x` Multiplier.
*Logic: Advanced technologies (Anti-Matter, Reality Warping) create much larger systemic disturbances than primitive tools (Pottery).*

## 3. Determinism & Flow
- **Evaluation Order**: Runs first in the `CivTick` sequence.
- **Stability**: Tech emissions are persistent but their *effect* is handled by the Propagation Engine (Spec 80).
- **Tie-Breaking**: Ascending `TechId`.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `TECH_IMPACT_TRACE`
- **Primary Drivers**:
    - `EMISSION_SOURCE`: Tech ID that produced the force.
    - `ERA_SCALING`: Multiplier applied based on technology level.

## 5. Failure Modes & Bounds
- **Saturated Result**: Max force per axis is capped at `±1,000,000 PPM`.
- **Invalid Tech**: If `TechId` is unknown, emit `ERR_AUTH_VIOLATION` (Reason 0x0004).

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

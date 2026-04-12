# 🔒 82: Sociological Ideology Tree (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `StateVector` ([`Spec 80`](./80-impact-propagation-engine.md)): Real pressures.
    - `EventHistory`: Recent shock markers (War, Disaster).
- **Outputs**:
    - `IdeologyModifier`: Coefficient applied to propagation math.
    - `DivergencePPM`: Tension between State and Faction values.
- **Parameters**:
    - `INERTIA_COEFF`: 0.99x (Normal).
    - `SHOCK_INERTIA`: 0.50x (Post-Crisis).

## 2. Mathematical Kernels

### 2.1 Ideological Inertia
Ideologies resist drift through a persistence term.
```text
CurrentDimension = (PrevValue * INERTIA_COEFF) + (TargetDrift * (1.0 - INERTIA_COEFF))
```

### 2.2 Shock Adjustment
Following a `MassExtinctionEvent` or `RegimeCollapse`, `INERTIA_COEFF` is reduced to `0.50x` for 5 ticks.
*Logic: Crises allow for rapid ideological realignment (e.g., radicalizing a population toward "Ecology" after a planetary disaster).*

### 2.3 Radicalization and In-Group Favoritism (Hardened)
Ideology drift is amplified by "Echo Chambers" and social identity.
```text
GroupPolarization = mulPPM(DivergencePPM, InGroupFavoritismPPM)
ExposureModifier = 1.0 + (RadicalizingSettingsPPM / 1,000,000)
EffectiveDrift = mulPPM(GroupPolarization, ExposureModifier)
```
- **In-Group Favoritism**: Factions with high `cohesion` (Spec 80) gain `+20%` drift speed toward their own extremes.
- **Radicalizing Settings**: High `information.reach` combined with low `information.trust` (Spec 86) creates high-exposure environments.

## 3. Determinism & Flow
- **Evaluation Order**: Step 3 of the `CivTick` Sequence.
- **Drift Limit**: Total adjustment per tick is capped at `±5,000 PPM` (unless in Shock state).
- **Consensus**: `FactionIdeology` must stay within `±300,000 PPM` of `StateIdeology` or trigger a `FactionSpawn` (Spec 83).
- **Social Identity**: Once a dimension exceeds `700,000 PPM`, it becomes part of the `InGroupIdentity`, increasing `InGroupFavoritismPPM`.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `VALUE_SYSTEM_TRACE`
- **Primary Drivers**:
    - `TRADITIONALISM`: The impact of the Inertia term.
    - `CRISIS_PIVOT`: Acceleration of drift during shock events.

## 5. Failure Modes & Bounds
- **Saturated Result**: If a dimension hits `±1,000,000 PPM`, it becomes a `Fundamentalist` dogma (Permanent lock).
- **Invalid Dimension**: Rejections on unknown axes via `ERR_AUTH_VIOLATION`.

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

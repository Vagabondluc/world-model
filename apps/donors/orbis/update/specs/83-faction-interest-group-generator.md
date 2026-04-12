# 🔒 83: Faction & Interest Group Generator (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `PressureState` ([`Spec 80`](./80-impact-propagation-engine.md)): Societal drivers.
    - `Divergence` ([`Spec 82`](./82-sociological-ideology-tree.md)): Value system tension.
- **Outputs**:
    - `FactionInstanceV1`: Entity with demands and influence.
- **Parameters**:
    - `INFLUENCE_FLOOR`: 20,000 PPM (2%).
    - `COALITION_THRESHOLD`: 80% axis overlap.

## 2. Mathematical Kernels

### 2.1 Influence and Clout Model (Hardened)
Faction power is a weighted sum of its access points, normalized as `Clout`.
```text
RawPower = mulPPM(PopShare, W_POP) + mulPPM(WealthAccess, W_WEALTH) + mulPPM(ForceAccess, W_FORCE)
CloutPPM = (RawPower / SumOfAllRawPower) * 1,000,000
```
- **Clout**: Represents the faction's relative strength in government. High clout factions can block laws (Victoria 3 pattern).

### 2.2 Collective Action (Asabiya)
Following Turchin's Cliodynamics, factions gain or lose the ability to act collectively.
```text
AsabiyaNext = AsabiyaPrev + mulPPM(PressureDelta, 0.1) - mulPPM(SuccessDecay, 0.05)
```
- **Frontier Pressure**: Factions on geographic or ideological "frontiers" gain Asabiya faster.
- **Success Decay**: Successful factions (high clout for long duration) suffer from declining collective action capacity.

### 2.3 Consolidation & Pruning
To prevent actor-count bloat:
1. **Garbage Collection**: If `Clout < INFLUENCE_FLOOR` for 10 ticks, delete the faction.
2. **Coalition Merge**: If two factions share 80% preference, they merge into one `Coalition` entity using the higher `Legitimacy`.

## 3. Determinism & Flow
- **Evaluation Order**: Step 4 of the `CivTick` sequence.
- **Tie-Breaking**: If two factions have equal clout, the one with lower `FactionId` (hash-based) takes priority in the Situation Room.
- **Birth**: Factions only spawn if `Pressure > Threshold` AND `Divergence > Threshold`.
- **Clout Sum**: The system must ensure `Sum(CloutPPM) == 1,000,000` for all active factions.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `FACTION_DYNAMICS_TRACE`
- **Primary Drivers**:
    - `IDEOLOGICAL_MISMATCH`: Influence gained from value divergence.
    - `ECONOMIC_GRIEVANCE`: Influence gained from pressure metrics (e.g., Inequality).

## 5. Failure Modes & Bounds
- **Saturated Result**: If a single faction reaches `> 800,000 PPM` influence, it triggers a `RegimeTransition` to `Authoritarian` or `DominantParty`.
- **Invalid ID**: Duplicate `FactionId` strings result in `ERR_DIGEST_MISMATCH`.

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

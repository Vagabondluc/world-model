# 🔒 85: Elite Actor & Character Engine (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `SourceEntity` ([`Spec 83/84`](./83-faction-interest-group-generator.md)): Parent Faction/Institution.
    - `Regime` ([`Spec 81`](./81-regime-transition-state-machine.md)): Global context.
- **Outputs**:
    - `ActorStateV1`: High-agency individual entity.
    - `ActionOverride`: High-impact decisions that bypass systemic default.
- **Parameters**:
    - `OVERRIDE_THRESHOLD`: 700,000 PPM Influence.

## 2. Mathematical Kernels

### 2.1 Career Lifecycle Rules
Actors progress through stages based on age and success metrics.
- **Apex**: Triggered if `InfluencePPM > 500,000`.
- **Decline**: Triggered if `HealthPPM < 300,000` OR `Age > 60 Ticks`. Competence drops `-5,000 PPM` per tick.

### 2.2 Decision Utility (Actor Scope)
Actors use a variant of the Need scoring system but weighted by self-interest.
```text
Score = Opportunity + Ambition + PowerDelta - Risk - LoyaltyConflict
```
*Logic: Actors with high `Ambition` will take risky actions even if it destabilizes the state.*

## 3. Determinism & Flow
- **Evaluation Order**: Runs after Institution Step (Spec 84).
- **Tie-Breaking**: `(score desc, influence desc, actorId asc)`.
- **Unit Command**: If an actor has `commanderActorId` link to a Unit (Spec 89), they apply their `StrategyPPM` to that unit's success rolls.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `CHARACTER_ACTION_TRACE`
- **Primary Drivers**:
    - `PERSONAL_AMBITION`: High ambition bias in scoring.
    - `LOYALTY_CONFLICT`: High penalty from faction/state mismatch.

## 5. Failure Modes & Bounds
- **Saturated Result**: If an actor gains `> 1,000,000` Influence, they are marked as a `HistoricalLegend` and effectively become the State.
- **Invalid ID**: Duplicate `ActorId` results in `ERR_DIGEST_MISMATCH`.

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

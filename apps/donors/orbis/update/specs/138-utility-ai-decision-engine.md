# 138 Utility AI Decision Engine

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/39-deterministic-utility-decision.md`, `docs/brainstorm/135-typescript-simulation-architecture.md`]
- `Owns`: [`action utility functions`, `decision tie-breaking policy`]
- `Writes`: [`agent intent`, `simulated actor behavior`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/138-utility-ai-decision-engine.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define the decision-making framework for NPC factions and agents using a high-performance Utility AI (Scoring) approach.

## 1. Decision Process
Agents select actions by calculating a "Utility Score" for each available option.

### 1.1 The Scoring Formula
```text
Utility = (NeedWeight * CurrentNeedValue) + (ActionBenefit * EfficiencyModifier) - OpportunityCost
```
- **NeedWeight**: Fixed-point factor (`PpmInt`) representing agent priorities (e.g., Survival > Wealth).
- **EfficiencyModifier**: Derived from `actor.competence` and `institution.efficiency`.

### 1.2 Tie-Breaking and Stability
- If two actions score within 5,000 PPM of each other:
  1. Prefer the action aligned with the agent's `ideology.drift_vector` (Spec 82).
  2. Prefer the lowest `action_id` (fallback).
- **Oscillation Control**: Executed actions incur a 10-tick "Recency Penalty" (`-50,000 PPM`) to prevent the AI from flipping between two high-utility states (e.g., settling and immediately moving).

## 2. Consideration Buckets
- **Personal Scope**: Ambition, wealth, health.
- **Faction Scope**: Power, clout, unrest.
- **Empire Scope**: Growth, stability, defense.

## 3. Execution Integration
- AI runs in the **Sim-Worker**.
- **Action Selection**: Limited to top 3 choices to prevent exhaustive searching of the action space.
- **Explanation**: Decisions emit an `OutcomeDriverTrace` (Spec 122) for player transparency.

## 4. Scalability: Aggregate Agents & Throttling
- **Throttling**: To maintain < 5ms execution, only 20% of NPC agents are updated per `CivTick` in a round-robin rotation.
- **Priority**: Agents in "High Pressure" zones or "Crisis" states are exempt from throttling and update every tick.
- **Aggregate Decision**: Mass population (Pops) do not run individual Utility AI; they aggregate into Faction-level intent.

## 5. Performance Targets
- Target < 5ms total AI execution time per 1,000 active entities.
- Consideration results are cached across ticks if world state hasn't changed > 5,000 PPM.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

# 140 Narrative AI Director (Pacing & Events)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/114-threshold-and-reasoncode-registry.md`, `docs/brainstorm/122-causality-trace-contract.md`]
- `Owns`: [`narrative drama curve`, `event selection priority`]
- `Writes`: [`narrative events`, `pacing modifiers`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/140-narrative-ai-director.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define a high-level system that manages the "Drama Curve" of the simulation, ensuring that emergent events (Spec 133) occur at a pace that is engaging for the player without breaking determinism.

## 1. The Drama Curve
- **DramaPPM**: A global value representing current "tension" (derived from `population.unrest` and `system.stability`).
- **Target Curve**: The Director compares `DramaPPM` to a desired "Era Wave" (e.g., periods of quiet growth followed by intense crisis).

## 2. Event Selection: "The Deck"
Potential events are stored in a weighted "Deck."
- **Prerequisites**: Events only enter the deck if world-state thresholds (Spec 114) are met.
- **Dynamic Weighting**:
  - If `DramaPPM` < Target: Increase weights for "Crisis" events.
  - If `DramaPPM` > Target: Increase weights for "Stability/Restoration" events.

## 3. Deterministic Seeds
- The Director uses the `worldSeed` + `TickInt` to "shuffle" the deck.
- The outcome is 100% reproducible for a given save state.

## 4. Integration with Trace
- Every event triggered by the Director must provide a `provenance` field (Spec 122) explaining why it was selected (e.g., "Tension too low -> Triggered Faction Strike").

## 5. Failure Modes
- **Drama Overload**: If tension stays at 1,000,000 PPM for too long, the Director forces a `RegimeTransition` or `MassExtinction` to "reset" the curve.

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

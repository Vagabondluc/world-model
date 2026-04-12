# 145 Procedural History Compression

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/109-memory-storage-explosion-control.md`, `docs/brainstorm/122-causality-trace-contract.md`]
- `Owns`: [`history compression algorithms`, `relevance filtering policy`]
- `Writes`: [`compressed chronicle summaries`, `event-log pruning commands`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/145-procedural-history-compression.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Enable thousand-year simulations without storage explosion by dynamically aggregating and compressing the event log.

## 1. Relevance Filtering (Swinging Door)
Not every tick is historically relevant. The system uses a **Swinging Door** algorithm to filter time-series metrics (`economy.growth`, `population.unrest`).
- **Logic**: Only store a data point if the deviation from the previous trend line exceeds a specific `tolerancePPM`.
- **Outcome**: Constant growth/decline is stored as two endpoints; only "shocks" create new points.

## 2. Event Aggregation (The "Chronicle" Pass)
Repetitive minor events are collapsed into summary records every `EraTick` (100 CivTicks).
- **Example**: 500 individual `Unit_Move` events in a hex are collapsed into a single `save_event_log` entry: `{"type": "Migration_Flow", "count": 500, "vector": [...]}`.
- **Rule**: If an event didn't trigger a `Threshold` (Spec 114) or a `Causality Trace` (Spec 122), it is a candidate for culling.

## 3. Lossy vs. Lossless Tiers
- **Tier 1 (Current Era)**: Lossless. Every event and tick snapshot is preserved.
- **Tier 2 (Past 5 Eras)**: Aggregated. Individual unit moves culled; city-level deltas and threshold triggers preserved.
- **Tier 3 (Deep History)**: Statistical. Only `EraTransition` events and "Legendary Actor" traces remain. Base metrics are stored as low-resolution curves.

## 4. Historical Reconstruction (Cliodynamics)
When a player views "Deep History":
- The UI does not query raw events.
- It queries the **Cliodynamic Curve** (Spec 143) generated during the compression pass.
- **Accuracy**: The curve is guaranteed to pass through all "Threshold" points, ensuring causal consistency.

## 5. Persistence
- Compressed history is stored in **IndexedDB** using `LZ-String` or similar bit-level compression.
- **Budget**: Deep history for 10,000 years should occupy < 10MB.

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

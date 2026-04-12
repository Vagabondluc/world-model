# 108 Multi Resolution Data Architecture (Brainstorm Draft)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`multi-resolution data architecture`, `aggregation pipeline rules`]
- `Writes`: [`projection-layer data flow constraints`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/108-multi-resolution-data-architecture.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Implement one deterministic reality model with multiple projection layers for different scales and game modes.

## Core Philosophy
- One source of truth (but resolution is dynamic).
- Many read models.
- No duplicated simulations.

## Layer Model
- `L0 truth layer`: atomic entities/events/state updates. Mode is **Scale-Dependent**:
  - **Dormant Mode**: Statistical/Logistic truth (Cheap, Global).
  - **Active Mode**: Discrete Agent truth (Expensive, Local).
- `LN projection layers`: aggregated summaries for altitude-specific consumption.

## Lazy Truth Spawning
The simulation does not instantiate micro-entities until the viewport zoom reaches the **Active Threshold** (Spec 144).
- **Statistical-to-Discrete (Bloom)**: Deterministic sampling of macro-state into discrete agents.
- **Discrete-to-Statistical (Compress)**: Lossy aggregation of agent states back into macro-variables.

## Hierarchical Indexing
Each atomic element stores parent links.

Example:
- local node -> district -> province -> empire -> sphere

This enables O(1)-style upward lookup without full scans.

## Aggregator Responsibilities
Projection layers compute derived summaries only:
- population totals
- economic output
- logistics capacity
- military pressure
- ideology distributions
- trust/legitimacy summaries

## Storage Strategy
Store:
- atomic events
- atomic entities
- relationship graph

Cache:
- projection aggregates

If caches are lost, they are rebuildable from source-of-truth data.

## Update Modes
- scheduled recompute (default for long-run planet simulation)
- optional incremental recompute for hot regions

Use dirty flags:
- recompute parent aggregates only when child state changed

## Determinism Rules
- aggregators are pure functions of child state
- stable grouping and reduce order
- no projection layer writes directly to truth layer

## Writeback Rule
Higher layers cannot mutate truth directly.
- any “god action” must emit events into L0 truth pipeline

## Query Contract
All consumers query projection interfaces, not raw truth by default.

```ts
interface ProjectionQueryV1 {
  scale: string
  scopeId: string
  fields: string[]
  tick: number
}
```

## Pipeline
- simulate base reality
- append events
- update dirty aggregates
- update projection caches
- render scale-specific view

## Failure Conditions
- disagreement between scales for same identity anchor
- projection invents state not derivable from truth
- non-deterministic aggregate outcomes on replay

## Success Criteria
- same tick queried at different scales shows coherent transformed meaning
- replay parity maintained with projections enabled
- adding a new genre requires only new projection/view logic, not a new simulation core


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

# 102 MVP Roadmap Credible Causality (Brainstorm Draft)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`MVP phase roadmap`, `credible causality acceptance gates`]
- `Writes`: [`implementation sequencing guidance`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/102-mvp-roadmap-credible-causality.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Objective
Prove emergence fast with minimal systems, not full feature completeness.

## MVP Success Test
After ~200 simulated years, a player can explain a causal political arc (example: automation + inequality -> unrest -> military takeover).

## Phase 1: Core Loop
- Implement small pressure set:
  - `economy.growth`
  - `economy.inequality`
  - `population.unrest`
  - `governance.legitimacy`
  - `governance.surveillance`
  - `infrastructure.automation`
- Implement tech nodes as pressure emitters only.
- Implement linear propagation rules.
- Implement threshold triggers to events.
- Implement chronological event log.

Exit criteria:
- repeated runs produce coherent but divergent histories from different action paths.

## Phase 2: Politics Appears
- Add 3 to 5 factions:
  - workers
  - elites
  - military
  - technocrats
- Add 3 government forms:
  - democratic
  - authoritarian
  - military
- Add one leader slot with traits:
  - ambition
  - risk tolerance
- Allow crisis-time leader override attempt.

Exit criteria:
- coups and reform failures can emerge without scripted stories.

## Phase 3: Memory Layer
- Add chronicle summary generator for major events.
- Add era splitter from dominant pressure patterns.

Exit criteria:
- timeline is readable as a coherent historical arc.

## Phase 4: Player Agency
- Add minimal levers:
  - fund welfare
  - increase control
  - invest in automation
  - appease faction
  - repress faction

Exit criteria:
- player can intentionally steer long-term direction with visible tradeoffs.

## Explicit Non-Goals (MVP)
- detailed institution graph
- actor social network
- diplomacy
- map fragmentation
- myth stack
- elections/constitutional systems

## Performance Strategy
- aggregate groups, not individuals
- coarse ticks (target: 1 tick = 1 year)
- limit AI actions per tick (1 to 2 strategic actions)
- deterministic seeded pseudo-randomness only
- integer ppm state in authoritative path

## Storage Strategy
- event-sourced core (`actions + events`)
- snapshots every N ticks (recommended: 25)
- stream-compress repetitive minor events into aggregate summaries

## MVP UI Skeleton
- Situation screen: pressure bars + warnings
- Action screen: minimal action cards/buttons
- Timeline screen: major events and chronicle entries
- Leader screen: current leader traits and risk stance

## Build Order
- pressures and propagation
- threshold events
- factions
- government modifiers
- leader behavior
- event log
- basic UI
- chronicle summary

## Principle
Scale is optional.
Credible causality is mandatory.


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

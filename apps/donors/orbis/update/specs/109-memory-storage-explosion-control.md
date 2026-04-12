# 109 Memory Storage Explosion Control (Brainstorm Draft)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`history storage control strategy`, `tiered event retention policy`]
- `Writes`: [`compaction and snapshot guidelines`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/109-memory-storage-explosion-control.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Keep long simulations cheap and readable across disk, RAM, and query time without sacrificing historical continuity.

## Core Law
Store truth once.  
Everything else must be rebuildable.

Canonical persistence:
- event log (truth)
- periodic snapshots (fast load)
- compressed summaries (human readability)

## Event Log Tiering
### Tier A (retain permanently)
- player/AI actions
- regime transitions
- war start/end and treaties
- major tech/ideology/government shifts
- territorial annexation/partition
- institution creation/destruction

### Tier B (compress aggressively)
- minor unrest churn
- price micro-oscillations
- minor skirmishes
- micro-migrations

### Tier C (debug optional)
- intermediate formula traces
- per-step contribution diagnostics

Policy:
- always keep Tier A
- merge Tier B into waves/eras
- disable or purge Tier C outside debug contexts

## Snapshot Strategy
- full snapshot every `N_full` ticks (default: 25 years)
- optional delta snapshot every `N_delta` ticks (default: 1 year)
- load path:
  - latest full snapshot
  - replay bounded event tail

Granularity:
- prefer per-civ or per-region chunk snapshots for large worlds

## Chunking Strategy
Use stable keys:
- `world_id + layer + chunk_id + time_block`

Recommended time blocks:
- high layers: 100-year blocks
- mid layers: 10-year blocks
- operational layers: 1-year blocks

## Streaming Compression During Simulation
### Wave Aggregators
For repeating pressure dynamics, maintain rolling summaries:
- start tick
- peak tick/value
- top drivers
- resolution mode

Write one wave summary event at closure.

### Era Segmentation
Commit era records periodically or on dominant-driver shifts:
- era label
- top pressures
- net macro changes
- signature conflicts

## Read Model Indexes
Precompute materialized views for UI:
- `major_events_by_tick`
- `major_events_by_actor`
- `major_events_by_region`
- `eras_by_civ`
- `biographies_index`

All are disposable and rebuildable from ledger + summaries.

## Disk Compression Discipline
- use integer ppm fields (`int16/int32`) in authoritative state
- prefer columnar/delta encoding for long time series
- keep event payloads lean (IDs + deltas + cause refs)
- never embed full entity snapshots in regular events

## Deterministic RNG Storage Rule
Persist:
- world seed
- tick
- entity id
- rng counter

Do not store every roll in production logs.

## GC and Retention Rules
Never delete:
- regime transitions
- wars/treaties
- major tech/ideology pivots
- actor rise/fall events
- myth/narrative flips
- border changes
- catastrophes

Compress:
- repeated unrest -> unrest wave
- minor skirmishes -> conflict phase
- micro-migrations -> migration pulse

Delete:
- per-tick tiny deltas only after confirmed summary replacement

## Performance Knobs
- tick size
- snapshot interval
- aggregation interval
- verbosity tier (A/B/C)
- chunk size

## Recommended MVP Defaults
- tick: 1 year
- full snapshot: every 25 years
- era commit: every 50 years or driver-shift trigger
- unrest/migration: wave aggregators enabled
- event tiers: A+B on, C off
- long time series: only top layers by default

## Implementation Targets
- fast replay
- bounded load times
- readable historical timeline
- controllable storage growth


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

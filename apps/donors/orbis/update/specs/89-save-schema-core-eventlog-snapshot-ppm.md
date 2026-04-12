# 89 Save Schema Core EventLog Snapshot PPM (Brainstorm Design)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/80-impact-propagation-engine.md`, `docs/brainstorm/113-canonical-key-registry.md`]
- `Owns`: [`save_world`, `save_tick`, `save_event_log`, `save_state_snapshot`, `save_pressure_state`]
- `Writes`: [`event log`, `snapshots`, `pressure state rows`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/89-save-schema-core-eventlog-snapshot-ppm.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Goal
Ship a minimal deterministic save core:
- event log as source of truth
- snapshots for fast load
- ppm state table for query and UI

## Tables (MVP)
- `save_world(world_id, seed, ruleset_version, created_at)`
- `save_tick(world_id, tick, rng_counter)`
- `save_event_log(event_id, world_id, tick, scope, subject_id, event_type, payload, cause, created_at)`
- `save_state_snapshot(world_id, tick, state, hash, created_at)`
- `save_pressure_state(world_id, tick, civ_id, ...ppm columns...)`

## Write Order Per Tick
- insert `save_tick`
- append all `save_event_log` rows (stable order)
- compute reduced pressure rows and insert `save_pressure_state`
- build snapshot + hash and insert `save_state_snapshot`

## Determinism Rules
- sort events by `(tick, scope, subject_id, event_type, event_id)`
- fixed-point ppm ints only
- no in-place event update, append-only
- snapshot is derived only from replayable events + deterministic reducers

## Indexes
- `save_event_log(world_id, tick)`
- `save_event_log(scope, subject_id, tick)`
- `save_pressure_state(world_id, civ_id, tick)`
- `save_state_snapshot(world_id, tick)`

## API Contract (MVP)
- `appendEvents(worldId, tick, events[])`
- `computePressureState(worldId, tick)`
- `writeSnapshot(worldId, tick)`
- `loadWorldAtTick(worldId, tick)` (snapshot + replay delta)

## Done Criteria
- replay from seed + events equals snapshot hash
- load from snapshot is O(1) snapshot fetch + bounded delta replay
- pressure queries support “top risk drivers” without full JSON scan

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.


## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

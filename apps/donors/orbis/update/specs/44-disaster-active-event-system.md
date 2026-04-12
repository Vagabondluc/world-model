# 🔒 DISASTER & ACTIVE EVENT SYSTEM SPEC v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

Derived from root `spec4.md` heading lock. This doc formalizes the missing contract.

## 0) Purpose

Model active world disasters during gameplay (eruption, quake, flood, impact aftershock) as deterministic event pipelines that interact with existing domains.

## 1) Event Types

```ts
enum ActiveDisasterKind {
  VolcanicEruption,
  Earthquake,
  Flood,
  Wildfire,
  MeteorStrike,
  DustVeil,
  Tsunami,
}
```

## 2) Event Envelope

```ts
interface ActiveDisasterEvent {
  eventId: uint64
  kind: ActiveDisasterKind
  time: AbsTime
  regionId: uint64
  biomeIds: uint64[]
  intensityPPM: uint32
  durationTicks: uint32
  sourceDomain: DomainId
}
```

## 3) Triggers

Triggers are deterministic thresholds over existing domain fields:

- tectonic stress
- volcanic heat flux proxy
- extreme runoff/flood state
- impact events from geological systems

No wall-clock or non-deterministic trigger sources.

## 4) Effects

Disasters emit only world deltas (no direct mutation):

- `PopulationSize`, `MigrationFlow`
- `ForestCover`, `SoilQuality`
- `ToxinLoad`, `AerosolProxy`
- infrastructure and hostility pressure fields

All effects are quantized and routed through `40-action-resolution-world-delta.md`.

## 5) Conflict and Ordering

- Must obey deterministic event ordering (`11-deterministic-event-ordering.md`)
- Concurrent disasters stack via reducer policy per delta kind
- Clamp and conservation rules are mandatory

## 6) Recovery Window

```ts
interface DisasterRecoveryWindow {
  eventId: uint64
  start: AbsTime
  end: AbsTime
  rebuildingPressurePPM: uint32
  migrationPressurePPM: uint32
}
```

Recovery is an explicit scheduled phase, not implied behavior.

## 7) Explainability

Each disaster must expose:

- trigger breakdown
- top affected regions/biomes
- emitted delta summary hash
- recovery window schedule

## 8) Performance Constraints

- Max active disasters per tick: configurable cap
- Region-local evaluation first, no full-planet scans per event
- Deterministic culling by priority if cap exceeded

## 9) Modding

Mods may add disaster subtypes only by:

- registering `ActiveDisasterKind` extension IDs
- defining trigger tables
- defining bounded delta emission templates

No direct core state mutation allowed.

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

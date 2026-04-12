# 🔒 SAVE / LOAD SNAPSHOT CONTRACT v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Guarantee deterministic resume/replay across platforms and engine versions.

Canonical dependencies:
* `docs/35-deterministic-rng.md` (RNG + digest primitives)
* `docs/56-unified-parameter-registry-schema-contract.md` (parameter schemas)
* `docs/36-domain-mode-policy.md` (domain mode/scheduler state)

---

## Snapshot Structure

```ts
interface SnapshotV1 {
  snapshotVersion: uint32
  engineVersion: uint32
  registryVersion: uint32

  absTime: AbsTime
  engineStep: uint64

  rngState: RNGStateSnapshotV1
  schedulerState: SchedulerSnapshotV1

  domainStates: DomainStateSnapshotV1[]
  parameterStates: DomainParameterStateV1[]

  globalDigest: Digest64
}
```

```ts
interface RNGStateSnapshotV1 {
  baseSeed: uint64
  eventCounter: uint64
}

interface DomainStateSnapshotV1 {
  domainId: DomainId
  schemaVersion: uint32
  stateVersion: uint32
  authoritativeState: BinaryBlob
  derivedCache?: BinaryBlob
  lastRunTime: AbsTime
}

interface SchedulerSnapshotV1 {
  domainNextRun: Record<DomainId, AbsTime>
  activeDomains: DomainId[]
}
```

---

## Hard Rules

* Authoritative state is mandatory.
* Derived cache is optional and must never be source-of-truth.
* Canonical serialization order is required (sorted domain IDs, sorted keys, stable chunk order).
* Snapshot load MUST recompute and verify digest before any simulation advance.

---

## Version and Migration

```ts
interface SnapshotVersionSetV1 {
  snapshotVersion: uint32
  registryVersion: uint32
  schemaVersion: uint32
  stateVersion: uint32
}
```

```ts
interface DomainStateMigratorV1 {
  fromVersion: uint32
  toVersion: uint32
  migrate(oldState: BinaryBlob): BinaryBlob
}
```

Rules:
* newer unknown versions -> reject
* older versions -> migrate through pure deterministic chain


# 🔒 DOMAIN DEPENDENCY GRAPH & EXECUTION PHASES SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Define deterministic domain execution order from dependency declarations and fixed engine phases.

Canonical dependencies:
* `docs/11-deterministic-event-ordering.md`
* `docs/30-cross-scale-tick-synchronization.md`
* `docs/59-worlddelta-validation-invariant-enforcement.md`

---

## Dependency Declaration

```ts
interface DomainDependencyDefV1 {
  domainId: DomainId
  readSet: uint32[]
  writeSet: uint32[]
  dependsOnDomains: DomainId[]
}
```

---

## Engine Phases

```ts
enum EnginePhaseV1 {
  Intake,
  EventOrdering,
  ParameterUpdates,
  DomainExecution,
  GlobalDigest,
  OverlaySampling,
  SnapshotCheckpoint
}
```

Within `DomainExecution`, domains run in topological order. If multiple domains are eligible at the same step, tie-break by ascending `uint32 domainId`.

---

## Hard Rules

* Cycles in dependency graph are forbidden unless resolved by one of:
  1. phase-split resolution with minimum 1 tick delay on each cycle edge
  2. lagged-coupling resolution with declared `delayTicks` in `[1..10]`
* All phases and domain order are replay-stable.
* Overlay sampling is read-only and runs after authoritative mutation phases.


## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

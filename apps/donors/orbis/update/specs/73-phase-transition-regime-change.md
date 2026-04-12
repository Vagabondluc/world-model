# 🔒 PHASE TRANSITION & REGIME CHANGE SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Represent large-scale regime transitions as explicit deterministic state machines.

Canonical dependencies:
* `docs/60-event-schema-reason-code-registry.md`
* `docs/71-domain-dependency-graph-execution-phases.md`

---

## Trigger Types

```ts
enum RegimeTriggerKindV1 {
  ScalarThreshold,
  FieldFractionThreshold,
  RateThreshold,
  Timer
}

interface RegimeTriggerDefV1 {
  id: uint16
  kind: RegimeTriggerKindV1
  sourceId: uint32
  threshold: int32
  hysteresisPPM: uint32
  minTicksInState: uint32
}
```

---

## State Machine

```ts
interface RegimeStateMachineV1 {
  machineId: uint16
  domainId: DomainId
  stateId: uint16
  enteredAt: AbsTime
}
```

Hard rules:
* transitions emit numeric events
* transitions are deterministic and hysteresis-bounded
* no implicit state jumps outside declared transition table



## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

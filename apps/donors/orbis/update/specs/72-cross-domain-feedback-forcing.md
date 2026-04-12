# 🔒 CROSS-DOMAIN FEEDBACK & FORCING SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Define bounded, deterministic coupling channels between domains.

Canonical dependencies:
* `docs/58-state-authority-contract.md`
* `docs/40-action-resolution-world-delta.md`
* `docs/71-domain-dependency-graph-execution-phases.md`

---

## Forcing Types

```ts
enum ForcingKindV1 {
  ScalarForcing,
  FieldForcing,
  SparseLayerForcing
}

interface ForcingChannelDefV1 {
  id: uint16
  sourceDomainId: DomainId
  targetDomainId: DomainId
  kind: ForcingKindV1
  targetId: uint32
  capPPM: uint32
  lagTicks: uint16
}
```

---

## Hard Rules

* No instantaneous mutual forcing loops in the same execution phase.
* Every forcing channel has explicit cap and optional lag.
* Forcing writes must pass authority and delta validation gates.
* Channels must be digest-visible for replay/A-B verification.



## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

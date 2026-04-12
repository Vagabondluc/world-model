# 🔒 WORLDDELTA VALIDATION & INVARIANT ENFORCEMENT v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Provide the deterministic enforcement pipeline for every world delta.

Canonical dependencies:
* `docs/40-action-resolution-world-delta.md`
* `docs/58-state-authority-contract.md`
* `docs/35-deterministic-rng.md` (digest trace integration)

---

## Validation Pipeline (ordered)

```ts
enum DeltaValidationStepV1 {
  RegistryValidation,
  AuthorityValidation,
  ModePermissionValidation,
  ScopeCompatibilityValidation,
  PayloadTypeRangeValidation,
  WriteSetValidation,
  InvariantPrecheck,
  ApplyDelta,
  InvariantPostcheck,
  DigestTraceCommit
}
```

If any required step fails, delta is rejected deterministically.

---

## Supporting Types

```ts
enum BoundPolicyV1 {
  Reject,
  Clamp
}

enum InvariantCheckKindV1 {
  NonNegativeField,
  RangeScalar,
  ConservationWithinPPM,
  MonotonicIncreasing,
  SumLayerNotExceedScalar,
  PopNotExceedEnergy,
  ProbabilityPPMRange
}

interface InvariantDefV1 {
  id: uint32
  domainId: DomainId
  severity: "Warn" | "Halt" | "QuarantineDomain"
  check: InvariantCheckKindV1
  args: int32[]
  dependentIds: uint32[]
}

interface DeltaRejectionTraceV1 {
  time: AbsTime
  domainId: DomainId
  eventId: uint64
  deltaId: uint64
  reasonCodeId: uint16
  targetId: uint32
  detailsDigest: Digest64
}
```

---

## Hard Rules

* Delta apply order is deterministic (`event order`, then `deltaId` ascending).
* All bounds behavior is explicit (`Reject` or `Clamp`).
* Every rejection/clamp must be traceable and included in digest flow.
* Invariant post-check runs for invariants touched by the write set; full sweep reserved for checkpoint boundaries.


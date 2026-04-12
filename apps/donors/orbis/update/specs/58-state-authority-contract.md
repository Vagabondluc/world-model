# 🔒 STATE AUTHORITY CONTRACT v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Define one owner for each world datum and enforce write permissions.

Canonical dependencies:
* `docs/48-field-id-registry-scale-table.md` (ID registry)
* `docs/40-action-resolution-world-delta.md` (delta model)
* `docs/36-domain-mode-policy.md` (mode permissions)

---

## Core Types

```ts
enum DataKindV1 {
  ScalarGlobal,
  ScalarDomain,
  FieldCell,
  FieldRegion,
  LayerSparse,
  EntityRecord
}

enum AuthorityModeV1 {
  Authoritative,
  DerivedCache,
  PresentationOnly
}

interface AuthorityEntryV1 {
  id: uint32
  kind: DataKindV1
  mode: AuthorityModeV1
  ownerDomainId: DomainId
  upstreamDeps?: uint32[]
  clampMin: int32
  clampMax: int32
  boundPolicy: BoundPolicyV1
}

interface AuthorityRegistryV1 {
  registryVersion: uint32
  entries: AuthorityEntryV1[]
}
```

---

## Hard Rules

* Each datum ID MUST have exactly one owner domain.
* Only owner may write the datum.
* `DerivedCache` may be written only by its owner and must declare upstream dependencies.
* `PresentationOnly` data must not be consumed by authoritative simulation math.
* Authority mode changes are breaking changes requiring registry/version migration.

---

## Validation Invariants

* no duplicate datum IDs
* valid domain ownership
* sane clamp bounds
* no presentation-only dependency in authoritative upstream graph


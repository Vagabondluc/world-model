# 🔒 REGIME METRICS & OBSERVABLES SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Define stable, typed metric outputs used for regime detection, dashboards, and replay comparisons.

Canonical dependencies:
* `docs/31-simulator-dashboard.md`
* `docs/73-phase-transition-regime-change.md`

---

## Metric Definitions

```ts
enum MetricKindV1 {
  Climate,
  Biosphere,
  CoreMagnetosphere,
  Civilization,
  Composite
}

enum MetricScopeV1 {
  Global,
  Region,
  Cell,
  Species,
  Civilization
}

interface MetricDefV1 {
  id: uint16
  kind: MetricKindV1
  scope: MetricScopeV1
  unit: UnitFamilyV1
  sourceIds: uint32[]
}

interface MetricSampleV1 {
  metricId: uint16
  time: AbsTime
  scopeId?: uint32
  value: int32
}
```

---

## Hard Rules

* metric formulas are deterministic and versioned
* metric IDs are append-only and stable
* metric sampling cadence must be declared per metric
* regime logic must reference metric IDs, not free-form names



## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.

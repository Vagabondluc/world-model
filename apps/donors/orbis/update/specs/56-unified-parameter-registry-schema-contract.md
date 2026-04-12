# 🔒 UNIFIED PARAMETER REGISTRY & SCHEMA CONTRACT v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## 0) Purpose

Provide one deterministic, versioned parameter contract across all domains:

* typed
* bounded
* serializable
* digestable
* mod-overridable without schema breakage

Canonical dependency:
* `docs/35-deterministic-rng.md` for parameter digest integration.

---

## 1) Global Registry

```ts
interface GlobalParameterRegistryV1 {
  registryVersion: uint32
  domains: DomainParameterSchemaV1[]
}
```

---

## 2) Domain Schema

```ts
interface DomainParameterSchemaV1 {
  domainId: DomainId
  schemaVersion: uint32
  parameters: ParameterDefinitionV1[]
}
```

Changing parameter structure requires incrementing `schemaVersion`.

---

## 3) Parameter Definitions

```ts
enum ParamTypeV1 {
  INT32,
  UINT32,
  FLOAT64,
  BOOL,
  ENUM
}

type ParamValueV1 = int32 | uint32 | float64 | 0 | 1

interface ParamBoundsV1 {
  min: number
  max: number
  step?: number
}

interface ParamFlagsV1 {
  affectsDeterminism: boolean
  mutableAtRuntime: boolean
  requiresRestart: boolean
  experimental?: boolean
}

enum ParamProvenanceV1 {
  EARTH,        // Strictly based on empirical Earth data
  GAMEPLAY,     // Accelerated or tuned for UX/playability
  FITTED,       // Derived from simulation stability runs
  SPECULATIVE   // Best-guess or fantasy placeholder
}

interface ParameterDefinitionV1 {
  id: string
  type: ParamTypeV1
  defaultValue: ParamValueV1
  unit: string
  bounds: ParamBoundsV1
  flags: ParamFlagsV1
  provenance: ParamProvenanceV1
  calibratedOn?: string      // e.g. "2026-02-12 research pass"
  paramVersion: uint16       // version of this specific parameter definition
  description: string
  deprecatedSince?: uint32
  replacementParamId?: string
}
```

v1 constraints:
* no nested objects
* no arrays
* no free-form strings as authoritative numeric values
* floats must be quantized before hashing

---

## 4) Live Parameter State

```ts
interface DomainParameterStateV1 {
  domainId: DomainId
  schemaVersion: uint32
  values: Record<string, ParamValueV1>
}
```

Hard rules:
* reject unknown parameter keys
* include only schema-declared IDs
* enforce bounds and step snapping on write

---

## 5) Runtime Change Event

```ts
interface ParamChangeEventV1 {
  domainId: DomainId
  paramId: string
  oldValue: ParamValueV1
  newValue: ParamValueV1
  absTime: AbsTime
}
```

If `affectsDeterminism=true`, every successful change must emit this event.

---

## 6) Mod Override Contract

```ts
interface ParameterOverrideV1 {
  domainId: DomainId
  paramId: string
  newDefault?: ParamValueV1
  newBounds?: ParamBoundsV1
}

interface ParameterOverridePackV1 {
  baseSchemaVersion: uint32
  overrides: ParameterOverrideV1[]
}
```

Hard rules:
* cannot change parameter type
* cannot remove parameters
* cannot change enum backing
* cannot alter determinism flags

Breaking override requires a schema version bump.

---

## 7) Deterministic Serialization

Serialization order:
1. sort domains by `domainId`
2. write `schemaVersion`
3. sort parameter IDs lexicographically
4. write quantized canonical numeric value

No runtime object iteration order may affect output.

---

## 8) Parameter Digest Contract

```ts
interface ParameterDigestV1 {
  domainId: DomainId
  schemaVersion: uint32
  digest: Digest64
}
```

Digest must incorporate:
* `schemaVersion`
* all `(paramId, quantizedValue)` pairs in sorted order
* parameter salt from digest contract
* `domainId`



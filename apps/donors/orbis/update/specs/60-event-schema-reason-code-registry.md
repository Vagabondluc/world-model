# 🔒 EVENT SCHEMA & REASON CODE REGISTRY v1 (FROZEN)

SpecTier: Executable Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

## Purpose

Define numeric-only runtime registries for events, rejection reasons, invariant codes, and explain codes.

Canonical dependencies:
* `docs/11-deterministic-event-ordering.md`
* `docs/59-worlddelta-validation-invariant-enforcement.md`
* `docs/48-field-id-registry-scale-table.md`

---

## Registry Types

```ts
interface EventSchemaRegistryV1 {
  registryVersion: uint32
  eventTypes: EventTypeDefinitionV1[]
  reasonCodes: ReasonCodeDefinitionV1[]
  invariantCodes: InvariantCodeDefinitionV1[]
  explainCodes: ExplainCodeDefinitionV1[]
}

interface EventTypeDefinitionV1 {
  id: uint16
  name: string           // tooling only
  domainId: DomainId
  payloadSchema: EventPayloadSchemaV1
  producesDeltas: boolean
}

interface EventPayloadSchemaV1 {
  fields: PayloadFieldV1[]
}

interface PayloadFieldV1 {
  fieldId: uint16
  valueType: ValueType
}

interface ReasonCodeDefinitionV1 {
  id: uint16
  name: string
  severity: "Info" | "Warn" | "Error"
}

interface InvariantCodeDefinitionV1 {
  id: uint16
  domainId: DomainId
  name: string
  severityDefault: "Warn" | "Halt" | "QuarantineDomain"
}

interface ExplainCodeDefinitionV1 {
  id: uint16
  domainId: DomainId
  name: string
}
```

---

## Event Instance

```ts
interface EventInstanceV1 {
  eventId: uint64
  eventTypeId: uint16
  domainId: DomainId
  absTime: AbsTime
  payload: FixedBinaryBlob
}
```

---

## Hard Rules

* Runtime logic must branch on numeric IDs only.
* Event payload schemas are fixed-layout in v1 (no dynamic keys).
* IDs are append-only and never reused.
* Registry version mismatch at load time must reject snapshot/replay.


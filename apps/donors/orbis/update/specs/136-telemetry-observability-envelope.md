# 🔒 TELEMETRY OBSERVABILITY ENVELOPE v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`, `docs/specs/30-runtime-determinism/135-exactly-once-idempotency-contract.md`]
- `Owns`: [`RuntimeEventEnvelopeV1`, `TraceCorrelationPolicyV1`]
- `Writes`: [`runtime telemetry events`, `cross-domain trace correlation records`]

## Purpose
Standardize runtime observability records so all domains emit a shared, queryable, replay-safe envelope with trace correlation.

## Scope
- runtime JSONL events
- dice/governance/runtime bridge events
- failure heatmaps and cross-domain trace summaries

## Envelope Contract

```ts
interface RuntimeEventEnvelopeV1 {
  schemaVersion: "runtime.event.v1"
  eventId: string
  traceId: string
  parentEventId?: string
  timestampIso: string
  source: string
  worldId: string
  tick: number
  revisionId?: string
  requestId?: string
  actionId?: string
  status?: "ok" | "degraded" | "failed" | "timeout" | "cancelled"
  reasonCode?: string
  payload: Record<string, unknown>
}

interface TraceCorrelationPolicyV1 {
  requireTraceId: true
  requireEventId: true
  requireSchemaVersion: "runtime.event.v1"
}
```

## Validation Rules
1. Every emitted runtime event must include `schemaVersion`, `eventId`, `traceId`, `timestampIso`, `source`, `tick`, and `payload`.
2. `traceId` must be stable across causally related events in one chain.
3. Any non-`ok` status must include `reasonCode`.
4. Envelope shape must be machine-validatable from JSONL exports.

## Operational Mapping
Implementation should map to:
- `runtime:validate-envelopes`
- `runtime:telemetry-export`
- `runtime:failure-heatmap`
- `runtime:cross-domain-traces`

## Compliance Vector (v1)
Input:
- One dice action chain producing queued -> rolling -> settled events

Expected:
- each event has `schemaVersion=runtime.event.v1`
- all events share one stable `traceId`
- each event has unique `eventId`
- telemetry export includes non-empty normalized envelope list

## Promotion Notes
- No predecessor; new canonical contract.

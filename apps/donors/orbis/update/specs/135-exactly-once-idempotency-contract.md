# 🔒 EXACTLY-ONCE IDEMPOTENCY CONTRACT v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/30-runtime-determinism/35-deterministic-rng.md`, `docs/specs/30-runtime-determinism/58-state-authority-contract.md`, `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`]
- `Owns`: [`RequestId`, `PayloadDigest64`, `TickInt`, `RevisionId`, `IdempotencyEnvelopeV1`, `IdempotencyResultV1`, `IdempotencyCachePolicyV1`]
- `Writes`: [`authoritative idempotency cache`, `duplicate delivery audit events`]

## Purpose
Guarantee that high-impact runtime commands mutate authoritative state at most once per unique request identity, even under retries, network duplication, or client reconnect.

## Scope
- Dice/action command requests
- Policy/governance mutation requests
- Retry/replay-safe duplicate handling

## Canonical Rule
For the same `requestId` and same canonical payload digest:
- first valid delivery: execute mutation and persist result
- duplicate delivery: return persisted result, do not mutate again

## Contracts

```ts
type RequestId = string
type PayloadDigest64 = string
type TickInt = number
type RevisionId = string

interface IdempotencyEnvelopeV1 {
  requestId: RequestId
  worldId: string
  tick: TickInt
  revisionId: RevisionId
  actionType: string
  payloadDigest64: PayloadDigest64
}

interface IdempotencyResultV1 {
  status: "executed" | "duplicate_replay" | "rejected_mismatch"
  authoritativeEventId?: string
  reasonCode?: string
}

interface IdempotencyCachePolicyV1 {
  minRetentionTicks: TickInt
  evictionPolicy: "tick_window_then_snapshot_anchor"
}
```

## Validation Rules
1. `requestId` is globally unique within a world timeline window.
2. Duplicate `requestId` with equal `payloadDigest64` must replay cached result.
3. Duplicate `requestId` with different `payloadDigest64` must reject with reason code.
4. Idempotency replay must not append a second mutation event.

## Failure Codes
- `RC_IDEMPOTENCY_MISMATCH_PAYLOAD`
- `RC_IDEMPOTENCY_REPLAY`

## Operational Mapping
Implementation should map to:
- `runtime:policy-idempotency-smoke`
- duplicate command handling in authoritative dice/policy pipelines

## Compliance Vector (v1)
Input:
- request A: `requestId=req_1001`, `payloadDigest64=0xabc`, action `decree_tax+10`
- duplicate A: same `requestId=req_1001`, same digest

Expected:
- first delivery -> `status=executed`, one authoritative mutation event appended
- duplicate delivery -> `status=duplicate_replay`, zero additional mutation events

Negative case:
- duplicate with `requestId=req_1001`, digest `0xdef`
- expected -> `status=rejected_mismatch`, reason `RC_IDEMPOTENCY_MISMATCH_PAYLOAD`

## Promotion Notes
- No predecessor; new canonical contract.

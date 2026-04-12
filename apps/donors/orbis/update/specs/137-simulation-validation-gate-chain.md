# 🔒 SIMULATION VALIDATION GATE CHAIN v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/30-runtime-determinism/135-exactly-once-idempotency-contract.md`, `docs/specs/30-runtime-determinism/136-telemetry-observability-envelope.md`, `docs/specs/70-governance-benchmarks/75-benchmark-scenario-contract.md`]
- `Owns`: [`ValidationGateChainV1`, `RuntimeThresholdMatrixV1`]
- `Writes`: [`gate pass/fail artifacts`, `threshold violation diagnostics`]

## Purpose
Define one executable chain of runtime validation gates for authoritative simulation acceptance.

## Gate Chain Contract

```ts
interface ValidationGateChainV1 {
  p0: string[]
  p1: string[]
  p2: string[]
  ciEntry: string
}
```

Canonical chain:
- `runtime:p0-gate`
- `runtime:p1-gate`
- `runtime:p2-gate`
- `runtime:test`
- `runtime:ci` (must execute gate + tests end-to-end)

## Threshold Matrix Contract

```ts
interface RuntimeThresholdMatrixV1 {
  maxFrameCostMs: number
  timeoutBudgetMs: number
  fallbackTrigger: "on_timeout_or_budget_violation"
  maxDiceCount: number
}
```

Required v1 values:
- `maxFrameCostMs = 16.6`
- `timeoutBudgetMs = 5000`
- `fallbackTrigger = on_timeout_or_budget_violation`
- `maxDiceCount = 20`

## Required Assertions
1. Contract integrity checks pass before smoke suites.
2. Multiplayer authority smoke proves host-authoritative reconcile.
3. Renderer failure/timeout cannot mutate canonical result.
4. Replay/debug parity checks pass.
5. Observability artifacts are generated and valid.

## Required Artifacts
At minimum, the gate must produce:
- `dice-events.jsonl`
- `runtime-events.jsonl`
- `lockstep-bucket-jitter-smoke.json`
- `host-migration-smoke.json`
- `policy-idempotency-smoke.json`
- `cross-domain-causal-smoke.json`
- `runtime-telemetry-export.json`
- `failure-heatmap.json`
- `cross-domain-trace-summary.json`

## Compliance Vector (v1)
Input:
- run `runtime:ci` on clean workspace

Expected:
- exit code `0`
- all required artifacts present
- deterministic parity flags true in causal smoke outputs
- no threshold violation that bypasses fallback policy

## Promotion Notes
- No predecessor; new canonical contract.

# 90 Action Defs And Deterministic Preview Model (Brainstorm Design)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/89-save-schema-core-eventlog-snapshot-ppm.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`, `docs/brainstorm/122-causality-trace-contract.md`]
- `Owns`: [`content_action_def`, `content_action_param`, `ActionPreviewResultV1`]
- `Writes`: [`preview results`, `action commit events`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/90-action-defs-and-deterministic-preview-model.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Goal
Represent actions as content and preview their outcomes deterministically before commit.

## Content Tables
- `content_action_def(action_id, name, category, requirements, costs, effects, side_effect_risk, version)`
- `content_action_param(action_id, key, type, min, max, default, unit)`

## Action Lifecycle
- `draft` -> `preview` -> `commit` -> `checkpoint`

## Preview Engine Contract
- input: current tick state, selected action, param values
- output:
  - direct deltas
  - cascade deltas (short/mid/long)
  - risk flags + reason codes
  - confidence/provenance

## Determinism Rules
- same state + action + params + tick => same preview output
- side-effect risk resolved by seeded deterministic stream
- stable calc order by sorted metric key

## Preview Output Shape
```ts
interface ActionPreviewResultV1 {
  actionId: string
  direct: Array<{ key: string; deltaPPM: number }>
  cascade: Array<{ key: string; deltaPPM: number; horizon: "short" | "mid" | "long" }>
  risks: Array<{ key: string; severity: "low" | "med" | "high"; reasonCode: number }>
  confidence: "low" | "medium" | "high"
  provenance: { source: "fitted" | "gameplay"; modelVersion: string }
}
```

## Validation
- reject if requirements fail
- reject if revision mismatch
- clamp params to contract ranges

## Done Criteria
- all high-impact actions support preview
- preview and commit use same model version
- event log stores preview digest and commit digest for audit

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

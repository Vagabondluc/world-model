# 107 Cross Scale Information Contract (Brainstorm Draft)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`cross-scale information contract`, `persistence/aggregation rules`]
- `Writes`: [`zoom transformation requirements`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/107-cross-scale-information-contract.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define strict transformation laws for data when zooming between scales so continuity is preserved and information density remains readable.

## Prime Rule
- Same world identity at all scales.
- Less detail at higher scale, never broken causality.

## Information Classes
- `persistent`: visible across all scales (anchors)
- `aggregated`: transformed representation across scales
- `local`: visible only within bounded altitude windows

## Identity Persistence
A persistent object keeps one identity while representation changes.

Examples:
- fort -> stronghold -> military hub
- river ford -> route -> trade artery
- battle skirmish -> campaign -> war arc

## Aggregation Laws
- zoom out reduces quantity, increases symbolism
- repeated similar events merge into thematic waves
- aggregation cannot remove durable consequences

## Causality Preservation
If low-scale event changes durable state (population, territory, institution, legitimacy), that effect must remain visible at higher scales in transformed form.

## Visibility Thresholds
Each datum has relevance thresholds by altitude.
- below threshold: hidden, not deleted
- hidden data remains simulated and queryable

## Authority Continuity
Ownership changes propagate upward with smoothing delay.
- no instant global jumps unless explicit hard transition event

## Actor Continuity
- major actors persist across all scales
- minor actors collapse into aggregates at high scales

## Narrative Continuity
- myths persist longer than raw facts
- beliefs remain visible at higher scales where raw events are aggregated

## UI Mutation Rule
- zoom out: less micromanagement, more systemic indicators
- zoom in: more agency, more local context

## Contract Shape
```ts
type ScaleClassV1 = "persistent" | "aggregated" | "local"

interface CrossScaleRuleV1 {
  datumKey: string
  class: ScaleClassV1
  minScale: string
  maxScale: string
  aggregationFn?: string
  identityAnchorKey?: string
}
```

## Determinism Requirements
- aggregation functions are pure
- stable ordering for merge groups
- same source state -> same cross-scale projection

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

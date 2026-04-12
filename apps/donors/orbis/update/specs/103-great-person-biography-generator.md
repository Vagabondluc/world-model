# 99 Great Person Biography Generator (Brainstorm Draft)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`great-person biography generator contract`]
- `Writes`: [`actor biography outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/99-great-person-biography-generator.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Generate actor-centric historical biographies from canonical and chronicled data.

## Qualification Rules
Actor qualifies when composite impact crosses threshold:
- participation in high-importance events
- sustained influence duration
- regime transition involvement
- myth linkage

## Biography Structure
- origin
- rise
- influence period
- opposition
- outcome
- memory/legacy

## Data Contract
```ts
interface BiographyProfileV1 {
  actorId: string
  title: string
  eraSpan: { startTick: number; endTick: number }
  originSummary: string
  riseSummary: string
  influenceSummary: string
  oppositionSummary: string
  outcomeSummary: string
  legacySummary: string
  sourceEventIds: string[]
}
```

## Narrative Lenses
Generate variants by source lens:
- heroic
- tragic
- villainous
- contested
- bureaucratic

## Supporting Artifacts
- quote extraction (from chronicle lines)
- relationship graph (allies/rivals)
- influence timeline
- key decision cards

## Example Output Pattern
`<Actor>` rose during `<Crisis>`, leveraged `<Institution/Faction>`, triggered `<Major Decision>`, and is remembered as `<Contested Legacy>`.

## Determinism Requirements
- same actor + same timeline slice => same biography body
- fixed template selection order
- source tie-break by influence weight then sourceId


## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.


## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

# 99 Great Person Biography Generator (Brainstorm Draft)

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/specs/30-runtime-determinism/56-unified-parameter-registry-schema-contract.md`, `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`]
- `Owns`: [`great-person biography generator contract`, `BiographyProfileV1`]
- `Writes`: [`actor biography outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/specs/40-actions-gameplay/107-great-person-biography-generator.md`
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
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedUnitPolicyClauseV1); numeric authority follows `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`.

## Reason Code Integration
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedReasonCodeIntegrationClauseV1); reason-code authority follows `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`.

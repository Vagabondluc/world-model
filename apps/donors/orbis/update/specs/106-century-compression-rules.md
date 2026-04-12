# 98 Century Compression Rules (Brainstorm Draft)

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/specs/30-runtime-determinism/56-unified-parameter-registry-schema-contract.md`, `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`]
- `Owns`: [`century compression rules`, `importance/aggregation heuristics`, `EventImportanceInputV1`, `CompressedEraV1`]
- `Writes`: [`compressed era-history artifacts`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/specs/40-actions-gameplay/106-century-compression-rules.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Compress long-run history into human-readable eras while preserving causality and major turning points.

## Goal
Keep:
- regime transitions
- territorial changes
- major wars
- structural inventions
- demographic pivots
- institution creation/destruction

Aggregate:
- repetitive low-impact unrest
- small economic oscillations
- minor skirmishes

## Event Importance Score
Each canonical event gets `importancePPM` based on weighted factors.

```ts
interface EventImportanceInputV1 {
  regimeChange: boolean
  territoryChangeScalePPM: number
  casualtyScalePPM: number
  institutionCreatedOrDestroyed: boolean
  mythCreated: boolean
  leaderChange: boolean
  economicShiftScalePPM: number
}
```

```ts
importancePPM =
  (regimeChange ? 10_000_000 : 0) +
  mulPPM(territoryChangeScalePPM, 8_000_000) +
  casualtyScalePPM +
  (institutionCreatedOrDestroyed ? 6_000_000 : 0) +
  (mythCreated ? 5_000_000 : 0) +
  (leaderChange ? 4_000_000 : 0) +
  economicShiftScalePPM
```

## Temporal Aggregation
Low-importance events are merged into period summaries by theme:
- labor unrest
- policy churn
- border skirmishes
- media cycles

## Narrative Dominance Rule
For each compressed period:
- surface majority belief narrative
- surface highest influence source narrative
- retain minority narratives in drill-down

## Causal Anchoring Rule
An event can be retained at top level only if it changes at least one durable state:
- government form
- territory ownership
- institution graph
- faction distribution
- myth adoption baseline

## Era Chunking
Auto-segment history into eras using dominant pressure vectors and transition markers.

Example output:
- Founding Era
- Expansion Era
- Age of Fracture
- Machine Ascendancy

## Compression Pyramid
- Full ledger
- Major events
- Era milestones
- Civilizational identity summary

## Output Contract
```ts
interface CompressedEraV1 {
  eraId: string
  startTick: number
  endTick: number
  title: string
  dominantThemes: string[]
  milestoneEventIds: string[]
  aggregateNarratives: string[]
}
```

## Determinism Requirements
- stable scoring order by `(tick, eventId)`
- fixed coefficients by ruleset version
- stable tie-break by `eventId`


## Unit Policy
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedUnitPolicyClauseV1); numeric authority follows `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`.

## Reason Code Integration
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedReasonCodeIntegrationClauseV1); reason-code authority follows `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`.

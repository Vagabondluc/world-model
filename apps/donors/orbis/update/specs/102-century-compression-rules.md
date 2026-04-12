# 98 Century Compression Rules (Brainstorm Draft)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`century compression rules`, `importance/aggregation heuristics`]
- `Writes`: [`compressed era-history artifacts`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/98-century-compression-rules.md`
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
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.


## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

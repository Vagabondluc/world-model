# 103 Playable Museum Interface (Brainstorm Draft)

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/specs/30-runtime-determinism/56-unified-parameter-registry-schema-contract.md`, `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`]
- `Owns`: [`playable museum IA`, `exhibit interaction contract`, `MuseumExhibitV1`, `BranchComparisonV1`]
- `Writes`: [`museum exhibit navigation outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/specs/40-actions-gameplay/103-playable-museum-interface.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Provide an interactive historical exploration layer with exhibits, artifacts, controversies, and branch comparison.

## Core Structure
Museum is organized into exhibits:
- wars
- government transitions
- cultural shifts
- disasters
- innovations
- myths and memory conflicts

## Exhibit Contract
```ts
interface MuseumExhibitV1 {
  exhibitId: string
  title: string
  period: { startTick: number; endTick: number }
  summary: string
  keyFigureIds: string[]
  artifactIds: string[]
  mapStateRef: string
  dominantNarratives: string[]
  controversies: string[]
}
```

## Artifact Types
- event cards
- institution charters
- faction manifestos
- actor biographies
- map snapshots
- media narratives
- myth records

## Interaction Modes
- guided timeline tour
- free roam exhibits
- compare narratives
- branch simulation comparison (`what if X failed`)

## Comparison Contract
```ts
interface BranchComparisonV1 {
  baselineWorldId: string
  variantWorldId: string
  divergenceTick: number
  keyDifferences: Array<{ key: string; deltaPPM: number }>
  highlightedEvents: string[]
}
```

## Education Mode
Optional “textbook generation” view:
- chapterized eras
- glossary links
- key figures
- source-bias notes

## Multiplayer Value
Each world/save can output unique museum content for sharing and competitive storytelling.

## Determinism Requirements
- exhibit assembly deterministic for same world + ruleset
- branch diff deterministic from aligned divergence tick
- stable artifact ordering by `(importance, tick, id)`


## Unit Policy
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedUnitPolicyClauseV1); numeric authority follows `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`.

## Reason Code Integration
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedReasonCodeIntegrationClauseV1); reason-code authority follows `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`.

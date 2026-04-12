# 102 Documentary Mode (Brainstorm Draft)

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/specs/30-runtime-determinism/56-unified-parameter-registry-schema-contract.md`, `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`]
- `Owns`: [`documentary mode structure`, `episode composition contract`, `DocumentaryEpisodeV1`]
- `Writes`: [`documentary timeline render outputs`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/specs/40-actions-gameplay/102-documentary-mode.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Render simulation history as episodic, watchable narratives using compressed eras, causality traces, and actor arcs.

## Episode Model
Each episode corresponds to one era block or one major crisis arc.

Episode structure:
- baseline world state
- rising tensions
- trigger event
- cascade chain
- aftermath and legacy

## Episode Contract
```ts
interface DocumentaryEpisodeV1 {
  episodeId: string
  title: string
  startTick: number
  endTick: number
  triggerEventId?: string
  keyEventIds: string[]
  keyActors: string[]
  keyInstitutions: string[]
  narrativeLens: "academic" | "patriotic" | "critical" | "sensationalist"
}
```

## Visual Data Feeds
- map transitions
- power share charts
- faction radicalization bands
- trust/legitimacy trajectories
- actor portrait/timeline cards

## Narration Style Packs
- academic
- patriotic
- critical
- sensationalist

Style pack affects wording and emphasis, not canonical facts.

## Playback Controls
- play/pause timeline
- jump to trigger
- compare lens
- show causality trace
- toggle real vs perceived

## Determinism Requirements
- deterministic episode segmentation by era rules
- deterministic event ordering in each episode
- fixed style template catalog by version


## Unit Policy
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedUnitPolicyClauseV1); numeric authority follows `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`.

## Reason Code Integration
- See shared policy in `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` (SharedReasonCodeIntegrationClauseV1); reason-code authority follows `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`.

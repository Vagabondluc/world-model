# 93 Belief Narrative Activation Plan (Brainstorm Design)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`belief/narrative activation plan`, `activation gating rules`]
- `Writes`: [`narrative layer rollout steps`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/93-belief-narrative-activation-plan.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Goal
Activate perception and narrative distortion only after core governance loop is stable.

## Activation Preconditions
- save core and preview model pass deterministic replay checks
- situation room + action picker in daily use
- faction/institution/actor layers produce stable event cadence

## Step 1: Belief Read Model
- add `save_belief_state` generation from objective pressures
- start with passive divergence (no active propaganda)
- show read-only perceived vs real delta in Situation Room

## Step 2: Narrative Sources
- enable source entities with reach + credibility
- apply deterministic perception update
- add trust decay for disproven narratives

## Step 3: Narrative Actions
- enable campaign/declassify/censor/counter-message actions
- wire to preview + reason-coded risks
- feed outcomes back into pressure system

## Safety Limits
- clamp divergence to bounded ranges
- cooldowns on high-intensity narrative operations
- one dominant narrative operation per source per tick

## UX Requirements
- always show uncertainty/confidence
- always show top source drivers for perceived metrics
- keep objective and perceived charts side by side

## Done Criteria
- perceived-state events can trigger distinct outcomes from objective state
- causality trace explains narrative chain end-to-end
- replay remains deterministic with narrative layer enabled


## Unit Policy`n- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.`n
## Reason Code Integration`n- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.`n

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

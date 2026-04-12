# 91 Situation Room And Action Picker UX Backbone (Brainstorm Design)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/89-save-schema-core-eventlog-snapshot-ppm.md`, `docs/brainstorm/90-action-defs-and-deterministic-preview-model.md`, `docs/brainstorm/122-causality-trace-contract.md`]
- `Owns`: [`SituationRoom panel contract`, `Action Picker contract`]
- `Writes`: [`operator decisions`, `preview/commit traces`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/91-situation-room-and-action-picker-ux-backbone.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Goal
Deliver the minimum control bridge UI that makes the simulation understandable and steerable.

## Situation Room (Required Panels)
- top changes (last N ticks)
- near-threshold risks
- faction heat (if enabled)
- institution stance (if enabled)
- narrative drift (if enabled)
- top driver feed with reason codes

## Primary CTA
- `Decide...` opens shared Action Picker

## Action Picker (Shared Modal)
- filters: domain, risk, horizon, impacted group
- each card shows:
  - short intent label
  - likely effects arrows
  - support/opposition indicators
  - risk badge + reason code
  - confidence and provenance

## Interaction Contract
- high-impact: preview required before commit
- commit requires checkpoint in canon mode
- revision conflict opens fork/sync resolution

## Data Dependencies
- from `save_pressure_state`: key deltas and risk signals
- from `save_event_log`: trace and explainability
- from preview engine: action consequences

## Done Criteria
- player can identify top 3 problems in under 30 seconds
- every major action shows likely cost and risk
- post-action outcome links back to causality trace

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

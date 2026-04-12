# 92 Phased Addition Factions Institutions Actors (Brainstorm Design)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`phased rollout plan for factions/institutions/actors`]
- `Writes`: [`staged implementation sequence`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/92-phased-addition-factions-institutions-actors.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Goal
Add social complexity in controlled phases without destabilizing the core loop.

## Phase A: Factions
- enable faction spawn from pressure + ideology mismatch
- track size, influence, radicalization stage
- expose 3 actions: appease, suppress, negotiate

Gate to advance:
- faction lifecycle stable for 200+ ticks
- no deterministic replay drift

## Phase B: Institutions
- instantiate institution archetypes
- add legitimacy/corruption/adaptability
- mediate reform effects via inertia

Gate to advance:
- institution conflict resolution deterministic
- policy outcomes visibly differ by institution state

## Phase C: Actors
- spawn elites from factions/institutions
- apply actor action scoring and override rules
- expose key actions: promote, sideline, investigate, appoint

Gate to advance:
- actor interventions produce auditable reason-coded events
- no runaway action spam

## Common Controls
- feature flags per layer
- replay snapshots at phase boundaries
- regression scenarios for each phase

## Done Criteria
- each phase is independently shippable
- previous phase behavior remains stable after next phase activation


## Unit Policy`n- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.`n
## Reason Code Integration`n- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.`n

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

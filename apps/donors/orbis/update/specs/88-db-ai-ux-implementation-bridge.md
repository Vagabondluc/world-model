# 88 DB AI UX Implementation Bridge (Brainstorm Draft)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`db-ai-ux bridge plan`, `implementation integration constraints`]
- `Writes`: [`stack integration blueprint`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/88-db-ai-ux-implementation-bridge.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Provide a cohesive implementation bridge across data model, AI behavior, and player-facing control surfaces.

## Design Goals
- deterministic simulation replay
- event-sourced timeline
- mod-friendly content separation
- explainable causality queries

## Storage Split
- content DB: static rules and definitions
- save DB: world state, ticks, snapshots, event logs

## Content Schema (Static)
### content_tech_node
- `tech_id` (pk, text)
- `name` (text)
- `level` (int)
- `era` (text)
- `tags` (jsonb)
- `temporal_profile` (jsonb)
- `emissions` (jsonb)
- `prereq` (jsonb)
- `effects` (jsonb)

### content_ideology_node
- `ideo_id` (pk, text)
- `name` (text)
- `dimensions` (jsonb)
- `bias` (jsonb)
- `tolerances` (jsonb)
- `trigger_rules` (jsonb)

### content_institution_archetype
- `arch_id` (pk, text)
- `type` (enum)
- `power_sources` (jsonb)
- `aligned_axes` (jsonb)
- `resists` (jsonb)
- `adaptability` (smallint)
- `corruption_profile` (jsonb)

### content_action_def
- `action_id` (pk, text)
- `name` (text)
- `category` (enum)
- `requirements` (jsonb)
- `costs` (jsonb)
- `effects` (jsonb)
- `side_effect_risk` (jsonb)

### content_narrative_template
- `tmpl_id` (pk, text)
- `scope` (enum)
- `conditions` (jsonb)
- `message` (text)
- `tone_tags` (jsonb)

## Save Schema (Dynamic)
### save_world
- `world_id` (pk, uuid)
- `seed` (bigint)
- `ruleset_version` (text)
- `created_at` (timestamp)

### save_civ
- `civ_id` (pk, uuid)
- `world_id` (fk)
- `name` (text)
- `starting_ideology` (text)
- `created_at` (timestamp)

### save_tick
- `world_id` (fk)
- `tick` (int)
- `rng_counter` (bigint)
- pk: (`world_id`, `tick`)

### save_state_snapshot
- `world_id` (fk)
- `tick` (int)
- `state` (jsonb)
- `hash` (text)
- pk: (`world_id`, `tick`)

### save_event_log
- `event_id` (pk, ulid/text)
- `world_id` (fk)
- `tick` (int)
- `scope` (enum)
- `subject_id` (text)
- `event_type` (text)
- `payload` (jsonb)
- `cause` (jsonb)
- indexes: (`world_id`, `tick`), (`scope`, `subject_id`)

### save_pressure_state (optional denormalized query table)
- `world_id`, `tick`, `civ_id` (composite pk)
- ppm columns for key pressure axes

### save_faction
- `faction_id` (pk, uuid)
- `civ_id` (fk)
- `archetype` (text)
- `size_ppm` (int)
- `influence_ppm` (int)
- `radicalization` (smallint)
- `demands` (jsonb)
- `stance` (jsonb)

### save_institution
- `inst_id` (pk, uuid)
- `civ_id` (fk)
- `arch_id` (fk)
- `power_ppm` (int)
- `legitimacy_ppm` (int)
- `corruption_ppm` (int)
- `leaders` (jsonb)

### save_actor
- `actor_id` (pk, uuid)
- `civ_id` (fk)
- `role` (enum)
- `traits` (jsonb)
- `skills` (jsonb)
- `loyalties` (jsonb)
- `network` (jsonb)

### save_belief_state
- `world_id`, `tick`, `civ_id` (composite pk)
- `beliefs` (jsonb)

## Data Notes
- use ppm integers in authoritative state
- version content via `ruleset_version`
- sync multiplayer through event log, not snapshots

## Unified AI Decision Contract
AI loop:
- perceive
- form intent
- generate options
- score options
- commit action
- emit explanation

Inputs:
- real and perceived pressures
- ideology biases and tolerances
- faction and institution states
- actor traits and networks

Utility shape:
```text
U(action) =
  sum(axis weights * expected axis deltas)
  + sum(faction satisfaction effects)
  + institution alignment
  - catastrophe risk penalty
  - instability penalty
  - cost penalty
```

## AI Layers
- empire AI: strategic direction and top-level commitments
- institution AI: inertia, veto, redirection, adaptation
- faction AI: grievance, agitation, mobilization
- actor AI: coups, reforms, betrayals, high-agency gambits

## Deterministic Randomness
- derive pseudo-randomness from world seed + tick + entity id + event index
- persist rng counter per tick

## AI Explainability Payload
```json
{
  "ai_reason": {
    "top_drivers": [],
    "predicted_risks": [],
    "alignment": {},
    "alternatives_considered": [],
    "why_this": ""
  }
}
```

## UX Wireframe Hierarchy
Global shell:
- top bar: era, tick, stability, trust, treasury
- left nav:
  - situation room
  - tech and futures
  - society
  - institutions
  - people
  - narrative
  - timeline
  - policies and actions

### Situation Room
- top deltas
- imminent risks
- actors to watch
- faction heat
- narrative drift
- primary CTA: `Decide...`

### Tech and Futures
- tech tree with tags and impact emissions
- projection tab with short/mid/long horizon outcomes

### Society (Factions)
- influence, satisfaction, radicalization stage
- demand details and calming/escalation drivers

### Institutions
- power map
- legitimacy/corruption/adaptability
- actions: appoint, audit, fund, restructure

### People (Actors)
- roster and traits
- relationship graph
- plot risk feed
- actions: promote, sideline, investigate, bargain, exile

### Narrative
- real vs perceived dashboard
- media/source credibility map
- active frames
- actions: campaign, declassify, censor, counter-message

### Timeline
- event log filters
- causality trace drill-down

### Action Picker (shared)
- searchable catalog
- outcome arrows
- supporters/opponents
- risk badge
- confidence/provenance badge

## Recommended Implementation Order
- event log + snapshot core + ppm state path
- action definitions + deterministic preview
- situation room + action picker
- factions and institutions
- actors and narrative distortion


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

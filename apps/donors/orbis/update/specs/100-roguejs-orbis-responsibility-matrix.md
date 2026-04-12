# 🔒 ROGUE.JS ↔ ORBIS RESPONSIBILITY MATRIX SPEC v1 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/30-runtime-determinism/58-state-authority-contract.md`, `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`, `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`]
- `Owns`: [`Dice100RuntimeDomainV1`, `Dice100BoundaryRuleV1`, `Dice100BoundaryBreachEventV1`]
- `Writes`: `[]`

## Purpose
Lock ownership boundaries across authority, scheduler runtime, renderer, and UI integration so deterministic simulation cannot be contaminated by presentation or plugin layers.

## Scope
- Tactical turn loop and actor action sequencing.
- Deterministic outcome authority and replay boundaries.
- Renderer/physics non-authority policy.
- Multiplayer reconciliation and stale-revision handling.

## Owned Contracts
```ts
type Dice100RuntimeDomainV1 =
  | "authority_domain"
  | "runtime_domain"
  | "render_domain"
  | "ui_domain"
  | "plugin_domain"

interface Dice100BoundaryRuleV1 {
  sourceDomain: Dice100RuntimeDomainV1
  targetDomain: Dice100RuntimeDomainV1
  action: string
  allowed: boolean
  reasonCodeOnBlock: number
}

interface Dice100BoundaryBreachEventV1 {
  eventId: string
  tick: number
  sourceDomain: Dice100RuntimeDomainV1
  targetDomain: Dice100RuntimeDomainV1
  action: string
  blocked: boolean
  reasonCode: number
}
```

## Layer Definitions
- `Orbis Core`: canonical simulation authority and ledger writer.
- `Rogue Runtime`: tactical state machine, scheduler, and discrete action execution.
- `Renderer/Physics`: visual animation and effects only.
- `UI Layer`: player command and explainability surfaces.

## Responsibility Matrix (Authoritative)

| Capability | Owner | Allowed Consumers | Forbidden Owner |
|---|---|---|---|
| Canonical RNG seed and roll math | Orbis Core | Rogue Runtime, UI | Renderer/Physics |
| Tactical turn scheduling | Rogue Runtime | UI | Renderer/Physics |
| Actor decision scoring and utility | Orbis Core | Rogue Runtime | Renderer/Physics |
| Action validation (rules legality) | Rogue Runtime | UI | Renderer/Physics |
| Final action outcome values | Orbis Core | Rogue Runtime, UI | Renderer/Physics |
| Dice animation and camera | Renderer/Physics | UI | Orbis Core |
| Dice result authority | Orbis Core | Rogue Runtime | Renderer/Physics |
| Event ledger append | Orbis Core | none | Rogue Runtime, Renderer/Physics |
| Replay reconstruction | Orbis Core | UI | Renderer/Physics |
| Reason-code emission for UX | Orbis Core + Rogue Runtime | UI | Renderer/Physics |

## Integration Contracts

### Rogue Runtime Contract
- Receives canonical decision/outcome payloads from Orbis Core.
- Executes tactical state transitions in discrete turns.
- Emits action attempt and completion events with stable ids.
- Must not generate authoritative combat or roll outcomes outside canonical payload.

### Orbis Core Contract
- Computes deterministic outcomes for high-impact actions.
- Publishes roll outcomes to Dice Orchestration Bridge.
- Persists canonical events and reason codes.
- Provides replay-consistent response for identical inputs.

### Renderer Contract
- Renders animation from predetermined outcomes only.
- Never writes to canonical tactical or world state.
- On failure, returns status and reason-code context through bridge.

## Normative Boundary Rules
### Render Domain
- MUST NOT mutate canonical simulation fields (`WorldStore`, `hexData`, `SimTime`, domain state fields).
- MUST NOT compute authoritative combat/math outcomes.
- MUST consume read-only snapshots/envelopes.
- MUST emit intents/completions via bridge only.

### Authority Domain
- MUST own all canonical state mutation.
- MUST remain renderer-agnostic (headless-compatible).
- MUST persist authoritative action/result events.

### Runtime Domain (Rogue)
- MUST sequence tactical turns and action order.
- MUST NOT bypass authority for final outcomes.
- MUST reject stale revisions before authoritative commit.

### UI/Plugin Domains
- MUST use intent/command queue.
- Plugin domain defaults to read-only unless explicitly granted.
- Any blocked write must emit `Dice100BoundaryBreachEventV1`.

## Write Boundary Enforcement
Violation handling policy:
- Block mutation attempt.
- Emit reason code `610102` (validation blocked) or `610201` (revision conflict) depending on context.
- Record boundary breach event for diagnostics.

## Conflict Resolution Principle
Player input is deferred force:
- UI actions become intents.
- Intents are resolved on deterministic tick boundaries by authority.
- No direct state mutation at input time.

## Conflict and Failure Policy
- If renderer output differs from predetermined outcome: reject renderer output and preserve canonical outcome.
- If runtime receives stale revision: block commit and emit revision conflict reason code.
- If bridge times out: fallback visual path and keep canonical outcome.

## Mode Compatibility
- Offline single-process: logical boundaries remain enforced.
- Hosted multiplayer: authority strictly server-side.
- Host migration: freeze intake, transfer authority token+revision, resume after confirmation.

## Determinism Rules
- Same `worldSeed`, `tick`, `entityId`, and action payload must produce same canonical outcome.
- Tactical scheduler order must be stable for equal initiative under explicit tie-break rule.
- Visual frame rate cannot affect canonical state.

## Multiplayer Rules
- Host/server authoritative for final outcomes.
- Clients may predict visuals but must reconcile to canonical payload.
- Visual divergence is UX-only, never authority-bearing.

## Required Event Envelope Fields
Every cross-layer action envelope must include:
- `actionId`
- `requestId`
- `worldId`
- `tick`
- `revisionId`
- `actorId`
- `reasonCode` (when blocked/degraded/failed)

## Compliance Vector (v1)
Input:
- Renderer attempts to set canonical population field directly.

Expected:
- write blocked,
- boundary breach event emitted,
- canonical state unchanged.

## Compliance Vector (v1b)
Input:
- User clicks high-impact action in UI.

Expected:
- UI emits intent only,
- state mutation occurs only after deterministic authority resolution tick.

## Compliance Vector (v1c)
Input:
- `worldSeed = 12345`
- `tick = 14020`
- `actorId = unit_a11`
- action: `attack(target_b07)`
- canonical predetermined roll: `[17]`

Expected:
- Orbis Core resolves hit/damage deterministically.
- Rogue Runtime advances turn only after canonical outcome acknowledgment.
- Renderer animation mismatch cannot alter resolved hit/damage.

## Promotion Notes
- No predecessor; new canonical contract.
- Complements `docs/specs/40-actions-gameplay/99-dice-orchestration-bridge.md`.
- Paired with `docs/specs/40-actions-gameplay/101-render-adapter-layer.md`.

# 112 Core Architecture Integration Map (Brainstorm)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`core architecture integration map`, `layer interaction map`]
- `Writes`: [`integration dependency mapping`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/112-core-architecture-integration-map.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Bind brainstorm drafts to existing Orbis core contracts so civilization systems can be promoted without architectural drift.

## Core Anchor Specs
- `docs/specs/00-core-foundation/01-time-clock-system.md`
- `docs/specs/00-core-foundation/11-deterministic-event-ordering.md`
- `docs/specs/30-runtime-determinism/38-unified-tag-system.md`
- `docs/specs/30-runtime-determinism/39-deterministic-utility-decision.md`
- `docs/specs/30-runtime-determinism/40-action-resolution-world-delta.md`
- `docs/specs/30-runtime-determinism/57-save-load-snapshot-contract.md`
- `docs/specs/30-runtime-determinism/58-state-authority-contract.md`
- `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`
- `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md`
- `docs/specs/70-governance-benchmarks/75-benchmark-scenario-contract.md`

## Integration Matrix
| Brainstorm Draft | Core Owner Contracts | Integration Requirement |
|---|---|---|
| `79-tech-impact-matrix-contract.md` | `68`, `40`, `58` | Convert impact units to ppm fixed-point deltas written via world-delta ownership rules. |
| `80-impact-propagation-engine.md` | `01`, `11`, `68`, `60` | Tick-ordered deterministic equation pass with reason-coded threshold outputs. |
| `81-regime-transition-state-machine.md` | `58`, `60`, `11` | Regime state ownership must be explicit; transition events in stable sort order. |
| `82-sociological-ideology-tree.md` | `68`, `39`, `60` | Ideology modifiers must be deterministic coefficients; no stochastic branch in authority path. |
| `83-faction-interest-group-generator.md` | `39`, `40`, `58` | Faction actions resolved through utility + world-delta contracts. |
| `84-institution-elite-layer.md` | `58`, `60`, `68` | Institution mediation math and collapse events must emit registry reason codes. |
| `85-elite-actor-character-engine.md` | `39`, `40`, `11` | Actor decisions are utility-resolved, tie-broken deterministically, and logged. |
| `86-information-narrative-engine.md` | `60`, `68`, `57` | Belief/perception updates deterministic; narrative divergence bounded and snapshot-safe. |
| `87-player-control-bridge.md` | `40`, `57`, `60` | UI writes must obey preview->commit->checkpoint and revision conflict contracts. |
| `88-db-ai-ux-implementation-bridge.md` | `57`, `58`, `75` | Save/event schema must align with core snapshot and benchmark harness. |
| `89-save-schema-core-eventlog-snapshot-ppm.md` | `57`, `11`, `68` | Event log + snapshots are replay-consistent and fixed-point based. |
| `90-action-defs-and-deterministic-preview-model.md` | `40`, `39`, `60` | Preview and commit share model version and reason-code outputs. |
| `91-situation-room-and-action-picker-ux-backbone.md` | `33` UI implied, `60` | UI panels must expose reason codes and top-driver traces. |
| `92-phased-addition-factions-institutions-actors.md` | `75`, `57` | Each phase gated by deterministic replay and scenario tests. |
| `93-belief-narrative-activation-plan.md` | `60`, `68`, `75` | Narrative activation blocked until parity and stability tests pass. |
| `94-government-form-system.md` | `58`, `60`, `68` | Government kernel is state-owned and coefficient-locked. |
| `95-government-transition-system.md` | `81`, `60`, `11` | Transition path ordering and reason-code mapping mandatory. |
| `96-civil-war-fragmentation-simulator.md` | `58`, `60`, `57` | Authority forks and region alignment must remain deterministic and snapshot-replay safe. |
| `97-chronicler-historiography-system.md` | `57`, `60` | Canonical ledger immutable; interpreted chronicles derived only. |
| `98`, `99`, `100`, `101` | `97`, `57` | Compression/biography/documentary/museum are read-models only (no truth mutation). |
| `102`, `103`, `104`, `105`, `106`, `107`, `108`, `109`, `110`, `111` | varies | Must reference canonical key/threshold registries before promotion. |

## Promotion Gate (Brainstorm -> Frozen Spec)
- deterministic math path defined
- state ownership explicitly mapped
- reason codes registered
- replay parity test specified
- UI write flow follows preview->commit->checkpoint

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

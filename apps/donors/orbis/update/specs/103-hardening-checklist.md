# 103 Hardening Checklist (Brainstorm)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`hardening checklist criteria`, `priority remediation matrix`]
- `Writes`: [`hardening action plan`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/103-hardening-checklist.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## How to Use
- Treat this as a gate checklist, not a wishlist.
- Mark each item as `todo`, `in_progress`, `done`, or `deferred`.
- Do not start broad feature expansion until all Critical items are `done`.

## Critical: Simulation Integrity
- [ ] Lock one canonical unit policy (`ppm`, `ticks`, `cost`) and reference it in all brainstorm specs.
- [ ] Freeze deterministic tick order across `79` to `102`.
- [ ] Add stable tie-break rules everywhere an ordering conflict can happen.
- [ ] Add reason code requirements for every transition/action failure path.
- [ ] Define global clamp/saturation policy and apply consistently.
- [ ] Define replay parity checks (same seed + actions => same hashes).
- [ ] Define schema version handshake (`ruleset_version`) for all content/save records.

## Critical: Event and Save Core
- [ ] Finalize canonical event envelope fields and required indexes.
- [ ] Define snapshot cadence and retention policy.
- [ ] Define event compaction policy (what can be merged, what cannot).
- [ ] Add migration rules for event payload shape changes.
- [ ] Add integrity hash algorithm and mismatch handling flow.

## Critical: Action and Preview Contract
- [ ] Define preview confidence semantics (`low|medium|high`) with exact thresholds.
- [ ] Enforce preview->commit->checkpoint for all high-impact actions.
- [ ] Define stale-revision conflict response shape and UX text pattern.
- [ ] Ensure preview and commit share exact same model version id.
- [ ] Add explicit fallback behavior when preview model fails.

## Critical: Tech Tree Hardening (Your Current Weakest Area)
- [ ] Define tech design goals first: simulation-first, game-first, or hybrid.
- [ ] Add missing prerequisites for every tech node (no orphan nodes).
- [ ] Add at least one systemic impact vector per tech (not only unlock flavor).
- [ ] Add at least one narrative/event hook per major tech family.
- [ ] Resolve naming collisions and near-duplicates (factory/shield/armor/scanner lines).
- [ ] Define branch identity for each era (why this era is distinct).
- [ ] Add explicit mutually-exclusive policy/governance tech branches.
- [ ] Add obsolescence/supersession rules (what older tech becomes less relevant).
- [ ] Define cost progression formula and verify monotonic growth constraints.
- [ ] Add category quotas per level (military, civil, science, governance balance).
- [ ] Add anti-snowball checks (cap or diminishing returns on key growth techs).
- [ ] Add deterministic unlock tests for at least 10 long-path chains.
- [ ] Add “tech feels redundant” review pass with keep/merge/delete decisions.

## High: Politics Layer (Factions, Institutions, Actors)
- [ ] Define minimum faction archetypes and exact spawn thresholds.
- [ ] Define institution power distribution sum rules and validation.
- [ ] Define actor action cooldowns and anti-spam limits.
- [ ] Add cross-layer conflict matrix (faction vs institution vs regime).
- [ ] Add explicit “no-op” behavior when no valid action exists.
- [ ] Define staged rollout feature flags and rollback plan per layer.

## High: Narrative and Memory
- [ ] Define objective vs perceived divergence metrics and alert thresholds.
- [ ] Define trust source decay/recovery equations.
- [ ] Add suppression/rediscovery lifecycle rules with reason codes.
- [ ] Define myth solidification threshold and decay behavior.
- [ ] Add chronicle generation determinism checks (same input => same text id set).

## High: Government and Transition
- [ ] Define government kernel defaults for all starter forms.
- [ ] Add legal reform path requirements and failure modes.
- [ ] Add coup path support constraints and post-failure outcomes.
- [ ] Add revolution/collapse fork conditions with explicit cooldown.
- [ ] Define transition fatigue and minimum stabilization windows.

## High: Civil War and Fragmentation
- [ ] Define power-center viability formula and threshold tests.
- [ ] Define region alignment scoring with stable tie-break.
- [ ] Define asset split formula and audit output.
- [ ] Define end-state taxonomy (reconsolidation, partition, frozen conflict).
- [ ] Add memory-of-violence persistence rules.

## High: UX Backbone
- [ ] Ensure all primary screens answer: what, why, what can I do, what it costs.
- [ ] Add required warnings with reason code chips for all blocked actions.
- [ ] Add “top drivers” trace on every major outcome card.
- [ ] Add uncertainty/provenance badges in all forecast views.
- [ ] Add information fog controls and confidence display rules.

## Medium: Performance and Operability
- [ ] Set hard caps for per-tick actions/events.
- [ ] Define profiling budget per tick and per 100-year simulation run.
- [ ] Define long-run storage budget and compaction thresholds.
- [ ] Add smoke tests for 200/500/1000-year deterministic runs.
- [ ] Add crash-recovery workflow from last snapshot + event tail.

## Medium: QA and Test Packs
- [ ] Build minimum deterministic fixture pack:
- [ ] `inequality spiral`
- [ ] `automation prosperity`
- [ ] `coup attempt`
- [ ] `failed reform`
- [ ] `narrative panic without objective crisis`
- [ ] Build acceptance checklist report template per release.
- [ ] Add “known residual risks” section to each milestone report.

## Tech Tree Gap Prompts (Use Before Next Revision)
- [ ] Which techs currently exist only as flavor with no systemic consequence?
- [ ] Which eras have too many military nodes vs civil/governance nodes?
- [ ] Which tech names duplicate function under different labels?
- [ ] Which late-game techs have no believable enabling chain?
- [ ] Which branches produce identical outcomes and should be merged?
- [ ] Which top 20 techs actually drive historical divergence in simulations?

## Exit Criteria for “Hardened v1”
- [ ] Deterministic replay parity passes on full MVP scenario pack.
- [ ] Tech tree has no orphan nodes and no unresolved duplicate concepts.
- [ ] Every high-impact player action has preview + conflict-safe commit.
- [ ] Timeline can explain top 3 drivers for any major crisis.
- [ ] 200-year run produces readable, causally coherent, non-identical histories.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

# 111 Tech Tree Design Deep-Search Integration

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`tech-tree deep-search synthesis`, `integration recommendations`]
- `Writes`: [`tech-tree design alignment guidance`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/111-tech-tree-design-deep-search-integration.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Capture external design insights on 4X tech-tree evolution and map them to the Orbis causality architecture.

## Key Takeaways
- Classical `Civ` model proves legibility and pacing through era-gated DAGs.
- Modern systems increase replayability via non-linearity, contextual triggers, and partial randomness.
- Advanced simulation framing treats technology as force emission into society, not only unlock progression.
- Orbis direction is aligned with the frontier: deterministic causal propagation from tech to social outcomes.

## Design Patterns to Reuse
- Era pacing as global throttle to keep timeline coherence.
- Gateway technologies as deliberate bottlenecks (branch identity anchors).
- Contextual research boosts tied to world actions (Eureka-style).
- Web/radial specialization paths to avoid one optimal meta-line.

## Design Risks to Avoid
- Overly linear “inevitable history” tree.
- Tech nodes with no systemic consequence.
- Permanent-unlock assumptions without maintenance/decay pressure.
- Excessive randomness that breaks deterministic replay goals.

## Orbis Mapping (Existing Brainstorm Stack)
- Tech Emissions: `79-tech-impact-matrix-contract.md`
- Propagation Physics: `80-impact-propagation-engine.md`
- Ideology Mediation: `82-sociological-ideology-tree.md`
- Social Response: `83-faction-interest-group-generator.md`
- Institutional Inertia: `84-institution-elite-layer.md`
- Narrative Distortion: `86-information-narrative-engine.md`
- Memory and Chronicle: `97-chronicler-historiography-system.md`

## Integration Decisions (Proposed)
- Keep deterministic core, but allow bounded contextual variation via:
  - action-driven research modifiers
  - environment-dependent unlock acceleration
  - branch specialization pressure
- Add “tech entropy/maintenance” concept:
  - critical advanced techs require institutional/scientific upkeep
  - collapse conditions can degrade effective capability without deleting history

## Concrete Additions to Current Specs
- Add `research_context_modifiers` to tech node contract:
  - geography, faction pressure, institutional support, active policy.
- Add `tech_maintenance_cost` for late-era high-complexity nodes.
- Add `tech_degradation_events` for collapse pathways.
- Add `gateway_tech_registry` to enforce meaningful branch pivots.

## Validation Questions
- Does each tech node emit at least one structural pressure?
- Does each era have a distinct societal identity pivot?
- Can two civs with the same tech set diverge through ideology/institutions?
- Can advanced civs regress in capability under sustained crisis?

## Summary
For Orbis, tech trees should be treated as a deterministic causal engine:
- not “what can be built,”
- but “what pressures are introduced,”
- and “what kind of society emerges under those pressures.”


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

# 116 Tech Tree Research Report Synthesis

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`tech-tree research synthesis`, `evidence-backed design findings`]
- `Writes`: [`research-driven spec recommendations`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/116-tech-tree-research-report-synthesis.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Preserve the external research findings on technology-tree design and convert them into concrete decisions for Orbis.

## Executive Summary
Technology trees evolved from linear unlock ladders into causal systems.  
For Orbis, the recommended model is:
- deterministic progression backbone for legibility
- contextual modifiers for adaptation
- societal emission/pressure coupling for emergent politics

## Key Findings
- Traditional trees provide pacing and long-horizon planning through eras and prerequisites.
- Gateway technologies create meaningful strategic bottlenecks.
- Web/shuffle systems improve divergence and replayability.
- Contextual boosts connect tech progression to world actions.
- Tech-as-emission models are strongest for simulation-driven history.

## Orbis Implications
- Keep a deterministic DAG baseline for replay and explainability.
- Add bounded contextual research modifiers instead of full random tech draws.
- Treat each tech as pressure emission + narrative hook, not just unlock.
- Maintain ideological mediation so same tech causes different outcomes across societies.
- Support maintenance/degradation concepts for late-era capability entropy.

## Integration Targets
- `tech-tree-comprehensive-v1.md`: ensure all nodes map to impacts/events.
- `79-tech-impact-matrix-contract.md`: enforce emissions for each key tech.
- `80-impact-propagation-engine.md`: standardize pressure dynamics from tech emissions.
- `82-sociological-ideology-tree.md`: lock ideology reaction modifiers.
- `104-civilization-multipliers-catalog.md`: ensure multiplier coverage for major tech pivots.
- `111-tech-tree-design-deep-search-integration.md`: align with this synthesis.

## Design Decisions To Lock
- Baseline structure: deterministic tree with era gating.
- Variation mode: contextual boosts (Eureka-like), deterministic from state.
- No unconstrained RNG in authoritative tech progression.
- Mandatory “systemic consequence” requirement per tech node.
- Mandatory “branch identity” requirement per era.

## Open Risks
- Tech catalog breadth may exceed causal density if impacts are not enforced.
- AI complexity rises with web-like branching unless flavor profiles are constrained.
- Over-randomization risks breaking replay parity and player causal understanding.

## Immediate Actions
- Add `has_impact`, `has_event_hook`, `has_multiplier_link` checks for each tech node.
- Mark gateway techs explicitly and test branch lock behavior.
- Add nitrogen-fixation/agri-intensification chain as high-impact biomass pivot.
- Add benchmark scenarios to validate divergent social outcomes from identical tech sets under different ideology/government kernels.

## Confidence and Limits
- High confidence on pacing, bottlenecks, and player agency findings.
- Medium confidence on emerging “societal force” patterns due limited production-game evidence.
- AI handling of non-linear tech webs remains a known practical gap.


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

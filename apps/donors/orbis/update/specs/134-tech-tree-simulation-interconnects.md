# 134 Tech Tree Simulation Interconnects (Deep Search Synthesis)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/111-tech-tree-design-deep-search-integration.md`, `docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`tech-simulation interconnect map`, `complexity-collapse mechanics`]
- `Writes`: [`interconnect design patterns`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/134-tech-tree-simulation-interconnects.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Synthesize "Deep Search" results regarding advanced tech tree interactions, focusing on systemic dependencies, complexity collapse (Tainter's Theory), and ecological/societal feedback loops.

## 1. Complexity & The Tainter Bridge
Technology in Orbis is not just a capability unlock; it is an investment in systemic complexity.

### 1.1 Complexity PPM (Hardened)
- Every active tech node adds a `system.complexity_ppm` value.
- **Tainter Complexity Rule**:
  `TotalComplexity = Sum(TechNode.Complexity) * mulPPM(ScaleFactor, system.fragmentation)`
- **Rule of Diminishing Returns**:
  `Research_Cost_Next = BaseCost * (1.0 + (TotalComplexity / 500,000)^2)`
  *Logic: As complexity grows, solving the next problem becomes exponentially more expensive.*

### 1.2 The Collapse Trigger (Hardened)
- **Sustainability Threshold**:
  `Threshold = mulPPM(institution.efficiency, governance.legitimacy)`
- **The Tainter Breach**:
  If `TotalComplexity > Threshold`:
  - Trigger `thr_complexity_overload` (Reason: `840307`).
  - **Effect**: `system.stability` drops by `(TotalComplexity - Threshold)` per tick.
  - **Outcome**: Mandatory transition to `Collapse` or `Revolution` (Spec 95) if breach persists for > 20 ticks.

## 2. Resource & Environmental Niches
Technology creates "dependencies" on planetary state, forcing the civilization into specific ecological niches.

### 2.1 Extraction Dependencies
- Tech nodes can require "Niche Presence" (e.g., `tech_l06_004 Refining` requires `geomorphology.hydrocarbon_basins`).
- If a resource becomes scarce (`environment.resource_availability` < 200,000), tech effectiveness drops via `121` forcing.

### 2.2 Ecological Trap (The Nitrogen Example)
- `tech_l06_009 Nitrogen Fixation` creates an "Ecological Trap":
  - Boosts `agri.yield` (Sovereign need).
  - Creates mandatory `agri.runoff` (Risk).
  - Civilization becomes "addicted" to the high yield; removing the tech or losing the resource (natural gas/energy) triggers `thr_agri_pop_crash`.

## 3. Cognitive & Ideological Forcing
Tech doesn't just enable actions; it changes how people think.

### 3.1 Ideological Drift Modifiers
- Tech nodes emit `ideology.drift_vector` into Spec 82.
- Example: `tech_l05_001 Industrialization` applies a constant `+1,000 PPM/Tick` drift toward `Productivism` and away from `Ecologism`.
- Example: `tech_l19_003 Psionics` applies drift toward `Traditionalism/Mysticism`.

### 3.2 Information Reach & Divergence
- `tech_l06_006 Radio` and `tech_l08_001 Telecommunications` increase `information.reach` and `information.credibility` base values.
- High reach tech amplifies the `86` Perception Update Rule, making misinformation more volatile.

## 4. Unit & Actor Synergies
- **Unit Templates**: Tech unlocks base templates (Spec 124); Factions customize them based on their `wealth_access` and `ideology`.
- **Actor Competence**: Certain techs (e.g., `tech_l15_014 Holo Simulator`) provide a flat boost to `actor.competence` for specific roles.

## 5. Summary Interconnect Map

| Simulation Component | Interaction Type | Mechanism |
|---|---|---|
| **Ecology** | Feedback Loop | Tech emissions (`121`) -> Planet State -> Tech Forcing (`121`) |
| **Governance** | Upkeep | Complexity PPM -> Bureaucracy Drain / Legitimacy Threshold |
| **Ideology** | Drift | Tech Nodal Drift Vector -> Ideology Value Drift (`82`) |
| **Information** | Amplitude | Reach/Credibility Keys -> Narrative Update Speed (`86`) |
| **Factions** | Resource Conflict | Faction Access to Niche Resources -> Conflict/Unrest |

## 6. Improvements & Next Steps
- [ ] Implement `system.complexity_ppm` in `113-canonical-key-registry.md`.
- [ ] Add `ComplexityPpm` to the `TechNodeV1` contract in `tech-tree-update.md`.
- [ ] Define `thr_complexity_overload` in `114-threshold-and-reasoncode-registry.md`.
- [ ] Map "Niche Dependencies" as a new field in `tech-tree-comprehensive-v1.md`.

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

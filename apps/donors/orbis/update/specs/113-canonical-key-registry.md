# 113 Canonical Key Registry (Brainstorm)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`canonical key registry`, `metric key alias table`, `unit/range registry`]
- `Writes`: [`canonical key definitions`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/113-canonical-key-registry.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Provide one canonical dictionary for civilization metrics to prevent semantic duplication and contract drift.

## Conventions
- metric key format: `<domain>.<metric>`
- authoritative scale for normalized pressures: `ppm` (`0..1_000_000`)
- authoritative numeric type family:
  - `PpmInt` for normalized pressures
  - `SignedPpmInt` for signed deltas
  - `TickInt` for simulation ticks
  - `ReasonCodeInt` for reason code identifiers
- non-ppm values must explicitly declare unit (`kelvin`, `count`, etc.)

## Type Aliases
```ts
type PpmInt = number        // 0..1_000_000 (stored as fixed-point int)
type SignedPpmInt = number  // -1_000_000..+1_000_000
type TickInt = number       // 0..max tick
type ReasonCodeInt = number // 6-digit stable reason code id
```

## Domain Metric Keys
| Key | Unit | Range | Owner Draft | Notes |
|---|---|---|---|---|
| `economy.growth` | ppm | `0..1_000_000` | `79`,`80` | macro growth pressure |
| `economy.inequality` | ppm | `0..1_000_000` | `79`,`80` | distribution stress |
| `economy.trade_complexity` | ppm | `0..1_000_000` | `79`,`80` | network dependence |
| `economy.resource_pressure` | ppm | `0..1_000_000` | `79`,`80` | extraction stress |
| `governance.centralization` | ppm | `0..1_000_000` | `79`,`80`,`94` | authority concentration |
| `governance.bureaucracy` | ppm | `0..1_000_000` | `79`,`80`,`94` | administrative friction |
| `governance.surveillance` | ppm | `0..1_000_000` | `79`,`80`,`94` | control intensity |
| `governance.legitimacy` | ppm | `0..1_000_000` | `79`,`80`,`94` | perceived right-to-rule |
| `military.projection` | ppm | `0..1_000_000` | `79`,`80` | power reach |
| `military.defense` | ppm | `0..1_000_000` | `79`,`80` | resilience capability |
| `military.lethality` | ppm | `0..1_000_000` | `79`,`80` | destructive capacity |
| `military.logistics` | ppm | `0..1_000_000` | `79`,`80` | sustainment |
| `population.urbanization` | ppm | `0..1_000_000` | `79`,`80` | city concentration |
| `population.mobility` | ppm | `0..1_000_000` | `79`,`80` | movement capacity |
| `population.education` | ppm | `0..1_000_000` | `79`,`80` | knowledge base |
| `population.unrest` | ppm | `0..1_000_000` | `79`,`80` | instability pressure |
| `population.density` | ppm | `0..1_000_000` | `121` | normalized density index |
| `environment.extraction` | ppm | `0..1_000_000` | `79`,`80` | resource drawdown |
| `environment.pollution` | ppm | `0..1_000_000` | `79`,`80` | contamination burden |
| `environment.restoration` | ppm | `0..1_000_000` | `79`,`80` | repair capacity |
| `environment.climate_stability` | ppm | `0..1_000_000` | `79`,`80` | climate resilience |
| `environment.resource_availability` | ppm | `0..1_000_000` | `121` | resource accessibility |
| `science.research_speed` | ppm | `0..1_000_000` | `79`,`80` | innovation throughput |
| `science.paradigm_shift` | ppm | `0..1_000_000` | `79`,`80` | disruptive novelty |
| `culture.cohesion` | ppm | `0..1_000_000` | `79`,`80` | social integration |
| `culture.pluralism` | ppm | `0..1_000_000` | `79`,`80` | diversity tolerance |
| `culture.secularization` | ppm | `0..1_000_000` | `79`,`80` | secular orientation |
| `infrastructure.scale` | ppm | `0..1_000_000` | `79`,`80` | system footprint |
| `infrastructure.automation` | ppm | `0..1_000_000` | `79`,`80` | machine substitution |
| `information.trust` | ppm | `0..1_000_000` | `86`,`97` | source trust baseline |
| `information.divergence` | ppm | `0..1_000_000` | `86`,`97` | perceived-real gap |
| `information.credibility` | ppm | `0..1_000_000` | `86` | source credibility index |
| `information.reach` | ppm | `0..1_000_000` | `86` | narrative/media reach |
| `institution.efficiency` | ppm | `0..1_000_000` | `84` | administrative effectiveness |
| `institution.inertia` | ppm | `0..1_000_000` | `84` | structural rigidity/resistance |
| `institution.capture_share` | ppm | `0..1_000_000` | `84` | elite/faction capture level |
| `faction.clout` | ppm | `0..1_000_000` | `83` | political strength (sum 1M) |
| `faction.power` | ppm | `0..1_000_000` | `83` | total faction influence |
| `faction.loyalty` | ppm | `0..1_000_000` | `83` | alignment with state |
| `faction.radicalization` | ppm | `0..1_000_000` | `83`,`88` | propensity for extreme/violent action |
| `faction.satisfaction` | ppm | `0..1_000_000` | `83`,`88` | current contentment level |
| `faction.wealth_access` | ppm | `0..1_000_000` | `83` | faction economic control |
| `actor.influence` | ppm | `0..1_000_000` | `85` | individual agency/power |
| `actor.ambition` | ppm | `0..1_000_000` | `85` | goal-seeking intensity |
| `actor.competence` | ppm | `0..1_000_000` | `85` | skill/success probability modifier |
| `agri.yield` | ppm | `0..1_000_000` | `118`,`119` | agricultural productivity |
| `agri.pollution` | ppm | `0..1_000_000` | `121` | agricultural contamination |
| `agri.runoff` | ppm | `0..1_000_000` | `121` | nutrient runoff |
| `agri.hypoxia_risk` | ppm | `0..1_000_000` | `119`,`121` | oxygen depletion risk |
| `agri.food_security` | ppm | `0..1_000_000` | `119` | food availability |
| `agri.rural_displacement` | ppm | `0..1_000_000` | `119` | rural population movement |
| `agri.intensity` | ppm | `0..1_000_000` | `121` | agricultural intensification level |
| `system.stability` | ppm | `0..1_000_000` | `87`,`88` | overall civilization coherence |
| `system.population_carrying_capacity` | ppm | `0..1_000_000` | `119`,`121` | population support capacity |
| `system.corruption` | ppm | `0..1_000_000` | `119` | institutional capture risk |
| `system.fragmentation` | ppm | `0..1_000_000` | `119` | authority division risk |
| `system.transition_fatigue` | ppm | `0..1_000_000` | `95` | post-transition instability inertia |
| `system.war_exhaustion` | ppm | `0..1_000_000` | `96` | conflict attrition pressure |
| `system.fragmentation_pressure` | ppm | `0..1_000_000` | `96` | authority split pressure |
| `system.complexity_ppm` | ppm | `0..1_000_000` | `134` | total investment in systemic complexity/maintenance |
| `system.asabiya` | ppm | `0..1_000_000` | `129` | collective action capacity (Turchin) |
| `system.myth_adoption` | ppm | `0..1_000_000` | `97` | narrative hardening level |
| `aether.potential` | ppm | `0..1_000_000` | `149` | nodal magic pressure |
| `aether.flux` | ppm | `0..1_000_000` | `149` | edge flow intensity |
| `aether.resistance` | ppm | `0..1_000_000` | `149` | terrain/node flow resistance |
| `magic.belief_ppm` | ppm | `0..1_000_000` | `151` | aggregated faith resource |
| `magic.global_mana` | int | `0..MAX_INT` | `152` | strategic mana pool |
| `magic.charge_time` | ticks | `0..MAX_INT` | `153` | tactical casting delay |
| `network.desync_rate` | ppm | `0..1_000_000` | `148` | local vs authority drift |
| `climate.mean_temp_k` | kelvin | `150..450` | `121` | average planetary temperature |
| `climate.mean_precip_ppm` | ppm | `0..1_000_000` | `121` | normalized precipitation index |
| `climate.delta_index_ppm` | ppm | `0..1_000_000` | `121` | climate-change intensity proxy |
| `magnetosphere.health_ppm` | ppm | `0..1_000_000` | `121` | magnetic field strength index |
| `atmosphere.density_ppm` | ppm | `0..1_000_000` | `121` | atmospheric density index |

## Migration Aliases (Legacy -> Canonical)
| Legacy Key | Canonical Key |
|---|---|
| `resource_availability` | `environment.resource_availability` |
| `population_density` | `population.density` |
| `climate.meanPrecip01` | `climate.mean_precip_ppm` |
| `climate.meanTempK` | `climate.mean_temp_k` |
| `magnetosphere.health01` | `magnetosphere.health_ppm` |
| `atmosphere.density01` | `atmosphere.density_ppm` |
| `agriculture.intensity` | `agri.intensity` |

## Registry Rules
- keys are append-only
- renames require alias + migration note
- no duplicate semantics under different names
- each key must declare owner file before use
- display-level normalized values (`0..1`) are allowed only in UI, never in authoritative formulas

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

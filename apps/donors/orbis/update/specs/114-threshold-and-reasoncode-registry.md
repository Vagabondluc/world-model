# 114 Threshold And Reasoncode Registry (Brainstorm)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`threshold registry`, `reason-code registry`, `append-only policy`]
- `Writes`: [`threshold and reason-code entries`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/114-threshold-and-reasoncode-registry.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Centralize trigger thresholds and reason codes used across civilization drafts.

## Threshold Rule Contract
```ts
interface ThresholdRegistryEntryV1 {
  thresholdId: string
  metricKey: string
  comparator: ">=" | "<="
  triggerPPM: number
  cooldownTicks: number
  ownerDraft: string
  reasonCode: number
  eventKey: string
}
```

## Reason Code Bands
- `810xxx`: regime transition
- `820xxx`: ideology/radicalization
- `830xxx`: faction lifecycle
- `840xxx`: institution conflict/collapse
- `850xxx`: actor override/betrayal
- `860xxx`: narrative divergence
- `950xxx`: government transition paths
- `960xxx`: civil war/fragmentation
- `970xxx`: chronicler/historiography
- `110xxx`: wonder lifecycle

## Initial Threshold Entries
| Threshold Id | Metric | Comparator | Trigger PPM | Cooldown | Reason Code | Event Key | Owner |
|---|---|---|---:|---:|---:|---|---|
| `thr_regime_legitimacy_low` | `governance.legitimacy` | `<=` | 300_000 | 10 | 810101 | `regime_danger` | `81` |
| `thr_unrest_crisis` | `population.unrest` | `>=` | 700_000 | 5 | 810102 | `civil_crisis` | `80` |
| `thr_faction_spawn_labor` | `infrastructure.automation` | `>=` | 600_000 | 8 | 830101 | `faction_spawn_workers` | `83` |
| `thr_institution_collapse` | `governance.legitimacy` | `<=` | 200_000 | 20 | 840301 | `institution_fragment` | `84` |
| `thr_actor_override` | `population.unrest` | `>=` | 650_000 | 6 | 850201 | `actor_emergency_override` | `85` |
| `thr_narrative_divergence` | `information.divergence` | `>=` | 550_000 | 4 | 860201 | `perception_crisis` | `86` |
| `thr_reform_window` | `governance.legitimacy` | `>=` | 600_000 | 12 | 950101 | `reform_window_open` | `95` |
| `thr_coup_window` | `governance.legitimacy` | `<=` | 350_000 | 8 | 950201 | `coup_window_open` | `95` |
| `thr_authority_fork` | `system.fragmentation_pressure` | `>=` | 600_000 | 15 | 960101 | `authority_fork` | `96` |
| `thr_myth_solidify` | `system.myth_adoption` | `>=` | 700_000 | 25 | 970201 | `myth_solidified` | `97` |
| `thr_worker_displacement` | `infrastructure.automation` | `>=` | 500_000 | 10 | 830102 | `worker_displacement_crisis` | `119` |
| `thr_pollution_crisis` | `environment.pollution` | `>=` | 750_000 | 8 | 840302 | `pollution_response_protocol` | `121` |
| `thr_agri_runoff_crisis` | `agri.runoff` | `>=` | 650_000 | 12 | 840303 | `eutrophication_event` | `121` |
| `thr_hypoxia_event` | `agri.hypoxia_risk` | `>=` | 700_000 | 15 | 840304 | `hypoxia_zone_creation` | `121` |
| `thr_food_security_crisis` | `agri.food_security` | `<=` | 300_000 | 6 | 810103 | `food_shortage_declared` | `119` |
| `thr_corruption_spike` | `system.corruption` | `>=` | 600_000 | 20 | 840305 | `institution_crisis` | `119` |
| `thr_fragmentation_risk` | `system.fragmentation` | `>=` | 650_000 | 18 | 960102 | `authority_fragmentation` | `119` |
| `thr_complexity_overload` | `system.complexity_ppm` | `>=` | 800_000 | 20 | 840307 | `complexity_collapse_risk` | `134` |
| `thr_agri_soil_acidification` | `agri.intensity` | `>=` | 800_000 | 50 | 840306 | `soil_acidification_event` | `118` |
| `thr_agri_pop_crash` | `population.urbanization` | `>=` | 900_000 | 10 | 810104 | `agri_supply_crash` | `118` |
| `thr_leyline_rupture` | `aether.flux` | `>=` | 950_000 | 100 | 880101 | `arcane_discharge` | `149` |
| `thr_magic_overload` | `magic.belief_ppm` | `>=` | 900_000 | 50 | 880102 | `divine_manifestation` | `151` |
| `thr_network_desync` | `network.desync_rate` | `>=` | 50_000 | 1 | 990101 | `client_desync` | `148` |

## Rules
- threshold entries are append-only
- every threshold must map to one reason code
- every reason code must map to one owning subsystem
- tie-break order for simultaneous triggers:
  - highest overflow first
  - then reason code ascending

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

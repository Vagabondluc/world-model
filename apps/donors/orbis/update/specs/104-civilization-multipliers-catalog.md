# 104 Civilization Multipliers Catalog (Brainstorm)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`civilization multiplier catalog`, `multiplier taxonomy`]
- `Writes`: [`multiplier reference entries`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/104-civilization-multipliers-catalog.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Centralize all civilization-scale multipliers implied by the current brainstorm stack so balancing can happen from one file.

## Multiplier Rule
- authoritative math uses fixed-point ppm
- multipliers are explicit and stage-scoped
- default multiplier is `1_000_000` (1.0x)

## Stage Map (Where Multipliers Apply)
- `S1` Tech emission layer (`79`)
- `S2` Pressure propagation layer (`80`)
- `S3` Ideology interpretation layer (`82`)
- `S4` Faction pressure modulation (`83`)
- `S5` Institution mediation and capture (`84`)
- `S6` Actor override and disruption (`85`)
- `S7` Narrative/perception distortion (`86`)
- `S8` Government kernel gating (`94`)
- `S9` Transition and fragmentation modifiers (`95`, `96`)
- `S10` Memory feedback modifiers (`97`, `98`)

## Core Civilization Multipliers (Canonical)

### Economy
- `m_econ_growth_from_automation` (`S2`)
- `m_econ_growth_from_stability` (`S2`)
- `m_econ_growth_loss_from_pollution` (`S2`)
- `m_econ_inequality_from_capture` (`S5`)
- `m_econ_trade_complexity_from_scale` (`S2`)
- `m_econ_resource_pressure_from_growth` (`S2`)

### Governance
- `m_gov_legitimacy_gain_from_performance` (`S8`)
- `m_gov_legitimacy_loss_from_corruption` (`S5`)
- `m_gov_centralization_drift` (`S8`)
- `m_gov_bureaucracy_friction` (`S5`)
- `m_gov_surveillance_effect_on_unrest` (`S8`)

### Military
- `m_mil_projection_from_logistics` (`S2`)
- `m_mil_lethality_from_tech` (`S1`)
- `m_mil_defense_from_infrastructure` (`S2`)
- `m_mil_political_weight` (`S8`)

### Population
- `m_pop_urbanization_from_growth` (`S2`)
- `m_pop_mobility_from_transport` (`S1`,`S2`)
- `m_pop_education_from_science_spend` (`S2`)
- `m_pop_unrest_from_inequality` (`S2`)
- `m_pop_unrest_from_belief_divergence` (`S7`)

### Environment
- `m_env_extraction_from_industrialization` (`S1`,`S2`)
- `m_env_pollution_from_growth` (`S2`)
- `m_env_restoration_from_policy` (`S4`,`S8`)
- `m_env_climate_stability_loss_from_pollution` (`S2`)

### Science
- `m_sci_research_speed_from_education` (`S2`)
- `m_sci_research_speed_from_institutions` (`S5`)
- `m_sci_paradigm_shift_from_disruption` (`S6`,`S7`)

### Culture
- `m_cul_cohesion_from_legitimacy` (`S2`)
- `m_cul_pluralism_from_liberty` (`S3`,`S8`)
- `m_cul_secularization_from_knowledge_openness` (`S3`)

### Infrastructure
- `m_inf_scale_from_growth` (`S2`)
- `m_inf_automation_from_tech` (`S1`)
- `m_inf_automation_social_friction` (`S3`,`S4`)

## Political Control Multipliers
- `m_action_decision_speed` (`S8`)
- `m_action_policy_stability` (`S8`)
- `m_action_veto_probability_by_power_center` (`S8`)
- `m_action_emergency_override_strength` (`S8`,`S6`)
- `m_transition_fatigue` (`S9`)
- `m_transition_success_reform` (`S9`)
- `m_transition_success_coup` (`S9`)
- `m_transition_success_revolution` (`S9`)

## Social Actor Multipliers
- `m_faction_spawn_from_mismatch` (`S4`)
- `m_faction_radicalization_speed` (`S4`)
- `m_faction_influence_from_size_wealth_media_force` (`S4`)
- `m_institution_inertia` (`S5`)
- `m_institution_corruption_growth` (`S5`)
- `m_institution_capture_share` (`S5`)
- `m_actor_ambition_effect` (`S6`)
- `m_actor_risk_tolerance_effect` (`S6`)
- `m_actor_override_threshold` (`S6`)

## Information and Memory Multipliers
- `m_info_source_reach` (`S7`)
- `m_info_source_credibility` (`S7`)
- `m_info_trust_transfer` (`S7`)
- `m_info_divergence_growth` (`S7`)
- `m_info_divergence_decay` (`S7`)
- `m_myth_adoption_rate` (`S10`)
- `m_memory_detail_decay` (`S10`)
- `m_memory_symbolism_gain` (`S10`)

## War and Fragmentation Multipliers
- `m_fragmentation_trigger_sensitivity` (`S9`)
- `m_region_alignment_from_security` (`S9`)
- `m_region_alignment_from_ideology` (`S9`)
- `m_asset_split_by_loyalty` (`S9`)
- `m_war_exhaustion_growth` (`S9`)
- `m_postwar_recovery_speed` (`S9`)

## Missing/Underrepresented Civilization Multipliers (Add)
- `m_agri_yield_from_nitrogen_fixation` (critical biomass driver, `S1`,`S2`)
- `m_water_pollution_from_nitrogen_runoff` (`S2`)
- `m_hypoxia_risk_from_nutrient_loading` (`S2`)
- `m_food_security_from_fertilizer_access` (`S2`,`S4`)
- `m_rural_displacement_from_agri_intensification` (`S2`,`S4`)
- `m_population_carrying_capacity_from_fixed_nitrogen` (`S2`)

## Nitrogen Fixation Package (Recommended v1 Defaults)
- `m_agri_yield_from_nitrogen_fixation = 1_300_000`
- `m_food_security_from_fertilizer_access = 1_200_000`
- `m_population_carrying_capacity_from_fixed_nitrogen = 1_150_000`
- `m_water_pollution_from_nitrogen_runoff = 1_250_000`
- `m_hypoxia_risk_from_nutrient_loading = 1_200_000`
- `m_env_climate_stability_loss_from_n2o = 1_080_000`

## Validation Checklist
- every multiplier has stage ownership
- every multiplier has unit and clamp range
- every multiplier has deterministic tie-break policy where needed
- no duplicate concept names with different keys
- missing multipliers logged before adding new tech families


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

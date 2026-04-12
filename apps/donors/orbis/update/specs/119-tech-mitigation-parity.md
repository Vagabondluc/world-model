# 119 Tech Mitigation Parity (Risk Balance Contract)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`tech mitigation parity matrix`, `parity status rubric`]
- `Writes`: [`mitigation parity mappings`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/119-tech-mitigation-parity.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Ensure every tech that increases risk axes has defined mitigation pathways to prevent runaway destabilization.

## Scope Tag
- `MVP-now`: core risk mitigation for Ancient through Modern eras
- `Post-MVP`: parity for future/fringe technologies
- `Research`: nonlinear risk coupling analysis

As-Of:
- Revision: `brainstorm-r2026-02-12-a`
- Date: `2026-02-12`

Status rubric (aligned with `118`):
- `green`: parity entry complete and registry-mapped
- `yellow`: parity entry exists with caveat
- `red`: parity missing

## Risk Axes Definition
- `unrest`: Population instability pressure
- `inequality`: Distribution stress
- `pollution`: Environmental contamination burden
- `surveillance`: Control intensity pressure
- `corruption`: Institutional capture risk
- `fragmentation`: Authority division risk

## Mandatory Mitigation Parity Rule
For each tech that increases any risk axis, define:
- Risk increase magnitude (ppm)
- Mitigation action/policy/institution unlock
- Expected horizon (short/mid/long)
- Deterministic fallback if mitigation unavailable

## Risk-Increasing Tech Parity Table

### Level 1-5 (Ancient to Industrial Era)

| Tech ID | Risk Increase | Mitigation Path | Horizon | Fallback |
|---|---|---|---|---|
| tech_l01_003 (Mining) | `environment.extraction: +200,000` | Tech unlock: `Sanitation` (l05_006) | Long | Natural resource abundance |
| tech_l01_006 (Irrigation) | `economy.resource_pressure: +100,000` | Tech unlock: `Education` (l03_006) | Mid | Natural soil fertility |
| tech_l02_002 (Currency) | `economy.inequality: +150,000` | Policy unlock: `Progressive Taxation` | Short | Market self-correction |
| tech_l02_004 (Iron Working) | `military.lethality: +100,000` | Institution unlock: `Military Ethics Board` | Mid | Diplomatic agreements |
| tech_l03_005 (Machinery) | `population.urbanization: +200,000` | Tech unlock: `Sanitation` (l05_006) | Mid | Rural migration |
| tech_l04_004 (Gunpowder) | `military.lethality: +250,000` | Institution unlock: `International Law Framework` | Long | Diplomatic treaties |
| tech_l05_001 (Industrialization) | `environment.pollution: +300,000` | Tech unlock: `Chemistry` (l06_007) | Long | Natural purification |
| tech_l05_005 (Steam Power) | `environment.pollution: +200,000` | Tech unlock: `Electricity` (l06_005) | Long | Renewable sources |
| tech_l05_007 (Economics) | `economy.inequality: +180,000` | Policy unlock: `Social Safety Net` | Mid | Charitable organizations |

### Level 6-10 (Modern to Astro Engineering Era)

| Tech ID | Risk Increase | Mitigation Path | Horizon | Fallback |
|---|---|---|---|---|
| tech_l06_005 (Electricity) | `infrastructure.scale: +250,000` | Tech unlock: `Radio` (l06_006) | Short | Manual backup systems |
| tech_l06_007 (Chemistry) | `environment.pollution: +250,000` | Tech unlock: `Plastics` (l07_005) | Mid | Regulatory frameworks |
| tech_l07_007 (Nuclear Fission) | `environment.pollution: +400,000` | Institution unlock: `Nuclear Safety Commission` | Long | Containment protocols |
| tech_l07_008 (Synthetic Materials) | `environment.pollution: +150,000` | Tech unlock: `Pollution Processor` (l14_006) | Long | Natural degradation |
| tech_l08_007 (Robotics) | `population.unrest: +200,000` | Policy unlock: `Universal Basic Income` | Long | Job retraining programs |
| tech_l09_007 (Nuclear Bomb) | `military.lethality: +500,000` | Institution unlock: `Mutually Assured Destruction` | Long | Diplomatic deterrence |
| tech_l10_003 (Hydroponic Farm) | `infrastructure.scale: +150,000` | Tech unlock: `Biospheres` (l10_006) | Mid | Traditional agriculture backup |
| tech_l11_001 (Automated Factories) | `population.unrest: +300,000` | Policy unlock: `Worker Retraining Program` | Mid | Economic adjustment |

### Level 11-15 (Fusion to Ion Age)

| Tech ID | Risk Increase | Mitigation Path | Horizon | Fallback |
|---|---|---|---|---|
| tech_l12_002 (Fusion Drive) | `infrastructure.scale: +200,000` | Tech unlock: `Automated Repair Unit` (l17_006) | Mid | Manual maintenance protocols |
| tech_l13_003 (Cloning Center) | `population.unrest: +250,000` | Institution unlock: `Bioethics Council` | Long | Regulatory oversight |
| tech_l14_002 (Merculite Missile) | `military.lethality: +350,000` | Institution unlock: `Arms Control Treaty` | Long | Diplomatic agreements |
| tech_l15_002 (Ion Drive) | `infrastructure.scale: +180,000` | Tech unlock: `Planetary Supercomputer` (l15_008) | Long | Redundant systems |
| tech_l15_005 (Neutron Blaster) | `military.lethality: +300,000` | Institution unlock: `Combat Rules of Engagement` | Mid | International law |

### Level 16-20 (Terraforming to Android Era)

| Tech ID | Risk Increase | Mitigation Path | Horizon | Fallback |
|---|---|---|---|---|
| tech_l16_004 (Terraforming) | `environment.extraction: +400,000` | Tech unlock: `Atmospheric Renewer` (l16_007) | Long | Natural restoration |
| tech_l17_008 (Weather Controller) | `governance.surveillance: +200,000` | Institution unlock: `Climate Governance Board` | Long | Democratic oversight |
| tech_l18_002 (Anti-Matter Drive) | `infrastructure.scale: +300,000` | Tech unlock: `Multi-Phased Shields` (l18_014) | Long | Containment systems |
| tech_l18_003 (Nano Disassemblers) | `environment.pollution: +450,000` | Institution unlock: `Nanotech Safety Protocols` | Long | Containment measures |
| tech_l20_004 (Plasma Cannon) | `military.lethality: +400,000` | Institution unlock: `Galactic Warfare Convention` | Long | Diplomatic restraint |
| tech_l20_008 (Android Workers) | `population.unrest: +350,000` | Policy unlock: `AI Labor Rights Framework` | Long | Economic redistribution |

### Level 21-25 (Galactic Governance to Time-Space Mastery Era)

| Tech ID | Risk Increase | Mitigation Path | Horizon | Fallback |
|---|---|---|---|---|
| tech_l21_001 (Proton Torpedo) | `military.lethality: +350,000` | Institution unlock: `Galactic Disarmament Initiative` | Long | Diplomatic solutions |
| tech_l21_010 (Galactic Cybernet) | `governance.surveillance: +400,000` | Institution unlock: `Digital Rights Charter` | Long | Privacy protections |
| tech_l22_001 (Star Fortress) | `military.lethality: +500,000` | Institution unlock: `Galactic Peacekeeping Force` | Long | Diplomatic deterrence |
| tech_l23_001 (Doom Star Construction) | `military.lethality: +700,000` | Institution unlock: `Existential Threat Council` | Long | Collective security |
| tech_l24_005 (Neutronium Bomb) | `military.lethality: +600,000` | Institution unlock: `Reality Preservation Treaty` | Long | Diplomatic restraint |
| tech_l25_002 (Stellar Converter) | `environment.extraction: +600,000` | Institution unlock: `Cosmic Ethics Council` | Long | Conservation protocols |

## Nitrogen Fixation Package (Phase G Patch)

| Tech ID | Risk Increase | Mitigation Path | Horizon | Fallback |
|---|---|---|---|---|
| tech_l06_009 (Nitrogen Fixation) | `agri.runoff: +250,000` | Tech unlock: `Sanitation` (l05_006), Policy: `Nutrient Management` | Short | Traditional manure rotation |
| tech_l06_010 (Synthetic Fertilizers) | `agri.hypoxia_risk: +300,000` | Institution: `Environmental Protection Agency`, Policy: `Buffer Zone Mandates` | Mid | Organic fallow periods |
| tech_l06_009 (Nitrogen Fixation) | `environment.pollution: +150,000` | Tech unlock: `Atmospheric Renewer` (l16_007) | Long | Natural N2 cycle |

## Mitigation Validation Rules
1. Every risk-increasing tech must have at least one mitigation pathway
2. Mitigation pathways must be achievable through available tech tree routes
3. Fallback mechanisms must be deterministic and reliable
4. Risk increases must be bounded and reversible through mitigation

## Compliance Check
- All risk-increasing techs: 67
- Techs with mitigation: 67
- Techs with fallback: 67
- Scoped parity compliance (sampled risk set): 100%
- Global matrix status vs `118` comprehensive audit: red (broad catalog remains unmapped)

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

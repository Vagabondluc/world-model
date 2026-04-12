# 121 Tech Environmental Forcing (Planet State Modifiers)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`environmental forcing modifiers`, `planet-state forcing formulas`]
- `Writes`: [`forcing modifier contracts`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/121-tech-environmental-forcing.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define deterministic modifiers from planet state to tech emissions to create environmental feedback loops.

## Scope Tag
- `MVP-now`: core forcing coefficients and bounded formulas
- `Post-MVP`: advanced nonlinear couplings
- `Research`: empirical calibration refinements

## Core Principle
Technology effectiveness varies with planetary state, producing bidirectional causality:

```text
planet state -> forcing multiplier -> adjusted tech emission
```

## Canonical Scale and Keys
- All forcing multipliers and normalized state inputs use `ppm` (`0..1_000_000`) from `113`.
- Temperature is explicit `kelvin` via `climate.mean_temp_k`.
- Use canonical keys only (no legacy aliases in formulas).

## Deterministic Forcing Formula
```ts
// Signed emission in ppm; multiplier in ppm where 1_000_000 == 1.0x
adjustedEmissionPPM = mulPPM(baseEmissionPPM, forcingMultiplierPPM)
finalEmissionPPM = clampSignedPPM(adjustedEmissionPPM, eraMinPPM, eraMaxPPM)
```

## Climate State Forcing

### Hothouse amplification
When `climate.mean_temp_k > 295`:
```
m.tech_heat_ppm = 1_100_000 // +10%
```

When `climate.mean_temp_k > 305`:
```
m.tech_heat_ppm = 1_250_000 // +25%
```

### Ice-age suppression
When `climate.mean_temp_k < 270`:
```
m.tech_cold_ppm = 900_000 // -10%
```

When `climate.mean_temp_k < 265`:
```
m.tech_cold_ppm = 750_000 // -25%
```

### Precipitation effects
When `climate.mean_precip_ppm < 200_000` (arid):
```
m.agri_from_aridity_ppm = 800_000
m.industrial_from_aridity_ppm = 950_000
```

When `climate.mean_precip_ppm > 800_000` (wet):
```
m.industrial_from_wet_ppm = 900_000
m.agri_from_wet_ppm = 1_100_000
```

## Resource Availability Forcing

### Scarcity amplification
When `environment.resource_availability < 300_000`:
```
m.extraction_from_scarcity_ppm = 1_300_000
m.efficiency_from_scarcity_ppm = 1_200_000
```

### Abundance dampening
When `environment.resource_availability > 800_000`:
```
m.extraction_from_abundance_ppm = 800_000
m.efficiency_from_abundance_ppm = 900_000
```

## Planetary Health Forcing

### Magnetosphere effects
When `magnetosphere.health_ppm < 300_000`:
```
m.communication_from_radiation_ppm = 700_000
m.computing_from_radiation_ppm = 750_000
m.bio_from_radiation_ppm = 800_000
```

### Atmospheric density effects
When `atmosphere.density_ppm < 500_000`:
```
m.combustion_from_thin_atmo_ppm = 600_000
m.flight_from_thin_atmo_ppm = 800_000
```

When `atmosphere.density_ppm > 1_500_000`:
```
m.flight_from_thick_atmo_ppm = 1_100_000
m.combustion_from_thick_atmo_ppm = 1_050_000
```

## Carrying-Capacity and Density Forcing

### Population pressure effects
When `population.density > 700_000`:
```
m.agri_from_density_ppm = 1_200_000
m.urban_from_density_ppm = 1_150_000
m.pollution_from_density_ppm = 1_250_000
```

When `population.density < 200_000`:
```
m.agri_from_low_density_ppm = 900_000
m.urban_from_low_density_ppm = 850_000
```

## Environmental Impact Feedback

### Pollution feedback loops
When `environment.pollution > 700_000`:
```
m.health_from_pollution_ppm = 1_100_000
m.clean_energy_from_pollution_ppm = 1_200_000
m.pollution_control_from_pollution_ppm = 1_300_000
```

### Climate-change amplification
When `climate.delta_index_ppm > 500_000`:
```
m.adaptation_from_climate_change_ppm = 1_250_000
m.mitigation_from_climate_change_ppm = 1_300_000
m.resilience_from_climate_change_ppm = 1_200_000
```

## Nitrogen Fixation Environmental Forcing

### Agricultural intensification
When `agri.intensity > 600_000`:
```
m.nitrogen_runoff_from_intensity_ppm = 1_200_000
m.soil_depletion_from_intensity_ppm = 1_150_000
m.water_pollution_from_intensity_ppm = 1_250_000
```

### Restoration feedback
When `environment.restoration > 500_000`:
```
m.sustainable_from_restoration_ppm = 1_150_000
m.eco_from_restoration_ppm = 1_200_000
m.renewable_from_restoration_ppm = 1_100_000
```

## Forcing Application Order
1. Planet state assessment
2. Forcing multiplier lookup
3. Sequential deterministic multiply (`mulPPM`)
4. Era clamp (`120`) + global safety clamp

## Validation Requirements

### Range checks
- each forcing multiplier in `[500_000..2_000_000]`
- no single forcing may exceed `+100%` or `-50%`
- combined forcing should remain within `+75%/-75%` unless explicitly allowed by reason code

### Stability checks
- monotonic boundary behavior
- no discontinuous jumps at threshold boundaries
- explicit tie behavior on equal thresholds (highest severity branch first)

### Determinism checks
- same state -> same multipliers
- no random terms in authoritative path
- no display-normalized inputs in authoritative formulas

## Display Conversion Note
UI may display normalized decimals (`0.0..1.0`), but authoritative formulas must keep `ppm` integers from `113`.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.

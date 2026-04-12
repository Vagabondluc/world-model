# 120 Era Impact Scaling (Emission Caps and Defaults)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`era impact scaling model`, `79->120 emission bridge`]
- `Writes`: [`era scaling coefficients`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/120-era-impact-scaling.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define era-level emission scaling that is explicitly derived from the base impact contract in `79`.

## Scope Tag
- `MVP-now`: deterministic scaling bridge + per-level multiplier table
- `Post-MVP`: adaptive per-planet cap tuning
- `Research`: empirical calibration of decay and overshoot control

## Base Contract Bridge (`79` -> `120`)

From `79`:
- `ImpactAxisValue` in `[-3..+3]`
- `1 impact unit = 50_000 ppm`
- base max absolute emission = `150_000 ppm`

Era scaling in this file applies as:

```text
baseEmissionPPM = impactAxisValue * 50_000
scaledEmissionPPM = mulPPM(baseEmissionPPM, eraMultiplierPPM)
finalEmissionPPM = clampSignedPPM(scaledEmissionPPM, -eraAxisCapPPM, +eraAxisCapPPM)
```

Where:
- `eraAxisCapPPM = mulPPM(150_000, eraMultiplierPPM)`

This makes all era caps mathematically reproducible from `79`.

## Era Multipliers (Levels 1..25)

| Level | Era Multiplier PPM | Derived Max | Default Band |
|---:|---:|---:|---|
| 1 | 1_000_000 | ±150_000 | ±50_000..±100_000 |
| 2 | 1_100_000 | ±165_000 | ±55_000..±110_000 |
| 3 | 1_200_000 | ±180_000 | ±60_000..±120_000 |
| 4 | 1_300_000 | ±195_000 | ±65_000..±130_000 |
| 5 | 1_400_000 | ±210_000 | ±70_000..±140_000 |
| 6 | 1_500_000 | ±225_000 | ±75_000..±150_000 |
| 7 | 1_600_000 | ±240_000 | ±80_000..±160_000 |
| 8 | 1_700_000 | ±255_000 | ±85_000..±170_000 |
| 9 | 1_800_000 | ±270_000 | ±90_000..±180_000 |
| 10 | 1_900_000 | ±285_000 | ±95_000..±190_000 |
| 11 | 2_000_000 | ±300_000 | ±100_000..±200_000 |
| 12 | 2_100_000 | ±315_000 | ±105_000..±210_000 |
| 13 | 2_200_000 | ±330_000 | ±110_000..±220_000 |
| 14 | 2_300_000 | ±345_000 | ±115_000..±230_000 |
| 15 | 2_400_000 | ±360_000 | ±120_000..±240_000 |
| 16 | 2_500_000 | ±375_000 | ±125_000..±250_000 |
| 17 | 2_600_000 | ±390_000 | ±130_000..±260_000 |
| 18 | 2_700_000 | ±405_000 | ±135_000..±270_000 |
| 19 | 2_800_000 | ±420_000 | ±140_000..±280_000 |
| 20 | 2_900_000 | ±435_000 | ±145_000..±290_000 |
| 21 | 3_000_000 | ±450_000 | ±150_000..±300_000 |
| 22 | 3_100_000 | ±465_000 | ±155_000..±310_000 |
| 23 | 3_200_000 | ±480_000 | ±160_000..±320_000 |
| 24 | 3_300_000 | ±495_000 | ±165_000..±330_000 |
| 25 | 3_400_000 | ±510_000 | ±170_000..±340_000 |

## Anti-Runaway Rules
- global axis clamp: `0..1_000_000` after propagation (`80`)
- per-action clamp: `finalEmissionPPM` must not exceed derived era max above
- recursive interaction depth capped by `80` rules (max 3)
- when axis exceeds `900_000`, apply accelerated damping in propagation stage

## Worked Examples

### Early era example (Level 1)
```text
impactAxisValue = +2
baseEmissionPPM = 2 * 50_000 = 100_000
eraMultiplierPPM = 1_000_000
scaledEmissionPPM = 100_000
finalEmissionPPM = clamp(100_000, -150_000, +150_000) = 100_000
```

### Late era example (Level 21)
```text
impactAxisValue = +3
baseEmissionPPM = 150_000
eraMultiplierPPM = 3_000_000
scaledEmissionPPM = 450_000
finalEmissionPPM = clamp(450_000, -450_000, +450_000) = 450_000
```

### Negative emission example (Level 15)
```text
impactAxisValue = -2
baseEmissionPPM = -100_000
eraMultiplierPPM = 2_400_000
scaledEmissionPPM = -240_000
finalEmissionPPM = clamp(-240_000, -360_000, +360_000) = -240_000
```

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

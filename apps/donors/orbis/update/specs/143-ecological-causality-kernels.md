# 143 Ecological Causality Kernels (Hardened)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/121-tech-environmental-forcing.md`]
- `Owns`: [`biome productivity formulas`, `biomass allometric kernels`, `Walker feedback math`]
- `Writes`: [`ecological derived states`, `carrying capacity delta`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/143-ecological-causality-kernels.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Transition conceptual biology into implementation-safe mathematical kernels grounded in empirical ecology.

## 1. Biome Productivity (GPP)
Gross Primary Productivity (GPP) is the base energy source for all actors. Stored as `PpmInt` where 1,000,000 PPM = 3.0 kg C/m²/yr (Tropical Forest baseline).

| Biome | GPP PPM (Baseline) | Max Carrying Capacity |
|---|---:|---|
| Polar Ice | 3,333 | 100 |
| Tundra | 66,667 | 2,000 |
| Boreal Forest | 800,000 | 24,000 |
| Temperate Forest | 833,333 | 25,000 |
| Savanna | 756,667 | 22,700 |
| Tropical Forest | 1,000,000 | 30,000 |
| Grassland | 200,000 | 6,000 |
| Desert | 33,333 | 1,000 |
| Open Ocean | 63,333 | 1,900 |

### 1.1 Temperature/Precipitation Modulation (PSR)
`GPP_Actual = mulPPM(GPP_Baseline, mulPPM(TemperatureFactor, PrecipitationFactor))`
- **TemperatureFactor**: Sigmoid centered at 288K (Earth mean).
- **PrecipitationFactor**: Linear ramp from 0 to 2000mm/yr.

## 2. Trophic Energy Conversion (Lindeman's 10% Rule)
To accurately support 335+ unit types (`125`) while staying "cheap," the simulation uses a tiered energy pyramid.

### 2.1 The Energy Cascade
`AvailableEnergy_L(n) = mulPPM(AvailableEnergy_L(n-1), 100,000)`
- **L0 (Producers)**: Total GPP (3.0 kg C/m² baseline).
- **L1 (Herbivores)**: 10% of GPP. Supports "Peasant" and "Laborer" biomass.
- **L2 (Carnivores/Actors)**: 1% of GPP. Supports "Elite Actors," "Dragons," and "Military" units.

### 2.2 Discrete Conversion
`MaxUnits_In_Hex = AvailableEnergy_Ln / Unit_Metabolic_Cost`
- **Metabolic Cost**: Huge units (Dragons) consume 100x the energy of Medium units (Humans).
- **Hardening**: If energy requirement > `AvailableEnergy`, units suffer `ATTRITION` (Spec 142).

## 3. The Geological Thermostat (Walker Feedback)
Ensures deep-time climate stability without heavy atmospheric CFD.

`Weathering_Rate = mulPPM(BaselineWeathering, exp((MeanTempK - 288) / 10))`
- **Effect**: Increases CO2 drawdown as temperature rises, creating a negative feedback loop.
- **Activation Energy**: 38.25 kJ/mol equivalent in fixed-point math.

## 4. Population Dynamics (Macro-Sim)
When zoomed out (> 24 mi/hex), population growth uses the Logistic Equation:
`dN/dt = r * N * (1 - N/K)`
- `K`: Carrying capacity derived from `GPP_Actual` and `agri.yield` (Spec 113).
- `r`: Intrinsic growth rate based on species traits.

## 5. Transition to Discrete Actors
When zooming in (< 24 mi/hex), the Logistic `N` is used to seed the initial count of discrete agents.
- **Sampling**: `AgentCount = PoissonDistribution(N)`.
- **Placement**: Agents are distributed based on a noise map of local resource density.

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

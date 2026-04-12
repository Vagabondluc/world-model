# 🔒 95: Urban Growth Lifecycle (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `PopPPM` ([`Spec 13`](../specs/10-life-ecology/13-population-dynamics.md)): Local population count.
    - `UtilizationPPM` ([`Spec 45`](../specs/40-actions-gameplay/45-economic-flow-trade-network.md)): Economic node activity.
    - `TechLevel` ([`Spec 79`](./79-tech-impact-matrix-contract.md)): Systemic efficiency coefficient.
    - `InfraScale` ([`Spec 93`](./93-settlement-urban-realizer.md)): Current building density.
    - `GlobalCityCount` (Global Scalar): Number of active `City` tier hexes.
- **Outputs**:
    - `SettlementTierV1`: Current classification (Village | Town | City | Ruin).
    - `UrbanDelta`: Triggers expansion or contraction events.
- **Parameters**: ([`Spec 56`](../specs/30-runtime-determinism/56-unified-parameter-registry-schema-contract.md))
    - `BASE_URBAN_THRESHOLD`: 500,000 PPM.
    - `RANK_SIZE_COEFF`: 1.5x (Inflation factor).

## 2. Mathematical Kernels

### 2.1 Threshold Function (Dynamic Scaling)
The requirement for urban ascension is not a constant; it scales with historical complexity.
```text
DynamicCityThreshold = BASE_URBAN_THRESHOLD 
                     * (1,000,000 / TechLevel.CommunicationSpeedPPM)
                     * (1,000,000 / TechLevel.LogisticsPPM)
```
*Logic: In Eras with slow communications (Medieval), the population threshold to organize a "City" is much higher than in the Digital Era.*

### 2.2 Rank-Size Cost Inflation
To prevent artificial city spam, the "Work Required" (Spec 90) to upgrade a settlement scales with global saturation.
```text
UpgradeInflation = (GlobalCityCount ^ RANK_SIZE_COEFF) / PlanetGPP
EffectiveUpgradeCost = BaseCost * UpgradeInflation
```
*Logic: If the planet already has many cities relative to its total energy production (GPP), starting a new one is politically and economically resisted (Cost Inflation).*

### 2.3 Complexity Tax (Administrative Drag)
Settlement efficiency is penalized by the square of its population.
```text
AdministrativeDrag = mulPPM(PopPPM, PopPPM) / max(1, InfraScale)
```
*Logic: Without infrastructure investment, large populations create logarithmic waste (Congestion, Disease, Crime).*

## 3. Determinism & Flow
- **Evaluation Order**: Runs in Phase A (Observation) at the end of every `CivTick`.
- **Hysteresis (Schmitt Trigger)**:
    - **Entry (Town -> City)**: `PopPPM > DynamicCityThreshold` AND `Utilization > 70%`.
    - **Exit (City -> Town)**: `PopPPM < (DynamicCityThreshold * 0.8)` OR `Utilization < 20%`.
- **Tie-Breaking**: If multiple hexes qualify for a single "Global Rank" slot, the one with higher `LegitimacyPPM` wins.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `URBAN_REASON_CODE`
- **Primary Drivers**:
    - `TECH_EFFICIENCY`: Impact of comms/logistics on the threshold.
    - `GLOBAL_COMPETITION`: Impact of the Rank-Size rule.
    - `ADMIN_COLLAPSE`: Impact of the Complexity Tax on stability.

## 5. Failure Modes & Bounds
- **Saturated Result**: If `InfraScale` reaches 1,000,000 PPM, the hex is marked as an `Ecumenopolis`.
- **Invalid Input**: If `PopPPM` is negative, emit `ERR_INTERNAL_CLAMP` (Reason 0x0002) and freeze growth.

## Hardening Addendum (2026-02-12)
- `SpecTier`: `Brainstorm Draft`
- `Status`: `Promotion Candidate after canonical header rewrite`
- `CanonicalizationTarget`: `docs/specs/* (TBD)`
- `DeterminismNote`: `Use fixed-point/PPM conventions from runtime determinism canon before promotion.`

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm draft.

Expected:
- deterministic output for identical inputs and evaluation order.
- explicit tie-break and clamp behavior is documented before promotion.

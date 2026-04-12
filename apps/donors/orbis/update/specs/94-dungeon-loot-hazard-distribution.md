# 🔒 94: Dungeon Loot & Hazard Distribution (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `DungeonOrigin` ([`Spec 92`](./92-dungeon-geometry-generator.md)): Karst | Tectonic | Volcanic | Archaeic.
    - `SettlementHistory` ([`Spec 95`](./95-urban-growth-lifecycle.md)): Presence of prior `Ruin` or `City` tiers.
    - `LocalResourcePPM` ([`Spec 25`](../specs/20-world-generation/25-resource-generation.md)): Bedrock mineral intensity.
    - `AccessibilityPPM`: Graph distance from the nearest `SURFACE` entrance.
- **Outputs**:
    - `LootInstanceV1`: Placed resource or item entity.
    - `HazardInstanceV1`: Tactical deterrents (Gas, Traps, Guardians).
- **Parameters**:
    - `SCARCITY_BIAS`: 1.2x (Exponential increase with depth).

## 2. Mathematical Kernels

### 2.1 Multi-Condition Gating
Placement follows a strict logic hierarchy to prevent datamining of pure noise patterns.
```text
SpawnProbability = OriginWeight 
                 * f(History) 
                 * f(Accessibility) 
                 * NarrativeModifier 
                 * ScarcityNoiseLayer(V)
```

| Layer | Weight Logic |
| :--- | :--- |
| **Origin** | `Archaeic` increases `ArtifactChance` by 5x. `Karst` increases `BioticChance` by 3x. |
| **Accessibility** | If `AccessibilityPPM < 200,000`, multiply `JackpotChance` by 0.1x (Already looted). |
| **History** | If `SettlementTier == RUIN`, apply `RelicBonus` from the `NARRATIVE` namespace. |
| **Scarcity Noise** | High-frequency deterministic hash (SplitMix64). $V > 0.98$ triggers "Jackpot" potential. |

### 2.2 Hazard Intensity (Dynamic Forcing)
Hazards are not static; they scale with current planetary forcing.
```text
GasIntensity = baseGasPPM * mulPPM(TectonicActivity01, AtmosphereDensity01)
```
*Logic: A geologically active planet makes Volcanic dungeons exponentially more hazardous.*

## 3. Determinism & Flow
- **Evaluation Order**: Triggered once upon `DUNGEON_CARVED` event.
- **Seeding**: Key = `hash64(worldSeed, hexId, nodeId, reasonCode)`.
- **Tie-Breaking**: Lowest `RegistryId` (Spec 02) for loot types.

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `LOOT_ORIGIN_TRACE`
- **Primary Drivers**:
    - `GEOLOGICAL_DEPOSIT`: Loot tied to Spec 25 bedrock.
    - `ARCHAEOLOGICAL_REMNANT`: Loot tied to Spec 95 history.
    - `ECOLOGICAL_YIELD`: Loot tied to Spec 13 species.

## 5. Failure Modes & Bounds
- **Saturated Result**: A node cannot exceed its `StorageCapacityPPM`. Excess loot is "Spilled" to neighbor nodes.
- **Invalid Input**: If `DepthPPM` is out of bounds, return `ERR_INTERNAL_CLAMP` and spawn no loot.

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

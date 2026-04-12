# 149 Magical Leyline Physics

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/143-ecological-causality-kernels.md`, `docs/brainstorm/136-hierarchical-pathfinding-hpa.md`]
- `Owns`: [`leyline flow dynamics`, `aether potential math`, `magical nodal graph`]
- `Writes`: [`ambient mana levels`, `spellcasting efficiency modifiers`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/149-magical-leyline-physics.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Model magic as a physical fluid-flow simulation (Aether) through a global network of Leylines, influencing ecology, combat, and technology.

## 1. The Leyline Network (Graph Topology)
Magic flows through a directed graph of **Nodes** (Source/Sink) and **Edges** (Leylines).

### 1.1 Node Types
- **Source**: Generates `AetherPPM` (e.g., Arcane Springs, Celestial Alignments).
- **Sink**: Consumes `AetherPPM` (e.g., Corrupted Blight, Pylon Infrastructure).
- **Junction**: Redistributes flow; applies a `ResitancePPM` based on terrain.

## 2. Flow Dynamics: Kirchhoff Aether Laws
To remain "cheap," Aether flow is calculated using a steady-state graph flow model. All values use `PpmInt` from `113`.

### 2.1 The Flux Equation (Fixed-Point)
`Flow_Edge = mulPPM((Potential_Source - Potential_Sink), (1,000,000 - Resistance_Edge))`
- **Potential**: Stored as `aether.potential`.
- **Saturation**: If `aether.flux > 950,000 PPM`, trigger `thr_leyline_rupture` (Reason: `880101`).

### 2.2 Ecological Deformation (Hardened)
Leylines are not static; they are "dragged" and deformed by planetary geology and ecology.
- **Geological Conduits**: Tectonic plate boundaries and volcanic belts (e.g., The Ring of Fire) act as "High-Conductivity Super-Edges." 
  - **Effect**: `Resistance_Edge` drops by 80% if edge aligns with a volcanic belt.
- **Elemental Polarization**: Ecological biomes polarize leylines into specific elements.
  - **Fire Belts**: Volcanic chains transport `Fire-Aspected Aether`.
  - **Deep Oceans**: Abyssal trenches transport `Water/Ice-Aspected Aether`.
  - **Ancient Forests**: Large biomes "bend" local leylines toward `Nature-Aspected Aether`.

## 3. Atmospheric Mana (The "Leak")
Leylines bleed magic into the local hex grid based on Gaussian interpolation.
- **Ambient Level**: `aether.ambient_mana = mulPPM(Nearby_Flux, Distance_Penalty_PPM)`.
- **Elemental Resonance**: If a hex has high `Ambient_Mana` AND aligns with the leyline's aspect (e.g., Fire Mana in a Volcano hex), trigger `thr_elemental_resonance` (Reason: `880103`).

## 4. Magical Forcing (Gameplay)
- **Combat**: Spells cast near nodes where `aether.potential > 500,000` gain `+50% EfficiencyModifier`.
- **Logistics**: "Aether-Charging" supply hubs reduces attrition by `20%` (Spec 142).
- **Civilization**: Advanced civs "addict" their infrastructure to leyline flow, increasing **Complexity PPM** (Spec 134).

## 5. Compliance Vector (v1)
Input:
- `Node_A.potential = 800,000`
- `Node_B.potential = 200,000`
- `Edge_AB.resistance = 100,000` (10% friction)

Expected Output:
- `Potential_Delta = 600,000`
- `Resistance_Multiplier = 900,000` (1.0 - 0.1)
- `aether.flux_AB = mulPPM(600,000, 900,000) = 540,000 PPM`.
- `thr_leyline_rupture` check: `540,000 < 950,000` (FAIL - No rupture).

## 6. Performance Optimization
- **Steady-State Update**: Flow graph is updated every 100 ticks or upon node construction/destruction.
- **Interpolation**: Ambient mana levels use a precomputed Gaussian kernel for cheap spatial rendering.

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

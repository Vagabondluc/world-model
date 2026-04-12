# 🔒 92: Dungeon Geometry Generator (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `Lithology` ([`Spec 26`](../specs/20-world-generation/26-erosion-sediment.md)): Rock hardness/type.
    - `BoundaryStress` ([`Spec 02`](../specs/20-world-generation/02-magnetosphere.md)): Tectonic chasm potential.
    - `SettlementTier` ([`Spec 95`](./95-urban-growth-lifecycle.md)): Presence of anthropic modifiers.
    - `HydrologyPPM` ([`Spec 50`](../specs/50-solver-contracts/50-hydrology-solver-contract.md)): Karst tube potential.
- **Outputs**:
    - `VoidTopologyV1`: Graph of connected empty volumes.
    - `VoxelMutation`: Removal of stone/dirt to create `AIR` or `WATER` voxels.
- **Parameters**:
    - `MAX_ROOM_VOLUME`: 5,000 Voxels.
    - `ANTHROPIC_CHANCE_PPM`: Derived from `SettlementTier`.

## 2. Mathematical Kernels

### 2.1 Causal Carving Rules
Geometry is a pure function of geological and social history.
```text
GrowthRate = mulPPM(HydrologyPPM, (1,000,000 - Lithology.HardnessPPM))
```

| Type | Formula Basis | Visual Result |
| :--- | :--- | :--- |
| **Natural (Karst)** | Gravity gradient walk | Organic branching tubes. |
| **Tectonic (Rift)** | Plane-parallel stress fracture | Linear vertical chasms. |
| **Anthropic (Ruin)** | Grid-aligned expansion | Cuboid rooms and right-angle halls. |

### 2.2 Anthropic Modification (The Civilization Imprint)
If `SettlementTier >= TOWN`, the generator applies a "Smoothing" pass to natural caves.
```text
RoomRegularityPPM = mulPPM(Civ.TechLevel, 800,000)
```
*Logic: Civilizations expand and regularize natural caves into habitable spaces (Underdark Cities).*

### 2.3 Precomputed Erosion Templates (Performance Optimization)
To avoid high-cost real-time hydraulic simulation:
1. **Templates**: Use a library of precomputed 3D "Karst Tubes" and "Fracture Planes."
2. **Lithology Masking**: The template is "Stencil-masked" by the authoritative `Lithology` hardness.
3. **Connectivity**: Tubes are linked using A* on the gravity gradient of the hex.

## 3. Determinism & Flow
- **Evaluation Order**: Runs once per hex during `GeoTick` realization.
- **Topological Sorting**: Nodes are sorted by `PathDistance` from the surface entrance.
- **Collision Rules**: Natural voids and Anthropic rooms must use a deterministic union-merge (Aggregation by MAX volume).

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `GEOMETRY_GEN_TRACE`
- **Primary Drivers**:
    - `KARST_DISSOLUTION`: Driven by water + limestone.
    - `TECTONIC_FRACTURE`: Driven by plate stress.
    - `ARCHAEIC_STRUCTURE`: Driven by past urbanization.

## 5. Failure Modes & Bounds
- **Saturated Result**: If a hex is 100% `AIR` (due to soft soil + high rain), the `VOXEL_COLLAPSE` event is emitted and the hex reverts to a `Depression` (Spec 64).
- **Invalid Input**: If `Lithology` is missing, default to `IGNEOUS` (Max Hardness) to prevent infinite void loops.

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

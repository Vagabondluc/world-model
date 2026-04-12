# 136 Hierarchical Pathfinding (HPA*)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/multi-resolution-data-architecture.md`, `docs/brainstorm/135-typescript-simulation-architecture.md`]
- `Owns`: [`pathfinding algorithm`, `spatial hierarchy`]
- `Writes`: [`navigation results`, `movement events`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/136-hierarchical-pathfinding-hpa.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Enable efficient pathfinding on large-scale world maps (up to 2048x2048) without exhausting the Sim-Worker's CPU budget.

## 1. Spatial Abstraction
The map is divided into a multi-level hierarchy to reduce the A* search space.

### 1.1 Clusters
- **Level 0 (Tile)**: The base hex/grid.
- **Level 1 (Sector)**: 16x16 tiles.
- **Level 2 (Region)**: 8x8 Sectors.

### 1.2 Entry/Exit Nodes
- Each Sector identifies "Entrances" (points where movement between sectors is possible).
- An abstract graph is built where nodes = Entrances and edges = Precomputed paths within the Sector.

## 2. Pathfinding Hybrid Model
Orbis uses a dual-pathfinding strategy to balance individual autonomy with mass transit efficiency.

### 2.1 HPA* (Inter-Sector)
- A* finds a path between Sectors on the abstract Entrance graph.
- Used for long-range scouting and trade-route calculations.

### 2.2 Flow Fields (Mass Transit)
- **Goal-Based**: When >5 entities share a destination (e.g., army moving to a front), the Sim-Worker generates a **Flow Field** (Dijkstra Map) for that target.
- **Efficiency**: Individual agents read their move-vector from the field at O(1) cost per unit.
- **Dynamic Terrain**: Any change to Level 0 traversability triggers a `SectorRebake` event.

## 3. Movement Physics (Deterministic)
- **Speed**: Stored as `PpmInt` (fixed-point units per tick).
- **Collision**: Entities occupying the same tile trigger a "Displacement" or "Combat" reason code.
- **Z-Axis**: Support for altitude (flying/submarine) as separate bitmask layers.

## 4. Performance & Budget
- **Path Request Queue**: Max 100 paths calculated per tick.
- **Memory**: Entrance graph must be pre-allocated in Sim-Worker memory.
- **Caching**: Precomputed inter-entrance paths are stored in `SharedArrayBuffer`.

## 5. Failure Modes
- **Unreachable Target**: Emit reason code `PATH_BLOCKED` (Reason: `800xxx`).
- **Graph Desync**: If tile traversability changes (e.g., city walls built), the abstract graph must be invalidated and rebuilt for affected sectors.

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

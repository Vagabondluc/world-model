# 142 Global Logistics & Supply Graph

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/139-macro-economic-input-output-model.md`, `docs/brainstorm/136-hierarchical-pathfinding-hpa.md`]
- `Owns`: [`supply line graph`, `logistics throughput math`]
- `Writes`: [`resource availability deltas`, `unit supply status`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/142-global-logistics-supply-graph.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Model the physical flow of resources across the map using graph theory, ensuring that economic productivity (Spec 139) is constrained by logistical infrastructure.

## 1. The Supply Graph
Logistics is modeled as a directed graph where nodes are hubs (cities, ports, warehouses) and edges are connections (roads, rail, shipping lanes).

### 1.1 Hub Throughput
- Each hub has a `CapacityPPM` based on local `infrastructure.scale`.
- Hubs accumulate "Stockpiles" of sector outputs from the I-O model.

### 1.2 Edge Efficiency
- Edge cost is a function of distance and terrain (derived from HPA* Sector costs).
- `ThroughputPPM = mulPPM(EdgeCapacity, system.efficiency)`.

## 2. The Bullwhip Effect (Hardened)
- Delays in supply lines create oscillations in resource availability.
- **Propagation Delay**: Resources take `Distance / Speed` ticks to arrive.
- **Feedback Loop**: Small fluctuations in consumer demand (Pops) create massive volatility in primary extraction sectors (The Bullwhip Effect).

## 3. Unit Logistics
- Combat units require a valid connection to a `SupplyHub`.
- **Attrition**: If `connection_quality < 200,000 PPM`, units suffer health decay and `military.lethality` penalties.

## 4. Bottleneck Analysis
- The simulation identifies "Cut Sets" in the graph (minimum edges whose removal disconnects the network).
- Threatening a cut-set edge triggers a high-priority `NeedWeight` for defense in the Utility AI.

## 5. Performance
- Graph updates occur every 10 ticks or upon hub/edge destruction.
- Max-flow calculations use a simplified greedy heuristic to fit within the Sim-Worker budget.

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

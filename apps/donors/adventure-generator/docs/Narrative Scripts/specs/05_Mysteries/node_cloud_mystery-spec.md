# Specification: Node Cloud Architect (node_cloud_mystery)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Node Cloud Architect is a tool for non-linear, city-wide investigations (10-20 nodes). It features a Force-Directed Graph, specific "Reactive Nodes", and a Timeline.

## 2. Component Architecture
### 2.1 Core Panels
- **Cloud Visualizer**:
    - Interactive constellation graph.
    - Filters: Faction influence (Colors).
- **Timeline**:
    - Event slider (Day 1, Day 2...).
- **Redundancy Matrix**:
    - "Core Truths" vs "Sources" (Ensures 3+ sources per truth).
- **Reactive State Manager**:
    - Logic: "If Node X cleared, then Y happens".

## 3. Interaction Logic
- **Simulation**:
    - "Simulate Flow" checks pathing availability.
- **Dynamic Updates**:
    - Timeline events can change Node states (e.g., Tavern becomes Closed).

## 4. Visual Design
- **Aesthetic**: Web of Intrigue / Crime Board.
- **Node Shapes**: Location vs Person vs Event.

## 5. Data Model
```typescript
interface NodeCloud {
  nodes: CloudNode[];
  edges: CloudEdge[];
  timeline: TimelineEvent[];
  coreTruths: TruthMapping[];
}

interface CloudNode {
  id: string;
  type: string;
  faction: string;
  state: string; // 'Active', 'Closed', etc.
}
```

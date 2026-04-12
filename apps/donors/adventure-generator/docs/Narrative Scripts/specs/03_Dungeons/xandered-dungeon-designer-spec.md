# Specification: Xandered Dungeon Designer (xandered-dungeon-designer)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Xandered Dungeon Designer is a topological tool focusing on non-linear dungeon layout. It manages "Loops", "Verticality", and "Landmarks" to ensure complex, engaging navigation.

## 2. Component Architecture
### 2.1 Core Panels
- **Topology Canvas**:
    - Nodes (Rooms) + Edges (Paths).
    - Focus on connection types (Loop, Chute, Secret).
- **Xander Toolbar**:
    - Loop Tool (Connect non-adjacent).
    - Vertical Switch (Level links).
    - Secret Path.
- **Complexity Auditor**:
    - Real-time "Non-Linearity Score".
- **Landmark Manager**:
    - Drag-and-drop unique cues to nodes.

## 3. Interaction Logic
- **Verification Engine**:
    - "Verify Navigation" simulates pathing to ensure no unintentional dead ends.
- **Elevation Overlay**:
    - Stacked view to visualize vertical alignment.

## 4. Visual Design
- **Aesthetic**: Flowchart (Colored lines).
- **Icons**: Large Landmark anchors.

## 5. Data Model
```typescript
interface Topology {
  nodes: TopoNode[];
  edges: TopoEdge[];
  landmarks: Landmark[];
  score: number;
}

interface TopoEdge {
  from: string;
  to: string;
  type: 'Standard' | 'Loop' | 'Vertical' | 'Secret';
}
```

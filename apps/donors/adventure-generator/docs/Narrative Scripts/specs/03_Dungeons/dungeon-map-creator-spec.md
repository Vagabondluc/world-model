# Specification: Dungeon Map Creator (dungeon-map-creator)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Dungeon Map Creator is a vector-based "Node-Link Editor" for drawing standard dungeon layouts. It emphasizes grid alignment, layer management, and "Xandering" connectivity.

## 2. Component Architecture
### 2.1 Core Panels
- **Interactive Canvas**:
    - Mode: Vector drawing.
    - Entities: Rooms (Nodes) and Corridors (Links).
    - Grid Snapping (5ft/10ft).
- **Xandering Toolbar**:
    - Tools: Add Loop, Secret Path, Elevation Shift.
- **Layer Manager**:
    - Tabs for Levels (Lvl 1, Basement, Attic).
- **Properties Panel**:
    - Context-aware fields for selected Room (Name, Shape, Flow).

## 3. Interaction Logic
- **Bi-Directional Sync**:
    - Adding "Room 5" here reserves "Room 5" in the Key Writer.
- **Flow Visualization**:
    - Overlay coloring paths by distance from entrance (white -> red).
- **Symbol Drag-and-Drop**:
    - Library of standard icons (Doors, Traps).

## 4. Visual Design
- **Aesthetic**: Blueprint / Schematic (Grid Paper).
- **Legend Export**: Automated legend generation based on used symbols.

## 5. Data Model
```typescript
interface DungeonMap {
  scale: number;
  layers: DungeonLayer[];
  legend: SymbolDefinition[];
}

interface DungeonLayer {
  id: string;
  nodes: RoomNode[];
  links: CorridorLink[]; // includes types like 'Secret', 'Loop'
}
```

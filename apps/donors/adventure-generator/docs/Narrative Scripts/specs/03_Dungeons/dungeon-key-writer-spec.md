# Specification: Dungeon Key Writer (dungeon-key-writer)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Dungeon Architect: Map & Narrative Key is a dual-pane suite syncing a visual Map Canvas with a text-based Room Key. It includes "Xandering" audit tools and sensory prompt enforcement.

## 2. Component Architecture
### 2.1 Core Panels
- **Dual-Pane Synchronizer**:
    - Left: Map Canvas (Grid).
    - Right: Narrative Key (Form/Text).
- **Xandering Module**:
    - Toolbar for "Elevation Shifts", "Loops".
- **Sensory Prompt Studio**:
    - Form enforcing 3 sensory details + 2 irrelevant details.

## 3. Interaction Logic
- **Symbol-to-Key**:
    - Draw "Trap" icon -> Adds "Trap" element to Room Key.
- **Logical Numbering**:
    - Re-numbering map node updates Key order.
- **Treasure Aggregator**:
    - Real-time summary of all loot in the dungeon.

## 4. Visual Design
- **Aesthetic**: Drafting Table / Blueprint.
- **Audit Mode**: Heat Map for connectivity.

## 5. Data Model
```typescript
interface DungeonProject {
  map: MapNode[];
  key: RoomKey[];
  treasury: LootItem[];
}

interface RoomKey {
  id: number;
  title: string;
  boxedText: string;
  elements: string[];
  denizens: Denizen[];
  connections: Connection[];
}
```

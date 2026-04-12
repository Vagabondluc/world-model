# Specification: Megadungeon Planner (megadungeon-planner)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Megadungeon Planner is a campaign-level tool for managing massive, multi-level dungeons. It tracks Factions, Ecosystems, Quest Arcs, and Difficulty progression across 10-20+ levels.

## 2. Component Architecture
### 2.1 Core Panels
- **Hierarchy Navigator**:
    - Vertical stack (Levels 1-20).
    - Color-coded by Difficulty.
- **Faction Grid**:
    - Matrix of Factions vs Levels/Control.
- **Ecosystem Modeler**:
    - Inputs for Food/Water sources and flow between levels.
- **Quest-Arc Timeline**:
    - Tracks stories spanning multiple levels.
- **Restoration Engine**:
    - Tracks "Cleared" status and restocking logic.

## 3. Interaction Logic
- **Depth-Based Difficulty**:
    - Deep levels auto-suggest higher difficulty/rewards.
- **Faction Dynamics**:
    - Selecting a level shows the controlling faction and their current conflicts.
- **Nodal Mapping**:
    - Visual connection graph for stairs/shafts between levels.

## 4. Visual Design
- **Aesthetic**: Grand/Subterranean (Dark Metallic).
- **Heat Map**: Difficulty colors (Green -> Purple).

## 5. Data Model
```typescript
interface Megadungeon {
  name: string;
  levels: DungeonLevel[];
  factions: Faction[];
  ecosystem: EcosystemData;
  arcs: QuestArc[];
}

interface DungeonLevel {
  id: number;
  name: string;
  difficulty: number; // 1-20
  factionControl: string;
}
```

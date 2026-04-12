# Specification: 5x5 Campaign Architect (5x5_mystery_campaign)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The 5x5 Campaign Architect manages a "Grand Web" of 5 linked mysteries, each containing 5 nodes (25 nodes total). It handles "Inter-Mystery Clues" and Global Lore.

## 2. Component Architecture
### 2.1 Core Panels
- **Meta-Mystery Map**:
    - Top Level: Mysteries A-E.
    - Drill-down: Click Mystery A to see its 5 nodes.
- **Global Lore DB**:
    - Recurring NPCs/Factions.
- **Inter-Mystery Clue Engine**:
    - Link Clue in Mystery A -> Mystery B.
- **Timeline**:
    - Campaign-level events.

## 3. Interaction Logic
- **Drill-Down**:
    - Zoom UI pattern (Campaign -> Mystery -> Node).
- **Consistency**:
    - Renaming an NPC in Global Lore updates all references in all nodes.
- **Entry Point Orientation**:
    - If Player starts at Mystery D, auto-highlight critical "Back-fill" clues.

## 4. Visual Design
- **Aesthetic**: Grand Strategy / Noir Dossier.
- **Visualization**: Colored threads (Blue = Internal, Red = Global).

## 5. Data Model
```typescript
interface Campaign5x5 {
  title: string;
  mysteries: Mystery5Node[]; // 5 mysteries
  globalLore: LoreElement[];
  interConnections: Connection[];
}
```

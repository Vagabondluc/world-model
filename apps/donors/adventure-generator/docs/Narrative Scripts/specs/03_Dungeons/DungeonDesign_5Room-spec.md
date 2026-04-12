# Specification: 5-Room & Narrative Architect (DungeonDesign_5Room)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The 5-Room & Narrative Architect is a flexible tool supporting both the "Classic 5-Room" structure and a "Narrative/Flexible" stage-based model. It focuses on the flow of the adventure and "Hero Spotlights."

## 2. Component Architecture
### 2.1 Core Panels
- **Framework Toggle**:
    - Switch: Classic (Fixed 1-5) vs Narrative (Flexible Stages).
- **Pipeline Ribbon**:
    - Visual flow (Drag & Drop in Narrative mode).
    - Stages: Prep, Flex (Trials), Midpoint, Flex (Puzzles), Climax.
- **Scene Editor**:
    - Context-aware fields (e.g., "Setback" field only appears for Midpoint).
- **Hero-Spotlight Sidebar**:
    - Analyzes current challenge and suggests PC-specific hooks (e.g., "Radiation for Bio-PC").

## 3. Interaction Logic
- **Recursive Generation**:
    - Filling "Theme" + "Midpoint" seeds suggestions for other rooms.
- **Branching Transitions**:
    - Define outcomes: "Success -> Scene X", "Failure -> Scene Y".
- **Flex Constraints**:
    - "Prep", "Midpoint", "Climax" are static/pinned.
    - "Flex Blocks" (Trials/Puzzles) allow reordering internal scenes.

## 4. Visual Design
- **Aesthetic**: Architectural Blueprint (Grid lines, Blueprints).
- **Indicators**: High-contrast "Cyan" for Twists/Setbacks.
- **Flow**: Lines connecting stages.

## 5. Data Model
```typescript
interface DungeonFlow {
  mode: 'Classic' | 'Narrative';
  theme: string;
  stages: Stage[];
}

interface Stage {
  id: string;
  type: 'Static' | 'Flex';
  scenes: Scene[];
}
```

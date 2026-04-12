# Specification: Tactical Battlefield Architect (battlefield_generation)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Tactical Battlefield Architect is a matrix-based generator for creating complex combat arenas. It uses a 3x5 grid to combine 5 element categories (Elevation, Terrain, Hard Cover, Soft Cover, Danger) into cohesive scenarios.

## 2. Component Architecture
### 2.1 Core Panels
- **Element Library**:
    - Database of 40 elements (8 per category).
- **Randomization Matrix**:
    - 3 Rows x 5 Groups grid.
    - Interactive cells (Manual override).
- **Scenario Synthesizer**:
    - Text editor for weaving the 5 selected elements.
- **Tactical Overlay**:
    - Role-based advice (Melee, Ranged, Magic).

## 3. Interaction Logic
- **Procedural Workflow**:
    - Generate Matrix -> Review Row -> Synthesize.
- **Manual Overrides**:
    - Click any matrix number to swap it (e.g., swap Index 2 for Index 7).
- **Consolidated Manifest**:
    - Export includes Table, Matrix, and Descriptions.

## 4. Visual Design
- **Aesthetic**: Wargame Command Center / VTT Asset Manager.
- **Grid Visualization**: Clear lines linking Matrix indices to Library columns.
- **Icons**: Terrain types (Mountain, Wall, Cloud).

## 5. Data Model
```typescript
interface BattlefieldMatrix {
  theme: string;
  library: { [category: string]: string[] }; // 8 items per cat
  matrix: number[][]; // 3x5 grid of indices
  scenarios: BattlefieldScenario[];
}

interface BattlefieldScenario {
  rowId: number;
  elements: string[];
  tactics: string;
  sensory: string;
}
```

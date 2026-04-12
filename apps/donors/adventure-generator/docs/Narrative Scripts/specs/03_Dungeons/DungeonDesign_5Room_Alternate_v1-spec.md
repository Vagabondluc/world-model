# Specification: Alternate 5-Room Flow (DungeonDesign_5Room_Alternate_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Alternate 5-Room Flow component visualizes an adventure as a vertical timeline with "Flex Blocks" (multiple scenes re-orderable within a block) sandwiched between Static Stages (Intro, Midpoint, Climax).

## 2. Component Architecture
### 2.1 Core Panels
- **Vertical Timeline**:
    - Primary Nav. Stages 1-7.
- **Flex Block Container**:
    - Holds multiple "Scene Cards".
    - Supports internal Drag-and-Drop.
- **Global AI Controller**:
    - Floating panel.
    - Actions: "Fill Next Stage", "Generate Full Plan".

## 3. Interaction Logic
- **Non-Linear Mapping**:
    - Flex scenes have "Entry" and "Exit" points to define mesh-like flow.
- **Adaptive UI**:
    - Marking a scene as "Combat" expands the CR/Difficulty calculator.

## 4. Visual Design
- **Theme-Sync**: Background color shifts by Stage (Red Climax, Blue Epilogue).
- **Responsive**: Timeline collapses to breadcrumbs on mobile.

## 5. Data Model
```typescript
interface AlternateFlow {
  title: string;
  stages: {
    prep: StaticStage;
    challenges: FlexBlock;
    midpoint: StaticStage;
    roleplay: FlexBlock;
    climax: StaticStage;
    resolution: StaticStage;
    epilogue: StaticStage;
  };
}
```

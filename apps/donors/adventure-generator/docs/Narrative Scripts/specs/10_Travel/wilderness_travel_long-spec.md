# Specification: Wilderness Master Architect (wilderness_travel_long)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Wilderness Master Architect is a comprehensive tool for building entire travel chapters. It includes "Seasonal Weather," "Scaling," and a "Sequence Visualizer" for linked mini-stories.

## 2. Component Architecture
### 2.1 Core Panels
- **Workspace Tabs**:
    - Biomes, Mechanics, Sequences, Appendices.
- **Sequence Visualizer**:
    - Logic Flow (Approach -> Challenge -> Exit).
    - Drag-and-drop scene builder.
- **Weather Calendar**:
    - Month-grid with weather probabilities.
- **Scaling Dashboard**:
    - Global Slider for DCs and Damage.

## 3. Interaction Logic
- **Mini-Story Branching**:
    - Suggests "Retaliation" scene if previous interaction was "Hostile".
- **Simulation**:
    - "Simulate 14-Day Trip" calculates expected resource drain and exhaustion.
- **Biome Theming**:
    - Changing Biome updates UI colors (Ice-Blue vs Desert-Tan).

## 4. Visual Design
- **Aesthetic**: Encyclopedia / Professional Layout.
- **Density**: High (Expanded sections).

## 5. Data Model
```typescript
interface WildernessChapter {
  name: string;
  biome: string;
  sequences: LinkedSequence[];
  weather: WeatherCalendar;
  scaling: { dcModifier: number; crModifier: number };
}

interface LinkedSequence {
  steps: SceneNode[];
  branchingLogic: Branch[];
}
```

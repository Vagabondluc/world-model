# Specification: Dungeon Features Summarizer (dungeon-features-summarizer)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Dungeon Features Summarizer is a dashboard for defining the consistent physical and sensory rules of a dungeon (Illumination, Architecture, Atmosphere). It generates a "Reference Card" for the DM.

## 2. Component Architecture
### 2.1 Core Panels
- **Global Preset Header**:
    - Load Presets (e.g., "Frozen Fortress").
- **Grid Layout**:
    - 4 Quadrants: Physical, Sensory, Architectural, Unique.
- **Reference Card Preview**:
    - Real-time Markdown output.

## 3. Interaction Logic
- **Linked Parameters**:
    - "Cave" style -> auto-sets "Rough Walls".
- **RNG Buttons**:
    - Dice icon per field to randomize just that element.
- **AI Sync**:
    - "Sync All" button attempts to harmonize all fields with the narrative context.

## 4. Visual Design
- **Aesthetic**: High Density Dashboard.
- **Readability**: Markdown Highlighting in the preview card.

## 5. Data Model
```typescript
interface DungeonFeatures {
  preset: string;
  illumination: { type: string; source: string };
  dimensions: { ceiling: string; width: string };
  materials: { walls: string; floor: string };
  atmosphere: { smell: string; sound: string; temp: string };
  doors: string;
}
```

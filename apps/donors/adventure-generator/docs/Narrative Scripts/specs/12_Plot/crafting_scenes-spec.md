# Specification: Scene Director (crafting_scenes)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Scene Director is a dramatic framing engine. It focuses on the "Agenda" (Goal), "The Bang" (Start), and "Obstacles." It enforces "Sharp Cuts" to skip boring travel.

## 2. Component Architecture
### 2.1 Core Panels
- **Agenda Header**:
    - Core Question (e.g. "Does he betray us?").
- **Bang Randomizer**:
    - Initiating Action (e.g. "Gun drawn").
- **Cast Grid**:
    - Lead, Feature, Extra.
- **Cutter Interface**:
    - "From" (Start) / "To" (End).

## 3. Interaction Logic
- **Filler Elimination**:
    - UI suggests "Abstract Time" for transitions > 1 hour without conflict.
- **Agenda Check**:
    - "End Scene" button highlights when conflict resolves.
- **Bang Generation**:
    - Selection from dramatic library based on "Tone".

## 4. Visual Design
- **Aesthetic**: Script / Director Notes / High Contrast.
- **Focus**: Action-oriented.

## 5. Data Model
```typescript
interface SceneFrame {
  agenda: string;
  bang: string;
  cast: { role: string; name: string }[];
  cuts: { start: string; end: string };
  obstacles: string[];
}
```

# Specification: Dungeon Room Designer (dungeon-room-designer)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Dungeon Room Designer is a tool for detailing specific rooms. It focuses on physical dimensions, interactive elements, and specifically enforces a "Sensory Palette" to ensure descriptive depth.

## 2. Component Architecture
### 2.1 Core Panels
- **Header**: Room ID, Type, AI Seed.
- **Physical Traits**: Dimensions, Shape, Materials.
- **Dynamic Content Grid**:
    - **Interactive Elements**: List of objects (Traps, Treasure).
    - **Sensory Palette**: 5-sense checklist.
- **Curiosity Bench**:
    - Input for "Irrelevant Details".
- **Reaction Planner**:
    - Table for "If Player does X, then Y".

## 3. Interaction Logic
- **Sensory Audit**:
    - Progress bar tracks selected senses (Goal: 3/5).
    - Inline validation warns if met.
- **AI Narrative Engine**:
    - "Draft Description" button synthesizes inputs into Boxed Text.
- **Template Library**:
    - Save/Load room archetypes.

## 4. Visual Design
- **Aesthetic**: Card-Based with distinct icons.
- **Validation**: Visual checks (Green ticks, Red warnings).

## 5. Data Model
```typescript
interface RoomDetail {
  id: string;
  traits: { shape: string; dimensions: string; material: string };
  senses: { [key: string]: string }; // Sight, Sound, etc.
  elements: InteractiveElement[];
  curios: string[]; // Irrelevant details
  narrative: string;
}
```

# Specification: Pointy Hat Dungeon Architect (DungeonCreation_PointyHat_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Pointy Hat Dungeon Architect is a thematic dungeon design suite that enforces a "Theme-First" workflow. It ensures that mechanics, encounters, and the goal all stem from a single-word theme (e.g., "Decay").

## 2. Component Architecture
### 2.1 Core Panels
- **Step I: The Theme**:
    - Input: Single word.
    - Logic: Triggers "Autosuggest" for downstream steps.
- **Step II: Mechanics**:
    - Editable rules blocks (e.g., "Healing is halved").
- **Step III: The Goal**:
    - Narrative objective generator.
- **Step IV: Encounters**:
    - 3 distinct slots: Combat, Puzzle, Roleplay.
    - BACKGROUND AUDITOR: Checks harmony with Theme.
- **Step V: The Ending**:
    - Synthesis editor: combining Theme + Mechanic + Narrative.

## 3. Interaction Logic
- **Step-Unlocked Progression**:
    - Step II is locked/dimmed until Step I is filled.
- **Auto-Thematic Suggestions**:
    - "Autosuggest" button queries the AI for theme-appropriate mechanics.
- **Persona-Based**:
    - User can save custom mechanics to a personal library.

## 4. Visual Design
- **Thematic Skins**:
    - UI colors/textures shift based on the Theme keyword (e.g., 'Decay' -> Distressed/Rust).
- **Layout**: Linear vertical flow (Step I -> V) with the final step (Ending) visually emphasized.

## 5. Data Model
```typescript
interface PointyDungeon {
  theme: string;
  mechanics: string[];
  goal: string;
  encounters: {
    combat: string;
    puzzle: string;
    roleplay: string;
  };
  ending: string;
}
```

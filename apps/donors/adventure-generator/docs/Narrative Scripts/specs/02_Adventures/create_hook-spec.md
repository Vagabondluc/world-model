# Specification: Scenario Hook Generator (create_hook)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Scenario Hook Generator is a narrative tool designed to create "Twisted", "Dilemma", or "Patron" hooks. It forces the definition of foundational elements (Location, NPCs) before generating specific hook details, ensuring actionable and deep beginnings.

## 2. Component Architecture
### 2.1 Core Panels
- **Hook Archetype Selector**:
    - 9 Types (e.g., Twisted, Dilemma, Bait).
    - Changes input fields dynamically.
- **Scenario Foundation**:
    - Inputs: Location, NPCs, Conflict.
- **Dynamic Archetype Module**:
    - **Twisted**: "Truth" vs "Lie" fields.
    - **Dilemma**: "Choice A" vs "Choice B".
- **Next Steps Console**:
    - "Actionable Steps" list (Investigation points).

### 2.2 Creative Tools
- **Sensory Suite**: Toggles for "Evocative Language".
- **Handout Formatter**: Generates player-facing text (Letter, Rumor).

## 3. Interaction Logic
- **Constraint-Based**:
    - Cannot generate Hook Details until Foundation is set.
- **Consequence Engine**:
    - Suggests consequences for ignoring the hook based on conflict type.

## 4. Visual Design
- **Aesthetic**: Drafting Pad / Narrative Board.
- **Icons**: Unique glyphs for each Archetype.
- **Layout**: Split-pane (Utility vs Creative).

## 5. Data Model
```typescript
interface HookData {
  archetype: 'Twisted' | 'Dilemma' | 'Patron' | ...;
  foundation: { location: string; npcs: string[]; conflict: string };
  details: { truth?: string; lie?: string; choiceA?: string; choiceB?: string };
  previewText: string;
  nextSteps: string[];
}
```

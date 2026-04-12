# Specification: Arcane Library Adventure Generator (arcane_library_method)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Arcane Library Adventure Generator is a high-fidelity creative engine designed to generate distinct dungeon/adventure premises using a "Tri-Fold" randomizer (Action + McGuffin + Subject). It focuses on rapid ideation and grounding random ideas into the specific campaign context.

## 2. Component Architecture
### 2.1 Core Panels
- **Tri-Fold Premise Randomizer**:
    - Math-driven engine (d100 tables).
    - Generates batches (e.g., 5 ideas at once).
- **Selection Gallery**:
    - Card-based interface for browsing generated batches.
    - "Locking" a card moves it to the Expansion phase.
- **Expansion Studio**:
    - Interactive form for the "Core 3": **Origin**, **Positioning**, **Stakes**.
- **Creativity Tools**:
    - **Re-Roll Overrides**: Buttons to re-roll specific columns (e.g., "Keep Action, Re-roll Subject").
    - **Direct Involvement Panel**: Suggests personal hooks based on PC bios.

## 3. Interaction Logic
- **Process Flow**:
    - Generate Batch -> Select Card -> Expand Context -> Save.
- **Creative Challenges**:
    - Tooltips detect "weird" combinations and offer prompts to bridge the gap.
- **Weighting**:
    - Optional filters (Theme, Biome) adjust the probability of certain keywords.

## 4. Visual Design
- **Aesthetic**: Arcane & Scholarly (Leather, Gold Foil).
- **Layout**: Grid-aligned precision.
- **Emphasis**: "Selection" step is visually highlighted to guide workflow.

## 5. Data Model
```typescript
interface ArcanePremise {
  id: string;
  action: string;
  mcguffin: string;
  subject: string;
  context: {
    origin: string;
    positioning: string;
    stakes: string;
  };
  hook: string;
}
```

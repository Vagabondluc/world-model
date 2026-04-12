# Specification: Mystical Encounter Hub (Encounter_genric_beta)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Mystical Encounter Hub is a narrative-focused tool for high-fantasy/feywild scenes. It features a "Realm Themed" UI, a word-count pacer, and balanced Success/Failure consequence tracking.

## 2. Component Architecture
### 2.1 Core Panels
- **Realm Themed Interface**:
    - Selector (Feywild, Shadowfell).
    - Changes background/borders.
- **Narrative Console**:
    - Text Area + Word Counter.
    - Color-coded progress (Yellow -> Green -> Red) targeting 500 words.
- **Environmental Twist**:
    - Input for unique realm physics (e.g., Mirror-Rain).
- **Twin Outcome Panels**:
    - Side-by-side Success vs Failure fields.

## 3. Interaction Logic
- **Linked XP**:
    - Setting "Success XP" allows "Failure XP" to be set as a % (e.g., 25% of Success).
- **Auto-Formatting**:
    - Export injects Headers ("The Challenge", "The Narrative") automatically.
- **Inspiration Chips**:
    - Buttons to autosuggest "Twists" based on the Realm.

## 4. Visual Design
- **Aesthetic**: High-Phantasy (Glowing borders, Serif font).
- **Feedback**: Word count progress bar coloring.

## 5. Data Model
```typescript
interface MysticalEncounter {
  realm: string;
  focus: 'RP' | 'Riddle' | 'Combat';
  twist: string;
  narrative: string; // 500 word target
  npc: { name: string; motive: string; tactics: string };
  rewards: { successXP: number; failureXP: number };
}
```

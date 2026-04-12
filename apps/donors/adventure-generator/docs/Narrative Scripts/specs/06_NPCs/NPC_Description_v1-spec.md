# Specification: Detailed NPC Architect (NPC_Description_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Detailed NPC Architect (Lore & Psyche Suite) allows DMs to build complex NPCs via a 3-phase workflow: Data Grid, Backstory, and Psyche. It manages "Word Count" for concise output.

## 2. Component Architecture
### 2.1 Core Panels
- **Data Grid**:
    - 16-field table (Card Value, Catchphrase, Mannerisms).
- **Backstory Module**:
    - Text editor with "Conciseness" markers.
- **Psyche Panel**:
    - Motivations, Morals, Personality, Flaws.
- **Word Budget**:
    - Progress bar (Goal: 500 words).

## 3. Interaction Logic
- **Card Seed**:
    - Selecting "Queen of Hearts" biases the random traits toward Royalty/Emotion.
- **Incremental Expansion**:
    - Filling the Grid "seeds" the Backstory generation.
- **Progressive Disclosure**:
    - Hidden fields for "Secret Intel".

## 4. Visual Design
- **Aesthetic**: Literary / Book Layout (Serif).
- **Feedback**: Word Count color change.

## 5. Data Model
```typescript
interface DetailedNPC {
  cardSeed: string;
  grid: { [key: string]: string }; // 16 fields
  backstory: string;
  psyche: { motivations: string; morals: string; personality: string; flaws: string };
}
```

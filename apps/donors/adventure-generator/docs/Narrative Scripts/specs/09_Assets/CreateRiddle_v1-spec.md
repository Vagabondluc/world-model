# Specification: Riddle Crafter v1 (CreateRiddle_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Riddle Crafter v1 is a dual-difficulty generator. It takes a "Target Answer" and produces both an "Easy" (literal) and "Hard" (abstract/metaphorical) riddle for that answer.

## 2. Component Architecture
### 2.1 Core Panels
- **Target Console**:
    - Input: Answer (e.g., "Shadow").
    - Theme Toggle: Cryptic / Whimsical.
- **Difficulty Split-View**:
    - Easy Pane: Hint-based text.
    - Hard Pane: Metaphor-based text.
- **Logic Explanation**:
    - Breakdown of *why* the clues work (e.g., "Born of sun = Light source").

## 3. Interaction Logic
- **Independent Regeneration**:
    - "Regenerate Easy" only refreshes the easy version.
- **Tone Shifting**:
    - Changing Theme modifies the vocabulary (e.g., "Whimsical" uses playful words).

## 4. Visual Design
- **Aesthetic**: Balanced / Comparative.
- **Contrast**: Visual distinction between Easy (Light) and Hard (Dark) sections.

## 5. Data Model
```typescript
interface RiddleV1 {
  answer: string;
  theme: 'Cryptic' | 'Whimsical' | 'Dark';
  easy: string;
  hard: string;
  explanation: string;
}
```

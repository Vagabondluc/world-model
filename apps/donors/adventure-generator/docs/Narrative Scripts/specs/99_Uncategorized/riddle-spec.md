# Specification: Riddle Forge (riddle)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Riddle Forge is a lightweight riddle generator. It produces "Easy" and "Hard" variants for a given answer based on a "Theme."

## 2. Component Architecture
### 2.1 Core Panels
- **Input**:
    - Answer (e.g. Silence).
    - Theme (e.g. Whispering Library).
- **Variant Output**:
    - Easy (Direct Hint).
    - Hard (Abstract/Metaphor).
- **Explanation**:
    - Logic breakdown.

## 3. Interaction Logic
- **Regenerate**:
    - Refreshes clues based on the current theme.
- **Copy**:
    - Quick clipboard access for specific variants.

## 4. Visual Design
- **Aesthetic**: Clean / Card-based.
- **Contrast**: Differentiates Easy vs Hard visual blocks.

## 5. Data Model
```typescript
interface RiddleForge {
  answer: string;
  theme: string;
  easy: string;
  hard: string;
  explanation: string;
}
```

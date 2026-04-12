# Specification: Compound Riddle Architect v2 (CreateRiddle_v2)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Compound Riddle Architect v2 builds riddles based on "Logical Derivation." It combines two "Secret Words" (A + B) to form a Compound Answer (e.g., Fire + Wall = Firewall).

## 2. Component Architecture
### 2.1 Core Panels
- **Logic Header**:
    - Inputs: Word A, Word B, Result (Answer).
- **Clue Editors**:
    - Dedicated box for transforming Word A into a clue.
    - Dedicated box for Word B.
- **Wrapper Module**:
    - Injects structural text ("The two secret words...").
- **Synthesizer**:
    - Real-time preview of the full formatted riddle.

## 3. Interaction Logic
- **Step-by-Step Flow**:
    - Define Words -> Generate Clues -> Synthesize.
- **Compound Validation**:
    - Check if A+B constitutes a valid concept/phrase.
- **Ambiguity Control**:
    - Toggle "Vague" vs "Specific" wording.

## 4. Visual Design
- **Aesthetic**: Analytical / Mathematical / Card-based.
- **Symbols**: Uses "+" and "=" to denote structure.

## 5. Data Model
```typescript
interface RiddleV2 {
  wordA: string;
  wordB: string;
  answer: string;
  clueA: string;
  clueB: string;
  finalText: string;
}
```

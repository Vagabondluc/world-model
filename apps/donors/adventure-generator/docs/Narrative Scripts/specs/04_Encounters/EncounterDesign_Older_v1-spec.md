# Specification: Encounter Architect: Older_v1 (EncounterDesign_Older_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Encounter Architect (Older_v1) is a comprehensive scene builder focusing on "Setting the Scene" with sensory depth, rigorous Environmental mechanics, and detailed Skill Challenges. It emphasizes a structured narrative flow (Sensory -> Mechanics -> Logic -> Tactics -> Consequences).

## 2. Component Architecture
### 2.1 Core Panels
- **Vivid Header**:
    - Fields: Scene Title, Tier (Level Range).
- **Sensory Builder**:
    - Input: Text area for box text.
    - Feedback: "Sensory Tags" (Sight, Sound) highlighting usage.
- **Mechanism Matrix**:
    - **Environment**: Mechanics for modifiers (e.g., gravity).
    - **Logic**: Steps for Skill Challenges (DC, Success/Failure tracking).
- **Tactical Dashboard**:
    - Opponent stats and "Tactics Notes".
- **Narrative Branching**:
    - Success/Failure outcomes and Transition hooks.

## 3. Interaction Logic
- **Outcome Mapping**:
    - Entering "Success" text auto-prompts a "Transition" field.
- **Dynamic XP Tally**:
    - Real-time calculator summing Challenge XP + Monster XP.
- **Validity Check**:
    - Warns if Challenges lack DCs.

## 4. Visual Design
- **Aesthetic**: High Contrast / Drafting Board.
- **Icons**: Sensory organs (Eye, Ear, Nose).
- **Watermarks**: Instructional placeholders.

## 5. Data Model
```typescript
interface EncounterOlder {
  title: string;
  tier: string;
  sensoryText: string;
  environment: { effect: string; mechanics: string };
  challenge: { logic: string; checks: SkillCheck[] };
  opponents: Opponent[];
  outcomes: { success: string; failure: string; hooks: string[] };
  xpTotal: number;
}
```

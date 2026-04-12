# Specification: Character Portrait & Backstory Suite (character_profile)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Character Portrait & Backstory Suite is a deep-dive tool for PC creation. It includes a "Personality Wizard" (sensory questionnaire), "Backstory Studio" (1500w profile), and "Arc Timeline" (Hero's Journey).

## 2. Component Architecture
### 2.1 Core Panels
- **Personality Wizard**:
    - Sensory-rich questionnaire (Smell/Sight).
    - Hidden Role Scoring (Actor +4, Power Gamer +5).
- **Backstory Studio**:
    - Tabbed Editor (Psychology, History, Physical).
- **Arc Timeline**:
    - Hero's Journey Drag-and-Drop (Call to Adventure -> Transformation).
- **Surface Card**:
    - Bilingual Output (Fr/En) for public profile.

## 3. Interaction Logic
- **Psychological Mirroring**:
    - Adjusts mannerisms based on MBTI/Enneagram input.
- **Sensory Progression**:
    - "Earliest Memory" prompt asks for smell/sound details.
- **Heavy Price**:
    - Periodic prompt: "What did it cost?" to enforce narrative weight.

## 4. Visual Design
- **Aesthetic**: Literary / Leather-Bound Journal.
- **Roles**: Color-coded notes (Purple=Narrative, Blue=Strategy).

## 5. Data Model
```typescript
interface CharacterProfile {
  identity: { name: string; archetype: string };
  wizardScores: { [role: string]: number };
  backstory: { psychology: string; history: string; physical: string };
  arc: { beats: string[] };
  surface: { job: string; look: string; persona: string };
}
```

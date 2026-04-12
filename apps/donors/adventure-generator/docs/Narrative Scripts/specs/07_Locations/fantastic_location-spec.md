# Specification: Fantastic Location Architect (fantastic_location)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Fantastic Location Architect designs evocative 3-point scene locations. It imposes a "Rule of Three" for Aspects and Sensory Details to prevent feature creep.

## 2. Component Architecture
### 2.1 Core Panels
- **Aspect Editor**:
    - Exactly 3 slots (Visual features).
- **Scale & Age**:
    - Dimensions (100ft) + Chronology (Primordial).
- **Sensory Palette**:
    - 5 Senses checklist (Need 3).
- **Interactions**:
    - Derived actions (e.g. "Climb the ribs").
- **Narrative Preview**:
    - Text block with word count (Goal: 300-400 words).

## 3. Interaction Logic
- **Aspect-Driven Interaction**:
    - Entering "Crystal Shard" aspect auto-suggests "Harvest" or "Arcana Check" interaction.
- **Sensory Reskinning**:
    - Changing Theme (e.g. "Bone" -> "Magma") updates sensory word bank.

## 4. Visual Design
- **Aesthetic**: Cinematic / Moody.
- **Iconography**: Sensory icons (Eye, Ear, Nose).

## 5. Data Model
```typescript
interface FantasticLocation {
  name: string;
  isNpcTied: boolean;
  aspects: [string, string, string]; // Fixed tuple of 3
  scale: string;
  age: string;
  sensory: { [sense: string]: string };
  interactions: string[];
}
```

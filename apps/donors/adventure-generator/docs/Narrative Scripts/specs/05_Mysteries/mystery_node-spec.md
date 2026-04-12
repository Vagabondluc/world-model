# Specification: Mystery Node Architect (mystery_node)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Mystery Node Architect details a single scene within a mystery. It includes "The Bang" (start), "Atmosphere" (Sensory), "Clues", and "NPCs".

## 2. Component Architecture
### 2.1 Core Panels
- **Scene Framing**:
    - Agenda, "The Bang" (Inciting incident).
- **Atmosphere**:
    - 3-of-5 Senses checklist.
- **Clue Repository**:
    - List of clues (Phyiscal, Environmental, Testimony).
    - Visibility Toggle (Obvious/Subtle).
- **NPC Logic**:
    - Behavior tree (Bribed -> X, Intimidated -> Y).

## 3. Interaction Logic
- **"The Bang"**:
    - Prompt to define the "Start".
- **Lead Mapping**:
    - Tagging clues with "Points to Node X".
- **Visibility**:
    - Slider for difficulty of finding the clue.

## 4. Visual Design
- **Aesthetic**: Immersive / Atmospheric (Weather icons).
- **Badging**: NPC roles (Lead vs Extra).

## 5. Data Model
```typescript
interface MysteryNodeDetail {
  id: string;
  agenda: string;
  bang: string;
  senses: { [key: string]: string }; // 3 required
  clues: DetailedClue[];
  npcs: NPCBehavior[];
}

interface DetailedClue {
  type: 'Physical' | 'Env' | 'Testimony';
  content: string;
  visibility: 'Obvious' | 'Subtle';
  leadsTo: string;
}
```

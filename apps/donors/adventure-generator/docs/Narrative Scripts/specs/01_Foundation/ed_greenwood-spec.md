# Specification: Persona Manager (ed_greenwood)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Persona Manager is a high-fidelity React component that simulates the creative process of specific AI personas (in this case, Ed Greenwood). It focuses on generating long-form narrative content, specific lore accuracy, and structured data generation (magic items, NPCs).

## 2. Component Architecture
### 2.1 Core Panels
- **Persona Context Header**:
    - Displays identity: "Ed Greenwood".
    - Domain: "FR Lore / World-Building".
    - Motive: "Bring epic adventures to life".

- **Dynamic Parameter Console**:
    - **Temperature Slider**: Scales from 0.1 (Lore Accuracy) to 1.0 (Creative Prose).
    - **Mode Toggle**: Multi-Layered Narrative vs. Summary Mode.

- **Prose Analytics Panel**:
    - Real-time **Word Count**.
    - Progress Bar targeting the "800+ Words" requirement.

- **Layered Artifact Gallery**:
    - Visual slots for DALL-E generated images (Scenes, Characters).
    - Structured Data Tables for Magic Items and NPCs.

## 3. Interaction Logic
- **Task-Based Temp Auto-Switch**:
    - System suggests temperature shifts (e.g., lower temp for "Research", higher for "Drafting").

- **Investigation Pulse**:
    - Visual indicator when AI is processing external web links/sources.

- **Structured-Only Toggle**:
    - Restricts output to bullet points when enabled.

## 4. Visual Design
- **Theme**: Literary & Sophisticated (Old Manuscript).
- **Colors**: Parchment, Ink-Black, Gold.
- **Typography**: Serif fonts.
- **Icons**: "Parchment" (Lore), "Crossed Swords" (Conflict).

## 5. Data Model
```typescript
interface PersonaState {
  name: string;
  temperature: number;
  wordCount: number;
  mode: 'Narrative' | 'Summary';
  artifacts: GeneratedArtifact[];
}

interface GeneratedArtifact {
  type: 'Image' | 'Table' | 'Text';
  content: any;
}
```

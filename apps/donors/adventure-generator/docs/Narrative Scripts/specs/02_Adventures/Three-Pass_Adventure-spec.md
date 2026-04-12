# Specification: Three-Pass Adventure Studio (Three-Pass_Adventure)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Three-Pass Adventure Studio is a high-fidelity React component that guides Dungeons & Dragons Game Masters through a structured, iterative design process (Narrative, Mechanical, Presentation). It enforces a strict workflow to ensure balanced and well-paced adventures.

## 2. Component Architecture
### 2.1 Core Panels
- **Stage-Gate Stepper**:
    - Manage workflow: **Pass 1 (Narrative)** -> **Pass 2 (Mechanical)** -> **Pass 3 (Pro)**.
    - Locks future passes until current criteria are met.

- **Modular Scene Builder**:
    - "Narrative Description" (Pass 1) must be filled before "Summary Bullets" (Pass 3).
    - Prevents premature optimization.

- **Evolutionary Entity Editor**:
    - Context-aware fields for NPCs/Rivals.
    - Pass 1: "Motivations".
    - Pass 2: "Stats" (Action/Guts), "Luck Points".

- **Atmospheric Palette Tool** (Pass 3):
    - Sensory keywords generator.
    - "Read Aloud" template builder.

### 2.2 Active Trackers
- **Doomsday Clock**:
    - Visual progress bar (ticks).
    - Integrated with scene logic (failures advance the clock).

## 3. Interaction Logic
- **Iterative Refinement**:
    - "Go Back" warning: changing Narrative requires re-validating Mechanics.
- **Requirement Checklists**:
    - "Completion Criteria" must be checked to enable "Next Pass".
- **Artifact Management**:
    - Saves progress as a structured JSON/Markdown object.

## 4. Visual Design
- **Aesthetic**: Professional Publishing Tool (Golden Compass branding).
- **Typography**: Clean, Technical.
- **Zoned Info**: Visual separation between GM-only and Player-facing data.

## 5. Data Model
```typescript
interface AdventureModule {
  title: string;
  currentPass: 1 | 2 | 3;
  scenes: Scene[];
  rival: Rival;
  doomsdayClock: { current: number; max: number; event: string };
}

interface Scene {
  id: string;
  narrative: string; // Pass 1
  mechanics: { type: string; dc: number; reward: string }; // Pass 2
  presentation: { readAloud: string; keyFeatures: string[] }; // Pass 3
}
```

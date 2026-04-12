# Specification: Quest & Travel Architect (adventure)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Quest & Travel Architect is a high-fidelity "Phase 4 Suite" component consisting of three distinct modes: Seed Generator (Arcane), Travel Event Map (TES), and Co-Pilot Console (Roleplay). It handles the generation of quests, the plotting of journeys, and the active roleplay of the adventure.

## 2. Component Architecture
### 2.1 Core Modes
- **Seed Generator**:
    - **Relational Reel UI**: 3 spinning reels (Action, McGuffin, Subject).
    - **Context Expansion**: Fields for "Origin", "Position", "Stakes".

- **Travel Event Map (TES)**:
    - **Distance Scaling**: "Close" (1 Slot), "Far" (2 Slots), "Very Far" (3 Slots).
    - **Spectrum Event Cards**: Draggable cards.
    - Colors: Red (Combat), Blue (Roleplay), Purple (Hybrid), Yellow (Exploration).

- **Co-Pilot Console**:
    - **Narrative Sync Hub**: Chat-like interface (Storyteller vs Protagonist).
    - **Decision Resolution Modal**: Pop-up for evaluating "Complex Tasks" (DC Checks).

## 3. Interaction Logic
- **Abstract Distance**:
    - Changing distance selector dynamically adds/removes event slots.
- **Decision Points**:
    - "Task Evaluation Required" pauses the chat stream until DM adjudicates Success/Failure.
- **Stakes Generation**:
    - Selecting a seed automatically prompts/generates the "Context" fields.

## 4. Visual Design
- **Aesthetic**: Pathfinder / Cartography (Parchment, Ink).
- **Icons**: Compass, Shield, Scroll.
- **Color Coding**: Functional use of Red/Blue/Purple for event types.

## 5. Data Model
```typescript
interface QuestState {
  mode: 'Seed' | 'Travel' | 'CoPilot';
  seed: { action: string; mcguffin: string; subject: string; context: any };
  travel: { distance: 'Close' | 'Far' | 'Very Far'; events: EventCard[] };
  chatLog: ChatMessage[];
}

interface EventCard {
  type: 'Combat' | 'Social' | 'Hybrid' | 'Exploration';
  description: string;
}
```

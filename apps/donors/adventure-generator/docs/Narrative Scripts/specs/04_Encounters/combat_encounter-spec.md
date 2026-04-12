# Specification: Tactical Encounter & Combat Studio (combat_encounter)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Tactical Encounter & Combat Studio is a comprehensive hub integrating Arena editing, Encounter Balancing, Trap generation, and Scene Flow. It is designed to be a "War Room" for the DM.

## 2. Component Architecture
### 2.1 Core Panels
- **Combat Arena**:
    - Inputs: Physical Features, Hazards (Trigger/Effect).
    - Tactics Engine: Suggests behavior based on terrain.
- **XP Balancer**:
    - Threshold Calculator (Easy/Medium/Hard/Deadly).
    - Slider: Adjusts Difficulty Rank to auto-add minions.
- **Trap Matrix**:
    - Recursive 6x6 generator.
    - Fields: Clue, Trigger, Danger, Obscure.
- **Scene Flow**:
    - Node graph of adventure stages.
- **Urban/Social Hub**:
    - Trackers for Social Events and Urban Crawl layers.

## 3. Interaction Logic
- **Real-Time Difficulty**:
    - Adding monsters updates the XP/Threshold meter instantly.
- **Tactical Synergy**:
    - Selecting "Artillery" enemy type suggests "High Ground" usage if available in Arena.
- **Scene Continuity**:
    - "Scene Flow" warns if current scene disconnects from previous stage.

## 4. Visual Design
- **Aesthetic**: Dark, High-Contrast (War Room).
- **Indicators**: Status colors (Red=Hazard, Blue=Buff).
- **Icons**: Role badges (Brute, Solo).

## 5. Data Model
```typescript
interface CombatStudio {
  arena: ArenaState;
  balance: BalanceState;
  traps: TrapState[];
  social: SocialState;
  flow: SceneNode[];
}

interface ArenaState {
  environment: string;
  hazards: Hazard[];
  tactics: string;
}
```

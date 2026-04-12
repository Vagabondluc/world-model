# Specification: Eldwyn Mission Board (Eldwyn_mission_prompt)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Eldwyn Mission Board is a Westmarsh-style hub managing Missions, Adventure Hooks (Matrix), Travel Events (TES), and NPC Profiles. It unifies public-facing content with GM procedural tools.

## 2. Component Architecture
### 2.1 Core Panels
- **Mission Hub**:
    - Post Editor: Title, Rank (Silver/Gold), Tags (Combat/Stealth).
    - Reward Calculator (Tier-synched).
- **Adventure Matrix**:
    - 5x4 Grid input for hook generation.
    - "Submit and Expand" workflow (80 -> 120 words).
- **Travel System (TES)**:
    - Distance Selector (Close/Far).
    - Event Generator (Color-coded: Orange=Combat, Blue=RP).
- **NPC Profiler**:
    - Surface-only viewer (Name, Job, Look).
    - Toggle for "GM Secrets".

## 3. Interaction Logic
- **Rank Logic**:
    - Selecting "Gold Rank" updates Rewards to higher GP/Magic Item tier.
- **Narrative Expansion**:
    - Clicking "Expand" on an outline queries the AI to flesh out details.
- **Drama Travel**:
    - Distance "Far" auto-generates 2 events with complimentary colors.

## 4. Visual Design
- **Aesthetic**: Rugged / Industrial / Mining (Cold Greys).
- **Indicators**: Color-coded badges for Mission Tags and Event Types.

## 5. Data Model
```typescript
interface EldwynHub {
  missions: MissionPost[];
  currentMatrix: { seed: string; hook: string };
  travel: { distance: string; events: TravelEvent[] };
  npcs: SurfaceNPC[];
}

interface MissionPost {
  id: string;
  rank: 'Copper' | 'Silver' | 'Gold';
  tags: string[];
  rewards: string;
}
```

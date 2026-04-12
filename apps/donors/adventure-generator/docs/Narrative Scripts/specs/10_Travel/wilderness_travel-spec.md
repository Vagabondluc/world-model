# Specification: Wilderness Travel Manager (wilderness_travel)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Wilderness Travel Manager handles day-to-day overland travel. It features a "Location Matrix" for random encounters and linked "Mini-Stories" (Common Sequence).

## 2. Component Architecture
### 2.1 Core Panels
- **Config Studio**:
    - Structure (Hexcrawl), Biome (Tundra), Pace.
- **Travel Log**:
    - Progress Bars: Distance, Supplies, Morale.
- **Scene Generator**:
    - 2d6 Roller.
    - Status: "Standalone" or "Sequence Part 2".
- **Environment Console**:
    - Weather, Hazards, Navigation Checks.

## 3. Interaction Logic
- **Sequence Tracking**:
    - Rolling "7" (Common) triggers a 3-part mini-story tracker.
- **Fail-Forward**:
    - Failed Nav check triggers "Veering off Course" event instead of nothing.
- **Resource Drain**:
    - "Simulate Day" decrements Supplies.

## 4. Visual Design
- **Aesthetic**: Rugged / Map-like.
- **Dashboard**: Progress bars heavily used.

## 5. Data Model
```typescript
interface WildernessTrip {
  settings: { biome: string; pace: string };
  stats: { distance: number; supplies: number; morale: number };
  currentScene: SceneData;
  sequenceState: { active: boolean; step: number };
}
```

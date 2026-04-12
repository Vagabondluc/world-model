# Specification: Westmarsh Adventure Generator (westmarsh)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Westmarsh Adventure Generator allows rapid creation of 4 simultaneous plot hooks using a 5x4 Matrix. It supports a "mining town / cold terrain" setting.

## 2. Component Architecture
### 2.1 Core Panels
- **Setting Header**:
    - Context: Mining Town, Cold Terrain.
- **Adventure Matrix View**:
    - 4 Slots (Simultaneous generation).
    - Seed Display (e.g. 3-1-4-2-6).
- **Narrative Expander**:
    - 80 Word Mode -> 120 Word Mode toggles.
- **Cause-Effect Map**:
    - Visual link: Hook -> Motive -> Consequence.

## 3. Interaction Logic
- **Regeneration Loop**:
    - "Regenerate Matrix" refreshes all 4 seeds.
- **Detail Increment**:
    - Clicking "Expand" on a card adds detail to that specific plot.
- **Entity Tracking**:
    - Highlights named NPCs and McGuffins in the text.

## 4. Visual Design
- **Aesthetic**: Rustic / Cold / Frosted Glass.
- **Layout**: Quad-Grid for adventures.

## 5. Data Model
```typescript
interface WestmarshGen {
  setting: { town: string; terrain: string };
  adventures: AdventureHook[];
}

interface AdventureHook {
  seed: number[];
  title: string;
  narrative: string; // 80 or 120 words
  entities: { hook: string; threat: string; place: string };
}
```

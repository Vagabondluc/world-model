# Specification: Raid Architect (raid_prep)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Raid Architect plans combat-heavy scenarios. It includes an "XP Budget Calculator," "Squad Builder," and "Survey Intelligence Matrix."

## 2. Component Architecture
### 2.1 Core Panels
- **Budgeter**:
    - Calculates "Deadly Threshold" x 3.
    - Squad allocation (Alpha, Beta).
- **Intelligence Matrix**:
    - Categorizes features (Trivial -> Impossible).
- **Blueprint Layer**:
    - Tactical map (Entries, Vantages).
- **Defense Stack**:
    - Passive (Walls) vs Active (Archers).

## 3. Interaction Logic
- **Budget Distribution**:
    - Auto-suggests squad breakdown (e.g. "8 Easy Squads") to match XP target.
- **Risk Assessment**:
    - "Challenging" intel prompts for specific DC definitions.
- **Handout Sync**:
    - Generates player-safe maps by stripping "Impossible" intel.

## 4. Visual Design
- **Aesthetic**: Military Intelligence / Grid Paper / Folder.
- **Data Viz**: Progress bars for XP budget usage.

## 5. Data Model
```typescript
interface RaidPrep {
  xpBudget: { total: number; used: number };
  squads: RaidSquad[];
  intel: { [category: string]: Feature[] }; // category: Trivial, etc.
  layout: TacticalFeature[];
}
```

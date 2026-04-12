# Specification: Faction & Downtime Dashboard (factions_creation)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Faction & Downtime Dashboard simulates a "Living World." It tracks Faction Clocks, resolves Off-Screen Conflicts (Sim), and logs Downtime outcomes.

## 2. Component Architecture
### 2.1 Core Panels
- **Faction Hub**:
    - Tier (Power Level), Goal (Clock).
- **Clock Monitor**:
    - Segmented progress bars (4/6/8).
- **Conflict Simulator**:
    - Party A vs Party B roller.
- **Relationship Web**:
    - Visual graph (Ally/Enemy links).

## 3. Interaction Logic
- **Global Roll**:
    - "Resolve All Clocks" rolls 1d6 for every active faction.
- **Cascade Effect**:
    - Completing a clock triggers checks for Allies (Bonus) and Enemies (Penalty).
- **Map Sync**:
    - "Faction Damaged" result updates territory map control.

## 4. Visual Design
- **Aesthetic**: Grand Strategy / Blueprint.
- **Status**: Bright colors for Active, Grey for Damaged.

## 5. Data Model
```typescript
interface FactionSystem {
  factions: FactionData[];
  relationships: { source: string; target: string; type: 'Ally' | 'Enemy' }[];
  history: LogEntry[];
}

interface FactionData {
  name: string;
  tier: number;
  clock: { current: number; max: number; goal: string };
  status: 'Active' | 'Damaged' | 'Resolved';
}
```

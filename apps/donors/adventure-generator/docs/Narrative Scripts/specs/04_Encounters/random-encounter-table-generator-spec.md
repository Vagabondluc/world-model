# Specification: Random Encounter Table Generator (random-encounter-table-generator)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Random Encounter Table Generator is a probability tool for creating balanced encounter tables (d4 to d20, bell curves). It includes specific tools for Monte Carlo simulation and rules injection.

## 2. Component Architecture
### 2.1 Core Panels
- **Probability Engine**:
    - Logic for Bell Curve (2d6) vs Linear (1d20).
    - Visualizer: Graph of probability distribution.
- **Table Editor**:
    - Grid: Roll Range, Description, Frequency (Common/Rare).
    - XP Validator: Checks danger level.
- **Rules Meta-Injector**:
    - Toggles: Reaction Table, Distance, Surprise.
- **Simulator**:
    - "Run 100 Rolls" button and report view.

## 3. Interaction Logic
- **Weighted Management**:
    - Selecting "Common" auto-assigns a broad range (e.g., 5-9 on 2d6).
- **Live Validation**:
    - Warns if a "Low Level" table includes a CR 10 monster.
- **Locked Mode**:
    - Hides simulation/probability tools for "Session View".

## 4. Visual Design
- **Aesthetic**: Analytical / Utility (Excel-like but pretty).
- **High Contrast**: Banners for roll results.

## 5. Data Model
```typescript
interface RandomTable {
  dieType: '1d20' | '2d6' | '1d100';
  theme: string;
  entries: TableEntry[];
  settings: { reaction: boolean; distance: boolean };
}

interface TableEntry {
  range: string; // "2-4"
  content: string;
  frequency: 'Common' | 'Uncommon' | 'Rare';
}
```

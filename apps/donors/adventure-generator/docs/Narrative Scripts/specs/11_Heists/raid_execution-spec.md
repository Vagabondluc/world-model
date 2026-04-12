# Specification: Raid Commander (raid_execution)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Raid Commander runs tactical operations using "Theater of Operations" logic and "Squad Status". It handles "Awareness Ripples" and "Fail-Forward" checks.

## 2. Component Architecture
### 2.1 Core Panels
- **Theater Map**:
    - Active Zones (highlighted) vs Passive.
- **Squad Status**:
    - Awareness states: Green (Passive), Yellow (Alert), Red (Aware).
- **Time Switcher**:
    - Dungeon Turn -> Raid Turn (1 min) -> Combat Round (6s).
- **Fail-Forward Modal**:
    - Options for "Success at Cost" vs "Complication".

## 3. Interaction Logic
- **Awareness Ripple**:
    - Noise in Zone A triggers checks for squads in Zone B.
- **Distance Scaling**:
    - Selecting "60ft" applies penalty to Perception DC.
- **Pulse**:
    - "Tick" button advances timelines and patrol paths.

## 4. Visual Design
- **Aesthetic**: Command Tablet / Field Ops.
- **Feedback**: Flashing banners for status changes.

## 5. Data Model
```typescript
interface RaidRun {
  timeScale: 'Macro' | 'Turn' | 'Round';
  activeZones: string[];
  squads: LiveSquad[];
  rippleQueue: NoiseEvent[];
}

interface LiveSquad {
  id: string;
  status: 'Passive' | 'Alert' | 'Aware';
  location: string;
}
```

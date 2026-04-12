# Specification: Golden Compass Studio (golden_compass)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
Golden Compass Studio is a "Unified Engines" component that implements the "Three-Pass Method" (Narrative, Mechanical, Usability) for episode design. It features a pulp-adventure aesthetic and specialized tracking tools for time (Doomsday Clock) and stats (Diamond Ratings).

## 2. Component Architecture
### 2.1 Core Panels
- **Iterative Pass Workflow**:
    - Tabs/Filters for: **Pass 1 (Narrative)**, **Pass 2 (Mechanical)**, **Pass 3 (Usability)**.
    - Limits active tools based on the current pass.

- **Scene Anatomy Editor**:
    - Enforces structure: "Atmospheric Description" box (large) vs "Key Info" bullets.

- **Active Trackers Panel**:
    - **Doomsday Clock**: Circular progress bar (Time resource). Flashes red on penalties.
    - **Status Overlay**: Tags challenges with effects (e.g., SHOCKED).

- **NPC Stat Diamonds**:
    - Custom Input: Clickable diamonds (1-3) for Action, Guts, Knowledge, Society.

## 3. Interaction Logic
- **Success/Failure Branching**:
    - Sub-view to define logic maps: "If Success -> Scene B", "If Failure -> Scene C (+1 Hour)".

- **Asset Registry**:
    - Manages MacGuffins, Vehicles, and Wild Places.

- **Fortune Master Tips**:
    - Contextual help box appearing during pass transitions.

## 4. Visual Design
- **Aesthetic**: Pulp Adventure / Steampunk (Serial style).
- **Colors**: Deep Red, Crimson, Cream.
- **Textures**: Aged paper.
- **Icons**: Stars (Luck), Shields (Life), Clocks (Time).

## 5. Data Model
```typescript
interface Scene {
  id: string;
  title: string;
  passStatus: { narrative: boolean; mechanical: boolean; usability: boolean };
  challenges: Challenge[];
  branching: { success: string; failure: string };
}

interface Challenge {
  name: string;
  difficulty: 'Basic' | 'Critical' | 'Extreme';
  field: 'Crime' | 'Society' | 'Action' | 'Guts';
  rating: 1 | 2 | 3;
}
```

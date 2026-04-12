# Specification: Mystery Re-configurator (swap_mystery)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Mystery Re-configurator allows DMs to replace a "Mystery Node" (e.g. Node C) with a completely different scenario type (e.g., Dungeon Crawl) while maintaining clue continuity.

## 2. Component Architecture
### 2.1 Core Panels
- **Replacement Wizard**:
    - Select New Type (Dungeon, Heist).
    - Select Script Template.
- **Clue Mapping**:
    - Input: Old Inbound Hooks.
    - Action: Map to New Locations.
    - Input: Old Outbound Leads.
    - Action: Map to New Rewards.
- **Narrative Sync**:
    - Drag-and-drop Recurring NPCs.
- **Transition Guide**:
    - AI-generated pacing advice.

## 3. Interaction Logic
- **Integrity Check**:
    - Prevents finalization if Unmapped Clues exist.
- **Abstraction**:
    - Maps "Nodes" to "Hub Rooms" for dungeon scenarios.
- **Manifest Sync**:
    - Updates global campaign files automatically.

## 4. Visual Design
- **Aesthetic**: Modular / Engineering.
- **Visualization**: Split view (Old vs New).

## 5. Data Model
```typescript
interface SwapConfig {
  originalNode: string;
  newScenarioType: string;
  clueMap: { [oldClueId: string]: string }; // Old -> New Location
  injectedElements: string[];
}
```

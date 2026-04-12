# Specification: Campaign Architect (campaign_prep)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Campaign Architect is a "Master Strategy Suite" component designed for high-level campaign planning. It covers world-building, metaplot tracking, 3-Act structure, caste management, and player integration.

## 2. Component Architecture
### 2.1 Core Panels
- **Metaplot Control Center**:
    - Global parameters: Fantasy Flavor, Tier (1-4), Session Length.
- **Visual Arc Architect**:
    - 3-Act Planner (Gathering Storm -> Path of Thorns -> Crown of Echoes).
    - Tracks "Escalating Stakes".
- **NPC Relationship Matrix**:
    - Database for 5-7 recurring characters (Goals, Quirks, Metaplot Connections).
- **Branching Point Editor**:
    - "What If?" scenarios for major pivot points.

### 2.2 Integration Tools
- **PC Integration Helper**:
    - "Hook Toggles" (Prophecy, Faction, etc.) to link PC backstories.
- **Theme-to-Scene Weaving**:
    - Suggests events based on selected themes (e.g., "Corruption").

## 3. Interaction Logic
- **Flexibility Planning**:
    - The UI flags "Branching Points" where player choice is critical.
- **Adaptation Logic**:
    - Allows DM to pre-plan consequences for major failures/deaths.

## 4. Visual Design
- **Aesthetic**: Authoritative & Strategic (Boardroom / Storyboard).
- **Layout**: Horizontal flow for Acting planning, Vertical for deep dives.

## 5. Data Model
```typescript
interface CampaignState {
  title: string;
  flavor: string;
  tier: string;
  acts: [Act, Act, Act];
  npcs: NPC[];
  branches: BranchPoint[];
  pcHooks: PCHook[];
}

interface Act {
  title: string;
  milestones: string[];
  climax: string;
}
```

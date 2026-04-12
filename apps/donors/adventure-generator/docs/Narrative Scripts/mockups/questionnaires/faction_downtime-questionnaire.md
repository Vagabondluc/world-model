# UI Questionnaire: faction_downtime

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A faction progress tracker using "Clocks" - segmented circular indicators that fill as factions advance their agendas during downtime periods.

## 2. Core Inputs
- **Faction Clock Registry:** Each faction can have multiple clocks representing different goals.
- **Clock Properties:**
    - Clock Name/Goal (e.g., "Seize the Northern Docks").
    - Number of Segments (typically 4, 6, or 8).
    - Current Progress (filled segments).
    - Difficulty DC (optional, for skill-check variant).
- **Resolution Method:** Simple (1d6, fill on 1), Complex (Skill check vs DC), or Blended (1d4, check on 1).
- **PC Involvement:** Tracking how player actions aid or hinder specific clocks.
- **Faction Interconnections:** Which factions are aiding/hindering each other's clocks.

## 3. UI Requirements
- **Visual Clock Display:** Circular or pie-chart clocks with fillable segments for each faction goal.
- **Downtime Roller:** A batch-roll tool that processes all active clocks at once during downtime.
- **Progress Event Logger:** When a segment fills, prompts for "What concrete event occurred?"
- **Completion Handler:** When a clock fills completely, triggers a "Goal Achieved" workflow and auto-creates a new clock.
- **PC Impact Tracker:** Shows which clocks have been affected by player actions this session.

## 4. Derived & Automated Fields
- **Intersection Suggestor:** AI-generated ideas for how completed faction goals intersect with PC activities.
- **Complication Generator:** For failed skill checks in the complex resolution method.

## 5. Exports & Integration
- Faction Progress Report (showing all clock statuses).
- Campaign Timeline (visual representation of faction milestones).
- "Living World" Event Feed for players.

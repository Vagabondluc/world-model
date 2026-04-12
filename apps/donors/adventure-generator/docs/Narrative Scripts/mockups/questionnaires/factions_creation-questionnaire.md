# UI Questionnaire: Faction & Downtime Dynamics

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A strategic dashboard for GMs to manage the "Living World" aspect of a campaign, tracking faction agendas, resolved downtime periods, and the resulting ripple effects on the game world.

## 2. Core Inputs
- **Faction Details:** (Name, Type, Tier 1-4, Leader, Key Agents).
- **Faction Clocks:** (4, 6, or 8 segments depending on project complexity).
- **Conflict Participants:** (Faction A vs Faction B / Wandering Adventurers / Outsiders).
- **Resolution Period:** (Between sessions, Monthly, In-game week).

## 3. UI Requirements
- **Faction Hub:** A directory of all active factions (4-8 recommended) with Tier-based proficiency bonuses clearly displayed.
- **Clock Visualizer:** Interactive radial or linear progress bars showing the segments for each faction's current agenda.
- **Conflict Simulator Console:** A "Roll and Resolve" interface that generates outcomes (Stalemate, Damaged, United) and territory shifts.
- **Downtime Event Log:** A narrative feed that translates "Clock Segments Filled" into concrete city events (e.g., "The Scrappers have secured the Iron Vein").
- **Relationship Web Canvas:** A visual graph showing "Allies" and "Enemies" connections between factions.

## 4. Derived & Automated Fields
- **Tier Proficiency Bonus:** Automatically calculated (Tier 1 = +2, Tier 2 = +3, etc.).
- **Outcome Consequences:** Suggests changes to "Adversary Rosters" and "Dungeon Maps" based on simulator results.
- **PC Interaction Prompts:** Flags which Faction events create "opportunities or obstacles" for the player characters.

## 5. Exports & Integration
- Faction Dossier (Markdown).
- Living City Report (Player-facing Handout).
- Conflict Aftermath Summary.
- Updated Dungeon Map / Adversary Roster (JSON).

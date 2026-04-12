# UI Explanation: Faction & Downtime Dynamics

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Categorical Faction Hub:** A management pane based on the `factions_creation.txt` template. It defines the "Tier" (power level) of each group, which acts as a global variable for their "Proficiency Bonus" in conflict rolls.
- **Segmented Clock Monitor:** A visual representation of the progress-tracking mechanic from `faction_downtime.txt`. It supports 4, 6, and 8-segment clocks, highlighting the "Threshold of Resolution" where a faction achieves its goal.
- **Probabilistic Conflict Sim:** An interactive module based on the `faction-conflict-simulator.txt`. It uses die-roll logic (1d6 for occurrence, random tables for participants and outcomes) to simulate "Living World" changes while the PCs are off adventuring.
- **Intersection Event Engine:** A log that bridges the gap between faction mechanics and player narrative. It follows Rule 4 of the Downtime script: "Intersection Faction Progress with PCs," generating concrete hooks like "Additional enemy waves if initial foes are not swiftly defeated."

## Interaction Logic
- **The "Roll Faction Clocks" Global Action:** A single-button resolution that rolls for all active factions simultaneously (Rule 1: 1d6, segments fill on 1), or allows for "Complex Resolution" via Skill Checks + DC.
- **Dynamic Map Syncing:** Conflict outcomes (Stalemate, Damaged, United) are linked to the "Dungeon State" (Step 10 of Conflict script), suggesting automated updates to maps and encounter tables.
- **Allies/Enemies Cascade:** Filling a clock for one faction automatically triggers checks for their "Allies" (who might progress) or "Enemies" (who might take complications).

## Visual Design
- **Strategic & Schematic:** The UI uses a "Grand Strategy" aesthetic—clean lines, blueprint-style icons, and a clear hierarchy of metadata.
- **Status Contrast:** Active clocks use bright green/amber fill levels, while "Damaged" or "Exhausted" factions are greyed out or have "Cracked" status icons.
- **Web-Based Relationship Graphs:** The Allies/Enemies links are shown as a dynamic node graph (Mermaid style), where line thickness indicates the strength of the bond or rivalry.

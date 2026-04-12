# UI Explanation: raid_prep

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Interactive XP Budgeter:** A mathematical utility that takes the party's level and size to calculate the "Deadly" encounter threshold and then multiplies it by 3x (as per the script's guidelines). It provides a workspace to build "Action Groups" (Easy/Medium squads) that chip away at this budget.
- **Survey Intelligence Matrix:** A hierarchical categorizer that divides the raid location's features (Entries, Rooms, Obstacles, Forces) into four distinct lists based on their visibility/scoutability (Trivial to Impossible).
- **Tactical Layout Layer-Modeller:** A blueprint tool that allows the DM to design the internal layout with specific tactical features like windows for sniping, varied building heights for vantage points, and multiple route options.
- **Defense Hierarchy Stack:** A management tool for placing passive obstacles (locks, traps) and active forces (guards, response teams). It specifically includes "Alarm Logic" to show how many additional squads are attracted when triggered.
- **Objective Tier-Editor:** A field for defining the primary goal (e.g., Rescue) and secondary goals (e.g., Sabotage), allowing for complex, multi-objective raids.

## Interaction Logic
- **Automatic Budget Distribution:** When a CR budget is set, the UI suggests a "Squad Breakdown" (e.g., "Recommend 8 Easy squads and 4 Medium squads to hit your XP target").
- **Survey Risk Assessment:** Selecting a "Challenging" or "Impossible" survey element automatically prompts the DM to define a "Survey Risk" (e.g., "A successful scout requires a DC 18 Stealth check to avoid detection").
- **Blueprint-to-Handout Sync:** Clicking "Generate Handout" automatically creates a version of the blueprint with all "Impossible" elements removed and "Challenging" elements marked with a question mark.

## Visual Design
- **Military Intelligence Aesthetic:** Uses grid-paper backgrounds, tactical icons, and a layout that resembles a mission briefing folder.
- **Data-Driven Visualization:** Uses progress bars for the XP budget and color-coded status circles for the survey matrix.
- **Topographic & Spatial cues:** The layout emphasizes building height and vantage points with specialized icons (e.g., a "Vantage Point" binocular icon).

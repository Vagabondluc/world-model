# UI Questionnaire: raid_prep

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A tactical planning tool for DMs to design comprehensive raid scenarios, focusing on location surveyability,XP budgeting for multiple guard groups, and detailed blueprints.

## 2. Core Inputs
- **Raid Objective:** Primary and tiered goals (e.g., Sabotage, Rescue, Kill/Capture).
- **Raid Location:** Target type and layout features (windows, vantage points).
- **Surveyability:** Categorizing Entries, Rooms, Passive Obstacles, and Active Forces into Trivial, Challenging, or Impossible to scout.
- **Entry Points:** Multiple secured and/or hidden entrance options.
- **Internal Layout:** Multiple routes and hidden tactical elements.
- **Defenses:** Passive obstacles (traps/locks) and Active forces (squads/alarms).
- **CR Budget (D&D Specific):** XP target (3x Deadly) broken down into Medium/Easy groups.

## 3. UI Requirements
- **Objective Tier-Builder:** A section to define the main mission and optional side-objectives.
- **Tactical Map Sketcher:** A blueprint tool with "Layer" support to show surveyable vs. hidden floors/rooms.
- **Survey Matrix Grid:** A spreadsheet-style categorizer for scouted intel (Trivial -> Impossible).
- **Adversary XP Calculator:** A budgeter that takes the "Deadly" XP for the party and auto-calculates the target total (3x), then allows the DM to build "Squads" to fill that budget.
- **Entry/Exit Strategy Panel:** A tool to define various infiltration points and their associated risks/DCs.

## 4. Derived & Automated Fields
- **Raid Difficulty Visualizer:** A 1-10 rating based on the CR Budget and the complexity of the defense layers.
- **Squad Count Recommender:** Suggests the number of Easy/Medium groups based on the total XP budget.

## 5. Exports & Integration
- Raid Intel Folder (DM Notes + Player Blueprint).
- VTT Squad Manifest (NPCs + Statblocks).
- Raid "Execution" File (Pre-filled logic for the running phase).

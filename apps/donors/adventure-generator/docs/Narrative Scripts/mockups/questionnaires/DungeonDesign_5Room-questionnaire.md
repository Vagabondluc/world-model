# UI Questionnaire: 5-Room Dungeon & Narrative Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A dual-mode dungeon design tool that supports both the classic "5-Room Dungeon" structure and the "Narrative Scene" approach, allowing GMs to build compact, impactful adventures with clear pacing and dramatic tension.

## 2. Core Inputs
- **Design Methodology:** (Select: Classic 5-Room vs. Narrative/Flexible Order).
- **Core Theme/Location:** (e.g., Forsaken Sanctuary, Chronomancer's Spire).
- **The Midpoint Twist:** (A field to define the critical disruption).
- **Inciting Incident:** (For the Narrative mode).

## 3. UI Requirements
- **Structure Selector:** A toggle to switch between the 5-Room and Stage-Based frameworks.
- **Room/Scene Command Center:** 5-7 dedicated panels depending on the mode:
    - **Classic:** Entrance, Puzzle, Trick, Climax, Reward.
    - **Narrative:** Prep, Flex Trials, Midpoint, Flex Puzzles, Climax, Resolution.
- **Flex-Order Organizer:** A drag-and-drop interface for "Flex Order" scenes in Narrative mode.
- **Transition Map:** A visual tool to define connections and alternative routes between scenes.
- **Roleplay/Mood Calibration:** Sliders or tags for each room to set Atmosphere, Tension, and Difficulty.

## 4. Derived & Automated Fields
- **Hero Role Spotlighter:** Automatically suggests hazards or traps that highlight specific PC abilities (e.g., "Golems for the Tech PC," "Chessboard for the Scholar").
- **Twist Generator:** Suggests NPC betrayals or environmental setbacks based on the theme.
- **Outcome Brancher:** Generates "Success/Failure" summaries for each challenge to show narrative impact.

## 5. Exports & Integration
- Adventure PDF (Dungeon Map + Key).
- Scene Flowchart (for Narrative mode).
- VTT Map Key (JSON).

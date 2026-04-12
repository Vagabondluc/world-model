# UI Explanation: crafting_scenes

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Dramatic Agenda Header:** A specialized input area that forces the DM to define the "Goal" of the scene before anything else. It prevents aimless roleplaying.
- **The Bang Input/Randomizer:** A high-impact workspace for the "Initiating Action." It includes a library of dramatic hooks (e.g., "An arrow flies past," "A betrayal is revealed").
- **Cast Allocation Grid:** Categorizes NPCs into Leads, Features, and Extras, helping the DM prioritize their performance.
- **Cutter Interface (Sharp Cuts):** A before-and-after view that helps the DM identify where to "Skip to the Good Stuff" and where to "Cut to Black."
- **Obstacle Forge:** A tool to quickly add complexity to a scene, ensuring the players can't just bypass the drama without effort.

## Interaction Logic
- **Filler Elimination:** Automatically suggests "Sharp Cuts" for travel or long rests, replacing them with [ABSTRACT TIME] summaries.
- **Agenda-Based Conclusion:** The UI prompts the DM to "End Scene" as soon as the core Agenda question has been answered (Yes or No).
- **Smooth Transitioning:** Generating the output provides both the "Start Bang" and the "Ending Hook" to lead into the next scene.

## Visual Design
- **Directorial Utility Aesthetic:** Clean, punchy layout reminiscent of a movie script or a stage director's notes.
- **Action-Heavy Color Palette:** Uses high-contrast blacks, whites, and alert reds to emphasize the focus on immediate drama and choices.
- **Clutter-Free Workspace:** Minimizes sensory detail description to focus on the "The Bang" and "The Agenda."

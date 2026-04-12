# UI Explanation: CreateRiddle_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Target Answer Console:** The central focus where the DM inputs the solution. This drives the AI's generation logic.
- **Synchronized Difficulty Panel:** A split-view layout that presents the "Easy" and "Hard" versions simultaneously. This allows the DM to compare the two options and choose the one that best fits their party's current situation.
- **Riddle Engine Refinement:** Individual "Regenerate" buttons for each tier, allowing for localized iteration without resetting both riddles.
- **Solution Verification Box:** A breakdown panel that explains the internal logic or "clues" within the riddle, as required by the script.

## Interaction Logic
- **Direct Variable Mapping:** The user provides the "Answer," and the UI handles the difficulty scaling (e.g., Easy = direct descriptions, Hard = metaphors and paradoxes).
- **Tone-Aware Generation:** Selecting a theme (Dark, Whimsical) shifts the vocabulary of the generated riddle while keeping the "Answer" central.
- **One-Click Export:** Buttons to either take the full set or individual tiers for use in session notes.

## Visual Design
- **Balanced & Informative:** A clean, dual-column layout that prioritizes clarity and comparison.
- **Contrast Markers:** Uses subtle color shading or borders (e.g., Light Gray for Easy, Deep Charcoal for Hard) to distinguish the difficulty levels.
- **Utility-First Header:** Minimizes distraction, keeping the focus on the Answer and the Generate action.

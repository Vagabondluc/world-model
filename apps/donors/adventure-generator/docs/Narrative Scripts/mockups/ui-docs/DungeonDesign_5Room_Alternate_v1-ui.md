# UI Explanation: DungeonDesign_5Room_Alternate_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Stage Navigation:** A vertical timeline acting as the primary navigation. Clicking a "Stage" (e.g., Intro, Flex Block) opens the corresponding editor.
- **Static Scene Editor:** A standard form with fields for Summary, Characters, Setting, Challenge, Outcomes, and Transitions.
- **Flex Block Container:**
    - A special container for Stages 2 and 4.
    - **Draggable Cards:** Each scene is a card that can be reordered via drag-and-drop.
    - **Interchangeable Logic:** Visual indicators showing that these scenes can occur in any order.
- **Global AI Controller:** A floating panel that can "Fill Next Stage" or "Generate Full Adventure Plan".

## Interaction Logic
- **Stage Interconnectivity:** The "Transitions" field in one scene can deep-link to the "Summary" of the next scene if it's a fixed path.
- **Non-Linear Mapping:** In Flex Blocks, transitions are treated as "Entry Points" (how they got here) and "Exit Points" (where to next), allowing for a mesh-like structure.
- **Adaptive UI:** If a scene is marked as "Combat Heavy", the Challenge field expands to show Encounter Difficulty (CR) calculation tools.

## Visual Design
- **Theme-Sync:** Background tints change based on the selected Stage (e.g., red for Climax, blue for Epilogue).
- **Responsive Layout:** Timeline collapses to a breadcrumb menu on smaller screens.

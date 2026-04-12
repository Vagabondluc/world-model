# UI Explanation: dungeon-features-summarizer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Global Preset Header:** Allows loading pre-defined sets (e.g., "Frozen Fortress", "Infected Hive").
- **Grid Layout:** 
    - **Physical Attributes:** Wall material, floor type, ceiling height, corridor width.
    - **Sensory Factors:** Light level, temperature, ambient sound/smell.
    - **Architectural Details:** Common door types (locked/unlocked/trapped), secret passage frequency.
- **Reference Card Preview:** A stylized, formatted text block that updates in real-time as inputs are changed.

## Interaction Logic
- **Linked Parameters:** Changing the "Base Style" to "Cave" might automatically set walls to "Unworked Rock" and floors to "Uneven Earth" as a smart default.
- **RNG Buttons:** Each individual feature has a "DICE" icon to randomize just that specific element based on the Global Preset's weighting.
- **AI Sync:** The "AI Sync All" button attempts to bridge the features with the current dungeon narrative context.

## Visual Design
- **Information Density:** High density, low friction. Designed for quick scanning during live gameplay.
- **Markdown Highlighting:** The Reference Card uses bolding and bullet points to ensure the DM's eyes hit the key words first.

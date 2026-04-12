# UI Explanation: Pointy Hat Dungeon Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Theme-First Workspace:** The UI is architected around the "One-Word Theme." Entering the theme in Step I triggers the "Thematic Bridge" which affects the suggested inputs for everything from Mechanics to the Ending.
- **The Step-by-Step Flow:** A linear but editable set of five containers, ensuring the GM follows the "Pointy Hat" logic of building outward from a core concept.
- **Thematic Consistency Auditor:** A background service that checks keywords in Step IV (Encounters) against the Theme and Mechanics in Step I/II to ensure a cohesive immersion.
- **Encounters & Synthesis Logic:** A specialized editor for Step V that helps the GM "synthesize" the theme, mechanics, and narrative into a single climactic event.

## Interaction Logic
- **Step-Unlocked Progression:** While the GM can jump between steps, the UI visually emphasizes the sequential nature of the method, requiring a completed Theme before Mechanics are suggested.
- **Auto-Thematic Suggestions:** Clicking "Autosuggest" next to the Theme field provides a list of Mechanics, Goals, and Encounter types that historically or narratively fit that theme.
- **Editable & Persona-Based:** Reflecting the script's requirement for being "Editable and savable," the UI allows for custom mechanic blocks that can be reused across different dungeons.

## Visual Design
- **Thematic & Evocative:** The UI skin can change subtly based on the "One-Word Theme" (e.g., 'Decay' adds a textured, distressed look; 'Ice' adds a cool blue tint).
- **Clean Focus:** Minimizes distractions to keep the GM focused on the narrative and mechanical harmony.
- **Synthesis Visualization:** The final "Ending" step is visually wider and more prominent, signifying it as the culmination of all previous design choices.

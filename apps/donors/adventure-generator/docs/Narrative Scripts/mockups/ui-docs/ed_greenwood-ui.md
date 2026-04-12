# UI Explanation: Persona Manager (ed_greenwood)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Persona Context Header:** Displays the active persona identity, domain expertise, and a brief "Motive" (e.g., "Bring epic adventures to life").
- **Dynamic Parameter Console:** Slider-based inputs for Temperature (Scaling between 0.1 for Lore accuracy and 1.0 for creative prose).
- **Prose Analytics Panel:** A real-time word counter with a progress bar targeting the "800+ Words" script requirement. 
- **Layered Artifact Gallery:** Visual slots for DALL-E generated characters and scenes, alongside structured data tables for magic items and NPCs.

## Interaction Logic
- **Task-Based Temp Auto-Switch:** The UI automatically suggests a temperature shift if the user switches from "Research Lore" to "Draft Narrative".
- **Structured-Only Toggle:** A footer switch that restricts the AI to the "Brief Bullet Point" summary mode mentioned in the script.
- **Investigation Pulse:** A visual indicator that activates when the AI is processing external web links provided by the user.

## Visual Design
- **Literary & Sophisticated:** Uses serif typography (resembling an old manuscript), earthy color palettes (Parchment, Ink-Black, Gold), and soft border shadows.
- **Content-First Layout:** Maximizes the central prose area to accommodate long-form storytelling.
- **Status Icons for Logic:** Small "Parchment" icons for world-building details and "Crossed Swords" for cause-and-effect conflict chains.

# UI Explanation: SceneDescriptor_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Context Configurator:** The top section where the DM defines the "What and Where." It anchors the AI's descriptive style to the chosen Genre and Location.
- **Entity & Event Ledger:** A dedicated space to list the "Chess Pieces" (NPCs/Objects) and the "Momentum" (Goals/Events) of the scene.
- **Atmospheric Palette:** A structured sensory input board. It ensures the resulting prose isn't just visual, but engages sound, smell, and feeling.
- **Dual-View Narrative Engine:**
    - **Vivid Player Description:** The output of the expanded bullet points, focused on immersion.
    - **GM Strategy Panel:** The mechanical and tactical side of the scene, derived from the same inputs.
- **Refinement Controls:** Buttons for "Regenerate Prose" allow for tone shifts without losing the core information.

## Interaction Logic
- **Bullet-to-Prose Transformation:** The core feature is taking raw facts (e.g., "It's raining," "Gargoyle is there") and weaving them into the specific [EXPLANATION OF BULLET POINTS] required by the script.
- **GM Integration:** The system identifies mechanical keywords (like "AC," "Trapped," or "Goal") and automatically moves them into the "Key Points for Running" section.
- **Consistency Auditor:** Ensures that if a "Chalice" is mentioned in the Entities, it appears naturally in both the Player Description and the GM notes.

## Visual Design
- **Authorial & Immersive:** Uses a clean, serif font style for the "Player Description" sections to distinguish them from the utility/input sections.
- **Status Indicator Colors:**
    - **Blue:** Narrative/Atmospheric inputs.
    - **Amber:** GM-only mechanical notes.
- **Pacing Cues:** Short, punchy labels that encourage the DM to provide "Vivid" rather than just "Functional" descriptions.

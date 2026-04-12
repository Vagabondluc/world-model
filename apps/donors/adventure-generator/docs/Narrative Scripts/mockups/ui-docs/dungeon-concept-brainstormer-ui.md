# UI Explanation: Dungeon Detail & Expansion Suite

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Multimodal Workflow Hub:** A top-level switch that allows the GM to shift focus between high-level brainstorming (Step 1-7 of Concept script), structured room-building (JP Cooper method), and micro-level sensory detailing (Corridor and Features scripts).
- **Interactive Concept Pod:** A specialized workspace for Step 2-4 of the Concept Brainstormer. It uses "Monster Manual Scan" and "Location Twist" tools to help the GM find a cohesive "Denizens + Location + Goal" triad.
- **The 10-Room Wizard (Conversational):** A focused, one-prompt-per-step interface that implements the "JP Cooper 10 Room Dungeon" logic. It provides "Pro Tips" and "Logical Follow-Through" as the GM enters ideas or asks the script to "Roll."
- **Sensory Detail Matrices:** A dense collection of inputs for Step 2 of the Corridor script and the Features Summarizer, ensuring at least three senses are addressed per area.
- **Structural Non-Linearity Auditor (Xander-Tools):** A panel based on the "Xandered Dungeon Designer" that checks for "Loops," "Elevation Shifts," and "Discontinuous Connections" in the overall dungeon plan.

## Interaction Logic
- **"Roll X Ideas" Logic:** Buttons embedded in every field allow the GM to ask the AI to generate multiple options (as per Step 1 of the JP Cooper script), either randomly or based on a specific "Genre/Literary Work."
- **Logical Chain Validator:** (JP Cooper Step 3) A background process that checks if the new input (e.g., Room 4 hint) contradicts the established Theme (Room 1).
- **Thematic Bleed:** Themes established in the "Global Features Summary" automatically prepopulate the "Corridor Theme Generator" to maintain atmospheric consistency.

## Visual Design
- **Dense but Organized:** The UI uses a "Control Center" aesthetic with multiple collapsible modules. Information is categorized logically as per the Features Summarizer (Step 5).
- **Progressive Disclosure:** Advanced Xandering techniques (Step 1-10 of Xandered script) are hidden behind an "Advanced Structural" tab to avoid overwhelming the user during basic brainstorming.
- **Visual Roll-Results:** Tables (Step 5 of Corridor script) are displayed with clickable cells for manual overrides.

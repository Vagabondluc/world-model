# UI Explanation: dungeon-room-designer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Header Section:** Room ID, Type selection, and AI seed control.
- **Physical Traits Panel:** Inputs for dimensions, shape, and base materials.
- **Dynamic Content Grid:**
    - **Interactive Element Manager:** A list where users can add/remove objects. Each object has a type (Trap, Treasure, Ornament, Mechanism).
    - **Sensory Palette:** A checklist of the 5 senses. At least 3 must be selected to "pass" the design audit.
- **"The Curiosity Bench":** A dedicated space for the 2 required "Irrelevant Details" that add life to the room.
- **Reaction Planner:** A table for the DM to note how the room responds to common player actions (Search, Detect Magic, Investigate).

## Interaction Logic
- **Sensory Audit:** A visual progress bar that turns green once 3 senses are described.
- **AI Narrative Engine:** A "Draft Description" button that synthesizes the Room Type, Interactive Elements, and Senses into a coherent 2-4 sentence of "Boxed Text".
- **Template Library:** Users can save "Room Archetypes" (e.g., "Standard Crypt Room", "Boss Ante-chamber").

## Visual Design
- **Card-Based UI:** Each section (Senses, Interactions, Features) is encapsulated in a clean card with a distinct icon.
- **Inline Validation:** Red icons appear on sub-sections that haven't met the minimum requirements (e.g., "Need 1 more interactive element").

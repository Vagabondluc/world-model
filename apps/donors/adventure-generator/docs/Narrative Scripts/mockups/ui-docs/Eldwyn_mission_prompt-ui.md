# UI Explanation: Westmarsh & Eldwyn Campaign Suite

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Eldwyn Guild Hub:** A unified command center for GMing in the 'Westmarsh' style. It separates the "Public" (Mission Board, NPC Profiles) from the "Private/Procedural" (Adventure Matrix, Travel System).
- **Mission Codification Studio:** A rigid editor based on the "Mission Codification Guide" (Step 1-67). It enforces standardized IDs, Tags, and Tier-based rewards.
- **Recursive Adventure Matrix:** A specialized 5x4 grid that uses the "Rail Road Quest Generator" logic. It allows the GM to "Submit and Expand" outlines from 80 to 120 words after user confirmation.
- **Drama-Centric Travel (TES) Module:** A UI based on the "Pointy Hat Traveling Event System." It ignores "Realism" (food/rations) in favor of color-coded "Drama" events (Red, Blue, Yellow, and Combos).
- **Surface-Level NPC Profiler:** A bilingual-ready (Fr/En) tool for Step 1 of the NPC script, ensuring players only see the "Surface" traits (Name, Job, Look, Persona) while hiding GM secrets.

## Interaction Logic
- **Tier-Synched Rewards:** Selecting a "Rank" (e.g., Silver) automatically populates the "Rewards" field with the correct GP range and Magic Item roll from the script's reward table.
- **Seed-to-Story Generation:** The Matrix Console transforms numeric seeds (1-6) into integrated narrative outlines, allowing for rapid generation of "Adventure Hooks."
- **The "Drama" over "Realism" Travel Toggle:** Selecting distance (Close/Far/Very Far) automatically calculates the number of events (1, 2, or 3) and suggests color-coded combos (e.g., Purple for Roleplay/Combat).

## Visual Design
- **Rugged & Industrial:** The UI uses a "Mining Town" aesthetic—cold greys, industrial steel borders, and rugged textures reflecting the Eldwyn setting (Sweden/Quebec-like climate).
- **Categorical Color Coding:** Missions and Travel Events are color-coded (Red/Blue/Yellow) for instant "Glance-ability" during a session.
- **Public-Facing Cards:** The NPC and Mission outputs are designed as "Cards" that the GM can drag-and-drop into a player chat or campaign board.

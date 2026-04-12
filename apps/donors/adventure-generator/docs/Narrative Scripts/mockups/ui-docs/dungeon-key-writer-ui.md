# UI Explanation: Dungeon Architecture & Keying Suite

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Dual-Pane Synchronizer:** The core of the UI. The "Spatial Map Canvas" handles map design (Step 1-11 of Creator script), while the "Narrative Key Sidebar" handles documentation (Step 1-10 of Designer and Key Writer scripts).
- **Xandering Design Module:** A specialized toolbar for the Map Creator's Step 7, allowing for easy placement of "Elevation Shifts," "Discontinuous Connections," and "Non-linear Loops."
- **Sensory Prompt Studio:** A rigid UI structure for Step 5 of the Room Designer, requiring the GM to input 3 sensory details and 2 irrelevant-but-cool details before a room is marked "Complete."
- **Logical Room Hierarchy:** An automated numbering system that keeps the Map and Key in sync. Re-numbering a room on the map instantly re-orders the Key.

## Interaction Logic
- **Symbol-to-Key Translation:** Drawing a "Secret Door" or "Trap" on the map automatically adds a dedicated "Element" entry in the corresponding Room Key.
- **Tactical Denizen Manager:** A sub-panel for Step 4 of the Key Writer, where the GM can record combat stats, behavior notes (e.g., "Ambushers," "Cowardly"), and carried treasure.
- **Treasure Aggregator:** A real-time summary tool (Step 6 of Key Writer) that watches the "Treasure" field in all rooms and builds a master loot table for the dungeon.

## Visual Design
- **Drafting & Blueprint Esthetic:** High-precision graph-paper background for the canvas, with clean, professional typography for the Key.
- **Visual Xandering Audit:** A "Heat Map" mode that highlights how well connected the dungeon is, flagging "Dead Ends" vs "Loops" to ensure non-linear exploration.
- **Interactive Legend:** A sidebar that populates as the GM uses different map symbols, acting as a visual glossary for the dungeon.

# UI Explanation: dungeon-map-creator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Interactive Canvas:** A vector-based drawing area where Rooms are nodes and Corridors are links.
- **Xandering Toolbar:**
    - **Add Loop:** Automatically connects two distant nodes to prevent linear pathing.
    - **Secret Path:** Adds a hidden link with specialized "Secret Door" markers.
    - **Elevation Shift:** Adds stairs or ladders to transition between layers.
- **Layer Manager:** A tabbed system to handle multiple dungeon levels (Under-Level, Attic, Hidden Vault).
- **Legended Properties Panel:** When a room is selected, detail fields (Name, Shape, Flow) appear.

## Interaction Logic
- **Bi-Directional Sync:** Adding a room to the Map Creator immediately reserves a slot in the Key Writer with the same number.
- **Smart Snap:** Room nodes snap to the grid based on the chosen Scale (5ft/10ft).
- **Flow Visualization:** An optional overlay that colors the paths based on "Distance from Entrance" to help the DM identify "bottlenecks".

## Visual Design
- **Drafting Vibe:** Uses a blueprint-style background (Grid paper or dark blue schematic).
- **Symbol Library:** Drag-and-drop icons for classic map elements (Pits, Statues, Altars).
- **Legend Export:** Automatically generates a separate "Map Legend" document based on the symbols used on the canvas.

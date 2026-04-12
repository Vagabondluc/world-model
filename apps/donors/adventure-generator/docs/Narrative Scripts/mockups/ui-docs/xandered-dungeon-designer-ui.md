# UI Explanation: xandered-dungeon-designer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Non-Linear Canvas:** A topological mapping area where nodes (rooms) and edges (paths) are managed. Unlike the Map Creator, this focuses purely on *how* rooms connect, not their physical shape.
- **Xander Toolbar:**
    - **Loop Tool:** Automatically identifies the shortest path between two non-adjacent nodes and suggests adding a connecting door or corridor.
    - **Vertical Switch:** Adds level-to-level transitions (e.g., Pit, Elevator).
    - **Discontinuous Link:** Adds a "teleport" or "skip" path (like a secret chute from Lvl 1 to Lvl 4).
- **Landmark Manager:** A palette of "Mega-Features" that give players a sense of direction (e.g., "The Giant Chandelier", "The Red River").
- **Complexity Auditor:** A real-time meter that calculates "Non-Linearity". Higher scores indicate more "Xandered" designs.

## Interaction Logic
- **Verification Engine:** A "Verify Navigation" button that simulates party movement to ensure no area is a permanent dead-end and that multiple paths exist to major goals.
- **Elevation Overlay:** Toggleable layers that show how rooms on different floors physically stack, helping to place vertical chutes and stairs logically.
- ** Landmark Placement:** Drag-and-drop landmarks onto nodes. These landmarks auto-populate the "Boxed Text" in the Room Designer.

## Visual Design
- **Flowchart Aesthetic:** Brightly colored lines represent different connection types (Blue = Standard, Gold = Secret, Red = One-Way).
- **Landmark Icons:** Large, distinct icons that stand out on the topology graph to act as visual anchors.

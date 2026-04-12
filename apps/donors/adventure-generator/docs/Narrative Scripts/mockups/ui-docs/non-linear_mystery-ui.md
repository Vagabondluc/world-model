# UI Explanation: non-linear_mystery

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Framework Template Library:** A sidebar that allows DMs to swap between the five core structures (Conclusion, Funnel, Layer Cake, Loop, Dead End). Each selection completely reorganizes the Node Graph.
- **Interactive Structural Graph:** A visual editor that enforces the selected framework's logic (e.g., in a "Loop" it ensures every node has inbound leads from at least two others).
- **Proactive Trigger Console:** A focused area to design the "Safety Net" event for each node, ensuring players never reach a full stalemate.
- **Dead-End Decorator:** A specialized sub-menu for the Dead End tool, allowing DMs to define the "Compensatory Reward" (Lore/Item) that players find there.
- **Automated Filename Formatter:** A passive background system that applies the script's exact nomenclature (e.g., `_Conclusion_D.txt`) to every file based on its structural role.

## Interaction Logic
- **Neck-Node Validation:** In use of the "Funnel" structure, the UI highlights "Neck" nodes that require specific gateway clues to advance.
- **Loop-Break Logic Builder:** An interactive setting that lets the DM define the "Exit Condition" for a loop (e.g., "When the secret of the basement is revealed, reveal Node G").
- **Layer Cake Drill-Down:** Allows the DM to view the mystery as vertical layers, making it easier to manage "Depth" and "Surface level" investigation separately.

## Visual Design
- **Blueprint-Style CAD Layout:** Focused on structure and flow, using geometric icons for different node types.
- **Animated Connectivity Lines:** Connection lines pulse or change color to indicate "Essential Paths" vs. "Ancillary Leads."
- **Nomenclature Ribbon:** A visible footer that shows the exact filename that will be generated for the currently selected node.

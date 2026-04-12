# UI Explanation: 5_node_mystery

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Interactive Node Graph:** The centerpiece is a visual representation of the 5-node structure. It map out the progression from the Hook (A) through the investigation nodes (B, C, D) to the Climax (E).
- **Scenario Profile Editor:** A structured form to define the "Who, What, Why, and How" of the mystery, ensuring the AI stays focused on a consistent core truth.
- **Link & Clue Matrix:** A specialized tool that tracks clues within each node and validates that they point to the correct subsequent nodes, enforcing the Three Clue Rule.
- **Node Generation Manager:** Controls the creation and naming of the the individual `.txt` files for each node, ensuring they correctly reference the master scenario.

## Interaction Logic
- **clue-Driven Navigation:** Clicking a connection line in the graph shows the specific clues that lead from one node to the next.
- **Consistency Scrubber:** A post-process tool that scans all five nodes to ensure character names, timelines, and physical evidence are consistent across the entire scenario.
- **Dynamic Node Swapping:** If the DM wants to change Node C from an "Alleyway" to a "Library," the UI helps re-route the clues from A, B, and D accordingly.

## Visual Design
- **Investigation Board Aesthetic:** Uses a "Pinboard with Red String" visual metaphor for the node graph.
- **Status Icons:** Symbols for "Missing Clue" (Warning triangle), "Valid Path" (Checkmark), and "Ancillary Secret" (Magnifying glass).
- **Noir Layout:** High-contrast, clean typography that feels like a detective's dossier.

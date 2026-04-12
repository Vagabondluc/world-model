# UI Explanation: node_cloud_mystery

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Hierarchical Cloud Visualizer:** A sophisticated node-map that manages 10-20 scenes. It uses a force-directed graph to show relationships, allowing the DM to see clustering of clues and "Information Choke Points."
- **Temporal Event Slider:** A horizontal timeline manager that tracks the progression of the mystery in "Real Time." DMs can slide to different days/hours to see how the status of nodes changes if the players take no action.
- **Redundancy & Source Matrix:** A data-table that lists every "Core Truth" of the mystery and lists the 3+ different nodes where it can be discovered, ensuring the investigation is robust against player failure.
- **Faction & NPC Overlay:** A specialized filter for the map that highlights nodes influenced by specific organizations or where key NPCs are currently stationed.
- **Reactive State Manager:** A logic-builder for the "Reactive Nodes." It allows the DM to set conditional results based on player intervention (e.g., "If Node 4 is cleared, the Security in Node 10 increases").

## Interaction Logic
- **Pathfinding Simulation:** The UI can simulate random "investigation paths" to ensure that players starting at any of the 3-5 entry points have a logical route to the solution.
- **Recursive Content Generator:** When a new node is added to the cloud, the UI automatically prompts for the "Three Connections" and "Core Clue" required by the script.
- **Dynamic Timeline Updates:** If players interact with a node early, the DM can click "Intervene," and the system re-calculates the future timeline events accordingly.

## Visual Design
- **Web of Intrigue Aesthetic:** Uses a clean, dark-interface with glowing node connections. It’s designed to look like a high-tech "Crime Board."
- **Color-Coded Nodes:** Different shapes or colors indicate Node Types (Location, Person, Event) and Influence (Faction colors).
- **Scaleable Interface:** Supports smooth zooming from a macro "Entire City" view down into one specific "Crime Room" node.

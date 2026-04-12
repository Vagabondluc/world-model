# UI Explanation: Megadungeon Campaign Planner

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Vertical Hierarchy Navigator:** A specialized UI element (usually a vertical breadcrumb or stack) that represents the 10-20 levels. This allows the GM to maintain a high-level view while editing granular level themes.
- **Faction Territorial Dashboard:** A modular grid that tracks faction relations and territory. It uses the "Faction Framework" (Step 4 of the script) to drive encounter types on each level.
- **Dungeon Ecosystem Modeler:** A set of logical inputs for "Internal Economy" (Step 5). It visualizes how food, water, and monsters move between levels, ensuring the dungeon feels alive and coherent.
- **Quest-Arc Timeline:** A multi-step progress tracker for "Storylines" (Step 6) that span multiple levels, helping the GM track clues and mystery milestones.
- **Dynamic Restoration Engine:** A specialized panel for Step 9, allowing the GM to record "Cleared Areas" and providing AI-driven suggestions for how those areas "Change over time" or "Restock."

## Interaction Logic
- **Depth-Based Auto-Difficulty:** As the GM moves deeper into the levels, the UI automatically escalates the "Difficulty Progression" (Step 7), suggesting more extreme hazards and legendary artifacts.
- **Faction Dynamics Sidebar:** When inspecting a level, the UI shows which faction currently controls it and how their inter-faction dynamics might spill over into player encounters.
- **Sync-to-Campaign Hooks:** A dedicated area for Step 10, linking dungeon events back to the "Outside World" and established campaign hooks.

## Visual Design
- **Grand & Comprehensive:** The UI uses a wide-screen layout with multiple sidebar zones to accommodate the high information density. Color palettes are dark and metallic, evoking a subterranean feel.
- **Heat-Mapped Difficulty:** Levels in the navigator are color-coded (Green to Purple/Black) to represent the "Difficulty Progression."
- **Nodal Level Mapping:** Connections between levels (Step 2) are visualized using an interactive node-graph, allowing the GM to see "Secret Stairs" or "Collapsed shafts" at a glance.

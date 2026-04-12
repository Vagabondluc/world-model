# UI Explanation: city_gazetteer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Hierarchical District Navigator:** A permanent sidebar that allows the DM to quickly switch between neighborhood datasets. Each district acts as an independent "Page" in the gazetteer.
- **Template-Driven Entry Editor:** Enforces the script's specific structure (Landmarks, Services, Adventure Sites, Transportation) for every location added to the city.
- **Transit Network Visualizer:** Tracks how the districts connect. It includes specialized metadata for "Advanced" transit types like aerial cable cars or magical portals.
- **Live Scenic Interaction Module:** A dedicated tool for generating "Slices of Life." It features a d6 roller that automatically pulls from a pool of 20-30 non-combat encounters specific to the active district.
- **Chronological Background Tracker:** A horizontal timeline or list that monitors events occurring elsewhere in the world. It provides "Local News" snippets (Newspapers, Broadcasts) for the DM to drop into the game.

## Interaction Logic
- **Incremental Expansion:** The UI is designed to be "Living." DMs can add new districts or landmarks mid-campaign without disrupting existing data.
- **Context-Aware Encounters:** When the DM clicks "Check Encounter," the system prioritizes events that fit the *current* district's character (e.g., more "Lost Travelers" in the Docks, more "Political Arguments" in the Citadel).
- **Archive System:** A "Version History" tab allows the DM to see how the city has changed over the course of the campaign (e.g., following a fire or a political coup).

## Visual Design
- **Encyclopedic Utility:** A high-density, structured layout resembling a digital atlas or a wiki.
- **Color-Coded Districts:** Each district header has a unique color or icon to help the DM orient themselves visually while multitasking.
- **Sensory Highlights:** Key landmarks and encounters feature bolded "Narrative Keywords" to help with immediate improvisational description.
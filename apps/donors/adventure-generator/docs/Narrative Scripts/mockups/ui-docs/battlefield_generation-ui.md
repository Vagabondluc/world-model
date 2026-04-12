# UI Explanation: battlefield_generation

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Interactive Element Matrix:** The core workspace where 40 unique tactical elements (8 per category) are defined. It allows the DM to build a "Thematic Palette" for their setting.
- **Randomization Engine:** A visual 3x5 grid that performs the actual "Selection Logic" of the script. Each number in the matrix is an index that pulls a specific element from the library.
- **Dynamic Scenario Synthesizer:** A narrative editor that takes the five indexed elements and weaves them into a "Cohesive Battlefield." It includes dedicated fields for Sensory Details and Tactical Considerations.
- **Role-Based Tactical Overlay:** Provides specific advice for different PC types (Melee, Ranged, Spellcasters) based on the interaction of elevations and cover.
- **Atmosphere & Sensing Modals:** Specialized tabs for "Vivid language" and "Sensory details" to help the DM narrate the environment effectively.

## Interaction Logic
- **Procedural Workflow:** The UI follows the script's 3-step process (Table -> Matrix -> Battlefields) to ensure logical progression.
- **Manual Overrides:** While the matrix is randomized, the DM can manually click a number to swap a specific element (e.g., changing index 3 to index 5 to better fit a mid-session twist).
- **Consolidated Manifest:** Generating the output creates a single document containing the Full Table, the Matrix, and the 3 distinct descriptions for easy session use.

## Visual Design
- **Tactical Grid Aesthetic:** Uses a clean, high-contrast layout that mimics a wargame command-center or VTT asset-manager.
- **Column-to-Matrix Linking:** Visual lines or color-matching help the DM see exactly which element in the "Cover" column corresponds to the "3" in "Row 1" of the matrix.
- **Status Icons:** Uses icons for common terrain types (Mountain for Elevation, Wall for Hard Cover, Cloud for Soft Cover) to improve scannability.
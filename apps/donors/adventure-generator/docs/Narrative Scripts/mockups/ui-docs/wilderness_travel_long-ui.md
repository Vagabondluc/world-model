# UI Explanation: wilderness_travel_long

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Multi-Tab Workspace Navigation:** Organizes the 14+ sections of the script into logical workstreams:
    - **Foundation:** Biomes and Factions.
    - **Systems:** Travel Mechanics, Survival Challenges, and Equipment.
    - **Content:** Encounter Design and Linked Sequences.
    - **Appendices:** Maps, Stat Blocks, and Quick References.
- **Sequence Visualizer (Logic Flow):** A tool specifically for the 6-8 (Common) results. DMs can drag scenes to create "Mini-stories" that unfold over multiple travel days.
- **Seasonal Weather Matrix:** A calendar-based input where the impacts on navigation, speed, and foraging are automatically calculated based on the current "Month".
- **Scene Anatomy Editor:** Replaces the standard text box with structured fields for "Entrance," "Challenge," "Reward," and "Exit," forcing the DM to follow the systematic approach.
- **Scaling Dashboard:** A global slider that adjusts all DCs, CRs, and Hazard Damage across the entire chapter simultaneously.

## Interaction Logic
- **Mini-Story Linkage:** If a PC handles "Scene 1" of a sequence peacefully, the UI suggests a "Grateful NPC" path for "Scene 2". If they were hostile, it suggests a "Retaliation" path.
- **Exhaustion Simulation:** A "Simulate Trip" feature that calculates the average number of exhaustion checks and HP lost for a party of [X] level over [Y] days.
- **Inventory/Gear Impact:** Equipping "Essential Gear" in the UI automatically adds bonuses to the underlying survival roll simulations.

## Visual Design
- **Encyclopedia Aesthetic:** Designed to look like a professional RPG layout (multi-column text, sidebar boxes, call-to-action alerts).
- **Functional Density:** High information density, but managed through progressive disclosure (expandable sections).
- **Status Indicators:** Icons for "Linked Sequence" (Chain-link), "Hazard" (Danger triangle), and "Plot Advancement" (Book icon).
- **Thematic Consistency:** The UI "Theme" (color palette and icons) shifts when a different Biome is selected (e.g., Ice-blue for Arctic, Sandy-tan for Desert).

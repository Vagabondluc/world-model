# UI Explanation: Eldwyn Campaign Nexus (Eldwyn_instant_generator)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Setting Reference Header:** A persistent context block that defines the "Mining Town / Cold Terrain" aesthetic, grounding all generated content in the Westmarsh flavor.
- **Quad-Adventures Matrix View:** A layout that displays 4 simultaneous adventure outlines generated from the 5x4 internal number matrix, allowing for quick selection and comparison.
- **Progressive Narrative Expander:** A button-driven interface that transitions from the initial "80 Word Mode" to a more detailed "120 Word Mode" upon user confirmation.
- **Cause-and-Effect Relationship Map:** A sub-view that explicitly links Hooks, Threats, and Intrigues to their story consequences, as requested by the script instructions.

## Interaction Logic
- **Seed-to-Story Visualization:** Each adventure card displays the "Matrix Seed" (e.g., [3-1-4-2-6]) used to pull from the 5x6 master table, ensuring transparency in the procedural generation.
- **Named Entity Tracking:** The UI highlights every named NPC and their occupation, providing a quick reference sheet for the DM.
- **Matrix Regeneration Loop:** A recursive interaction flow where the user can "Regenerate Matrix" to explore new combinations while the system increments the narrative detail level.

## Visual Design
- **Rustic & Cold Mining Aesthetic:** Uses cool blues, frosted glass effects, and industrial metallic accents.
- **Compact Card Layout:** Designed to present multiple high-level plots at once without overwhelming the DM.
- **Functional Typography:** Large clear headers for Adventure Titles, with dense, technical-style text blocks for the 120-word expanded narratives.

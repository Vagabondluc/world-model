# UI Questionnaire: battlefield_generation

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A procedural battlefield architect that generates tactically rich combat environments using a matrix of terrain, cover, and danger elements.

## 2. Core Inputs
- **Thematic Setting:** (e.g., Arctic Wastes, Arcane ruins, Volcanic caves).
- **Complexity Level:** Number of distinct elements per category.
- **Randomization Seed:** (Optional) To reproduce a specific number matrix.
- **Battlefield Element overrides:** Optional user-defined elements for Elevations, Difficult Terrain, Hard/Soft Cover, and Dangers.

## 3. UI Requirements
- **Element Library Manager:** 5 columns for Elevations, Difficult Terrain, Hard Cover, Soft Cover, and Dangers (8 items each).
- **Matrix Configurator:** A 3x5 grid showing the randomized indices (1-8) used to build three distinct battlefields.
- **Battlefield Previewer:** A tabbed interface to view the three generated battlefields (Summary, Tactics, Sensory Details).
- **Tactical Roles Analyzer:** A specialized view showing how Melee, Ranged, and Spellcaster characters can exploit the generated terrain.
- **Sensory Palette Editor:** Tools to refine the "Vivid language," "Visions," "Sights," and "Smells."

## 4. Derived & Automated Fields
- **Cohesion Engine:** Automatically weaves the 5 disparate elements (from different indices) into a single, logical narrative description.
- **Indices-to-Text Mapper:** Pulls specific descriptions from the Element Library based on the Number Matrix.
- **Tactical Summary Generator:** Distills the complex interaction of elements into 3-5 key "Battlefield Dynamics."

## 5. Exports & Integration
- Battlefield Tactical Dossier (Markdown).
- VTT Map Legend (JSON).
- Printable Sensory Reference Cards.
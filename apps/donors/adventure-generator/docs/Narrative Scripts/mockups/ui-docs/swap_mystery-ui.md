# UI Explanation: swap_mystery

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Scenario Re-Type Wizard:** A high-level selector that lets the DM switch the "Genre" of a mystery segment (e.g., from Investigation to Dungeon Crawl). It provides a list of applicable external scripts (heist_prep.txt, etc.) to handle the new content.
- **Clue Mapping & Bridge Tool:** A critical utility that tracks the "Hooks" into and out of the mystery. It allows the DM to specify which room or person in the *new* structure inherits the clues from the *old* structure.
- **Campaign Manifest Synchronizer:** A background process that updates the master `5x5Campaign_Overview` and `InterMysteryConnections` files to reflect the structural change, ensuring the "Grand Web" isn't broken.
- **Narrative & NPC Injector:** A specialized workspace that allows the DM to "drag and drop" recurring campaign elements (NPCs, Motifs) into the new scenario structure, ensuring continuity.
- **Transition Guide Editor:** A dedicated space for the AI to generate pacing and style-of-play advice for the GM, helping them manage the shift between a mystery and a more action-focused scenario.

## Interaction Logic
- **Interactive Integrity Checks:** If the DM tries to finalize the swap without mapping all essential clues, the UI provides a list of "Broken Connections" that need to be resolved.
- **Node-to-Area Abstraction:** For linear scenarios (like dungeons), the UI creates "Hubs" or "Key Rooms" that act as the structural equivalents of the 5 nodes, making it easier to track information flow.
- **One-Click Manifest Updates:** Pressing "Update Campaign" handles the tedious task of editing multiple text files across the project directory.

## Visual Design
- **Configuration & Engineering Aesthetic:** Uses a "Modular" visual style, suggesting that mysteries and scenarios are interchangeable "Parts" of a larger machine.
- **Visual Mapping Lines:** Shows the before-and-after of clue locations using split-view sideboards (Old Mystery vs. New Scenario).
- **Audit Tooltip:** Hovering over a connection shows its source and destination to ensure logical flow.

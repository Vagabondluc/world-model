# UI Explanation: Quick NPC Reference Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Snap-Generation Prompt:** A single, centralized input where the DM types a basic seed (e.g., "Tiefling Merchant") to trigger the script's logic.
- **Constraint-Driven Table Editor:** The core of the UI. It mirrors the script's 9-category requirement. Each cell is designed to encourage one-sentence brevity to keep the reference "fast."
- **"Unexpected Detail" Highlighter:** A dedicated, high-contrast box for the "One unexpected detail" requirement, ensuring the NPC stands out from generic archetypes.
- **Narrative Deep-Dive Studio:** A secondary editor for the longer description that adds depth beyond the table, useful for preparing NPCs ahead of time.
- **Roleplay Dashboard (View Mode):** A "Read-Only" mode that transforms the edit grid into a clean, aesthetic card for use during a live session.

## Interaction Logic
- **Brevity Enforcement:** The UI uses character limits or visual indicators to warn the DM if a category's description is becoming too verbose.
- **The "Roll for Twist" Interaction:** A button that can instantly replace or generate the "Unexpected Detail" if the DM gets stuck.
- **Linking Systems:** If "Knowledge" or "Bonds" are filled, the UI suggests 1-click links to related Factions or Locations in the campaign manager.

## Visual Design
- **Clean & Fast:** Unlike the "NPC Creator Bot," this UI uses a more modern, streamlined digital aesthetic for maximum "glans-ability" at the table.
- **Grid-First Layout:** The table occupies the majority of the screen real-estate, emphasizing its role as the primary tool.
- **Color-Coded Cues:** Interaction cues (Speech, Habits) are slightly indented or color-indicated to help the DM shift into character quickly.

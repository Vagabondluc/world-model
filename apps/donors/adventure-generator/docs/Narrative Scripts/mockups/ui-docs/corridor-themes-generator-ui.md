# UI Explanation: corridor-themes-generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Theme Input:** A search/dropdown to select the primary aesthetic (e.g., Crypt, Sewer, Tech).
- **Control Bar:**
    - **Senses Toggle:** If on, includes sight/sound/smell/texture.
    - **Hazards Toggle:** If on, adds minor obstacles (e.g., loose rubble, slippery mold).
    - **History Toggle:** If on, adds flavor text about the dungeon's past.
- **Dynamic Result Card:**
    - Displays the generated text in a clean, readable format.
    - **Sub-Reroll Buttons:** Small icons next to each paragraph (Base, Senses, Lore) that allow regenerating just that specific block.
- **Seed Persistence:** The seed stays consistent until "Generate New" is clicked, allowing users to "tweak" a specific hallway.

## Interaction Logic
- **Weighted Selection:** The generator pulls from JSON tables where elements are tagged by Theme. A "Lava" theme won't generate "Freezing Mist".
- **AI Paraphrasing:** An optional "Stylize" button uses AI to rewrite the procedural output in a specific author's style (e.g., "Lovecraftian", "Clinical").
- **Bulk Gen:** "Generate 5" button creates a list of variations for a long descent.

## Visual Design
- **Minimalist Aesthetic:** Focuses on typography and readability.
- **Copy Feedback:** Clicking the "Copy" button gives a subtle "Copied!" toast notification.

# UI Explanation: Arcane Library Adventure Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Tri-Fold Premise Randomizer:** A math-driven engine that pull from the script's d100 table (Action, McGuffin, Subject). It allows for batch generation (5 ideas) to provide the DM with variety.
- **The Selection Gallery:** A clean, card-based interface where the DM selects the most compelling premise. Selecting a card "locks" it into the detail editor.
- **Expansion Studio (The Core 3):** Three mandatory fields (Origin, Positioning, Stakes) that force the DM to ground the random idea in the actual campaign world.
- **Column-Specific Override:** A set of buttons that allow the DM to manually "Re-Roll" only one part of the premise (e.g., keeping "Rescue the Goblet" but changing the "Subject" to "In the City's Underbelly").
- **Direct Involvement (Hooks) Panel:** A tool to suggest "Personal Stakes," as required by the script, by pulling from PC bio data.

## Interaction Logic
- **Iterative Ideation:** The UI facilitates the Selection Process (Step 71-75 in the script) by automating the "Dice simulation" and presenting clear options.
- **Creativity Prompting:** If an "Unusual Combination" occurs, the UI presents a "Creative Challenge" tooltip to help the DM bridge the narrative gap.
- **Weighting (Optional):** The UI can be set to weight specific Actions or Subjects higher based on the current campaign biome (e.g., more "Ocean's Abyss" subjects if in a Nautical campaign).

## Visual Design
- **Arcane & Scholarly:** The UI uses a deep leather and gold-foil aesthetic, looking like a magical tome or a set of divination cards.
- **Grid-Aligned Precision:** Despite the scholarly theme, the data entry is precise and grid-aligned to make the 5-option selection easy to parse.
- **Call-to-Action Emphasis:** The "Selection" step is highlighted with high-contrast borders and checkboxes to ensure the DM knows the next required step in the workflow.

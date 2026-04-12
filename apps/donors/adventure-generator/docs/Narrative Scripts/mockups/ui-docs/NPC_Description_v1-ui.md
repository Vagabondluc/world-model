# UI Explanation: Detailed NPC Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Multi-Tabbed Generation Workflow:** To prevent overwhelming the DM (as mentioned in the script), the UI is split into three phases: Data Grid, Backstory, and Psyche.
- **The "Data Grid" (16-Field Table):** A specialized editor that handles the structured requirements of the script, including "Card Value," "Available Knowledge," and "Catchphrases."
- **Backstory Narrative Module:** A focused text editor with AI assistance to generate the "concise backstory" where each sentence introduces a new, distinct fact.
- **Psyche Breakdown Panel:** A rigid four-section editor (Motivations, Morals, Personality, Flaws) that ensures the DM follows the script's specific psychological framework.
- **Budget Monitor (Word Count):** A prominent progress bar that tracks the 500-word limit in real-time.

## Interaction Logic
- **Incremental Expansion:** The UI encourages the DM to fill the table first, which then "Hydrates" or seeds the backstory and personality sections with keywords and themes.
- **Brevity Policing:** Both the backstory and persona sections include visual markers to ensure they remain "concise" yet "vivid" as per the roleplay requirements.
- **The "Card Value" Seed:** Choosing a card value (like "Ace of Hearts") shifts the initial random generation toward specific character archetypes (e.g., Royalty vs. Commoner).

## Visual Design
- **Literary & Sophisticated:** Uses a more traditional book-layout aesthetic with serif typography and parchment-colored accents, reflecting the "professional creative writer" role.
- **Progressive Disclosure:** Advanced fields (like "Hidden Knowledge" or "Secret Flaws") are tucked into expandable drawers to keep the main view clean.
- **Visual Word Count:** The word count isn't just a number; it's a bar that changes color (Green -> Yellow -> Red) as it approaches the 500-word limit.

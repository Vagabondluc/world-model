# UI Explanation: create_hook

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Hook Archetype Selector:** The primary controller that defines the logic of the entire UI. Selecting one of the 9 types (Dilemma, Bait, Patronage, etc.) changes the available input fields in the "Hook Specifics" section.
- **Scenario Foundation Panel:** Captures the "Bones" of the adventure (Who, Where, What) to ensure the hook is properly anchored in the game world.
- **Dynamic Archetype Module:**
    - If **Dilemma**: Provides fields for two conflicting motivations.
    - If **Twisted**: Provides fields for "The Truth" vs "The Lie."
    - If **Treasure Map**: Provides fields for cryptic clues and physical descriptions of the object.
- **Sensory & Evocation Suite:** A set of toggles and text areas designed to ensure the description is "Vivid" and "Multi-sensory."
- **Next Steps Console:** Focuses on actionability, forcing the generation of clear "Points of Investigation" for the players.

## Interaction Logic
- **Constraint-Based Generation:** The UI enforces the script's requirement to define basic scenario elements *before* crafting the hook details.
- **Consequence Engine:** Based on the "Conflict" input, the UI automatically proposes 2-3 consequences for failure to engage with the hook.
- **Handout Formatter:** Automatically creates a player-facing version of the hook (e.g., a "Patron's Letter" or an "Overheard Rumor") based on the drafted details.

## Visual Design
- **Narrative-Focus Board:** A clean, split-pane layout. The left side handles the "Utility/Foundation," while the right side handles the "Creative Archetype" details.
- **Archetype Iconography:** Unique icons for each hook type (e.g., a map for Treasure, a masked face for Twisted, a shield for Confrontation).
- **Drafting-Pad Aesthetic:** Uses light-themed, parchment-like backgrounds for the "Hook Preview" to keep the focus on the prose.

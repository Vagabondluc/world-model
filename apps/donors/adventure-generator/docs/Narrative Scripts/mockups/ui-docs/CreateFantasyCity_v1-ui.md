# UI Explanation: CreateFantasyCity_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Settlement Identity Panel:** Controls the core demographics and biome alignment. It ensures the "Dominant Race" logic flows through to shopkeepers and historical events.
- **Architectural Layer Manager:** Specifically handles the unique requirements of "Glade Circles" vs. "Treetop Housing." It includes visual toggles for rope bridges and natural resource utilization.
- **Cultural & Artistic Gallery:** A focused workspace for defining the "Soul" of the city through statues, gardens, and tapestries.
- **Lore & Succession Timeline:** Manages the history of the "Luminarch" and the city's military/political past (Battles and Coups).
- **Merchant Manifest Editor:** A strict validation tool that ensures all 10 required shop types are named and described before the project is marked "Done."

## Interaction Logic
- **Biome-Integrated Suggestions:** Changing the biome to "Dark Timberlands" automatically updates the suggested descriptions for architecture (e.g., using Ironbark or Shadow-pine).
- **History-to-Npc link:** Major historical events automatically generate relevant NPCs (e.g., a "Battle of the Spire" veteran or a descendant of the first Luminarch).
- **Auto-naming Registry:** Provides thematic name suggestions for shops based on the city's name and dominant race.

## Visual Design
- **Natural Heritage Aesthetic:** Uses earthy tones (Greens, Tans, Browns) and organic borders that feel like carved wood or parchment.
- **Hierarchical Layout:** The UI progresses from the macro (City Identity) to the micro (Specific Shops), mirroring the DM's creative process.
- **Iconography:** Uses symbols for trees, hammers (shops), and crowns (government) to categorize information.
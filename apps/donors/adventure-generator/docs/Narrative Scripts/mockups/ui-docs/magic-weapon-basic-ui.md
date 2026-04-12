# UI Explanation: magic-weapon-basic

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Description Input Field:** A large text area for the user to paste lore or descriptions.
- **Rarity & Rules Controller:** A dedicated settings panel to set Rarity, Weapon Type, and toggle automation like "Auto-Balance" or "Online Reference."
- **Live Preview Panel:** A side-by-side view that renders the weapon's stat block in real-time as the agent processes the description.
- **Feature Budget Tracker:** A small UI element that displays "X of Y features used," enforcing the script's rules for rarity-based complexity.

## Interaction Logic
- **Rarity-Driven Constraints:** Selecting a rarity level (e.g., Uncommon) immediately restricts the generator to only 1 major feature, ensuring balance.
- **Thematic Extraction:** The AI analyzes the input description (e.g., "frozen heart") and suggests damage types (Cold) and properties (Heavy, Versatile) automatically.
- **VTT Sync:** Buttons at the bottom allow for one-click transfers to popular Virtual Tabletop formats.

## Visual Design
- **Clean & Professional:** Focused on readability and rapid iteration.
- **System-Compliant Formatting:** The preview panel uses a design that mimics official D&D 5e item blocks for familiarity.
- **Modern Dark Theme:** Reduces eye strain during long DM prep sessions.

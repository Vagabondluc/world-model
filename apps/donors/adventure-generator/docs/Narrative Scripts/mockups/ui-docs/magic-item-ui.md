# UI Explanation: magic-item

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Categorized Data Management:** Separate sections for General Identity, Magical Properties, and Lore/Advanced features.
- **Dynamic Property Builder:** An interactive list where DMs can add specific spells or mechanic-based abilities. It automatically suggests spell-slot costs based on item rarity.
- **Specialized Workspaces:** Context-aware modals for Sentient Items (stats/personality) and Artifacts (destiny/destruction).
- **Auto-Value Calculator:** A background engine that calculates recommended market values for items based on 5e rarity tables and item complexity.

## Interaction Logic
- **Constraint Enforcement:** If an item is set to "Uncommon," the UI will flag or reject Level 5+ spell effects to maintain balance consistency.
- **Fabled Scaling Engine:** For "Fabled" items, the UI provides a level-by-level progression table, allowing the DM to define when and how the item grows.
- **History Linker:** A "Generate Lore" button that analyzes the item's properties (e.g., Cold, Kraken-themes) and proposes historical origins that fit the theme.

## Visual Design
- **High-Fantasy Aesthetic:** Uses custom borders and scroll-like texture patterns in the preview area to evoke a "Magic Item Compendium" feel.
- **Interactive Charge Trackers:** Visual icons for charges that "light up" in the preview to show usage.
- **Status Badges:** Color-coded rarity badges (Blue for Rare, Purple for Very Rare, Gold for Artifact).

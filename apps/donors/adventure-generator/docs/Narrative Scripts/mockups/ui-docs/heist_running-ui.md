# UI Explanation: Heist Running Dashboard

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Live Tension HUD:** The core mechanic of the `heist_running.txt` script. It visually tracks the "Tension Level" from 1-10, triggered by player actions or failed rolls.
- **Flashback Bank:** A specialized resource tracker (referencing 'Blades in the Dark' style logic often used in heists) where players can spend points to retcon preparation actions.
- **Dynamic Complication Engine:** A real-time generator that injects obstacles (Step 5 of script) like "Rival Crews" or "Mechanical Hounds" based on the current Tension level.
- **Intervention Console:** A modal interface that triggers during "Critical Moments," forcing the party to choose between Stealth, Distraction, or Combat, each with varying Tension costs.

## Interaction Logic
- **Turn-Based Tension Increment:** If players take too long in a zone, a "Ticking Clock" (Rule 4 of script) automatically adds +1 Tension.
- **The "Point of No Return" Alert:** At Tension level 8, the UI changes color and shifts to "High Alert" mode, escalating all guard statblocks.
- **Retreat Path Calculator:** Provides a dynamic "Exit Route" based on previously cleared zones.

## Visual Design
- **High-Stakes HUD:** Inspired by stealth-action games (e.g., Dishonored). Uses a minimalist overlay with high-contrast warning elements.
- **Progressive Anxiety Colors:** The Tension bar shifts from serene green to cautionary amber to emergency red.
- **Monospace Narrative Log:** A scrolling log of the "Rhythm of the Heist," keeping a history of all major narrative choices.

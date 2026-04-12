# UI Explanation: mystery_node

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Scene Framing & Agenda Module:** Focuses the DM on the *reason* for the scene. It includes the "Bang" constructor—a dedicated tool for designing the explosive moment that starts the investigation.
- **Sensory Palette:** A checkbox-driven interface for the "Three of Five" technique. It forces the user to pick three senses and provide evocative descriptions for each, ensuring immersive scene-setting.
- **NPC Behavior Tree:** A miniature logic-builder for NPCs in the scene. It maps PC approaches (Diplomatic, Aggressive, Stealthy) to specific NPC reactions and information releases.
- **Clue & Obstacle Matrix:** Manages the discovery path within the node. It distinguishes between obvious and subtle clues and ensures that every obstacle (like a locked door) has multiple solutions as per the script's guidelines.

## Interaction Logic
- **"The Bang" Trigger:** A prominent UI element that helps the DM prepare for the transition from exploration into active investigation.
- **Outbound Lead Mapping:** Every clue can be "tagged" with a destination node. The UI visualizes these links to help the DM see the investigation web.
- **Transition Selection:** Provides clear UI buttons for "Sharp Cuts" (skipping travel time) or "Abstract Time" (narration-heavy transitions).

## Visual Design
- **Immersive Scene Editor:** Uses localized background colors or subtle atmospheric icons based on the chosen terrain (e.g., rain icons for stormy streets).
- **Lead-Feature-Extra Badging:** Characters in the dossier are visually distinct based on their importance to the mystery.
- **Clue Visibility Indicators:** Uses a "Visibility" slider for each piece of evidence to manage the balance of Easy vs. Hard discovery.

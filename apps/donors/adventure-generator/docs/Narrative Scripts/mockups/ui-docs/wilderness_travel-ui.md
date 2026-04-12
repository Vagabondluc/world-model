# UI Explanation: Wilderness Travel Manager

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Journey Configuration Studio:** A high-level setup area where the DM defines the "Purpose," "Structure" (Route/Hex/Point), and "Biome." This sets the global modifiers for the session.
- **The "Location Matrix" Engine:** A central dashboard that executes the 2d6 logic from the scripts. It handles both standalone encounters and the "6-8 Common" linked story sequences, maintaining state between rolls.
- **Resource & Navigation Hub:** A tactical panel for tracking "supplies," "travel distance," and "navigation checks." It includes a "Getting Lost" recovery workflow.
- **Environmental Console:** Manages dynamic weather (d20 scale) and biome-specific hazards (e.g., dense undergrowth, sandstorms) that apply immediate mechanical penalties.
- **Episodic Sequence Log:** A hidden or collapsable tracker that specifically manages the 3-5 linked encounters for "Common" rolls, ensuring the mini-story has a logical flow.

## Interaction Logic
- **Scene-Driven Workflow:** The UI guides the DM through the "Entrance -> Challenge -> Reward -> Exit" structure for every encounter, providing vivid sensory prompts along the way.
- **Fail-Forward Navigation:** If a navigation check fails, the UI doesn't just halt travel; it triggers a "Veering off Course" or "Hazard Encounter" sub-scene.
- **Seasonal Scaling:** Selecting a season automatically adjusts foraging DCs and weather probability curves.

## Visual Design
- **Rugged & Exploratory:** The UI uses earthy tones and map-like iconography (compasses, tents, trees) to reinforce the theme of wilderness survival.
- **Dashboard Efficiency:** Key stats (Supplies, Morale, Distance) are displayed as progress bars for quick visual assessment by the DM.
- **Contextual Sensory Prompts:** The "Scene Generator" displays dynamic keywords (Sights, Sounds, Smells) based on the current biome to help the DM improvise.

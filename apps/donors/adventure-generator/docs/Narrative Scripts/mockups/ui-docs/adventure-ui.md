# UI Explanation: Quest & Travel Architect (Phase 4 Suite)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Tri-Mode Dashboard:** A tabbed interface that switches between "Seed Generator" (Procedural content), "Travel Event Map" (Narrative sequencing), and "Co-Pilot Console" (Active roleplay).
- **Relational Reel UI:** A visual tool for the Arcane Library method that mimics three spinning reels to combine an Action, McGuffin, and Subject into a premise.
- **Spectrum Event Cards:** Color-coded cards (Red, Blue, Yellow, etc.) used to visualize the Traveling Event System (TES). These can be dragged onto a linear "Journey Slot" based on distance (Close, Far, Very Far).
- **Decision Resolution Modal:** A proactive pop-up in the Co-pilot mode that pauses the narrative when a "Complex Task" occurs, prompting the DM to evaluate success/failure.

## Interaction Logic
- **Abstract Distance Scaling:** Selecting "Very Far" in the TES mode automatically unlocks three event slots, while "Close" provides only one.
- **Narrative Sync Hub:** A dual-stream text area specifically designed for the Protocol where the User is the PROTAGONIST and the AI is the STORYTELLER.
- **Stakes Expansion Logic:** When a seed is chosen, the UI generates mandatory "Context" fields: Origin, Unique Position, and Stakes.

## Visual Design
- **Pathfinder / Cartography Aesthetic:** Uses parchment backgrounds, ink-splatter accents, and tactical compass icons.
- **Subtle Coding for Events:** Colors (Red, Blue, Purple) are used functionally to denote the *type* of interaction (Combat, Social, Hybrid) at a glance.
- **Minimalist Logistics:** Purposely hides complex resource tracking (food, weight) in favor of large-scale "Drama" indicators, adhering to the Pointy Hat TES philosophy.

# UI Explanation: Social & Hazard Studio (Phase 6 Suite)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Interactive Intrigue Grid:** A specialized table for managing the 10-20 NPCs of a social event. It tracks "Attitude" (Friendly, Wary, Hostile) and active "Topics of Conversation" in a single view.
- **Dynamic Zone Toggle:** A visual representation of the event location's areas. GMs can "Shift" NPC groups between zones (e.g., Balcony to Library) to represent the flow of the party.
- **Thematic Trap Matrix:** A 6x4 grid of Clues, Triggers, Dangers, and Obscure methods. It features a "Global Theme" filter that instantly reskins all 24 components (e.g., from "Urban Thieves Guild" to "Ancient Forest").
- **Staged Execution Timeline:** A three-stage sequencer for traps. It ensures the GM narratively describes a "Warning" and "Action" phase before applying the "Impact," as per script guidelines.

## Interaction Logic
- **Crossover Facilitator:** A UI action that suggests NPCs from separate conversation groups to "interrupt" or "merge" with the PCs, creating a sense of a larger, interconnected event.
- **Randomized Matrix Pull:** A tool that generates a 3x4 number matrix to selectively build unique traps from the master component table.
- **Skill vs Roll Evaluator:** A split-view resolution tool. One side prompts for "Player Reasoning" (How do you bypass it?) and the other for "Character Capability" (Check vs Save).

## Visual Design
- **Social Mode:** Elegant, high-contrast urban aesthetic (Midnight Blue, Ivory, Gold accents).
- **Hazard Mode:** Tactical, high-caution aesthetic (Slate Gray, Warning Orange, Caution Yellow).
- **Contextual Handouts:** Automatic creation of "NPC Character Cards" and "Redacted Blueprints" for player-facing tactical/social info.

# UI Explanation: Narrative Engine & Tactical Lexicon

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Plot Engine Library (Atomic Generators):** A searchable catalog based on the 34 "Core Plot Engines" from `big_list_rpg.md`. It provides structured metadata (Tension, Failure States, Scene Types) for direct injection into a GM's campaign manager.
- **Tactical Role Overlay System:** Implements the "Creature Roles" from `Reference_CreatureRoles_v1.txt`. It allows GMs to take a generic statblock and apply a "Tactical Filter" (Ambusher, Artillery, Brute, Controller, Leader, Minion) which adds specific behavior prompts and ability mods.
- **Workflow & Twist Suite:** A meta-processing module based on the "Meta-Rules" section of the reference.
    - **Hook vs Meat:** A transition wizard that helps plan bait-and-switch narratives.
    - **Twist Deck:** A virtual card draw system for 18 "Universal Twists" (e.g., Pandora's Box, Score One for the Home Team).
- **Environmental Event Matrix:** A procedural generator for Wilderness, Urban, and Travel events, filtered by "Tone, Mood, and Perspective" (Grim, Whimsical, Hopeful), ensuring atmospheric consistency.

## Interaction Logic
- **Constraint Synchronization:** When a "Constraint Play" meta-rule is active, the UI restricts certain "Narrative Engines" or "Tactical Options" (e.g., disabling 'Lethal Force' paths).
- **Persistence & Mutation Tracking:** Following the logic in the reference script, resolving an engine allows the GM to click "Mutate," which suggests the next engine based on the previous result (e.g., Failed Capture -> Manhunt).
- **Scale Morphing:** A global toggle that rephrases the selected plot engine for different scopes (Personal, Communal, Regional, Global) while maintaining the "Atomic Logic."

## Visual Design
- **Lexical & Systematic:** The UI uses a "Codex" layout—clean typography, sidebars for related definitions, and a focus on "Atomic Elements."
- **Twist Card Aesthetic:** The 18 Twists are displayed as virtual cards with unique iconography to represent their impact (e.g., a "Broken Heart" for Personal Sacrifice).
- **Synergy Indicators:** When grouping creature roles, the UI displays "Tactical Synergy Sparklines" showing the balance of Ranged vs Melee vs Support.

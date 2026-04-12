# UI Questionnaire: faction-conflict-simulator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A dynamic simulation engine that resolves conflicts between dungeon factions, updating territories, resources, and encounter tables based on probabilistic outcomes.

## 2. Core Inputs
- **Faction Registry:** Names, goals, resources, territory, and key NPCs.
- **Random Faction Table:** Die-based selection including "Wandering Adventurers," "Outsiders," and "Roll Again Twice."
- **Conflict Check Frequency:** When to trigger checks (e.g., between sessions, per in-game week).
- **Conflict Outcome Table:** Results like "Stalemate," "Faction Damaged," "Factions Unite," "Territory Shift."
- **Faction Matchup Logic:** What happens if the same faction is rolled twice (civil strife vs. reroll).

## 3. UI Requirements
- **Faction Dashboard:** A grid or card view showing all factions with their current status (territory size, resource levels, morale).
- **Conflict Roller:** A dedicated tool that rolls the frequency check (1d6), then auto-rolls twice on the faction table if conflict occurs.
- **Outcome Resolver:** A visual panel that displays the rolled outcome and prompts the DM to interpret it based on faction context.
- **Territory Map Overlay:** A simple clickable map where territories can be reassigned after conflicts.
- **Change Log:** A running history of past conflicts and their outcomes.

## 4. Derived & Automated Fields
- **Dynamic Encounter Table Updates:** Automatically adjusts encounter frequencies based on which faction controls which area.
- **Narrative Snippet Generator:** AI-suggested brief descriptions of the conflict based on the factions involved and outcome.

## 5. Exports & Integration
- Updated Faction Status Report (PDF/Markdown).
- Revised Encounter Tables (VTT JSON).
- Conflict History Log.

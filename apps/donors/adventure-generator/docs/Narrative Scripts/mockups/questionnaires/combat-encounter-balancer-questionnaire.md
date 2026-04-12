# UI Questionnaire: combat-encounter-balancer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A mathematical combat calculator that balances monster XP against party thresholds to ensure appropriate difficulty (Easy to Deadly).

## 2. Core Inputs
- **Party Composition:** Level and Number of Players.
- **Difficulty Goal:** (Easy, Medium, Hard, Deadly).
- **Monster Registry:** Selections from a bestiary (with XP values).
- **Tactical Terrain:** Hazards, cover, and elevation features.
- **Resource Check:** Current party HP/Spell slots available.

## 3. UI Requirements
- **Live XP Calculator:** A bar or dial that updates as monsters are added.
- **Difficulty Threshold Markers:** Visual lines on the calculator showing where "Hard" and "Deadly" start.
- **Monster Multiplier Logic:** Automatically applies the 1.5x, 2x, etc., multipliers based on the number of creatures.
- **Tactical Map Sketch:** A simple 10x10 grid for basic positioning or "Theater of the Mind" notes.

## 4. Derived & Automated Fields
- **Reward Recommender:** Suggests gold/item rewards based on the final calculated difficulty.
- **Playtest Simulator:** A "Simulate 1 Round" button that calculates average damage output (DPR) vs party HP.

## 5. Exports & Integration
- Export to "Encounter Tracker" (Standard math format).
- VTT Wall/NPC Importer.

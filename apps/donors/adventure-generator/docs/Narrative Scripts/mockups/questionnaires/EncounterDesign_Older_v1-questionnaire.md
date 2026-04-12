# UI Questionnaire: EncounterDesign_Older_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A structured encounter builder that ensures every combat or non-combat scene has mechanical depth, sensory immersion, and clear narrative consequences.

## 2. Core Inputs
- **Scene Setting:** Vivid location description + sensory details.
- **Primary Objective:** What do the players need to actually *do*?
- **Environmental Effects:** Unique modifiers/hazards with gameplay mechanics.
- **Challenge Type:** Skill Challenge, Puzzle, Combat, or Hybrid.
- **Resolution Guidelines:** DCs, number of successes/failures, critical outcome notes.
- **Consequences:** Immediate and long-term impacts for both Success and Failure.
- **Opponent Data:** Statblocks, tactics, and motives.
- **Rewards:** XP and physical loot.

## 3. UI Requirements
- **Immersive Text Editor:** Large text area for the "Setting the Scene" with sensory keyword highlighting.
- **Challenge Logic Builder:** A tabular or node-based entry for multi-stage challenges (Success/Failure branches).
- **Statblock Importer:** A field to paste or select monster statblocks that auto-updates tactics suggestions.
- **Branching Outcome Preview:** A visual map of how current outcomes affect the next adventure phase.

## 4. Derived & Automated Fields
- **XP Calculator:** Automatically sums XP based on challenge complexity and monster CR.
- **Transition Hook Generator:** AI-suggested hooks based on the "Consequences" and "Objective" fields.

## 5. Exports & Integration
- Export to "Encounter Card" (PDF/Markdown).
- VTT integration (Foundry/Roll20 compatible JSON).

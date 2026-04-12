# UI Questionnaire: proactive_mystery_node

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A flexible "Safety Net" node designed to be triggered when players are stuck, providing adaptable clues and dynamics that guide them back to the main mystery regardless of their current progress.

## 2. Core Inputs
- **Mystery Name & Unique Identifier:** (e.g., "The Silver Heist", "01").
- **Flexible Trigger Conditions:** List of scenarios (e.g., stagnant investigation, missed critical clue, time pressure).
- **Core Clues (Adaptable):** At least three leads that point back to different parts of the main scenario.
- **Dynamic Content Variations:** Different ways the node plays out based on the current "State of Investigation."
- **Integration Guide:** Instructions for the GM on how to "inject" this node into the flow.

## 3. UI Requirements
- **Trigger Scenario Library:** A set of toggleable presets (e.g., "Players are stuck", "Too much in-game time passed").
- **Dynamic Content Switcher:** A selector that modifies the node's output based on "Investigation Phase" (Early, Mid, Late).
- **Lead-In/Lead-Out Map:** A visual tool showing how this proactive node "branches" back into the main mystery path.
- **NPC Adaptability Panel:** A workspace to define NPC dialogue that shifts based on which clues have already been found.
- **Injection Points Log:** A list of suggested places or moments where this node can be naturally introduced.

## 4. Derived & Automated Fields
- **investigation State Auditor:** Suggests which variant of the node to use based on the current mystery progress tracker.
- **Automated Filename Formatter:** Enforces the `_Proactive_XX.txt` nomenclature.
- **Redundancy Checker:** Ensures the clues in the proactive node don't just repeat found info, but provide *new* paths to the same truth.

## 5. Exports & Integration
- 1x Proactive Mystery Node File (.txt).
- GM Quick-Start Integration Guide (Markdown).
- VTT "Emergency" Scene Card.

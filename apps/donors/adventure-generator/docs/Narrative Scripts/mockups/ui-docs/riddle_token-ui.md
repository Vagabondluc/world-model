# UI Explanation: Puzzle & Asset Studio (Phase 14 Suite)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Dual-Pane Riddle Forger:** A split-view interface that allows the DM to provide a single "Answer" and instantly see both "Easy" and "Hard" riddle variants side-by-side. 
- **Thematic Prompt Injector:** A tool for the Token Studio that wraps natural language character descriptions (e.g., "Dwarf Fighter") into complex 2D technical prompts for aerial game art.
- **Top-Down Asset Preview:** A circular viewport that demonstrates how the generated character will fit into a standard D&D battlemap token frame.
- **Logic Breakdown Panel:** A mandatory section in the Riddle Forge that displays the AI's reasoning, ensuring the DM understands the metaphor before presenting it to players.

## Interaction Logic
- **Difficulty Comparison Mode:** Clicking "Contrast Versions" highlights the specific metaphors that differentiate the Easy and Hard variants.
- **Auto-Transparency Filter:** The Token UI automatically appends "Transparent Background" keywords to prompts and provides a checkbox to simulate VTT-ready assets.
- **Meta-Clue Generator:** A secondary tool that produces "Hints" (e.g., "The silence of the grave") in case the players are stuck on the Hard version.

## Visual Design
- **Riddle Mode:** Deeply atmospheric and cryptic (Obsidian Black, Deep Violet, and Spectral Blue).
- **Token Mode:** Functional and bright (Grid-aligned, Clean White interface, focusing on high-detail character art).
- **VTT Compatibility Focus:** UI layouts are designed to resemble assets from modern Virtual Tabletops (Foundry, Roll20).

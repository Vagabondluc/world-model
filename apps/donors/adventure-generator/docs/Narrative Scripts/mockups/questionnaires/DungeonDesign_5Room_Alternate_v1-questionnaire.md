# UI Questionnaire: DungeonDesign_5Room_Alternate_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
Create a structured adventure/dungeon narrative following the "Alternate 5-Room" flow (Static -> Flex -> Static -> Flex -> Climax).

## 2. Core Inputs
- **Adventure Title & Theme:** High-level context.
- **Scene Nodes:** Individual form entries for each stage (Intro, Challenges, Midpoint, Puzzles, Climax, Resolution, Epilogue).
- **Scene Fields:** Summary, Characters, Setting, Challenge, Outcomes, Transitions.

## 3. UI Requirements
- **Timeline-based UI:** A vertical or horizontal track showing the story progression.
- **Flex-Blocks:** Special containers for Stages 2 and 4 that allow multiple interchangeable scenes.
- **AI Sync:** Fill specific scenes or the entire adventure based on a "Mother Prompt".

## 4. Derived & Automated Fields
- **Transition Suggestions:** Automatically suggest "Flex" transitions based on the previous scene's outcome.

## 5. Exports & Integration
- Markdown (Chapter-based).
- PDF Handout.
- Narrative JSON for VTT quest logs.

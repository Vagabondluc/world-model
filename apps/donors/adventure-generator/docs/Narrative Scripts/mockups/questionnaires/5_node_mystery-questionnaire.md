# UI Questionnaire: 5_node_mystery

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A master architect tool that coordinates the creation of a complete, five-node mystery scenario (Hook, Discovery, Climax), ensuring clue connectivity and logical flow.

## 2. Core Inputs
- **Mystery Concept:** Murder, theft, disappearance, etc.
- **Key Elements:** Victim, Perpetrator, Motive, Method.
- **Tone/Setting:** Noir, Gothic, High Fantasy, etc.
- **Node Specifics:** Individual themes or locations for Nodes B, C, and D.
- **Ancillary Revelations:** Optional side-secrets to add depth.

## 3. UI Requirements
- **Scenario Dashboard:** High-level overview of the mystery arc.
- **Node Map (Visual Graph):** A 5-point layout (A -> B/C/D -> E) showing how clues flow between nodes.
- **Mystery Detail Form:** Fields for victim, perpetrator, motive, and method.
- **Clue Tracker:** A matrix to ensure the "Three Clue Rule" is satisfied (e.g., Node A must point to B, C, and D).
- **Consistency Reviewer:** A checklist/panel for cross-referencing timelines and NPC motivations.

## 4. Derived & Automated Fields
- **Clue Routing Map:** Automatically visualizes paths from discovery to climax.
- **Node File Generator:** Automates the creation of five text files with correct naming conventions.
- **Connection Validator:** Highlights if a node lacks sufficient outbound clues.

## 5. Exports & Integration
- 5x Individual Mystery Node Files (.txt).
- Master Mystery Overview (Markdown).
- VTT Campaign Log / Investigation Board.

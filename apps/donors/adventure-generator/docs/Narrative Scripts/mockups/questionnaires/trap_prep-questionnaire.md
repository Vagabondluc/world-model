# UI Questionnaire: trap_prep

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A systematic trap generator that uses a 4-component matrix (Clue, Trigger, Danger, Obscure) to create fair, non-lethal, and engaging challenges.

## 2. Core Inputs
- **Trap Theme:** (e.g., Ancient Temple, Frost Giant Den, High-Tech Lab).
- **Component Table (6 Entries per category):**
    - **Clues:** Visual/Auditory hints.
    - **Triggers:** Activation mechanics.
    - **Dangers:** Mechanical consequences.
    - **Obscuring Methods:** How it's hidden.
- **Number Matrix:** A 3x4 grid of numbers (1-6) for selection.
- **GM Guidelines:** Custom notes on setup and engagement.

## 3. UI Requirements
- **Randomizer Matrix Engine:** A button to generate a new 3x4 matrix that highlights the corresponding components in the table.
- **Trap Previewer:** A real-time text block that weaves the selected components into a cohesive narrative description.
- **Staged-Activation Editor:** A UI section to define the "Stages" of the trap's activation (giving players time to react).
- **Theme-Sync:** Automatically re-words table entries to match the chosen "Trap Theme".

## 4. Derived & Automated Fields
- **Fairness Auditor:** Checks if the trap has a clear "Clue" and a "Reaction Window".
- **DC Recommender:** Suggests ability check DCs based on the chosen "Danger".

## 5. Exports & Integration
- Trap Reference Card (PDF).
- Markdown "Trap Generator" file.

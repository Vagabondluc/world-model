# UI Questionnaire: Arcane Library Adventure Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A rapid ideation tool for D&D GMs that uses the "Arcane Library Method" (Action + McGuffin + Subject) to generate, refine, and select high-stakes adventure premises.

## 2. Core Inputs
- **Number of Premises to Generate:** (Default: 5).
- **Core Theme Filter:** (Optional: Underdark, City, High Seas).
- **Party Level:** (For contextual difficulty estimation).
- **Custom Keywords:** (Action/McGuffin/Subject seeds to override the random table).

## 3. UI Requirements
- **The Premises Slot-Machine:** A randomizer UI that displays 5 generated "Action + McGuffin + Subject" combinations.
- **Premise Selection Interface:** Interactive cards for each generated idea, allowing the DM to "Pick one" for further development.
- **Contextual Expansion Studio:** Three dedicated fields for the chosen premise:
    1. **Origin of Problem:** (The "How").
    2. **Unique Positioning:** (The "Why the Heroes").
    3. **The Stakes:** (The "Failure Consequence").
- **Creativity Facilitator:** A "Re-Roll" button for individual columns (Action, McGuffin, or Subject) if the combination is too weird.
- **Personal Stakes Injector:** A tool to link the quest to specific PC backgrounds or NPCs.

## 4. Derived & Automated Fields
- **Probability Matrix:** Automated d100 roll results based on the provided script table.
- **Title Generator:** Derived from the Action + McGuffin (e.g., "The Rescue of the Dragon-Goblet").
- **Difficulty Scaler:** Automatically suggests environmental challenges based on the "Subject" and "Party Level."

## 5. Exports & Integration
- Adventure Session One-Pager (Markdown).
- VTT Quest Object.
- Campaign Hook Notification.

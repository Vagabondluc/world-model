# UI Explanation: EncounterDesign_Older_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Vivid Header:** Allows for naming the scene and defining the "Tier" or player level to scale rewards.
- **Sensory-Rich Textbox:** A specialized input for "Setting the Scene" that encourages 3+ sensory details via live feedback tags (e.g., [Sight: Found], [Sound: Missing]).
- **Mechanism Matrix:**
    - **Environment Block:** Focused on mechanics and gameplay modifiers (e.g., difficult terrain, magical dimness).
    - **Challenge Logic:** A step-by-step editor for Skill Challenges or Puzzles, including DC settings and success/failure counters.
- **Tactical Dashboard:** Integration for opponent statblocks and AI-generated "Tactics Notes" that explain *how* NPCs use their environment.
- **Narrative Branching Panel:** Explicit fields for Success/Failure outcomes and the resulting "Narrative Hooks" for the next adventure phase.

## Interaction Logic
- **Outcome Mapping:** When a "Success" outcome is typed, the "Transition" field auto-suggests a logical next step (e.g., "Success in the chasm leads to the temple gates").
- **Dynamic XP Tally:** Changes as monsters or challenge complexity is adjusted.
- **Interactive Checklists:** Ensure the user has provided specific DCs and combat mechanics for every challenge listed.

## Visual Design
- **High Contrast Sections:** Uses clear bordered containers to separate "The Vibe" (Scene) from "The Math" (Mechanics).
- **Icon-Driven UI:** Icons for sensory categories (Ear, Eye, Nose) and status badges for "Combat" vs "Social".
- **Drafting Watermarks:** Sections like "Opponent Info" have watermark placeholders to guide the user on what to include (e.g., "Describe their motives...").

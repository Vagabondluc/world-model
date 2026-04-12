# UI Explanation: Three-Pass Adventure Studio

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Stage-Gate Stepper:** A central workflow manager that ensures the DM follows the script's strict order (Narrative -> Mechanical -> Presentation).
- **Evolutionary Entity Editor:** A specialized UI component for NPCs, Rivals, and McGuffins that changes its input fields based on the current pass. For example, Pass 1 focuses on "Motivations," while Pass 2 adds "Luck Points" and "Field Diamonds."
- **Modular Scene Builder:** A structured editor that prevents the "Misuse of Bullet Points." It enforces writing the narrative description *before* allowing the creation of summary bullets.
- **Narrative Logic Auditor:** An AI/Procedural layer that checks for Branching Paths and Doomsday Clock integration as the DM builds the story structure.
- **Atmospheric Palette Tool:** Available in Pass 3, this provides sensory keywords and "Read Aloud" templates to polish the final presentation.

## Interaction Logic
- **Iterative Refinement Flow:** The UI allows the DM to "Go Back" but flags that changes to Narrative (Pass 1) may require re-validating Mechanics (Pass 2).
- **The "Artifact" State-Management:** The UI mirrors the script's requirement to save and update artifacts at each pass, acting as a visual front-end for the underlying file system.
- **Requirement Checklists:** Each Pass ends with a "Completion Criteria" checklist (e.g., "All major scenes outlined?") that must be satisfied before the "Next Pass" button activates.

## Visual Design
- **Professional & Methodical:** The UI is designed to feel like a high-end publishing tool. It uses clean, technical typography with subtle "Golden Compass" branding (compass motifs, gold/blue accents).
- **Zoned Information:** Dividers and distinct zones separate "Fortune Master Knowledge" from "Player Handouts" or "Read Aloud" text.
- **Process Visualization:** The progress bar is a literal "Compass" needle that moves as the adventure's complexity and completion grow.

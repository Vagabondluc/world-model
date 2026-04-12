# UI Explanation: Golden Compass Studio (Unified Engines)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Iterative Pass Workflow:** A primary navigation mode that filters the UI based on the active Pass (Narrative, Mechanical, or Usability). This enforces the Three-Pass Method's requirement for focused development.
- **Visual Doomsday Clock:** A persistent circular progress bar that tracks the "Hours" resource. It flashes red when specific scene transitions or failed challenges trigger hour penalties.
- **Diamond-Rating Input:** A custom UI component for NPC and PC stats. Instead of numbers, users click "Diamonds" (1-3) to set ratings, mirroring the physical game's aesthetic.
- **Scene Anatomy Editor:** Following Pass 3 guidelines, this editor forces the user to write "Atmospheric Description" in a large text area before allowing the use of the "Key Information Box" (bullets).

## Interaction Logic
- **Success/Failure Branching:** Clicking a "Scene" opens a sub-view where users define the "Success Path" and "Failure Path", creating a logic map of the episode.
- **Status Overlay:** During "Pass 2", challenges can be "tagged" with specific status effects (e.g., "Failure on this track causes SHOCKED").
- **Asset Registry:** A panel to manage the "MacGuffin", "Transportation/Vehicles", and "Wild Places" mentioned in the template.

## Visual Design
- **Pulp Adventure / Serial Aesthetic:** High contrast (Deep Red, Crimson, and Cream), bold headers, and aged paper textures.
- **Icon-Heavy Tracking:** Uses distinct icons for Luck Points (Stars), Life Safety (Shields), and Time (Clocks).
- **Proactive Guidance:** A small "Fortune Master Tip" box appears when the user is transitioning between passes, offering advice from the Three-Pass Method.

# UI Explanation: 5-Room Dungeon & Narrative Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Framework Toggle:** A fundamental switch that reconfigures the UI between the "Classic 5-Room" (Room 1-5) and the "Narrative/Flexible" stage-based model.
- **The Pipeline Ribbon:** A visual representation of the adventure's flow. In Narrative mode, "Flex Stages" can be dragged and reordered to simulate non-linear gameplay.
- **Context-Aware Scene/Room Editor:** A deep-dive panel that adjusts its fields based on the selected stage (e.g., "The Midpoint" emphasizes twists/setbacks, while "The Entrance" highlights guardians and preservation).
- **Hero-Spotlight Intelligence:** A sidebar that analyzes the "Challenge" field and PC data to suggest specific obstacles (Traps, Hazards, NPCs) that make players feel like heroes.
- **Branching Transition Mapper:** A tool to define "Alternative Routes" based on player choices (Success/Failure), supporting the non-linear requirements of the Alternate script.

## Interaction Logic
- **Recursive Content Generation:** Filling out the "Theme" and "Midpoint" seeds the "AI Suggestions" for all other rooms, ensuring thematic consistency (e.g., Chronomancer theme adds "Snake-infested floors" or "Buzzer panels").
- **Outcome-to-Transition Wiring:** Success and Failure outcomes are directly linked to specific follow-up scenes, visually mapped in a "Flow" view.
- **The "Flex" Constraint:** In Narrative mode, the UI ensures that "Prep," "Midpoint," and "Climax" remain static pins, while the intervening trials can be handled dynamically by the GM.

## Visual Design
- **Architectural & Blueprint-Inspired:** Uses a grid-based layout with "Blueprint Blue" accents and technical diagrams, evoking the feeling of designing a physical or narrative space.
- **High-Contrast "Twist" Indicators:** The Midpoint/Setback sections use an "Alert Cyan" color to mark their importance as narrative disruptors.
- **Connection Lines:** Subtle, glowing lines connect the Pipeline stages, showing the DM the path the players will likely take.

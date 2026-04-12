# UI Explanation: EncounterDesign_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Compact Header:** Combines Title and Primary Goal into a single line to maximize vertical space.
- **AI Fast-Fill Button:** A prominent action that drafts a complete encounter based on the Title alone.
- **Tiled Data Blocks:** Uses a two-column grid for Environment and Challenge steps, allowing the DM to read both simultaneously.
- **Tactics Bullet-List:** Specifically designed for "IF/THEN" logic, making NPCs easier to run in the heat of combat.
- **XP Summary Footer:** A sticky footer that shows the breakdown of Challenge XP vs Combat XP.

## Interaction Logic
- **Quick-Entry Mode:** Tabbing through fields focuses on the most essential "Practical Guidelines" first.
- **Inline Math:** When a monster is added to the "Opponents" list, its XP is automatically added to the "Combat" tally.
- **One-Click Hook:** The "Hook" areas are pre-populated with "Success/Failure" presets that can be swapped with a single click.

## Visual Design
- **Tabletop Focused:** Optimized for high-contrast viewing on small screens (tablets or phones) frequently used at the table.
- **Action-Oriented Symbols:** Bullet points use functional icons (e.g., crosshairs for tactics, a d20 for skill checks).
- **Cheat-Sheet Formatting:** Avoids long paragraphs in favor of bolded keywords and short sentences.

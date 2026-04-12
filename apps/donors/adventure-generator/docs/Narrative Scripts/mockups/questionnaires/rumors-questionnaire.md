# UI Questionnaire: rumors

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A dynamic rumor table manager (d20/d30/d100) to provide players with actionable leads, lore, and meta-plot foreshadowing while tracking information delivery.

## 2. Core Inputs
- **Table Size:** (d20, d30, or d100).
- **Rumor Sources:** (Select: Hex/Location, Random Encounters, Roads/Paths, Factions, NPCs).
- **Rumor Focus:** (Select: Locations, Creatures, Objects, Situations/Threats, Lore).
- **Delivery Method:** (Proactive, Reactive, or Opportunistic).
- **Context/Framing:** (Overheard, Notice Board, Letter, Tarot/Vision).
- **Cost for Info:** (e.g., 1d6 gp).

## 3. UI Requirements
- **Rumor Master Table:** A grid to manage 20+ entries with columns for "Source," "Focus," "Status (Delivered/Fresh)," and "Player Impact."
- **Contextual Framing Tool:** A dropdown or generator to wrap raw rumors in immersive flavor (Tavern talk vs. Divine vision).
- **Restock & Evolution Panel:** A tool to update the table based on recent player achievements or campaign events.
- **Roll & Deliver Interface:** An interactive d20 roller that selects a rumor and provides the framed text for the DM.
- **Ledger of Known Truths:** A secondary list tracking which rumors players have already received and potentially verified.

## 4. Derived & Automated Fields
- **Actionability Auditor:** Flags rumors that lack a clear "Lead" or "Location" for the players to follow.
- **Consequence Integration:** Correlates rumors with current Faction status or Metaplot milestones.
- **Cost-to-Benefit Calculator:** Suggests the "DC Bonus" or quality of info based on the gold spent by players.

## 5. Exports & Integration
- Full Rumor Table (Markdown).
- VTT Rumor Macro.
- "Notice Board" Player Handout (PDF/Image).

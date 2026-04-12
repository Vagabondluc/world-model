# UI Explanation: rumors

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Master Rumor Grid:** A high-density data table that organizes rumors by roll (d20/d30/d100), source (Faction, Hex, NPC), focus (Object, Threat, Lore), and status (Fresh/Delivered).
- **Interactive Information Hub:** A central dashboard where the DM can "Roll for Information." It handles both proactive delivery and reactive player investigation.
- **Contextual Framing Engine:** A creative workspace that takes raw rumor data and wraps it in a "Delivery Context" (e.g., Notice Board, Letters, Vision), providing the DM with ready-to-read narration.
- **Evolution & Restock Manager:** A tool to maintain the "Freshness" of the table. It identifies "Dead Rumors" (crosses them off) and suggests "Restocks" based on recent PC achievements or world events.
- **Ledger of Truths:** A background tracker that notes which rumors have been discovered and potentially "Verified" by the players, linking them to the campaign's evolving lore.

## Interaction Logic
- **Constraint-Based Restocking:** The UI encourages periodically restocking the table to reflect the "Consequences of player actions," as emphasized in the script.
- **Investigation Check Integration:** Allows the DM to set Rumor Costs (1d6 gp) or difficulty modifiers (DCs) directly within the interface.
- **Actionability Auditor:** A background process that ensures every generated rumor provides a "Clear lead or location," preventing vague or useless flavor text.

## Visual Design
- **Information-Dense Archive:** Resembles a professional ledger or investigator's case-file.
- **Status Color-Coding:**
    - **Green:** Fresh rumors ready for delivery.
    - **Grey:** Delivered rumors that may soon be verified or archived.
    - **Blue:** Rumors tied to specific character backstories.
- **Tactical Utility Icons:** Small glyphs for the "Focus" column (e.g., a shield for Threats, a scroll for Lore) to allow the DM to scan the table instantly.

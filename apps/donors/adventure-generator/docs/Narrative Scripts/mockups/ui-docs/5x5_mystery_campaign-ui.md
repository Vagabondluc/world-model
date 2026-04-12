# UI Explanation: 5x5_mystery_campaign

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Meta-Mystery Navigation Map:** A nested node graph. The top level shows 5 "Mystery Nodes." Clicking into any Mystery Node reveals its underlying 5 "Scene Nodes," creating a 25-node interactive map.
- **Global Lore & Recurring Element Database:** A central repository for NPCs, factions, and landmarks that appear across different mysteries. Editing an element here updates it in all relevant nodes.
- **Inter-Mystery Clue Engine:** A specialized bridge-tool that allows DMs to link a specific clue in `Mystery A, Node 3` to the start of `Mystery B`.
- **Campaign Narrative Timeline:** A linear or branching view of the "Grand Secret" and how it is revealed piece-by-piece across the campaign.
- **XP/Complexity Balancer:** A global setting that scales DCs and enemy power levels based on the campaign's "In-Game Week" or the number of mysteries completed.

## Interaction Logic
- **Drill-Down Workflow:** The DM can zoom into any single mystery to edit its individual nodes using the standard 5-node mystery toolkit, then zoom out to see how it fits into the 25-node global web.
- **Recursive Consistency Checker:** When a change is made in Mystery B, the UI automatically flags any contradictions in Mysteries A, C, or D.
- **Entry Point Orientation:** If the players start with Mystery D instead of A, the UI re-calculates which clues in D need to be "obvious" to hook them into the rest of the campaign.

## Visual Design
- **Grand Strategy Interface:** Clean, spacious layout that manages high information density through hierarchical tabs and zooming.
- **Connectivity Visualization:** Uses different colored "thread" lines for intra-mystery clues vs. inter-mystery (campaign-level) clues.
- **Thematic Consistency:** The entire UI maintains the same "Noir Dossier" or "Fantasy Chronology" theme selected for the campaign.

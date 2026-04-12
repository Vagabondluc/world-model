# UI Explanation: revelations_dm_aid

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Automatic Revelation Matrix:** A specialized viewer that takes the mystery nodes and flips them "Inside Out." Instead of showing where a node leads, it shows everything that *points* to that node. This is the primary tool for checking redundancy.
- **Three-Clue Audit Engine:** A background service that constantly counts the inbound clues for every "Essential Revelation." It changes the node's header color or adds a warning icon if the count falls below three.
- **Cross-Reference Linker:** A navigational system that allows the DM to deep-link between the Revelation List and the actual Node content. Clicking "(From Node B)" instantly scrolls the UI to the description of Node B.
- **Critical Path & Bottle-Neck Analyzer:** A diagnostic tool that highlights nodes which are difficult to reach. It helps the DM identify if an investigation is likely to fail due to a single "Fragile" clue connection.
- **Proactive Register:** A summary area at the bottom that tracks "Emergency Lifelines," allowing the DM to see at a glance what help is available if the players fail to find the primary clues.

## Interaction Logic
- **Reverse-Mapping Automation:** The UI can parse existing node files and automatically populate the Revelation List, saving hours of manual cross-referencing.
- **Interactive Audit Fixes:** When the system flags a "Bottle-neck" (e.g., Node C only has 2 clues), the DM can click a "Suggest Source" button, and the AI recommends a logical place in another node to add the third clue.
- **Importance Filtering:** Allows the DM to hide "Ancillary secrets" and focus only on the clues required to finish the story.

## Visual Design
- **High-Information Utility Aesthetic:** Clean, tabular, and highly organized. It’s designed for rapid scanning during a live session.
- **Status Color Coding:**
    - **Green:** Validated (3+ clues).
    - **Yellow:** Warning (2 clues).
    - **Red:** Critical (1 clue or 0).
- **Navigation Pips:** Small icons next to clues that indicate the *type* of clue (Physical, Witness, Environmental).

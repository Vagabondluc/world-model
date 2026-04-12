# Spec Stub: Alexandrian Dungeon Custom Instructions

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


- **Purpose:** Document how the Dungeon Master’s Toolkit driver should interpret and enforce the custom instructions, including menu sequencing, consistency checks, and creative suggestions.
- **Inputs:** User choices from the toolkit menu, outputs from previously used tools, explicit requests or clarifications from the user.
- **Outputs:** Guided menu prompts, context-aware suggestions, tool-specific hand-offs, and reminders about consistency or creative expansion.
- **Example call:** After the user opens the toolkit, the system references this instruction file to present the menu, maintain the tool context, and suggest follow-up tools.
- **Edge cases:** Missing previous context (start from scratch), conflicting tool outputs (flag and reconcile), user forces a reset (need to reapply initial guidelines).
- **Mapping:** Drives the UI menu flow, visible instructions inside the toolkit overlay, and backend conversation orchestrator that dispatches tool logic.
- **Priority:** High
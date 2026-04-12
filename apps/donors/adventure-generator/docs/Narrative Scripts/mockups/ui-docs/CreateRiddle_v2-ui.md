# UI Explanation: CreateRiddle_v2

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Compound Logic Header:** A primary data-entry section for the two "Secret Words" and the combined "Final Answer." This ensures the riddle is built on a solid foundation.
- **Component-Specific Clue Editors:** Individual workspaces for drafting the cryptic descriptions for Word A and Word B. This allows the DM to refine each part of the riddle independently.
- **Introductory Wrapper Module:** Automatically injects the specific script-required lines ("The two secret words in these lines...") into the final output.
- **Real-Time Riddle Synthesizer:** A preview window that combines the wrapper and the clues into a formatted block, ready for export.

## Interaction Logic
- **Step-by-Step Workflow:** The UI guides the DM through the process outlined in the script: Word Selection -> Cryptic Definition -> Presentation.
- **Ambiguity Mitigation:** Includes tools to swap "Vague" descriptions for "Specific" wordplay to ensure the riddle has only one logical solution.
- **Compound Validation:** A background check that verifies the two words actually form a valid compound word or recognized phrase.

## Visual Design
- **Analytical & Precise:** Uses a modular, card-based layout that emphasizes the "Component nature" of the riddle.
- **Logical Connectors:** Visual symbols (like the '+' and '=') help the DM understand the mathematical-like structure of the riddle.
- **Clean Typography:** Prioritizes high-legibility fonts for the Clue text to ensure the DM can easily read it during a session.

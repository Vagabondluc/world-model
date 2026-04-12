# UI Explanation: jp cooper 10 room dungeon

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Guided Chat Interface:** The central focus. It mimics a messaging app. ChatGPT's prompts are left-aligned; user responses/actions are right-aligned.
- **Dungeon Ledger (Sidebar):** A vertical list that dynamically builds as the user answers. It shows the high-level "Theme" fields at the top and the "10 Rooms" below.
- **Smart Toolbar:** A contextual toolbar that appears above the input box.
    - **Buttons:** [Roll Once], [Roll 3], [Roll Genre...], [Undo Last].
- **Review Panel:** A full-screen overlay that appears when the user asks to "see the dungeon".

## Interaction Logic
- **Step-by-Step Flow:** The script forces a linear progression (one question at a time) to prevent cognitive overload.
- **"Roll" Interception:** When the user clicks "Roll", the UI sends a background command to the LLM to generate one or more creative options based on the previously entered data.
- **Contextual continuity:** Subsequent rolls are weighted to fit the "Location" and "Purpose" defined in the first section.
- **Hot-Swapping:** Clicking any room in the Sidebar allows the user to jump back to that point in the chat and change their answer (branching history).

## Visual Design
- **Theme-Responsive:** The chat bubbles and sidebar accent colors shift based on the "Genre" chosen (e.g., Parchment/Black for High Fantasy, Neon/Blue for Cyberpunk).
- **Pro-Tip Toasts:** Occasional tooltip popups that remind the user they can ask for "more flesh out" or "genre rolls".

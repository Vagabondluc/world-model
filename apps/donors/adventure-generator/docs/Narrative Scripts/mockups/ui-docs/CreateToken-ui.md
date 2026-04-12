# UI Explanation: Battlemap Token Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Subject Detail Studio:** A prominent text input where the DM provides the "Visual description of the character." This is the core variable that defines the prompt.
- **Style & Logic Controller:** A series of dropdowns and toggles that enforce the script's specific aesthetic requirements (e.g., Top-down view, 2D Game Art, Fantasy style).
- **Prompt Synthesis Engine:** A real-time previewer that shows how the user's description is being woven into the technical prompt (including keywords like "vivid colors," "transparent background," and "vtt token style").
- **Asset Generation Console:** A workspace integrated with DALL-E that displays the resulting image and provides tools for background removal and library management.

## Interaction Logic
- **Perspective Hard-Coding:** The UI automatically prepends the required perspective instructions ("Illustration of a top-down aerial view...") to ensure the output is always a functional VTT token.
- **Preset Switching:** Selecting "Token Style v1" vs "Token Style v2" subtlely shifts the secondary keywords to match the specific tone of those script versions.
- **Transparency Workflow:** Includes a dedicated "Remove Background" step to ensure the asset is ready for immediate placement on a digital battlemap.

## Visual Design
- **Asset-Centric Layout:** Priorities the visual output (the token) while keeping the text tools compact and accessible.
- **VTT Grid Aesthetic:** The image preview window uses a faint grid background to help the DM visualize how the token will look on a map.
- **Sleek & Visual UI:** Uses icons and thumbnail previews to help the DM manage multiple generated assets in a single session.

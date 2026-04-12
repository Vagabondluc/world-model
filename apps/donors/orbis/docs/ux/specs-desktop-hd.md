
# UX Spec: Desktop / HD+ (>1280px)

## Philosophy
The "Command Center". The user has access to all tools simultaneously without obscuring the central viewport.

## Layout Grid
*   **Structure:** CSS Grid `[64px_1fr_320px] / [60px_1fr_auto]`
*   **Safe Zone (Viewport):** Central region, minimum 800x600px visible at all times.

## Zones
1.  **Zone A (Header):** Fixed Top Bar (Height: 56px).
    *   *Contains:* Branding, Global Undo/Redo, Project State (Save/Load).
    *   *Z-Index:* 50.
2.  **Zone B (Tools):** Fixed Left Rail (Width: 64px).
    *   *Contains:* Terraform Brushes, View Modes (Icons only).
    *   *Behavior:* Tooltips on hover.
3.  **Zone C (Simulation Config):** Fixed Right Panel (Width: 320px).
    *   *Contains:* The "Simulation Tuner" (Tabs: Cosmic, Geo, Hydro, Bio).
    *   *Behavior:* Scrollable vertical content. Never overlaps viewport.
4.  **Zone D (Inspector):** Bottom-Right Floating (Width: 320px, Max-Height: 40%).
    *   *Behavior:* Anchored to bottom of Zone C. Context-aware.
5.  **Zone E (Timeline):** Bottom-Center Overlay.
    *   *Contains:* Time scrubber, Play/Pause.
    *   *Behavior:* Floating, centered, minimal height.

## Interaction Model
*   **Hover:** Reveal tooltips.
*   **Click:** Activates mode or toggles panel section.
*   **Drag:** Rotates globe (center zone only).

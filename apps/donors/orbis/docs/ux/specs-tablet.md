
# UX Spec: Tablet (768px - 1280px)

## Philosophy
The "Field Tablet". Focus on touch interaction and focused tasks. UI panels collapse to maximize view.

## Layout Grid
*   **Structure:** CSS Grid `[64px_1fr] / [56px_1fr]`
*   **Safe Zone:** Full screen, UI overlays must be toggleable.

## Zones
1.  **Zone A (Header):** Condensed Top Bar (Height: 56px).
    *   *Contains:* Hamburger Menu (Left), Title, "Edit/View" Toggle (Right).
2.  **Zone B (Tools):** Floating Left Dock (Width: 64px).
    *   *Behavior:* Semi-transparent. Toggles visibility based on "Edit Mode".
3.  **Zone C (Simulation Config):** Slide-over Sheet (Right).
    *   *Width:* 300px.
    *   *Behavior:* Off-screen by default. Triggered by "Settings" button in Header.
    *   *Backdrop:* Blurs viewport when open.
4.  **Zone D (Inspector):** Bottom Sheet (Peek height: 60px, Full: 50%).
    *   *Behavior:* Swipe up to reveal details of selected hex.
5.  **Zone E (Timeline):** Mini-widget in Top-Left (below header).

## Interaction Model
*   **Tap:** Select Hex.
*   **Two-Finger Pan:** Rotate Camera.
*   **Pinch:** Zoom.

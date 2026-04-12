
# UX Spec: Mobile (<768px)

## Philosophy
The "Scanner". Pure visualization with modal interactions. No permanent chrome except the bottom navigation.

## Layout Grid
*   **Structure:** Flex Column.
*   **Safe Zone:** Top 70% of screen.

## Zones
1.  **Zone A (Header):** Minimal (Height: 48px).
    *   *Contains:* Menu Icon, Current Mode Label.
2.  **Zone B (Navigation):** Bottom Tab Bar (Height: 64px).
    *   *Tabs:* Inspect, Layers, Tools, System.
3.  **Zone C (Panels):** Full-screen Modals.
    *   *Behavior:* "System" tab opens the Simulation Tuner as a full-screen modal overlay.
    *   *Behavior:* "Tools" tab opens a bottom-half sheet with brushes.
4.  **Zone D (Inspector):** Contextual Overlay (Top of Tab Bar).
    *   *Behavior:* Appears when object selected.

## Interaction Model
*   **Thumb Zone:** All primary actions (Tabs) in bottom 20% of screen.
*   **Gestures:** Critical. Single finger rotate, two finger pan/zoom.
*   **Inputs:** Sliders must have thick touch targets (44px min).

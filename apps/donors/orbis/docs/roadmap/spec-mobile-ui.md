
# SPEC: Responsive UI for Mobile & Tablet

## Status

**Draft – Approved for Implementation**

## Scope

This specification outlines the adaptation of the Orbis UI for touch devices. It prioritizes **gesture disambiguation** (navigation vs. modification) and **viewport maximization**.

---

## 1. Interaction Model (Crucial)

### 1.1 Gesture Mapping
Mobile 3D interaction requires separating "Camera Control" from "World Interaction".

| State | 1-Finger Drag | 2-Finger Drag | Pinch |
| :--- | :--- | :--- | :--- |
| **Default (View)** | Rotate Camera | Pan Camera | Zoom |
| **Terraform (Edit)** | **Apply Brush** | Rotate/Pan Camera | Zoom |

*Implementation Note*: The `OrbitControls` must have `enabled={true}` generally, but we must use `touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}` in Default mode, and disable single-touch rotation in Terraform mode.

---

## 2. Layout Strategy

### 2.1 Portrait (Phone)
*   **Header**: Minimal height. Logo + "Hamburger" menu for secondary actions.
*   **Canvas**: Fills remaining space.
*   **Controls**: Floating "Dock" at the bottom center.

### 2.2 Landscape (Phone)
*   **Header**: Hidden or collapsed into a top-left floating button.
*   **Canvas**: Full screen.
*   **Controls**: Vertical floating dock on the **Right** edge (thumb accessible).

### 2.3 Tablet
*   **Hybrid**: Sidebar layout similar to Desktop, but collapsible.

---

## 3. Component Adaptations

### 3.1 The "Control Dock" (Replaces Bottom Bar)
A floating container with glassmorphism (`backdrop-blur`) housing primary toggles.

*   **State A (Default)**:
    *   `[Layers Icon]` -> Opens View Mode Sheet.
    *   `[Tools Icon]` -> Enters Terraform Mode.
    *   `[Inspect Icon]` -> Opens Voxel Inspector Sheet.
*   **State B (Terraform Active)**:
    *   Displays current Brush (e.g., `[Raise]`).
    *   `[Settings Icon]` -> Opens Brush Size/Intensity slider popover.
    *   `[Done/Check Icon]` -> Exits Terraform Mode (Returns to State A).

### 3.2 View Mode Sheet
*   **Behavior**: Bottom Sheet (slide-up).
*   **Content**: Grid of buttons for `Biome`, `Elevation`, `Plates`, etc.
*   **Toggles**: Switches for `Clouds`, `Relief`, `Voxel Mode`.

### 3.3 Local Inspector (Voxel View)
*   **Behavior**:
    *   **Phone**: Bottom Sheet. Snaps to **40% height** (peek) or **90% height** (full).
    *   **Background**: When at 90% height, pause the main Globe loop to save battery.
*   **Content**:
    *   Top Bar: Hex ID, Biome Label, Close Button.
    *   Middle: `VoxelVisualizer` Canvas.
    *   Bottom: Data readout grid (Temp, Moisture).

### 3.4 Settings & Meta
*   **Location**: Inside a "Hamburger" menu in the Header (Portrait) or Top-Left FAB (Landscape).
*   **Content**: Seed, Regenerate, Config Sliders.

---

## 4. Visual Mockups

### 4.1 Portrait - Default View
```
+-----------------------------------+
| 🌍 ORBIS                    [☰] | <- Slim Header
|-----------------------------------|
|                                   |
|                                   |
|           (GLOBE VIEW)            |
|                                   |
|                                   |
|    (Floating Dock)                |
|  [ 🥞 Layers ] [ 🛠️ Tools ]      |
+-----------------------------------+
```

### 4.2 Portrait - Terraform Active
```
+-----------------------------------+
| 🌍 ORBIS                    [☰] |
|-----------------------------------|
|                                   |
|      (1-Finger Paints)            |
|      (2-Fingers Rotate)           |
|                                   |
|    (Floating Tool Palette)        |
|  [⬆️] [⬇️] [🔥] [❄️]  [⚙️] [✅] |
+-----------------------------------+
```
*Note: The [⚙️] button opens a small popover for Brush Radius/Intensity sliders just above the dock.*

### 4.3 Landscape - Inspector Open (Peek)
```
+-------------------------------------------------+
| [☰]                                             |
|                                                 |
|               (GLOBE VISIBLE HERE)              |
|                                                 |
|-------------------------------------------------|
| [x] Cell-1234 (Tropical Rainforest)       [ ^ ] | <- Handle
|-------------------------------------------------|
|                                                 |
|            (VOXEL CANVAS - 40% Height)          |
|                                                 |
+-------------------------------------------------+
```

## 5. Implementation Roadmap

1.  **Refactor `App.tsx` Layout**:
    *   Introduce `isMobile` check (media query).
    *   Wrap Desktop-specific sidebars in `hidden md:flex`.
    *   Create `MobileDock` component.
    *   Create `MobileHeader` component.

2.  **Interaction Refactor**:
    *   Update `OrbitControls` in `HexGrid.tsx` to accept touch-action props passed from `App.tsx` based on `terraformMode`.

3.  **Component Creation**:
    *   `BottomSheet`: A generic wrapper for the Inspector and View Modes.
    *   `BrushSettingsPopover`: Small floating div for sliders.

## 6. CSS / Tailwind Strategy
*   Use `fixed bottom-6 left-1/2 -translate-x-1/2` for the Dock.
*   Use `touch-none` on the Canvas container to prevent scroll interference.
*   Use `backdrop-blur-xl bg-slate-900/80` for all floating elements to maintain visibility of the globe behind controls.

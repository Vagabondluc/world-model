
# Spec: UI Hardening, Accessibility & Flat Projection (Phase 23)

## 1. Objective
Transform the "Orbis" interface from a prototype dashboard into a production-grade, accessible application. This phase introduces comprehensive help systems, keyboard navigation, responsive view modes (including a Flat Map projection), and robust menu navigation.

## 2. Accessibility (A11y) & Tooltips

### 2.1 The Global Tooltip System
A centralized `TooltipProvider` must be implemented to handle hover and focus states for all interactive elements.

*   **Behavior**:
    *   **Hover**: Short delay (300ms) before appearing.
    *   **Focus**: Appears immediately on keyboard focus.
    *   **Positioning**: Context-aware (flips top/bottom/left/right based on viewport edge).
*   **Content**:
    *   **Label**: The action name (e.g., "Raise Terrain").
    *   **Shortcut**: The hotkey (e.g., `[R]`).
    *   **Description**: 1-sentence explanation of the mechanic.

### 2.2 Keyboard Navigation
*   **Focus Traps**: Modals (Help, Load, Settings) must trap focus so `Tab` doesn't escape to the background.
*   **Skip Links**: Hidden "Skip to Canvas" and "Skip to Inspector" links for screen readers.
*   **Shortcuts**:
    *   `?`: Toggle Help Menu.
    *   `M`: Cycle View Mode (Globe / Map).
    *   `Esc`: Close active panel / Deselect Hex.
    *   `Space`: Pause/Resume Simulation.

## 3. Help & Onboarding

### 3.1 The "Operator's Manual" (Help Menu)
A dedicated modal accessible via the Header.
*   **Tabs**:
    1.  **Controls**: Mouse gestures and Keyboard shortcuts.
    2.  **Symbology**: Dynamic Legend (reuses the `Legend` component logic but expanded).
    3.  **Simulation Guide**: Explains the layers (Geology -> Biology -> Civ).

## 4. Enhanced Panel Architecture

### 4.1 Mobile Navigation Stack
On narrow screens, the "Sidebar" and "Inspector" cannot coexist side-by-side. We implement a **Stack Navigator** pattern.

*   **State**: `ui.navStack: PanelId[]`
*   **Behavior**:
    *   Opening a submenu pushes it to the stack.
    *   A sticky **"Back"** button appears in the panel header.
    *   Example Flow: `Main Menu` -> `Cosmic Tuner` -> `Back` -> `Main Menu`.

### 4.2 Inspector Modes
The Right Panel (Inspector) gains a view toggle:
1.  **Docked (Default)**: Standard 320px width.
2.  **Zen (Fullscreen)**: Expands to cover the viewport (minus header).
    *   Useful for analyzing complex Voxel chunks without the distraction of the globe.
    *   Includes a "Minimize" button to return to Docked state.

## 5. Flat Map Projection (The Planar View)

### 5.1 Concept
An alternative visualization to the Sphere. It renders the *exact same* simulation data (Hexes) onto a 2D Equirectangular plane. This allows seeing the entire world at once (poles to equator).

### 5.2 Implementation Strategy
We do *not* use a separate 2D renderer. We use the existing Three.js scene with a geometry swap.

*   **Geometry**: `THREE.PlaneGeometry` (Aspect Ratio 2:1).
*   **Mapping Logic**:
    *   **Globe**: `Position = Normal * Radius`.
    *   **Map**: `Position.x = (Longitude / 180) * Width`, `Position.y = (Latitude / 90) * Height`.
*   **Transition**: 
    *   Option A: Hard switch (Replace `GlobeScene` with `MapScene`).
    *   Option B: Morph Targets (Vertices interpolate from Sphere to Plane). *Decision: Hard switch for V1 performance.*

### 5.3 Shared Systems
The Flat Map must support all existing layers:
*   **Hex/Voxel Mode**: Instanced meshes work identically, just positioned differently.
*   **Clouds/Wind**: Re-mapped to the 2D plane (wrapping at X edges is optional for V1).
*   **Interaction**: Raycasting logic must adapt to the Plane geometry.

## 6. Data Model Updates

### 6.1 `UIStore`
```typescript
interface UIState {
  // ... existing
  projectionMode: 'GLOBE' | 'FLAT';
  inspectorMode: 'DOCKED' | 'FULLSCREEN';
  
  // Actions
  setProjectionMode: (mode: 'GLOBE' | 'FLAT') => void;
  toggleInspectorFullscreen: () => void;
}
```

## 7. Deliverables Plan

1.  **`TooltipSystem.tsx`**: Generic wrapper component.
2.  **`HelpModal.tsx`**: The documentation interface.
3.  **`FlatMapScene.tsx`**: The 2D counterpart to `GlobeScene`.
4.  **Refactor `RightPanel.tsx`**: Add Fullscreen toggle and Back navigation.
5.  **Update `Header.tsx`**: Add Help and Re-seed (prominent) buttons.

## 8. Verification
*   [ ] **TC-23-01**: Tabbing through the UI highlights buttons sequentially.
*   [ ] **TC-23-02**: Switching to "Flat" view preserves the current selection and data visualization colors.
*   [ ] **TC-23-03**: Mobile "Back" button correctly restores previous menu state.

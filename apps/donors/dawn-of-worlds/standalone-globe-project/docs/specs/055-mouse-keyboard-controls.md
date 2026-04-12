# SPEC-055: Mouse and Keyboard Controls

**Epic:** Globe UI Components  
**Status:** DRAFT  
**Dependencies:** SPEC-053 (Globe Interaction), SPEC-052 (Globe Renderer Integration)

## 1. Overview

This specification defines a comprehensive input control system for the standalone globe project, enabling intuitive mouse and keyboard interactions for camera manipulation, cell navigation, and application shortcuts. The goal is to transform the globe from a tool requiring UI panel interactions into a fully navigable 3D experience.

## 2. Goals

1. **Intuitive Navigation**: Users should navigate the globe naturally with standard 3D controls.
2. **Keyboard Shortcuts**: Power users can perform actions quickly via hotkeys.
3. **Accessibility**: All mouse actions should have keyboard equivalents where feasible.
4. **Performance**: Input handling must not impact 60fps rendering.
5. **Extensibility**: The control system should be modular for future enhancements.

## 3. Requirements

### 3.1 Mouse Controls - Camera

| Action | Input | Behavior |
|--------|-------|----------|
| **Rotate** | Left-click + Drag | Orbit camera around the globe center |
| **Zoom** | Scroll Wheel | Zoom in/out with smooth interpolation |
| **Pan** | Right-click + Drag | Pan camera (shift focus point) |
| **Quick Zoom** | Double-click on globe | Zoom to clicked location |

**Constraints**:
- Minimum zoom distance: `radius * 1.2` (prevent entering the globe)
- Maximum zoom distance: `radius * 6.0` (keep globe visible)
- Smooth damping on all camera movements (existing via OrbitControls)

### 3.2 Mouse Controls - Interaction

| Action | Input | Behavior |
|--------|-------|----------|
| **Hover** | Mouse move | Highlight cell under cursor (already implemented) |
| **Select** | Left-click on cell | Select cell and show info panel (already implemented) |
| **Deselect** | Left-click empty space | Clear selection |
| **Context Menu** | Right-click on cell | Future: Show cell-specific actions |

### 3.3 Keyboard Controls - Camera

| Action | Key | Behavior |
|--------|-----|----------|
| **Rotate Left** | `A` or `←` | Rotate globe left |
| **Rotate Right** | `D` or `→` | Rotate globe right |
| **Rotate Up** | `W` or `↑` | Rotate globe up (north pole toward camera) |
| **Rotate Down** | `S` or `↓` | Rotate globe down (south pole toward camera) |
| **Zoom In** | `+` or `=` | Zoom camera toward globe |
| **Zoom Out** | `-` | Zoom camera away from globe |
| **Reset View** | `Home` or `R` | Reset camera to default position |
| **Toggle Auto-Rotate** | `Space` | Toggle auto-rotation on/off |

**Rotation Speed**: Configurable, default 2° per keypress or 30°/s while held.

### 3.4 Keyboard Controls - Selection

| Action | Key | Behavior |
|--------|-----|----------|
| **Clear Selection** | `Escape` | Deselect current cell |
| **Cycle Selection** | `Tab` | Select next cell (neighbor-based) |
| **Cycle Selection Back** | `Shift+Tab` | Select previous cell |
| **Center Selected** | `C` | Center camera on selected cell |

### 3.5 Keyboard Controls - Application

| Action | Key | Behavior |
|--------|-----|----------|
| **Toggle Control Panel** | `P` | Show/hide the control panel |
| **Toggle Info Panel** | `I` | Show/hide the cell info panel |
| **Step Simulation** | `N` | Advance simulation by one step |
| **Toggle Auto-Run** | `T` | Toggle auto-run simulation |
| **Generate New World** | `G` | Generate new world with current params |
| **Cycle Display Mode** | `M` | Cycle through display modes (Biome → Elevation → ...) |

### 3.6 Modifier Keys

| Modifier | Effect |
|----------|--------|
| `Shift` | Increase movement speed (2x) |
| `Ctrl` | Decrease movement speed (0.5x) |
| `Alt` | Reserved for future use |

## 4. Architecture

### 4.1 New Components

#### `InputController` (Logic Layer)
- Central input manager for keyboard and mouse events
- Maintains current input state (pressed keys, mouse position)
- Emits actions rather than directly manipulating camera
- Configurable keybindings

#### `CameraController` (Logic Layer)
- Wraps/extends OrbitControls
- Provides programmatic camera API:
  - `rotateTo(lat, lon)` - Rotate to specific coordinates
  - `zoomTo(distance)` - Zoom to specific distance
  - `centerOn(cell)` - Center view on a cell
  - `resetView()` - Return to default view
- Smooth interpolation for all movements

#### `KeyboardShortcutManager` (Logic Layer)
- Maps keycodes to actions
- Supports combos (e.g., `Ctrl+Z`)
- Emits action events that App.tsx handles

### 4.2 Updated Components

#### `ThreeGlobeRenderer`
- Expose camera control methods
- Accept `CameraController` instance or expose internal controls

#### `GlobeRenderer.tsx`
- Forward keyboard events to InputController
- Handle shortcut actions

#### `App.tsx`
- Register keyboard shortcuts
- Handle application-level actions (toggle panels, simulation controls)

### 4.3 Data Flow

```
User Input (Mouse/Keyboard)
          ↓
    InputController
          ↓
    ┌─────┴─────┐
    ↓           ↓
CameraController  KeyboardShortcutManager
    ↓                     ↓
OrbitControls      App.tsx / Actions
    ↓                     ↓
  Camera            UI State Update
    ↓
 Renderer
```

## 5. Configuration

### 5.1 Keybinding Config
```typescript
interface KeybindConfig {
  camera: {
    rotateLeft: string[];    // ['a', 'ArrowLeft']
    rotateRight: string[];   // ['d', 'ArrowRight']
    // ...
  };
  selection: {
    clear: string[];         // ['Escape']
    cycleNext: string[];     // ['Tab']
    // ...
  };
  application: {
    togglePanel: string[];   // ['p']
    // ...
  };
}
```

### 5.2 Movement Config
```typescript
interface MovementConfig {
  rotationSpeed: number;      // Degrees per second
  zoomSpeed: number;          // Units per second
  shiftMultiplier: number;    // Speed multiplier when Shift held
  ctrlMultiplier: number;     // Speed multiplier when Ctrl held
  dampingFactor: number;      // Smoothing factor (0-1)
}
```

## 6. Accessibility

- All camera operations accessible via keyboard
- No time-limited interactions
- Clear visual feedback for current control mode
- Support for screen reader announcements on selection changes

## 7. Verification

### 7.1 Unit Tests
- `InputController.test.ts`: Key state management, event emission
- `CameraController.test.ts`: Camera API, interpolation math
- `KeyboardShortcutManager.test.ts`: Keybind matching, combos

### 7.2 Integration Tests
- Keyboard rotation updates camera position
- Zoom limits enforced
- Selection via keyboard works

### 7.3 Manual Testing
- Smooth 60fps during rapid input
- Controls feel natural and responsive
- All shortcuts work as documented

---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# TDD: Globe Camera Interaction

## Specification Reference
- Spec: [`034-globe-camera-interaction.md`](../specs/034-globe-camera-interaction.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: Interaction State Management
**Given** user input is received
**When** interaction state is updated
**Then** state must reflect current interaction mode

### AC-002: Mouse Event Handling
**Given** a mouse event
**When** event is processed
**Then** appropriate action must be performed

### AC-003: Touch Event Handling
**Given** a touch event
**When** gesture is recognized
**Then** appropriate action must be performed

### AC-004: Camera Rotation
**Given** drag input
**When** rotation is performed
**Then** camera must rotate correctly

### AC-005: Camera Pan
**Given** pan input
**When** pan is performed
**Then** camera must pan correctly

### AC-006: Camera Zoom
**Given** zoom input
**When** zoom is performed
**Then** zoom level must update correctly

### AC-007: Cell Selection
**Given** screen position
**When** cell selection is requested
**Then** cell ID must be returned

### AC-008: Polar Locking
**Given** camera rotation approaches pole
**When** polar angle is exceeded
**Then** rotation must be clamped

### AC-009: Keyboard Navigation
**Given** keyboard input
**When** key is pressed
**Then** appropriate navigation action must occur

### AC-010: Tap Detection
**Given** touch input
**When** tap occurs
**Then** tap must be distinguished from drag

### AC-011: Controls Configuration
**Given** a controls config
**When** controls are initialized
**Then** config must be applied

---

## Test Cases

### AC-001: Interaction State Management

#### TC-001-001: Happy Path - Initialize IDLE State
**Input**:
```typescript
{
  config: DEFAULT_CONTROLS_CONFIG
}
```
**Expected**: State initialized with mode="IDLE"
**Priority**: P0

#### TC-001-002: Happy Path - Transition to DRAG State
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "MOUSEDOWN", button: 0 }
}
```
**Expected**: State changes to mode="DRAG", isDragging=true
**Priority**: P0

#### TC-001-003: Happy Path - Transition to ZOOM State
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "WHEEL", delta: 1 }
}
```
**Expected**: State changes to mode="ZOOM", zoom level updated
**Priority**: P0

#### TC-001-004: Happy Path - Transition to SELECT State
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "MOUSEUP", button: 0 }
}
```
**Expected**: State changes to mode="SELECT", selectedCell set
**Priority**: P0

#### TC-001-005: Edge Case - Invalid State Transition
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "MOUSEUP", button: 0 }
}
```
**Expected**: No change, cannot zoom in IDLE mode
**Priority**: P1

#### TC-001-006: Integration - Full State Machine
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  events: [
    { type: "MOUSEDOWN", button: 0 },
    { type: "WHEEL", delta: 1 },
    { type: "MOUSEUP", button: 0 },
    { type: "CLICK", button: 0 }
  ]
}
```
**Expected**: State transitions through IDLE → DRAG → IDLE → ZOOM → SELECT → IDLE
**Priority**: P0

---

### AC-002: Mouse Event Handling

#### TC-002-001: Happy Path - Mouse Down
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "MOUSEDOWN", button: 0 }
}
```
**Expected**: State changes to mode="DRAG", dragStart recorded
**Priority**: P0

#### TC-002-002: Happy Path - Mouse Move
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera rotated
**Priority**: P0

#### TC-002-003: Happy Path - Mouse Up
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera rotated
**Priority**: P0

#### TC-002-004: Happy Path - Mouse Up
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera rotated
**Priority**: P0

#### TC-002-005: Edge Case - Mouse Up at Limit
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  event: { type: "MOUSEMOVE", clientY: 0 }
}
```
**Expected**: Rotation clamped at top limit
**Priority**: P1

#### TC-002-006: Happy Path - Mouse Up
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  event: { type: "MOUSEMOVE", clientY: 600 }
}
```
**Expected**: Camera rotated
**Priority**: P0

#### TC-002-007: Happy Path - Mouse Wheel Zoom In
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "WHEEL", deltaY: -120 }
}
```
**Expected**: Zoom level increased
**Priority**: P0

#### TC-002-008: Happy Path - Mouse Wheel Zoom Out
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "WHEEL", deltaY: 120 }
}
```
**Expected**: Zoom level decreased
**Priority**: P0

#### TC-002-009: Edge Case - Zoom at Limit
**Input**:
```typescript
{
  state: { mode: "IDLE", zoomLevel: 1.0 },
  event: { type: "WHEEL", deltaY: 1 }
}
```
**Expected**: Zoom level unchanged (at max)
**Priority**: P1

#### TC-002-010: Happy Path - Mouse Click
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "CLICK", button: 0, clientX: 400, clientY: 300 }
}
```
**Expected**: Cell selected, state changes to SELECT
**Priority**: P0

#### TC-002-011: Edge Case - Click Off-Screen
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "CLICK", button: 0, clientX: -100, clientY: -100 }
}
```
**Expected**: No cell selected, state remains IDLE
**Priority**: P1

#### TC-002-012: Integration - Full Mouse Workflow
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  events: [
    { type: "MOUSEDOWN", button: 0 },
    { type: "MOUSEMOVE", clientX: 100, clientY: 200 },
    { type: "MOUSEUP", clientY: 200 },
    { type: "WHEEL", deltaY: -120 },
    { type: "CLICK", button: 0, clientX: 400, clientY: 300 }
  ]
}
```
**Expected**: All events processed in sequence
**Priority**: P0

---

### AC-003: Touch Event Handling

#### TC-003-001: Happy Path - Touch Start
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "TOUCHSTART", touches: [{ clientX: 100, clientY: 200 }] }
}
```
**Expected**: State changes to mode="SELECT", tapStart recorded
**Priority**: P0

#### TC-003-002: Happy Path - Touch Move
**Input**:
```typescript
{
  state: { mode: "SELECT", isDragging: true },
  event: { type: "TOUCHMOVE", touches: [{ clientX: 150, clientY: 250 }] }
}
```
**Expected**: Camera rotated
**Priority**: P0

#### TC-003-003: Happy Path - Touch Move
**Input**:
```typescript
{
  state: { mode: "SELECT", isDragging: true },
  event: { type: "TOUCHMOVE", touches: [{ clientX: 150, clientY: 250 }] }
}
```
**Expected**: Camera rotated
**Priority**: P0

#### TC-003-004: Happy Path - Touch End
**Input**:
```typescript
{
  state: { mode: "SELECT", isDragging: true },
  event: { type: "TOUCHEND", touches: [{ clientX: 150, clientY: 250 }] }
}
```
**Expected**: Tap detected, cell selected
**Priority**: P0

#### TC-003-005: Edge Case - Touch Move with Drag
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  event: { type: "TOUCHSTART", touches: [{ clientX: 100, clientY: 200 }] }
}
```
**Expected**: Drag starts, tap not detected
**Priority**: P1

#### TC-003-006: Happy Path - Pinch Start
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "TOUCHSTART", touches: [{ clientX: 100, clientY: 200 }, { clientX: 200, clientY: 200 }] }
}
```
**Expected**: State changes to mode="ZOOM"
**Priority**: P0

#### TC-003-007: Happy Path - Pinch Zoom In
**Input**:
```typescript
{
  state: { mode: "ZOOM", isDragging: true },
  event: { type: "TOUCHMOVE", touches: [{ clientX: 100, clientY: 200 }, { clientX: 200, clientY: 150 }] }
}
```
**Expected**: Zoom level increased
**Priority**: P0

#### TC-003-008: Happy Path - Pinch End
**Input**:
```typescript
{
  state: { mode: "ZOOM", isDragging: true },
  event: { type: "TOUCHEND", touches: [{ clientX: 100, clientY: 200 }, { clientX: 200, clientY: 150 }] }
}
```
**Expected**: Zoom level updated, tap detected
**Priority**: P0

#### TC-003-009: Edge Case - Pinch at Limit
**Input**:
```typescript
{
  state: { mode: "ZOOM", zoomLevel: 10.0 },
  event: { type: "TOUCHMOVE", touches: [{ clientX: 100, clientY: 200 }, { clientX: 200, clientY: 150 }] }
}
```
**Expected**: Zoom level unchanged (at max)
**Priority**: P1

#### TC-003-010: Integration - Full Touch Workflow
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  events: [
    { type: "TOUCHSTART", touches: [{ clientX: 100, clientY: 200 }] },
    { type: "TOUCHMOVE", touches: [{ clientX: 150, clientY: 250 }] },
    { type: "TOUCHEND", touches: [{ clientX: 150, clientY: 250 }] },
    { type: "TOUCHSTART", touches: [{ clientX: 100, clientY: 200 }, { clientX: 200, clientY: 200 }] }
  ]
}
```
**Expected**: All touch events processed
**Priority**: P0

---

### AC-004: Camera Rotation

#### TC-004-001: Happy Path - Rotate Right
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera rotates right
**Priority**: P0

#### TC-004-002: Happy Path - Rotate Left
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera rotates left
**Priority**: P0

#### TC-004-003: Happy Path - Rotate Up
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera rotates up
**Priority**: P0

#### TC-004-004: Happy Path - Rotate Down
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera rotates down
**Priority**: P0

#### TC-004-005: Edge Case - Rotate at Pole
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  camera: { rotation: [0, 1.5, 0] }
}
```
**Expected**: Rotation clamped at pole
**Priority**: P1

#### TC-004-006: Edge Case - Invalid Rotation
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  camera: { rotation: [0, 0, 0] }
}
```
**Expected**: No change (already at pole)
**Priority**: P1

#### TC-004-007: Integration - Continuous Rotation
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  events: [
    { type: "MOUSEMOVE", clientX: 100, clientY: 200 },
    { type: "MOUSEMOVE", clientX: 150, clientY: 250 },
    { type: "MOUSEMOVE", clientX: 200, clientY: 300 }
  ]
}
```
**Expected**: Camera rotates continuously
**Priority**: P0

---

### AC-005: Camera Pan

#### TC-005-001: Happy Path - Pan Right
**Input**:
```typescript
{
  state: { mode: "PAN", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera pans right
**Priority**: P0

#### TC-005-002: Happy Path - Pan Left
**Input**:
```typescript
{
  state: { mode: "PAN", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera pans left
**Priority**: P0

#### TC-005-003: Happy Path - Pan Up
**Input**:
```typescript
{
  state: { mode: "PAN", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera pans up
**Priority**: P0

#### TC-005-004: Happy Path - Pan Down
**Input**:
```typescript
{
  state: { mode: "PAN", isDragging: true },
  event: { type: "MOUSEMOVE", clientX: 100, clientY: 200 }
}
```
**Expected**: Camera pans down
**Priority**: P0

#### TC-005-005: Edge Case - Pan at Limit
**Input**:
```typescript
{
  state: { mode: "PAN", camera: { position: [0, 1000, 0] }
}
```
**Expected**: Pan clamped at limit
**Priority**: P1

#### TC-005-006: Integration - Full Pan Workflow
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  events: [
    { type: "MOUSEDOWN", button: 0 },
    { type: "MOUSEMOVE", clientX: 100, clientY: 200 },
    { type: "MOUSEUP", clientY: 200 },
    { type: "MOUSEMOVE", clientX: 150, clientY: 250 }
  ]
}
```
**Expected**: Camera pans correctly
**Priority**: P0

---

### AC-006: Camera Zoom

#### TC-006-001: Happy Path - Zoom In
**Input**:
```typescript
{
  state: { mode: "IDLE", zoomLevel: 1.0 },
  event: { type: "WHEEL", deltaY: -120 }
}
```
**Expected**: Zoom level increases to 1.1
**Priority**: P0

#### TC-006-002: Happy Path - Zoom Out
**Input**:
```typescript
{
  state: { mode: "IDLE", zoomLevel: 1.1 },
  event: { type: "WHEEL", deltaY: 120 }
}
```
**Expected**: Zoom level decreases to 1.0
**Priority**: P0

#### TC-006-003: Happy Path - Zoom to Max
**Input**:
```typescript
{
  state: { mode: "IDLE", zoomLevel: 1.0 },
  event: { type: "WHEEL", deltaY: -1 }
}
```
**Expected**: Zoom level increases to 10.0
**Priority**: P0

#### TC-006-004: Edge Case - Zoom at Max
**Input**:
```typescript
{
  state: { mode: "IDLE", zoomLevel: 10.0 },
  event: { type: "WHEEL", deltaY: 1 }
}
```
**Expected**: Zoom level unchanged (at max)
**Priority**: P1

#### TC-006-005: Integration - Smooth Zoom
**Input**:
```typescript
{
  state: { mode: "IDLE", zoomLevel: 1.0 },
  events: [
    { type: "WHEEL", deltaY: -120 },
    { type: "WHEEL", deltaY: 120 }
  ]
}
```
**Expected**: Zoom level transitions smoothly
**Priority**: P0

#### TC-006-006: Edge Case - Zoom Out of Range
**Input**:
```typescript
{
  state: { mode: "IDLE", zoomLevel: 1.0 },
  event: { type: "WHEEL", deltaY: -1200 }
}
```
**Expected**: Error thrown or clamped
**Priority**: P0

---

### AC-007: Cell Selection

#### TC-007-001: Happy Path - Select Cell at Center
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "CLICK", button: 0, clientX: 400, clientY: 300 }
}
```
**Expected**: Cell at center returned
**Priority**: P0

#### TC-007-002: Happy Path - Select Cell at Edge
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "CLICK", button: 0, clientX: 200, clientY: 300 }
}
```
**Expected**: Cell at edge returned
**Priority**: P0

#### TC-007-003: Edge Case - Select Off-Screen Cell
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "CLICK", button: 0, clientX: -100, clientY: -100 }
}
```
**Expected**: Returns null
**Priority**: P1

#### TC-007-004: Integration - Select Multiple Cells
**Input**:
```typescript
{
  events: [
    { type: "CLICK", button: 0, clientX: 400, clientY: 300 },
    { type: "CLICK", button: 0, clientX: 400, clientY: 300 }
  ]
}
```
**Expected**: Last cell selected
**Priority**: P0

---

### AC-008: Polar Locking

#### TC-008-001: Happy Path - Clamp at North Pole
**Input**:
```typescript
{
  camera: { rotation: [0, 1.5, 0] },
  config: { enablePolarLock: true, minPolarAngle: -85 * (Math.PI / 180) }
}
```
**Expected**: Rotation clamped at -85 degrees
**Priority**: P0

#### TC-008-002: Happy Path - Clamp at South Pole
**Input**:
```typescript
{
  camera: { rotation: [0, -1.5, 0] },
  config: { enablePolarLock: true, minPolarAngle: -85 * (Math.PI / 180) }
}
```
**Expected**: Rotation clamped at 85 degrees
**Priority**: P0

#### TC-008-003: Edge Case - Clamp at Limit
**Input**:
```typescript
{
  camera: { rotation: [0, 1.5, 0] },
  event: { type: "MOUSEMOVE", clientY: 100 }
}
```
**Expected**: Rotation clamped at limit
**Priority**: P1

#### TC-008-004: Integration - Continuous Rotation at Pole
**Input**:
```typescript
{
  state: { mode: "DRAG", isDragging: true },
  events: [
    { type: "MOUSEMOVE", clientY: 100 },
    { type: "MOUSEMOVE", clientY: 50 }
  ]
}
```
**Expected**: Rotation clamped smoothly at pole
**Priority**: P0

---

### AC-009: Keyboard Navigation

#### TC-009-001: Happy Path - Arrow Right Key
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "KEYDOWN", key: "ArrowRight" }
}
```
**Expected**: Camera rotates right
**Priority**: P0

#### TC-009-002: Happy Path - Arrow Left Key
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "KEYDOWN", key: "ArrowLeft" }
}
```
**Expected**: Camera rotates left
**Priority**: P0

#### TC-009-003: Happy Path - Arrow Up Key
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "KEYDOWN", key: "ArrowUp" }
}
```
**Expected**: Camera rotates up
**Priority**: P0

#### TC-009-004: Happy Path - Arrow Down Key
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "KEYDOWN", key: "ArrowDown" }
}
```
**Expected**: Camera rotates down
**Priority**: P0

#### TC-009-005: Happy Path - Plus Key Zoom In
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "KEYDOWN", key: "+" }
}
```
**Expected**: Zoom level increased
**Priority**: P0

#### TC-009-006: Happy Path - Minus Key Zoom Out
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "KEYDOWN", key: "-" }
}
```
**Expected**: Zoom level decreased
**Priority**: P0

#### TC-009-007: Edge Case - Invalid Key
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "KEYDOWN", key: "X" }
}
```
**Expected**: No action, key not recognized
**Priority**: P1

#### TC-009-008: Integration - Full Keyboard Navigation
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  events: [
    { type: "KEYDOWN", key: "ArrowRight" },
    { type: "KEYDOWN", key: "ArrowLeft" },
    { type: "KEYDOWN", key: "+" },
    { type: "KEYDOWN", key: "-" }
  ]
}
```
**Expected**: All keys work correctly
**Priority**: P0

---

### AC-010: Tap Detection

#### TC-010-001: Happy Path - Detect Tap
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "TOUCHEND", touches: [{ clientX: 100, clientY: 200 }] }
}
```
**Expected**: Tap detected, cell selected
**Priority**: P0

#### TC-010-002: Happy Path - Detect Drag
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "TOUCHSTART", touches: [{ clientX: 100, clientY: 200 }] },
  event: { type: "TOUCHMOVE", touches: [{ clientX: 150, clientY: 250 }] }
}
```
**Expected**: Drag started, tap not detected
**Priority**: P0

#### TC-010-003: Edge Case - Drag at Tap Threshold
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "TOUCHSTART", touches: [{ clientX: 100, clientY: 200 }] },
  event: { type: "TOUCHMOVE", touches: [{ clientX: 110, clientY: 210 }] }
}
```
**Expected**: Tap detected (movement < threshold)
**Priority**: P1

#### TC-010-004: Edge Case - Tap at Edge
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  event: { type: "TOUCHSTART", touches: [{ clientX: 0, clientY: 0 }] }
}
```
**Expected**: Tap detected at edge
**Priority**: P1

#### TC-010-005: Integration - Full Touch Workflow
**Input**:
```typescript
{
  state: { mode: "IDLE" },
  events: [
    { type: "TOUCHSTART", touches: [{ clientX: 100, clientY: 200 }] },
    { type: "TOUCHMOVE", touches: [{ clientX: 150, clientY: 250 }] },
    { type: "TOUCHEND", touches: [{ clientX: 150, clientY: 250 }] }
  ]
}
```
**Expected**: All touch events processed
**Priority**: P0

---

### AC-011: Controls Configuration

#### TC-011-001: Happy Path - Initialize with Default Config
**Input**:
```typescript
{
  config: DEFAULT_CONTROLS_CONFIG
}
```
**Expected**: Controls initialized with defaults
**Priority**: P0

#### TC-011-002: Happy Path - Update Rotation Sensitivity
**Input**:
```typescript
{
  config: { rotationSensitivity: 0.01 }
}
```
**Expected**: Rotation sensitivity updated
**Priority**: P0

#### TC-011-003: Happy Path - Update Zoom Sensitivity
**Input**:
```typescript
{
  config: { zoomSensitivity: 0.1 }
}
```
**Expected**: Zoom sensitivity updated
**Priority**: P0

#### TC-011-004: Happy Path - Update Pan Sensitivity
**Input**:
```typescript
{
  config: { panSensitivity: 0.5 }
}
```
**Expected**: Pan sensitivity updated
**Priority**: P0

#### TC-011-005: Edge Case - Invalid Sensitivity
**Input**:
```typescript
{
  config: { rotationSensitivity: -1 }
}
```
**Expected**: Error thrown, sensitivity must be positive
**Priority**: P0

#### TC-011-006: Integration - Full Config Update
**Input**:
```typescript
{
  config: {
    rotationSensitivity: 0.02,
    zoomSensitivity: 0.15,
    panSensitivity: 0.75
  }
}
```
**Expected**: All sensitivities updated
**Priority**: P0

---

## Test Data

### Sample ControlsConfig
```typescript
const DEFAULT_CONTROLS_CONFIG: ControlsConfig = {
  rotationSensitivity: 0.005,
  enableDamping: true,
  zoomSensitivity: 0.1,
  pinchSensitivity: 0.001,
  minZoom: 0.1,
  maxZoom: 10.0,
  defaultZoom: 1.0,
  zoomDuration: 300,
  panSensitivity: 0.5,
  enablePan: true,
  tapThreshold: 5,
  highlightColor: "#FF0000",
  minPolarAngle: -85 * (Math.PI / 180),
  maxPolarAngle: 85 * (Math.PI / 180),
  enablePolarLock: true
};
```

### Sample InteractionState
```typescript
const SAMPLE_INTERACTION_STATE: InteractionState = {
  mode: "IDLE",
  isDragging: false,
  dragStart: null,
  dragCurrent: null,
  pinchStart: null,
  pinchCurrent: null,
  zoomLevel: 1.0,
  targetZoom: 1.0,
  selectedCell: null
};
```

### Sample Camera
```typescript
const SAMPLE_CAMERA: Camera = {
  position: [0, 0, 5],
  target: [0, 0, 0],
  up: [0, 1, 0],
  fov: Math.PI / 4,
  near: 0.1,
  far: 100,
  zoom: 1.0
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test interaction state management
- Test mouse event handling
- Test touch event handling
- Test camera rotation
- Test camera pan
- Test camera zoom
- Test cell selection
- Test polar locking
- Test keyboard navigation
- Test tap detection
- Test controls configuration

### Integration Testing Approach
- Test full interaction pipeline
- Test mouse and touch integration
- Test camera integration with rendering
- Test cell selection with globe
- Test controls with renderer
- Test full keyboard workflow
- Test touch workflow
- Test gesture recognition

### End-to-End Testing Approach
- Test complete interaction workflow
- Test camera movement scenarios
- Test zoom functionality
- Test cell interaction scenarios
- Test keyboard navigation scenarios
- Test touch interaction scenarios
- Test polar locking behavior

### Performance Testing Approach
- Test interaction with many cells
- Test rotation performance
- Test zoom performance
- Test cell selection performance
- Test gesture recognition performance

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── interaction/
│   │   ├── InteractionState.test.ts
│   │   ├── MouseEventHandling.test.ts
│   │   ├── TouchEventHandling.test.ts
│   │   ├── CameraRotation.test.ts
│   │   ├── CameraPan.test.ts
│   │   ├── CameraZoom.test.ts
│   │   ├── CellSelection.test.ts
│   │   ├── PolarLocking.test.ts
│   │   ├── KeyboardNavigation.test.ts
│   │   ├── TapDetection.test.ts
│   │   └── ControlsConfiguration.test.ts
├── integration/
│   ├── interaction/
│   │   ├── MouseTouchIntegration.test.ts
│   │   ├── CameraIntegration.test.ts
│   │   ├── CellSelectionIntegration.test.ts
│   │   ├── ControlsIntegration.test.ts
│   │   ├── FullInteractionPipeline.test.ts
│   │   ├── TouchWorkflow.test.ts
│   │   ├── KeyboardNavigationWorkflow.test.ts
│   │   ├── GestureRecognition.test.ts
│   │   └── PolarLockingBehavior.test.ts
└── e2e/
    ├── interaction/
        │   ├── CompleteInteractionWorkflow.test.ts
        │   ├── CameraMovementScenarios.test.ts
        │   ├── ZoomFunctionality.test.ts
        │   ├── CellInteractionScenarios.test.ts
        │   ├── KeyboardNavigationScenarios.test
        │   ├── TouchInteractionScenarios.test.ts
        │   └── PolarLockingScenarios.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by interaction component for unit tests
- Group by integration feature for integration tests
- Group by user scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases

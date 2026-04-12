---
# DEPRECATED - DO NOT USE

**Date**: 2026-01-31
**Reason**: This specification has been deprecated in favor of pure smooth spherical geometry.
**Replacement**: See `docs/specs/036-smooth-spherical-globe-architecture.md` and related smooth spherical specs (037-041).

This document is retained for historical reference only. All new development must use the smooth spherical architecture.
---

# Task List: Globe Camera Interaction

**TDD Reference:** [034-globe-camera-interaction.tdd.md](../tdd/034-globe-camera-interaction.tdd.md)

---

## Phase 1: Interaction Types

### Task 1.1: Create InteractionState Interface
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Interaction state management)
**Implementation Steps:**
1. Create file `logic/globe/interaction/types.ts`
2. Define `InteractionState` interface with fields:
   - `isDragging: boolean`
   - `isPanning: boolean`
   - `isRotating: boolean`
   - `lastMousePosition: { x: number, y: number } | null`
   - `dragStartCell: string | null`
3. Export interface
**Test Mapping:** TC-001-001, TC-001-002 (State tests)

### Task 1.2: Create CameraConfig Interface
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-011 (Controls configuration)
**Implementation Steps:**
1. In `logic/globe/interaction/types.ts`, define `CameraConfig` interface with fields:
   - `rotationSpeed: number`
   - `panSpeed: number`
   - `zoomSpeed: number`
   - `minZoom: number`
   - `maxZoom: number`
   - `enablePolarLock: boolean`
2. Export interface
**Test Mapping:** TC-011-001, TC-011-002 (Config tests)

### Task 1.3: Create GestureType Enum
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-008 (Tap detection)
**Implementation Steps:**
1. In `logic/globe/interaction/types.ts`, define `GestureType` enum with values: `TAP`, `DRAG`, `PINCH`, `ROTATE`
2. Export enum
**Test Mapping:** TC-008-001, TC-008-002 (Gesture tests)

---

## Phase 2: Interaction State Manager

### Task 2.1: Create InteractionStateManager Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (Interaction state management)
**Implementation Steps:**
1. Create file `logic/globe/interaction/state.ts`
2. Implement `InteractionStateManager` class
3. Add `setState(state: Partial<InteractionState>): void` method
4. Add `getState(): InteractionState` method
5. Export class
**Test Mapping:** TC-001-001, TC-001-002 (Manager tests)

### Task 2.2: Implement State Management
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Interaction state management)
**Implementation Steps:**
1. In `InteractionStateManager`, implement state management
2. Merge provided state with current state
3. Notify subscribers of changes
4. Export methods
**Test Mapping:** TC-001-001, TC-001-002 (State tests)

---

## Phase 3: Mouse Event Handling

### Task 3.1: Create MouseEventHandler Class
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Mouse event handling)
**Implementation Steps:**
1. Create file `logic/globe/interaction/mouse.ts`
2. Implement `MouseEventHandler` class
3. Add `handleMouseDown(event: MouseEvent): void` method
4. Add `handleMouseMove(event: MouseEvent): void` method
5. Add `handleMouseUp(event: MouseEvent): void` method
6. Add `handleWheel(event: WheelEvent): void` method
7. Export class
**Test Mapping:** TC-002-001, TC-002-002 (Handler tests)

### Task 3.2: Implement Mouse Down Handler
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Mouse event handling)
**Implementation Steps:**
1. In `MouseEventHandler`, implement `handleMouseDown()` method
2. Set dragging state
3. Record mouse position
4. Export method
**Test Mapping:** TC-002-001, TC-002-002 (Mouse down tests)

### Task 3.3: Implement Mouse Move Handler
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Mouse event handling)
**Implementation Steps:**
1. In `MouseEventHandler`, implement `handleMouseMove()` method
2. Calculate mouse delta
3. Update camera rotation or pan
4. Export method
**Test Mapping:** TC-002-003, TC-002-004 (Mouse move tests)

### Task 3.4: Implement Mouse Up Handler
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Mouse event handling)
**Implementation Steps:**
1. In `MouseEventHandler`, implement `handleMouseUp()` method
2. Clear dragging state
3. Clear mouse position
4. Export method
**Test Mapping:** TC-002-005, TC-002-006 (Mouse up tests)

### Task 3.5: Implement Wheel Handler
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Mouse event handling)
**Implementation Steps:**
1. In `MouseEventHandler`, implement `handleWheel()` method
2. Calculate zoom delta
3. Update camera zoom
4. Export method
**Test Mapping:** TC-002-007, TC-002-008 (Wheel tests)

---

## Phase 4: Touch Event Handling

### Task 4.1: Create TouchEventHandler Class
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-003 (Touch event handling)
**Implementation Steps:**
1. Create file `logic/globe/interaction/touch.ts`
2. Implement `TouchEventHandler` class
3. Add `handleTouchStart(event: TouchEvent): void` method
4. Add `handleTouchMove(event: TouchEvent): void` method
5. Add `handleTouchEnd(event: TouchEvent): void` method
6. Export class
**Test Mapping:** TC-003-001, TC-003-002 (Handler tests)

### Task 4.2: Implement Touch Start Handler
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-003 (Touch event handling)
**Implementation Steps:**
1. In `TouchEventHandler`, implement `handleTouchStart()` method
2. Record touch positions
3. Detect gesture type
4. Export method
**Test Mapping:** TC-003-001, TC-003-002 (Touch start tests)

### Task 4.3: Implement Touch Move Handler
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-003 (Touch event handling)
**Implementation Steps:**
1. In `TouchEventHandler`, implement `handleTouchMove()` method
2. Calculate touch delta
3. Update camera based on gesture
4. Export method
**Test Mapping:** TC-003-003, TC-003-004 (Touch move tests)

### Task 4.4: Implement Touch End Handler
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-003 (Touch event handling)
**Implementation Steps:**
1. In `TouchEventHandler`, implement `handleTouchEnd()` method
2. Clear touch state
3. Export method
**Test Mapping:** TC-003-005, TC-003-006 (Touch end tests)

---

## Phase 5: Camera Rotation

### Task 5.1: Create CameraRotator Class
**Priority:** P0
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-004 (Camera rotation)
**Implementation Steps:**
1. Create file `logic/globe/interaction/rotation.ts`
2. Implement `CameraRotator` class
3. Add `rotate(deltaX: number, deltaY: number): void` method
4. Export class
**Test Mapping:** TC-004-001, TC-004-002 (Rotator tests)

### Task 5.2: Implement Camera Rotation
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-004 (Camera rotation)
**Implementation Steps:**
1. In `CameraRotator`, implement `rotate()` method
2. Calculate rotation angles from delta
3. Apply rotation to camera
4. Export method
**Test Mapping:** TC-004-001, TC-004-002 (Rotation tests)

---

## Phase 6: Camera Pan

### Task 6.1: Create CameraPanner Class
**Priority:** P0
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-005 (Camera pan)
**Implementation Steps:**
1. Create file `logic/globe/interaction/pan.ts`
2. Implement `CameraPanner` class
3. Add `pan(deltaX: number, deltaY: number): void` method
4. Export class
**Test Mapping:** TC-005-001, TC-005-002 (Panner tests)

### Task 6.2: Implement Camera Pan
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-005 (Camera pan)
**Implementation Steps:**
1. In `CameraPanner`, implement `pan()` method
2. Calculate pan vector from delta
3. Apply pan to camera
4. Export method
**Test Mapping:** TC-005-001, TC-005-002 (Pan tests)

---

## Phase 7: Camera Zoom

### Task 7.1: Create CameraZoomer Class
**Priority:** P0
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-006 (Camera zoom)
**Implementation Steps:**
1. Create file `logic/globe/interaction/zoom.ts`
2. Implement `CameraZoomer` class
3. Add `zoom(delta: number): void` method
4. Export class
**Test Mapping:** TC-006-001, TC-006-002 (Zoomer tests)

### Task 7.2: Implement Camera Zoom
**Priority:** P0
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-006 (Camera zoom)
**Implementation Steps:**
1. In `CameraZoomer`, implement `zoom()` method
2. Calculate zoom factor from delta
3. Apply zoom to camera
4. Clamp to min/max zoom
5. Export method
**Test Mapping:** TC-006-001, TC-006-002 (Zoom tests)

---

## Phase 8: Cell Selection

### Task 8.1: Create CellSelector Class
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-007 (Cell selection)
**Implementation Steps:**
1. Create file `logic/globe/interaction/selection.ts`
2. Implement `CellSelector` class
3. Add `selectCellAtPosition(x: number, y: number): string | null` method
4. Export class
**Test Mapping:** TC-007-001, TC-007-002 (Selector tests)

### Task 8.2: Implement Cell Selection
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-007 (Cell selection)
**Implementation Steps:**
1. In `CellSelector`, implement `selectCellAtPosition()` method
2. Convert screen position to world position
3. Find cell at world position
4. Return cell ID or null
5. Export method
**Test Mapping:** TC-007-001, TC-007-002 (Selection tests)

---

## Phase 9: Polar Locking

### Task 9.1: Create PolarLocker Class
**Priority:** P0
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-009 (Polar locking)
**Implementation Steps:**
1. Create file `logic/globe/interaction/polar.ts`
2. Implement `PolarLocker` class
3. Add `lock(): void` method
4. Add `unlock(): void` method
5. Add `isLocked(): boolean` method
6. Export class
**Test Mapping:** TC-009-001, TC-009-002 (Locker tests)

### Task 9.2: Implement Polar Locking
**Priority:** P0
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-009 (Polar locking)
**Implementation Steps:**
1. In `PolarLocker`, implement `lock()` method
2. Restrict camera rotation at poles
3. Export method
**Test Mapping:** TC-009-001, TC-009-002 (Lock tests)

### Task 9.3: Implement Polar Unlocking
**Priority:** P0
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-009 (Polar locking)
**Implementation Steps:**
1. In `PolarLocker`, implement `unlock()` method
2. Remove camera rotation restrictions
3. Export method
**Test Mapping:** TC-009-003, TC-009-004 (Unlock tests)

---

## Phase 10: Keyboard Navigation

### Task 10.1: Create KeyboardNavigator Class
**Priority:** P0
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-010 (Keyboard navigation)
**Implementation Steps:**
1. Create file `logic/globe/interaction/keyboard.ts`
2. Implement `KeyboardNavigator` class
3. Add `handleKeyDown(event: KeyboardEvent): void` method
4. Export class
**Test Mapping:** TC-010-001, TC-010-002 (Navigator tests)

### Task 10.2: Implement Keyboard Navigation
**Priority:** P0
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-010 (Keyboard navigation)
**Implementation Steps:**
1. In `KeyboardNavigator`, implement `handleKeyDown()` method
2. Map arrow keys to camera rotation
3. Map +/- keys to zoom
4. Map page up/down to pan
5. Export method
**Test Mapping:** TC-010-001, TC-010-002 (Navigation tests)

---

## Phase 11: Tap Detection

### Task 11.1: Create TapDetector Class
**Priority:** P0
**Dependencies:** Task 1.3
**Acceptance Criteria:** AC-008 (Tap detection)
**Implementation Steps:**
1. Create file `logic/globe/interaction/tap.ts`
2. Implement `TapDetector` class
3. Add `detectGesture(touches: Touch[]): GestureType` method
4. Export class
**Test Mapping:** TC-008-001, TC-008-002 (Detector tests)

### Task 11.2: Implement Tap Detection
**Priority:** P0
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-008 (Tap detection)
**Implementation Steps:**
1. In `TapDetector`, implement `detectGesture()` method
2. Check for single touch
3. Check for short duration
4. Check for minimal movement
5. Return TAP gesture
6. Export method
**Test Mapping:** TC-008-001, TC-008-002 (Tap tests)

---

## Phase 12: Controls Configuration

### Task 12.1: Create ControlsConfigurator Class
**Priority:** P0
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-011 (Controls configuration)
**Implementation Steps:**
1. Create file `logic/globe/interaction/config.ts`
2. Implement `ControlsConfigurator` class
3. Add `setConfig(config: Partial<CameraConfig>): void` method
4. Add `getConfig(): CameraConfig` method
5. Export class
**Test Mapping:** TC-011-001, TC-011-002 (Configurator tests)

### Task 12.2: Implement Controls Configuration
**Priority:** P0
**Dependencies:** Task 12.1
**Acceptance Criteria:** AC-011 (Controls configuration)
**Implementation Steps:**
1. In `ControlsConfigurator`, implement `setConfig()` method
2. Merge provided config with default config
3. Apply config to interaction handlers
4. Export method
**Test Mapping:** TC-011-001, TC-011-002 (Config tests)

---

## Phase 13: Test Files

### Task 13.1: Create InteractionStateTests
**Priority:** P0
**Dependencies:** Task 2.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/state.test.ts`
2. Write tests for interaction state management
3. Write tests for state updates
**Test Mapping:** TC-001-001, TC-001-002

### Task 13.2: Create MouseEventTests
**Priority:** P0
**Dependencies:** Task 3.5
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/mouse.test.ts`
2. Write tests for mouse down handler
3. Write tests for mouse move handler
4. Write tests for mouse up handler
5. Write tests for wheel handler
**Test Mapping:** TC-002-001, TC-002-002

### Task 13.3: Create TouchEventTests
**Priority:** P0
**Dependencies:** Task 4.4
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/touch.test.ts`
2. Write tests for touch start handler
3. Write tests for touch move handler
4. Write tests for touch end handler
**Test Mapping:** TC-003-001, TC-003-002

### Task 13.4: Create CameraRotationTests
**Priority:** P0
**Dependencies:** Task 5.2
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/rotation.test.ts`
2. Write tests for camera rotation
3. Write tests for rotation accuracy
**Test Mapping:** TC-004-001, TC-004-002

### Task 13.5: Create CameraPanTests
**Priority:** P0
**Dependencies:** Task 6.2
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/pan.test.ts`
2. Write tests for camera pan
3. Write tests for pan accuracy
**Test Mapping:** TC-005-001, TC-005-002

### Task 13.6: Create CameraZoomTests
**Priority:** P0
**Dependencies:** Task 7.2
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/zoom.test.ts`
2. Write tests for camera zoom
3. Write tests for zoom clamping
**Test Mapping:** TC-006-001, TC-006-002

### Task 13.7: Create CellSelectionTests
**Priority:** P0
**Dependencies:** Task 8.2
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/selection.test.ts`
2. Write tests for cell selection
3. Write tests for selection accuracy
**Test Mapping:** TC-007-001, TC-007-002

### Task 13.8: Create TapDetectionTests
**Priority:** P0
**Dependencies:** Task 11.2
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/tap.test.ts`
2. Write tests for tap detection
3. Write tests for gesture detection
**Test Mapping:** TC-008-001, TC-008-002

### Task 13.9: Create PolarLockingTests
**Priority:** P0
**Dependencies:** Task 9.3
**Acceptance Criteria:** AC-009
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/polar.test.ts`
2. Write tests for polar locking
3. Write tests for polar unlocking
4. Write tests for lock state
**Test Mapping:** TC-009-001, TC-009-002

### Task 13.10: Create KeyboardNavigationTests
**Priority:** P0
**Dependencies:** Task 10.2
**Acceptance Criteria:** AC-010
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/keyboard.test.ts`
2. Write tests for keyboard navigation
3. Write tests for key mapping
**Test Mapping:** TC-010-001, TC-010-002

### Task 13.11: Create ControlsConfigTests
**Priority:** P0
**Dependencies:** Task 12.2
**Acceptance Criteria:** AC-011
**Implementation Steps:**
1. Create file `logic/globe/interaction/__tests__/config.test.ts`
2. Write tests for controls configuration
3. Write tests for config application
**Test Mapping:** TC-011-001, TC-011-002

---

## Summary

**Total Tasks:** 51
**P0 Tasks:** 51 (Types, State management, Mouse/Touch events, Camera controls, Selection, Tap detection, Configuration, Tests)

**Phases:** 13
- Phase 1: Interaction Types (3 tasks)
- Phase 2: Interaction State Manager (2 tasks)
- Phase 3: Mouse Event Handling (5 tasks)
- Phase 4: Touch Event Handling (4 tasks)
- Phase 5: Camera Rotation (2 tasks)
- Phase 6: Camera Pan (2 tasks)
- Phase 7: Camera Zoom (2 tasks)
- Phase 8: Cell Selection (2 tasks)
- Phase 9: Polar Locking (3 tasks)
- Phase 10: Keyboard Navigation (2 tasks)
- Phase 11: Tap Detection (2 tasks)
- Phase 12: Controls Configuration (2 tasks)
- Phase 13: Test Files (11 tasks)

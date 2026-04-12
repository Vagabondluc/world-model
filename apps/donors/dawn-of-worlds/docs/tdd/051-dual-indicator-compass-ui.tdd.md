# TDD: Dual-Indicator Compass UI

## Specification Reference
- Spec: [`051-dual-indicator-compass-ui.md`](../specs/051-dual-indicator-compass-ui.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: CompassStore Initialization
**Given** the compass store is created
**When** initial state is accessed
**Then** store must contain default values for all properties

### AC-002: Geographic Heading Calculation
**Given** a camera and globe mesh are available
**When** camera orientation changes
**Then** geographic heading must be calculated accurately relative to globe's True North

### AC-003: Magnetic Heading Calculation
**Given** a geographic heading and declination angle
**When** magnetic heading is calculated
**Then** magnetic heading must equal geographic heading plus declination angle

### AC-004: Declination Angle Validation
**Given** a declination angle is provided
**When** angle is validated
**Then** angle must be clamped to valid range (-180 to 180)

### AC-005: Display Mode Toggle
**Given** compass is in current display mode
**When** toggle is triggered
**Then** display mode must cycle to next mode in sequence

### AC-006: Heading Normalization
**Given** a heading value is calculated
**When** heading is normalized
**Then** value must be in 0-360 range

### AC-007: Needle Rendering
**Given** compass display mode and heading values
**When** needles are rendered
**Then** correct needles must be visible based on display mode

### AC-008: Compass Rose Rendering
**Given** compass is being rendered
**When** compass rose is drawn
**Then** cardinal and secondary direction labels must be positioned correctly

### AC-009: Declination Arc Rendering
**Given** both needles are visible
**When** declination arc is drawn
**Then** arc must span from geographic to magnetic needle positions

### AC-010: Mode Transition Animation
**Given** display mode is changing
**When** transition animation plays
**Then** old mode must fade out and new mode must fade in smoothly

### AC-011: Needle Rotation Animation
**Given** heading value changes
**When** needle rotation is animated
**Then** needle must rotate smoothly to new heading

### AC-012: Responsive Size Adaptation
**Given** viewport size changes
**When** compass size is recalculated
**Then** size must match breakpoint configuration

### AC-013: Keyboard Navigation
**Given** compass is focused
**When** keyboard events are received
**Then** Enter/Space must toggle mode, Escape must remove focus

### AC-014: Screen Reader Support
**Given** compass is rendered
**When** screen reader queries the element
**Then** appropriate ARIA attributes must be present

### AC-015: Performance Budget Compliance
**Given** compass is rendering
**When** render performance is measured
**Then** frame time must be under 2ms per frame

### AC-016: Camera Pole Handling
**Given** camera is positioned directly above or below globe
**When** heading calculation is attempted
**Then** heading must return null and compass must show undefined state

### AC-017: Settings Persistence
**Given** compass settings are modified
**When** page is reloaded
**Then** settings must persist across sessions

### AC-018: High Contrast Mode Support
**Given** high contrast mode is enabled
**When** compass is rendered
**Then** transparency must be removed and colors must be solid

### AC-019: Reduced Motion Support
**Given** reduced motion preference is set
**When** animations would play
**Then** animations must be disabled

### AC-020: Canvas Fallback
**Given** WebGL context is not available
**When** compass renderer is initialized
**Then** SVG fallback rendering must be used

---

## Test Cases

### AC-001: CompassStore Initialization

#### TC-001-001: Happy Path - Default State
**Input**:
```typescript
const store = useCompassStore.getState();
```
**Expected**:
```typescript
{
  geographicHeading: 0,
  magneticHeading: 0,
  declinationAngle: 12,
  displayMode: "BOTH",
  isAnimating: false
}
```
**Priority**: P0

#### TC-001-002: Happy Path - Custom Initial State
**Input**:
```typescript
const store = createCompassStore({
  declinationAngle: 15,
  displayMode: "GEOGRAPHIC_ONLY"
});
```
**Expected**: Store initializes with custom values
**Priority**: P1

#### TC-001-003: Integration - Persisted State Loading
**Input**:
```typescript
// LocalStorage contains:
localStorage.setItem("compass-storage", JSON.stringify({
  state: {
    declinationAngle: -5,
    displayMode: "MAGNETIC_ONLY"
  },
  version: 0
}));
```
**Expected**: Store loads persisted values on initialization
**Priority**: P0

#### TC-001-004: Edge Case - Corrupted Persisted State
**Input**:
```typescript
// LocalStorage contains invalid JSON
localStorage.setItem("compass-storage", "invalid-json");
```
**Expected**: Store initializes with default values, ignoring corrupted data
**Priority**: P1

---

### AC-002: Geographic Heading Calculation

#### TC-002-001: Happy Path - Camera Facing North
**Input**:
```typescript
const camera = createCamera();
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading = 0 degrees (or 360)
**Priority**: P0

#### TC-002-002: Happy Path - Camera Facing East
**Input**:
```typescript
const camera = createCamera();
camera.position.set(5, 0, 0);
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading = 90 degrees
**Priority**: P0

#### TC-002-003: Happy Path - Camera Facing South
**Input**:
```typescript
const camera = createCamera();
camera.position.set(0, 0, -5);
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading = 180 degrees
**Priority**: P0

#### TC-002-004: Happy Path - Camera Facing West
**Input**:
```typescript
const camera = createCamera();
camera.position.set(-5, 0, 0);
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading = 270 degrees
**Priority**: P0

#### TC-002-005: Edge Case - Camera at North Pole
**Input**:
```typescript
const camera = createCamera();
camera.position.set(0, 5, 0);
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading = null (undefined at pole)
**Priority**: P1

#### TC-002-006: Edge Case - Camera at South Pole
**Input**:
```typescript
const camera = createCamera();
camera.position.set(0, -5, 0);
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading = null (undefined at pole)
**Priority**: P1

#### TC-002-007: Integration - Camera with Roll
**Input**:
```typescript
const camera = createCamera();
camera.position.set(3, 0, 3);
camera.lookAt(0, 0, 0);
camera.rotation.z = Math.PI / 4; // 45 degree roll
const globe = createGlobeMesh();
```
**Expected**: Geographic heading = 45 degrees (roll ignored)
**Priority**: P1

---

### AC-003: Magnetic Heading Calculation

#### TC-003-001: Happy Path - Positive Declination
**Input**:
```typescript
const geographicHeading = 0;
const declinationAngle = 12;
```
**Expected**: Magnetic heading = 12 degrees
**Priority**: P0

#### TC-003-002: Happy Path - Negative Declination
**Input**:
```typescript
const geographicHeading = 90;
const declinationAngle = -8;
```
**Expected**: Magnetic heading = 82 degrees
**Priority**: P0

#### TC-003-003: Happy Path - Zero Declination
**Input**:
```typescript
const geographicHeading = 180;
const declinationAngle = 0;
```
**Expected**: Magnetic heading = 180 degrees (same as geographic)
**Priority**: P0

#### TC-003-004: Edge Case - Large Positive Declination
**Input**:
```typescript
const geographicHeading = 270;
const declinationAngle = 180;
```
**Expected**: Magnetic heading = 90 degrees (270 + 180 = 450, normalized to 90)
**Priority**: P1

#### TC-003-005: Edge Case - Large Negative Declination
**Input**:
```typescript
const geographicHeading = 90;
const declinationAngle = -180;
```
**Expected**: Magnetic heading = 270 degrees (90 - 180 = -90, normalized to 270)
**Priority**: P1

#### TC-003-006: Integration - Declination at 360 Boundary
**Input**:
```typescript
const geographicHeading = 350;
const declinationAngle = 15;
```
**Expected**: Magnetic heading = 5 degrees (350 + 15 = 365, normalized to 5)
**Priority**: P1

---

### AC-004: Declination Angle Validation

#### TC-004-001: Happy Path - Valid Angle
**Input**: declinationAngle = 12
**Expected**: Angle passes validation, returns 12
**Priority**: P0

#### TC-004-002: Happy Path - Minimum Valid Angle
**Input**: declinationAngle = -180
**Expected**: Angle passes validation, returns -180
**Priority**: P0

#### TC-004-003: Happy Path - Maximum Valid Angle
**Input**: declinationAngle = 180
**Expected**: Angle passes validation, returns 180
**Priority**: P0

#### TC-004-004: Error Case - Angle Below Minimum
**Input**: declinationAngle = -181
**Expected**: Angle clamped to -180
**Priority**: P0

#### TC-004-005: Error Case - Angle Above Maximum
**Input**: declinationAngle = 181
**Expected**: Angle clamped to 180
**Priority**: P0

#### TC-004-006: Edge Case - Extreme Positive Overflow
**Input**: declinationAngle = 540
**Expected**: Angle normalized and clamped to 180
**Priority**: P1

#### TC-004-007: Edge Case - Extreme Negative Overflow
**Input**: declinationAngle = -540
**Expected**: Angle normalized and clamped to -180
**Priority**: P1

---

### AC-005: Display Mode Toggle

#### TC-005-001: Happy Path - Both to Geographic
**Input**:
```typescript
const initialState = { displayMode: "BOTH" as CompassDisplayMode };
toggleDisplayMode(initialState);
```
**Expected**: displayMode = "GEOGRAPHIC_ONLY"
**Priority**: P0

#### TC-005-002: Happy Path - Geographic to Magnetic
**Input**:
```typescript
const initialState = { displayMode: "GEOGRAPHIC_ONLY" as CompassDisplayMode };
toggleDisplayMode(initialState);
```
**Expected**: displayMode = "MAGNETIC_ONLY"
**Priority**: P0

#### TC-005-003: Happy Path - Magnetic to Both
**Input**:
```typescript
const initialState = { displayMode: "MAGNETIC_ONLY" as CompassDisplayMode };
toggleDisplayMode(initialState);
```
**Expected**: displayMode = "BOTH"
**Priority**: P0

#### TC-005-004: Integration - Full Cycle
**Input**:
```typescript
let state = { displayMode: "BOTH" as CompassDisplayMode };
state = toggleDisplayMode(state); // -> GEOGRAPHIC_ONLY
state = toggleDisplayMode(state); // -> MAGNETIC_ONLY
state = toggleDisplayMode(state); // -> BOTH
```
**Expected**: Mode cycles through all three states and returns to original
**Priority**: P0

#### TC-005-005: Edge Case - Rapid Toggles
**Input**:
```typescript
let state = { displayMode: "BOTH" as CompassDisplayMode };
for (let i = 0; i < 10; i++) {
  state = toggleDisplayMode(state);
}
```
**Expected**: Mode cycles correctly without errors, final state = "GEOGRAPHIC_ONLY"
**Priority**: P1

---

### AC-006: Heading Normalization

#### TC-006-001: Happy Path - Positive Heading
**Input**: heading = 180
**Expected**: Normalized heading = 180
**Priority**: P0

#### TC-006-002: Happy Path - Zero Heading
**Input**: heading = 0
**Expected**: Normalized heading = 0
**Priority**: P0

#### TC-006-003: Happy Path - Maximum Heading
**Input**: heading = 360
**Expected**: Normalized heading = 0 (or 360)
**Priority**: P0

#### TC-006-004: Edge Case - Negative Heading
**Input**: heading = -45
**Expected**: Normalized heading = 315
**Priority**: P0

#### TC-006-005: Edge Case - Large Positive Overflow
**Input**: heading = 450
**Expected**: Normalized heading = 90
**Priority**: P1

#### TC-006-006: Edge Case - Large Negative Overflow
**Input**: heading = -90
**Expected**: Normalized heading = 270
**Priority**: P1

#### TC-006-007: Integration - Decimal Heading
**Input**: heading = 361.5
**Expected**: Normalized heading = 1.5
**Priority**: P1

---

### AC-007: Needle Rendering

#### TC-007-001: Happy Path - Both Needles Visible
**Input**:
```typescript
{
  displayMode: "BOTH",
  geographicHeading: 0,
  magneticHeading: 12
}
```
**Expected**: Both geographic (silver) and magnetic (red) needles rendered at correct angles
**Priority**: P0

#### TC-007-002: Happy Path - Geographic Only
**Input**:
```typescript
{
  displayMode: "GEOGRAPHIC_ONLY",
  geographicHeading: 45,
  magneticHeading: 57
}
```
**Expected**: Only geographic needle rendered at 45 degrees, magnetic needle hidden
**Priority**: P0

#### TC-007-003: Happy Path - Magnetic Only
**Input**:
```typescript
{
  displayMode: "MAGNETIC_ONLY",
  geographicHeading: 90,
  magneticHeading: 102
}
```
**Expected**: Only magnetic needle rendered at 102 degrees, geographic needle hidden
**Priority**: P0

#### TC-007-004: Edge Case - Needles Overlapping
**Input**:
```typescript
{
  displayMode: "BOTH",
  geographicHeading: 0,
  magneticHeading: 0 // Zero declination
}
```
**Expected**: Both needles rendered at same angle, magnetic needle slightly offset for visibility
**Priority**: P1

#### TC-007-005: Integration - Needle with Glow
**Input**:
```typescript
{
  displayMode: "BOTH",
  geographicHeading: 180,
  magneticHeading: 192,
  enableGlow: true
}
```
**Expected**: Both needles rendered with glow effects at specified intensity
**Priority**: P1

---

### AC-008: Compass Rose Rendering

#### TC-008-001: Happy Path - Primary Cardinals
**Input**:
```typescript
{
  showPrimaryCardinals: true,
  showSecondaryCardinals: false,
  showTertiaryCardinals: false
}
```
**Expected**: N, E, S, W labels rendered at 0°, 90°, 180°, 270° positions
**Priority**: P0

#### TC-008-002: Happy Path - Primary and Secondary Cardinals
**Input**:
```typescript
{
  showPrimaryCardinals: true,
  showSecondaryCardinals: true,
  showTertiaryCardinals: false
}
```
**Expected**: N, NE, E, SE, S, SW, W, NW labels rendered at correct positions
**Priority**: P0

#### TC-008-003: Happy Path - All Cardinals
**Input**:
```typescript
{
  showPrimaryCardinals: true,
  showSecondaryCardinals: true,
  showTertiaryCardinals: true
}
```
**Expected**: All 16 cardinal labels rendered at correct positions
**Priority**: P1

#### TC-008-004: Edge Case - No Labels
**Input**:
```typescript
{
  showPrimaryCardinals: false,
  showSecondaryCardinals: false,
  showTertiaryCardinals: false
}
```
**Expected**: No cardinal labels rendered, only tick marks
**Priority**: P1

#### TC-008-005: Integration - Tick Marks
**Input**:
```typescript
{
  showTickMarks: true,
  tickInterval: 30
}
```
**Expected**: Tick marks rendered at 0°, 30°, 60°, 90°, 120°, 150°, 180°, 210°, 240°, 270°, 300°, 330°
**Priority**: P1

---

### AC-009: Declination Arc Rendering

#### TC-009-001: Happy Path - Positive Declination
**Input**:
```typescript
{
  geographicHeading: 0,
  magneticHeading: 12,
  showDeclinationArc: true
}
```
**Expected**: Arc drawn from 0° to 12° clockwise, amber color, 2px width
**Priority**: P0

#### TC-009-002: Happy Path - Negative Declination
**Input**:
```typescript
{
  geographicHeading: 90,
  magneticHeading: 82, // -8 declination
  showDeclinationArc: true
}
```
**Expected**: Arc drawn from 90° to 82° counter-clockwise, amber color, 2px width
**Priority**: P0

#### TC-009-003: Happy Path - Zero Declination
**Input**:
```typescript
{
  geographicHeading: 180,
  magneticHeading: 180,
  showDeclinationArc: true
}
```
**Expected**: No arc rendered (or minimal indicator at 180°)
**Priority**: P1

#### TC-009-004: Edge Case - Large Declination
**Input**:
```typescript
{
  geographicHeading: 270,
  magneticHeading: 90, // 180 declination
  showDeclinationArc: true
}
```
**Expected**: Arc drawn from 270° to 90° (180° span), amber color
**Priority**: P1

#### TC-009-005: Integration - Declination Label
**Input**:
```typescript
{
  geographicHeading: 0,
  magneticHeading: 12,
  showDeclinationLabel: true,
  labelPosition: "TOP"
}
```
**Expected**: Label "12°E" displayed at arc midpoint (6°)
**Priority**: P1

---

### AC-010: Mode Transition Animation

#### TC-010-001: Happy Path - Both to Geographic
**Input**:
```typescript
{
  fromMode: "BOTH",
  toMode: "GEOGRAPHIC_ONLY",
  duration: 100
}
```
**Expected**: Magnetic needle and declination arc fade out over 100ms, geographic needle remains
**Priority**: P0

#### TC-010-002: Happy Path - Geographic to Magnetic
**Input**:
```typescript
{
  fromMode: "GEOGRAPHIC_ONLY",
  toMode: "MAGNETIC_ONLY",
  duration: 100
}
```
**Expected**: Geographic needle fades out over 100ms, magnetic needle fades in
**Priority**: P0

#### TC-010-003: Happy Path - Magnetic to Both
**Input**:
```typescript
{
  fromMode: "MAGNETIC_ONLY",
  toMode: "BOTH",
  duration: 100
}
**Expected**: Geographic needle fades in over 100ms, declination arc appears
**Priority**: P0

#### TC-010-004: Edge Case - Instant Transition
**Input**:
```typescript
{
  fromMode: "BOTH",
  toMode: "GEOGRAPHIC_ONLY",
  duration: 0
}
```
**Expected**: Immediate mode change, no fade animation
**Priority**: P1

#### TC-010-005: Integration - Scale Effect
**Input**:
```typescript
{
  fromMode: "BOTH",
  toMode: "GEOGRAPHIC_ONLY",
  enableScaleEffect: true
}
```
**Expected**: Compass scales down to 0.95 during fade, then to 1.0
**Priority**: P1

---

### AC-011: Needle Rotation Animation

#### TC-011-001: Happy Path - Small Heading Change
**Input**:
```typescript
{
  fromHeading: 0,
  toHeading: 5,
  duration: 200,
  easing: easeOutCubic
}
```
**Expected**: Needle rotates smoothly from 0° to 5° over 200ms
**Priority**: P0

#### TC-011-002: Happy Path - Large Heading Change
**Input**:
```typescript
{
  fromHeading: 0,
  toHeading: 180,
  duration: 200,
  easing: easeOutCubic
}
```
**Expected**: Needle rotates smoothly from 0° to 180° over 200ms
**Priority**: P0

#### TC-011-003: Happy Path - Cross 360 Boundary
**Input**:
```typescript
{
  fromHeading: 350,
  toHeading: 10,
  duration: 200,
  easing: easeOutCubic
}
```
**Expected**: Needle rotates smoothly from 350° to 10° (crossing 0°/360° boundary)
**Priority**: P0

#### TC-011-004: Edge Case - No Animation
**Input**:
```typescript
{
  fromHeading: 45,
  toHeading: 46,
  duration: 200,
  threshold: 1 // Below threshold
}
```
**Expected**: No animation (change < threshold), needle snaps to new position
**Priority**: P1

#### TC-011-005: Integration - Easing Function
**Input**:
```typescript
{
  fromHeading: 0,
  toHeading: 90,
  duration: 200,
  easing: easeOutCubic
}
```
**Expected**: Rotation follows cubic easing curve (starts fast, slows at end)
**Priority**: P1

---

### AC-012: Responsive Size Adaptation

#### TC-012-001: Happy Path - Desktop Viewport
**Input**: viewportWidth = 1920
**Expected**: Compass size = 120px (desktop size)
**Priority**: P0

#### TC-012-002: Happy Path - Tablet Viewport
**Input**: viewportWidth = 768
**Expected**: Compass size = 100px (tablet size)
**Priority**: P0

#### TC-012-003: Happy Path - Mobile Viewport
**Input**: viewportWidth = 375
**Expected**: Compass size = 80px (mobile size)
**Priority**: P0

#### TC-012-004: Edge Case - Below Mobile Breakpoint
**Input**: viewportWidth = 320
**Expected**: Compass size = 80px (minimum mobile size)
**Priority**: P1

#### TC-012-005: Integration - Viewport Resize
**Input**:
```typescript
// Initial viewport
let viewportWidth = 1920;
// Resize to mobile
viewportWidth = 375;
```
**Expected**: Compass size updates from 120px to 80px smoothly
**Priority**: P1

---

### AC-013: Keyboard Navigation

#### TC-013-001: Happy Path - Tab Focus
**Input**: Tab key pressed while compass is not focused
**Expected**: Compass receives focus, focus ring appears
**Priority**: P0

#### TC-013-002: Happy Path - Enter Key Toggle
**Input**: Enter key pressed while compass is focused
**Expected**: Display mode toggles, same as click behavior
**Priority**: P0

#### TC-013-003: Happy Path - Space Key Toggle
**Input**: Space key pressed while compass is focused
**Expected**: Display mode toggles, same as click behavior
**Priority**: P0

#### TC-013-004: Happy Path - Escape Key Blur
**Input**: Escape key pressed while compass is focused
**Expected**: Compass loses focus, focus ring disappears
**Priority**: P0

#### TC-013-005: Edge Case - Multiple Focus Attempts
**Input**: Tab key pressed multiple times
**Expected**: Compass cycles through focus states correctly
**Priority**: P1

---

### AC-014: Screen Reader Support

#### TC-014-001: Happy Path - Both Mode
**Input**:
```typescript
{
  displayMode: "BOTH",
  declinationAngle: 12
}
```
**Expected**: aria-label = "Compass showing both needles. Click to toggle mode."
**Priority**: P0

#### TC-014-002: Happy Path - Geographic Only Mode
**Input**:
```typescript
{
  displayMode: "GEOGRAPHIC_ONLY",
  declinationAngle: 12
}
```
**Expected**: aria-label = "Compass showing geographic only. Click to toggle mode."
**Priority**: P0

#### TC-014-003: Happy Path - Magnetic Only Mode
**Input**:
```typescript
{
  displayMode: "MAGNETIC_ONLY",
  declinationAngle: 12
}
```
**Expected**: aria-label = "Compass showing magnetic only. Click to toggle mode."
**Priority**: P0

#### TC-014-004: Integration - Description
**Input**: Compass rendered with description
**Expected**: aria-describedby = "compass-description", description element present
**Priority**: P1

---

### AC-015: Performance Budget Compliance

#### TC-015-001: Happy Path - Single Render
**Input**:
```typescript
const compass = createCompass();
const startTime = performance.now();
compass.render();
const endTime = performance.now();
const renderTime = endTime - startTime;
```
**Expected**: renderTime < 2ms
**Priority**: P0

#### TC-015-002: Happy Path - 1000 Renders
**Input**:
```typescript
const compass = createCompass();
const startTime = performance.now();
for (let i = 0; i < 1000; i++) {
  compass.render();
}
const endTime = performance.now();
const avgRenderTime = (endTime - startTime) / 1000;
```
**Expected**: avgRenderTime < 2ms
**Priority**: P0

#### TC-015-003: Integration - Full Frame Budget
**Input**:
```typescript
const compass = createCompass();
const frameBudget = 16.67; // 60fps
const compassRenderTime = measureRenderTime(compass);
const globeRenderTime = measureRenderTime(globe);
const totalRenderTime = compassRenderTime + globeRenderTime;
```
**Expected**: totalRenderTime < frameBudget
**Priority**: P1

#### TC-015-004: Edge Case - Complex Scene
**Input**: Compass rendering with both needles, declination arc, all labels, and tick marks
**Expected**: renderTime < 2ms (within budget despite complexity)
**Priority**: P1

---

### AC-016: Camera Pole Handling

#### TC-016-001: Happy Path - Near North Pole
**Input**:
```typescript
const camera = createCamera();
camera.position.set(0, 4.9, 0.1); // Near pole but not directly above
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading calculated (close to 0°)
**Priority**: P0

#### TC-016-002: Happy Path - Directly Above North Pole
**Input**:
```typescript
const camera = createCamera();
camera.position.set(0, 5, 0); // Directly above
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading = null (undefined at pole)
**Priority**: P0

#### TC-016-003: Happy Path - Near South Pole
**Input**:
```typescript
const camera = createCamera();
camera.position.set(0, -4.9, -0.1); // Near pole
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading calculated (close to 180°)
**Priority**: P0

#### TC-016-004: Happy Path - Directly Above South Pole
**Input**:
```typescript
const camera = createCamera();
camera.position.set(0, -5, 0); // Directly above
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading = null (undefined at pole)
**Priority**: P0

#### TC-016-005: Edge Case - Pole Threshold
**Input**:
```typescript
const camera = createCamera();
camera.position.set(0, 4.99, 0.01); // Just above threshold
camera.lookAt(0, 0, 0);
const globe = createGlobeMesh();
```
**Expected**: Geographic heading = null (dot product > 0.99)
**Priority**: P1

---

### AC-017: Settings Persistence

#### TC-017-001: Happy Path - Save Declination
**Input**:
```typescript
const store = useCompassStore.getState();
store.setDeclinationAngle(15);
```
**Expected**: localStorage contains updated declinationAngle: 15
**Priority**: P0

#### TC-017-002: Happy Path - Save Display Mode
**Input**:
```typescript
const store = useCompassStore.getState();
store.setDisplayMode("MAGNETIC_ONLY");
```
**Expected**: localStorage contains updated displayMode: "MAGNETIC_ONLY"
**Priority**: P0

#### TC-017-003: Happy Path - Load Persisted Settings
**Input**:
```typescript
// Page reload after setting declination to -8
const store = createCompassStore();
```
**Expected**: Store loads with declinationAngle: -8
**Priority**: P0

#### TC-017-004: Edge Case - Corrupted Storage
**Input**:
```typescript
// LocalStorage contains invalid data
localStorage.setItem("compass-storage", "{invalid json}");
const store = createCompassStore();
```
**Expected**: Store initializes with defaults, ignores corrupted data
**Priority**: P1

#### TC-017-005: Integration - Version Migration
**Input**:
```typescript
// LocalStorage contains old version
localStorage.setItem("compass-storage", JSON.stringify({
  state: { declinationAngle: 12 },
  version: -1 // Invalid version
}));
const store = createCompassStore();
```
**Expected**: Store handles version mismatch, uses defaults or migrates
**Priority**: P1

---

### AC-018: High Contrast Mode Support

#### TC-018-001: Happy Path - High Contrast Enabled
**Input**:
```typescript
const prefersHighContrast = true;
const compass = createCompass({ highContrastMode: true });
```
**Expected**: Compass background opacity = 1.0 (solid), border solid white, needles solid colors
**Priority**: P0

#### TC-018-002: Happy Path - High Contrast Disabled
**Input**:
```typescript
const prefersHighContrast = false;
const compass = createCompass({ highContrastMode: false });
```
**Expected**: Compass background opacity = 0.15 (semi-transparent), border with opacity
**Priority**: P0

#### TC-018-003: Edge Case - System Preference Change
**Input**:
```typescript
// System preference changes from false to true
window.matchMedia('(prefers-contrast: high)').matches = true;
```
**Expected**: Compass updates rendering to high contrast mode immediately
**Priority**: P1

#### TC-018-004: Integration - Needle Visibility
**Input**:
```typescript
const compass = createCompass({ highContrastMode: true });
```
**Expected**: Needle opacity = 1.0 (no transparency), increased stroke widths by 50%
**Priority**: P1

---

### AC-019: Reduced Motion Support

#### TC-019-001: Happy Path - Reduced Motion Enabled
**Input**:
```typescript
const prefersReducedMotion = true;
const compass = createCompass({ reducedMotion: true });
```
**Expected**: All CSS transitions disabled, needle rotation instant (no animation)
**Priority**: P0

#### TC-019-002: Happy Path - Reduced Motion Disabled
**Input**:
```typescript
const prefersReducedMotion = false;
const compass = createCompass({ reducedMotion: false });
```
**Expected**: All CSS transitions enabled, needle rotation animated
**Priority**: P0

#### TC-019-003: Edge Case - System Preference Change
**Input**:
```typescript
// System preference changes from false to true
window.matchMedia('(prefers-reduced-motion: reduce)').matches = true;
```
**Expected**: Compass immediately disables all animations
**Priority**: P1

#### TC-019-004: Integration - Hover Effects
**Input**:
```typescript
const compass = createCompass({ reducedMotion: true });
// User hovers over compass
```
**Expected**: No scale animation on hover, opacity change instant
**Priority**: P1

---

### AC-020: Canvas Fallback

#### TC-020-001: Happy Path - Canvas Available
**Input**:
```typescript
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
```
**Expected**: ctx is not null, canvas rendering used
**Priority**: P0

#### TC-020-002: Happy Path - Canvas Unavailable
**Input**:
```typescript
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d"); // Returns null
```
**Expected**: SVG fallback rendering initialized
**Priority**: P0

#### TC-020-003: Edge Case - WebGL Context Lost
**Input**:
```typescript
// WebGL context lost during rendering
const compass = createCompass();
handleContextLost();
```
**Expected**: Compass switches to SVG fallback gracefully
**Priority**: P1

#### TC-020-004: Integration - Fallback Feature Parity
**Input**:
```typescript
const compassCanvas = createCompassCanvas();
const compassSVG = createCompassSVG();
// Both should render identically
```
**Expected**: Both renderings produce identical visual output
**Priority**: P1

---

## Test Data

### Sample Compass State
```typescript
const SAMPLE_COMPASS_STATE: CompassState = {
  geographicHeading: 45,
  magneticHeading: 57,
  declinationAngle: 12,
  displayMode: "BOTH",
  isAnimating: false
};
```

### Sample Compass Config
```typescript
const SAMPLE_COMPASS_CONFIG: CompassConfig = {
  declinationAngle: 12,
  defaultMode: "BOTH",
  position: { offsetX: 20, offsetY: 20 },
  opacity: 0.15,
  size: 120,
  showDeclinationLabel: true,
  enableAnimations: true
};
```

### Sample Geographic Needle Props
```typescript
const SAMPLE_GEOGRAPHIC_NEEDLE: NeedleProps = {
  color: "#C0C0C0",
  width: 4,
  length: 45,
  tipLength: 12,
  tailLength: 8,
  opacity: 0.9,
  glowIntensity: 0.3
};
```

### Sample Magnetic Needle Props
```typescript
const SAMPLE_MAGNETIC_NEEDLE: NeedleProps = {
  color: "#FF3333",
  width: 4,
  length: 45,
  tipLength: 12,
  tailLength: 8,
  opacity: 0.9,
  glowIntensity: 0.5
};
```

### Mock Camera
```typescript
const MOCK_CAMERA: THREE.PerspectiveCamera = {
  position: new THREE.Vector3(3, 0, 3),
  rotation: new THREE.Euler(0, Math.PI / 4, 0),
  fov: 60,
  aspect: 16 / 9,
  near: 0.1,
  far: 1000
};
```

### Mock Globe Mesh
```typescript
const MOCK_GLOBE: THREE.Mesh = {
  geometry: new THREE.SphereGeometry(1, 64, 64),
  material: new THREE.MeshStandardMaterial({ color: 0x1a1122 }),
  position: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0)
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test compass store initialization and state management
- Test heading calculation algorithms independently
- Test declination angle validation and normalization
- Test display mode toggle logic
- Test needle rendering in isolation
- Test compass rose label positioning
- Test animation easing functions

### Integration Testing Approach
- Test compass heading updates with camera rotation
- Test magnetic heading calculation with declination
- Test mode transitions with visual feedback
- Test settings persistence across page reloads
- Test keyboard navigation with focus management
- Test screen reader announcements on mode changes

### Visual Regression Testing Approach
- Capture screenshots at each display mode
- Verify needle positions at cardinal headings (0°, 90°, 180°, 270°)
- Test declination arc rendering at various angles
- Validate color contrast ratios meet WCAG AA standards
- Test responsive sizing at different viewport widths

### Performance Testing Approach
- Measure render time for single compass frame
- Test memory usage with 1000 consecutive renders
- Verify throttled updates respect 60fps budget
- Test canvas caching effectiveness
- Measure impact on overall globe frame rate

### Accessibility Testing Approach
- Test keyboard navigation with screen reader
- Verify ARIA labels update on mode changes
- Test high contrast mode rendering
- Test reduced motion preference handling
- Verify focus ring visibility and behavior

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── compass/
│   │   ├── CompassStore.test.ts
│   │   ├── HeadingCalculation.test.ts
│   │   ├── DeclinationValidation.test.ts
│   │   ├── DisplayModeToggle.test.ts
│   │   ├── NeedleRendering.test.ts
│   │   ├── CompassRose.test.ts
│   │   ├── DeclinationArc.test.ts
│   │   ├── Animation.test.ts
│   │   └── Normalization.test.ts
├── integration/
│   ├── compass/
│   │   ├── CameraIntegration.test.ts
│   │   ├── GlobeIntegration.test.ts
│   │   ├── ModeTransitions.test.ts
│   │   ├── SettingsPersistence.test.ts
│   │   ├── KeyboardNavigation.test.ts
│   │   └── ScreenReader.test.ts
├── visual/
│   ├── compass/
│   │   ├── DisplayModeScreenshots.test.ts
│   │   ├── NeedlePositions.test.ts
│   │   ├── DeclinationArc.test.ts
│   │   └── ResponsiveSizing.test.ts
├── performance/
│   ├── compass/
│   │   ├── RenderTime.test.ts
│   │   ├── MemoryUsage.test.ts
│   │   └── FrameBudget.test.ts
└── accessibility/
    ├── compass/
    │   ├── KeyboardNavigation.test.ts
    │   ├── ScreenReader.test.ts
    │   ├── HighContrast.test.ts
    │   └── ReducedMotion.test.ts
```

### Naming Conventions
- Unit tests: `{FeatureName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- Visual tests: `{VisualAspect}.test.ts`
- Performance tests: `{PerformanceMetric}.test.ts`
- Accessibility tests: `{AccessibilityFeature}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by feature for unit tests (store, calculations, rendering)
- Group by integration point for integration tests (camera, globe, settings)
- Group by visual aspect for visual tests (screenshots, positions, sizing)
- Group by metric for performance tests (render time, memory, frame budget)
- Group by accessibility feature for accessibility tests (keyboard, screen reader, preferences)

---

## Test Utilities

### Mock Camera Factory
```typescript
export function createMockCamera(config?: Partial<CameraConfig>): THREE.PerspectiveCamera {
  const defaultConfig: CameraConfig = {
    position: new THREE.Vector3(0, 0, 5),
    rotation: new THREE.Euler(0, 0, 0),
    fov: 60,
    aspect: 16 / 9,
    near: 0.1,
    far: 1000
  };
  
  const mergedConfig = { ...defaultConfig, ...config };
  
  const camera = new THREE.PerspectiveCamera(
    mergedConfig.fov,
    mergedConfig.aspect,
    mergedConfig.near,
    mergedConfig.far
  );
  
  camera.position.copy(mergedConfig.position);
  camera.rotation.copy(mergedConfig.rotation);
  
  return camera;
}
```

### Mock Globe Factory
```typescript
export function createMockGlobe(config?: Partial<GlobeConfig>): THREE.Mesh {
  const defaultConfig: GlobeConfig = {
    radius: 1,
    segments: 64,
    color: 0x1a1122
  };
  
  const mergedConfig = { ...defaultConfig, ...config };
  
  const geometry = new THREE.SphereGeometry(
    mergedConfig.radius,
    mergedConfig.segments,
    mergedConfig.segments
  );
  
  const material = new THREE.MeshStandardMaterial({
    color: mergedConfig.color
  });
  
  const globe = new THREE.Mesh(geometry, material);
  globe.position.set(0, 0, 0);
  
  return globe;
}
```

### Performance Measurement Utility
```typescript
export function measureRenderTime(renderFn: () => void): number {
  const startTime = performance.now();
  renderFn();
  const endTime = performance.now();
  return endTime - startTime;
}

export function measureMemoryUsage(): number {
  if (performance.memory) {
    return performance.memory.usedJSHeapSize;
  }
  return 0;
}
```

### Screenshot Comparison Utility
```typescript
export async function captureCompassScreenshot(
  compass: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(compass);
  const dataUrl = canvas.toDataURL("image/png");
  
  // Save for comparison
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
```

### Accessibility Assertion Utility
```typescript
export function assertAriaAttribute(
  element: HTMLElement,
  attribute: string,
  expectedValue: string
): void {
  const actualValue = element.getAttribute(attribute);
  expect(actualValue).toBe(expectedValue);
}

export function assertFocusVisible(
  element: HTMLElement,
  isVisible: boolean
): void {
  const computedStyle = window.getComputedStyle(element);
  const outlineWidth = computedStyle.outlineWidth;
  
  if (isVisible) {
    expect(parseInt(outlineWidth)).toBeGreaterThan(0);
  } else {
    expect(parseInt(outlineWidth)).toBe(0);
  }
}
```

---

## Coverage Goals

### Unit Test Coverage
- CompassStore: 100%
- Heading calculation functions: 100%
- Declination validation: 100%
- Display mode toggle: 100%
- Needle rendering: 100%
- Compass rose rendering: 100%
- Animation functions: 100%

### Integration Test Coverage
- Camera integration: 100%
- Globe integration: 100%
- Settings persistence: 100%
- Keyboard navigation: 100%
- Screen reader support: 100%

### Visual Test Coverage
- All display modes: 100%
- Cardinal headings: 100%
- Declination angles: 0°, 12°, 45°, 90°, 180°
- Responsive breakpoints: mobile, tablet, desktop

### Accessibility Test Coverage
- Keyboard navigation: 100%
- Screen reader: 100%
- High contrast mode: 100%
- Reduced motion: 100%

### Performance Test Coverage
- Render time budget: 100%
- Memory usage: 100%
- Frame budget compliance: 100%

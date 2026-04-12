# TDD Plan: Golden Compass Studio

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Pass Workflow
- **`switches_passes`**: Click "Pass 2: Mechanical" and verify the UI updates to show stat blocks instead of just prose.
- **`shows_fortune_master_tip`**: Verify the tip box appears when changing passes.

### 1.2 Diamond Input
- **`renders_diamonds`**: Check that 3 diamond icons are rendered for a stat.
- **`updates_rating_on_click`**: Click the 2nd diamond and verify the rating updates to 2.

### 1.3 Doomsday Clock
- **`renders_clock_time`**: Pass "10:00" and verify the visual display.
- **`flashes_warning`**: Set time close to deadline and check for 'flash-red' CSS class.

## 2. Integration Tests

### 2.1 Branching Logic
- **Scenario**: Defining a failure path.
    1.  **Given**: Scene 1 is active.
    2.  **When**: User adds a "Failure" branch to "Alleyway Chase".
    3.  **Then**: The Logic Map updates, and the "Alleyway Chase" node is created/linked.

### 2.2 Challenge Creation
- **Scenario**: Adding a Critical Challenge.
    1.  **Given**: In Pass 2.
    2.  **When**: User adds "Stealth Approach", sets Difficulty to 'Critical', Field to 'Crime'.
    3.  **Then**: The challenge card appears with the correct icon and difficulty badge.

## 3. Component Mocks
- Mock the "Circular Progress Bar" if using a canvas/svg library.
- Mock the "Drag and Drop" for branching connections.

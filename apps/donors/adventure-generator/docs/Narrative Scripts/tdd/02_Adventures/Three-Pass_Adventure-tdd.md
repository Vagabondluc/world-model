# TDD Plan: Three-Pass Adventure Studio

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Stepper Logic
- **`initializes_at_pass_one`**: Verify component mounts in Narrative mode.
- **`locks_next_pass_if_incomplete`**: Attempt to click "Next" with empty fields and verify it remains disabled.
- **`advances_pass_on_complete`**: Check all boxes, click "Next", and verify state updates to Pass 2.

### 1.2 Entity Editor
- **`shows_correct_fields_per_pass`**:
    - Pass 1: Expect 'Motivation' input.
    - Pass 2: Expect 'Action/Guts' inputs.
- **`persists_data_between_passes`**: Enter data in Pass 1, switch to 2, switch back, and verify data remains.

### 1.3 Doomsday Clock
- **`advances_ticks`**: Call the update function and verify the visual segments fill up.
- **`triggers_event_at_max`**: Set clock to max and verify the "Event Triggered" alert fires.

## 2. Integration Tests

### 2.1 The "Go Back" Warning
- **Scenario**: Modifying Narrative after Mechanics are set.
    1.  **Given**: User is in Pass 2 with defined DCs.
    2.  **When**: User clicks "Pass 1" to return.
    3.  **Then**: A modal appears warning that "Mechanical stats may need re-validation".

### 2.2 Full Workflow State
- **Scenario**: Completing an adventure.
    1.  **Given**: All 3 passes are marked complete.
    2.  **When**: User clicks "Export Final Draft".
    3.  **Then**: The `onExport` handler is called with a fully populated `AdventureModule` object.

## 3. Component Mocks
- Mock the "Read Aloud" text generation (Rich Text Editor).
- Mock the file system save/load triggers.

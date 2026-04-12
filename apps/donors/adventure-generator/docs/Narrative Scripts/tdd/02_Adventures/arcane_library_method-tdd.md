# TDD Plan: Arcane Library Adventure Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Randomizer Engine
- **`generates_batch_of_5`**: Click "Roll" and verify 5 distinct cards appear.
- **`respects_filters`**: Set filter to "Nautical" and verify keywords (if tag logic exists) or simply that the generate function receives the filter config.

### 1.2 Selection Gallery
- **`selects_active_card`**: Click Card #3 and verify it becomes the "Chosen Idea" in the Context panel.
- **`overrides_single_column`**: Lock "Rescue" (Action) and "Goblet" (McGuffin), click "Re-roll Subject", and verify only the Subject changes.

### 1.3 Context Expansion
- **`validates_required_fields`**: Try to save without "Stakes" and check for error state.
- **`suggests_pc_hook`**: Click "Suggest Personal Hook" and verify text field populates with data derived from mock PC bios.

## 2. Integration Tests

### 2.1 The Creative Loop
- **Scenario**: Refining a premise.
    1.  **Given**: A batch of 5 ideas.
    2.  **When**: User selects "Rescue the Goblet...", fills in "Origin", and clicks "Save to Campaign".
    3.  **Then**: The `onSave` mock triggers, receiving the fully hydrated `ArcanePremise` object.

### 2.2 Re-rolling Logic
- **Scenario**: Partial re-roll.
    1.  **Given**: An active premise "Kill the King".
    2.  **When**: User clicks "Re-roll Subject" (King).
    3.  **Then**: The text updates to "Kill the [New Subject]", but "Kill" remains.

## 3. Component Mocks
- Mock the "Data Tables" (d100 lists) so tests are deterministic.
- Mock the "PC Bio Service" for hook generation.

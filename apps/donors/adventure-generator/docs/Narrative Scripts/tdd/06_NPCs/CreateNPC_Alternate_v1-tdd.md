# TDD Plan: NPC Template: Identity & Origin

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Descriptive Synthesis
- **`generates_physical_sentence`**:
    - Input Height: 5'10", Skin: Olive.
    - Verify Synthesis text contains "stands 5'10\" with olive skin".

### 1.2 Job Inventory
- **`populates_gear_from_job`**:
    - Select Job "Cartographer".
    - Verify Gear field includes "Ink" or "Map".

### 1.3 Identity Fields
- **`captures_preference`**:
    - Select Preference "Bisexual".
    - Verify State Update.

## 2. Integration Tests

### 2.1 Full Export
- **Scenario**: Saving Profile.
    1.  **Given**: Filled form.
    2.  **When**: Click "Save to Campaign".
    3.  **Then**: Verify payload structure matches schema.

## 3. Component Mocks
- Mock the "Job Inventory Database".

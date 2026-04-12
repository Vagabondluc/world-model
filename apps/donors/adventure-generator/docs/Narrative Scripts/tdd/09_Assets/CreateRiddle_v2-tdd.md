# TDD Plan: Compound Riddle Architect v2

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Structural Assembly
- **`assembles_full_riddle`**:
    - Input Clue A: "Red".
    - Input Clue B: "Hot".
    - Verify Final Text contains wrapper + "Red" + "Hot".

### 1.2 Input Validation
- **`validates_inputs_present`**:
    - Leave Word B empty.
    - Click Generate.
    - Verify Error "Both words required".

### 1.3 Clue Generation
- **`generates_individual_clues`**:
    - Click "Regenerate Clue A".
    - Verify Clue A updates, Clue B stays same.

## 2. Integration Tests

### 2.1 Compound Logic
- **Scenario**: Valid Compound.
    1.  **Given**: Word A "Light", Word B "House".
    2.  **When**: Validate Logic.
    3.  **Then**: Success "Valid Compound detected".

## 3. Component Mocks
- Mock the "Dictionary/Compound Service".

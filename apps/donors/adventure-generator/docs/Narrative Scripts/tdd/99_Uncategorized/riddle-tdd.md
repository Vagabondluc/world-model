# TDD Plan: Riddle Forge

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Generation
- **`generates_variants`**:
    - Input Answer: "Fire".
    - Verify Easy text exists.
    - Verify Hard text exists.
    - Verify Explanation exists.

### 1.2 Theming
- **`includes_theme_context`**:
    - Theme: "Library".
    - Verify Request Payload includes "Library" instruction.

## 2. Integration Tests

### 2.1 Export
- **Scenario**: Card Creation.
    1.  **Given**: Generated Riddle.
    2.  **When**: Click "Export Riddle Card".
    3.  **Then**: Output format matches Card Schema.

## 3. Component Mocks
- Mock the "AI Service".

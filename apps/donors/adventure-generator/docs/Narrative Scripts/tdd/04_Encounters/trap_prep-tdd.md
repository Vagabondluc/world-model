# TDD Plan: Trap Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Matrix Logic
- **`rolls_components`**:
    - Click "Roll Clue".
    - Verify Clue field updates with new string.

### 1.2 Sequence Builder
- **`generates_stages`**:
    - Input Danger "Falling Rock".
    - Verify Stage 3 (Impact) default text mentions "Bludgeoning damage".

### 1.3 Resolution Panel
- **`calculates_dc_guideline`**:
    - Set Trap Level: Dangerous.
    - Verify suggested DC is ~15.

## 2. Integration Tests

### 2.1 Theme Filter
- **Scenario**: Sci-Fi Trap.
    1.  **Given**: Theme 'Space Station'.
    2.  **When**: Roll Danger.
    3.  **Then**: Result includes "Laser" or "Plasma", excludes "Crossbow".

## 3. Component Mocks
- Mock the "Trap Database".

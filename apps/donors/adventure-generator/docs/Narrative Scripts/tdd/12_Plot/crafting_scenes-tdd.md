# TDD Plan: Scene Director

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Agenda Validation
- **`requires_agenda`**:
    - Try to Save without Agenda.
    - Verify Error "Define Scene Goal".

### 1.2 Sharp Cuts
- **`suggests_abstract_time`**:
    - Input Transition: "8 hour walk".
    - Verify UI Suggestion: "Use Abstract Time".

### 1.3 Bang Generation
- **`randomizes_bang`**:
    - Click "Randomize Bang".
    - Verify text field updates with new content.

## 2. Integration Tests

### 2.1 Scene Flow
- **Scenario**: Full Frame.
    1.  **Given**: Bang "Betrayal", Agenda "Survival".
    2.  **When**: Finalize Frame.
    3.  **Then**: Output narrative connects Bang to Agenda obstacles (mocked).

## 3. Component Mocks
- Mock the "Dramatic Library" database.

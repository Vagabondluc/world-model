# TDD Plan: Mystery Structure Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Framework Logic
- **`enforces_loop_connectivity`**:
    - Select Framework 'Loop'.
    - Add Node A, B, C.
    - Verify Graph automatically suggests A->B->C->A connections.

### 1.2 Configuration Panel
- **`toggles_dead_end_fields`**:
    - Set Node Type to 'Dead End'.
    - Verify "Reward" input becomes visible.

### 1.3 Filename Formatter
- **`generates_correct_nomenclature`**:
    - Framework: Loop. Node: A.
    - Verify Preview: `_Loop_A.txt`.

## 2. Integration Tests

### 2.1 Simulation
- **Scenario**: Path check.
    1.  **Given**: Complete Loop graph.
    2.  **When**: Click "Simulate Path".
    3.  **Then**: System verifies it's possible to reach 'Break Condition' (e.g. 4 clues).

## 3. Component Mocks
- Mock the "Graph Layout Engine".

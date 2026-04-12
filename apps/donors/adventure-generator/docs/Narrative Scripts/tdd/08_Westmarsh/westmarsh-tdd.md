# TDD Plan: Westmarsh Adventure Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Matrix Generation
- **`generates_unique_seeds`**:
    - Click Regenerate.
    - Verify 4 adventure slots have different seeds.

### 1.2 Narrative Expansion
- **`toggles_word_count_mode`**:
    - Select Adventure 1.
    - Click "120 Word Mode".
    - Verify UI State updates to `mode: 'expanded'`.

### 1.3 Threat Linking
- **`links_cause_to_consequence`**:
    - Input Threat "Sabotage".
    - Verify "Consequence" field suggests "Collapse" or "Flooding".

## 2. Integration Tests

### 2.1 Full Export
- **Scenario**: Session Prep.
    1.  **Given**: 4 generated adventures.
    2.  **When**: Click "Export All 4 Plots".
    3.  **Then**: Output text contains 4 distinct headers and narrative blocks.

## 3. Component Mocks
- Mock the "Procedural Story Engine".

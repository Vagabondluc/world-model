# TDD Plan: Revelation List Manager

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Audit Engine
- **`flags_bottleneck`**:
    - Node C has 1 Inbound Clue.
    - Verify Status is 'Critical' (Red).
- **`validates_three_clues`**:
    - Node B has 3 Inbound Clues.
    - Verify Status is 'Valid' (Green).

### 1.2 Matrix Rendering
- **`groups_clues_by_target`**:
    - Input: Clue 1 (Target C), Clue 2 (Target C).
    - Verify "Node C" section lists both clues.

### 1.3 Fix Suggestion
- **`triggers_suggestion`**:
    - Click "Suggest Source".
    - Verify AI service called with context "Node C needs clue".

## 2. Integration Tests

### 2.1 Data Ingestion
- **Scenario**: Loading Mystery.
    1.  **Given**: 5 Node objects.
    2.  **When**: Initialize Manager.
    3.  **Then**: Matrix populates fully with correct reverse mappings.

## 3. Component Mocks
- Mock the "Node Parser".

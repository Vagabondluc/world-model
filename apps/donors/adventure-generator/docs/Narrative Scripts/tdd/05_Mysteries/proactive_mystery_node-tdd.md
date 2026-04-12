# TDD Plan: Proactive Node Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Phase Switching
- **`updates_content_on_phase_change`**:
    - Set Phase: Early. Verify Text: "Vague Hint".
    - Set Phase: Late. Verify Text: "Desperate Plea".

### 1.2 Lead Mapper
- **`links_to_main_node`**:
    - Add Lead "Ledger".
    - Target: "Node B".
    - Verify Lead Object contains `target: 'Node B'`.

### 1.3 Trigger Manager
- **`adds_trigger_condition`**:
    - Enter "Players attack Guard".
    - Add.
    - Verify list length increments.

## 2. Integration Tests

### 2.1 File Gen
- **Scenario**: Export.
    1.  **Given**: Complete node data.
    2.  **When**: Click "Generate Proactive File".
    3.  **Then**: Output text includes all 3 phase variations.

## 3. Component Mocks
- Mock the "Campaign State" (for knowing which clues are missed).

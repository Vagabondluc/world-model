# TDD Plan: 5-Node Mystery Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Node Graph
- **`selects_active_node`**:
    - Click Node C.
    - Verify "Node Editor" panel title updates to "Node C".

### 1.2 Clue Logic
- **`validates_clue_target`**:
    - Add clue to Node A.
    - Set Target: "Node B".
    - Verify Graph draws line A->B.

### 1.3 Consistency Check
- **`flags_missing_clues`**:
    - Node A has 0 clues.
    - Run Validator.
    - Return Error: "Node A needs at least 1 outbound clue."

## 2. Integration Tests

### 2.1 File Generation
- **Scenario**: Exporting project.
    1.  **Given**: Full 5-node data.
    2.  **When**: Click "Generate All Node Files".
    3.  **Then**: Verify 5 separate file payloads are prepared (mocked).

## 3. Component Mocks
- Mock the "Graph Rendering" library.

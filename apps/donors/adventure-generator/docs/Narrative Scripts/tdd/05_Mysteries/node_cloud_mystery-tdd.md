# TDD Plan: Node Cloud Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Cloud Graph
- **`filters_by_faction`**:
    - Enable "Red Watch" filter.
    - Verify only nodes with `faction='Red Watch'` are visible/highlighted.

### 1.2 Timeline
- **`updates_node_state_on_time_change`**:
    - Move slider to Day 3.
    - Verify Node "Tavern" state changes to "Closed" (based on event data).

### 1.3 Redundancy Matrix
- **`flags_insufficient_sources`**:
    - Fact "King is Dead" has 1 source.
    - Verify Check Status -> "Warning: Needs 2 more".

## 2. Integration Tests

### 2.1 Path Simulation
- **Scenario**: Checking dead ends.
    1.  **Given**: Node connection graph.
    2.  **When**: Click "Simulate Flow".
    3.  **Then**: System logs "Path Found" or "Bottleneck at Node X".

## 3. Component Mocks
- Mock the Force-Directed Graph library (D3.js or similar).

# TDD Plan: Xandered Dungeon Designer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Tool Logic
- **`creates_loop_edge`**: Select Loop Tool, click Node A and Node C -> Verify edge type is 'Loop'.
- **`adds_landmark`**: Drag Landmark to Node A -> Verify Node A has landmark data attached.

### 1.2 Complexity Auditor
- **`calculates_score`**:
    - Graph with 1 loop -> Score 20%.
    - Graph with 3 loops + verticality -> Score 80%.

### 1.3 Canvas Rendering
- **`colors_edges_by_type`**: Verify 'Secret' edge renders as Gold/Dashed.

## 2. Integration Tests

### 2.1 Navigation Verification
- **Scenario**: Detect Dead End.
    1.  **Given**: Node B has no exit edges.
    2.  **When**: Click "Verify Navigation".
    3.  **Then**: Node B is highlighted as "Dead End".

## 3. Component Mocks
- Mock the Graph Theory library (Pathfinding).

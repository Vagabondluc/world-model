# TDD Plan: Random Encounter Table Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Probability Engine
- **`assigns_weighted_ranges`**:
    - Mode: 2d6.
    - Entry A: Common. Entry B: Rare.
    - Verify A gets ~30-40% of range (e.g. 5-9), B gets ~5% (e.g. 2 or 12).

### 1.2 Table Editor
- **`validates_xp_budget`**:
    - Table Level: 1-3.
    - Input: "Ancient Red Dragon".
    - Verify "Deadly Warning" flag appears.

### 1.3 Simulator
- **`runs_monte_carlo`**:
    - Click "Run 100 Rolls".
    - Verify Report object is populated with distribution stats.

## 2. Integration Tests

### 2.1 Export formatting
- **Scenario**: Printing.
    1.  **Given**: Active table with Rules toggled on.
    2.  **When**: Click "Print Cheat Sheet".
    3.  **Then**: Output HTML includes "Standard Procedures" block.

## 3. Component Mocks
- Mock the RNG engine for deterministic tests.

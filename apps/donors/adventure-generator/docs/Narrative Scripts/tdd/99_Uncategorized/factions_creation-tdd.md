# TDD Plan: Faction & Downtime Dashboard

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Clock Progress
- **`advances_clock_segment`**:
    - Current: 4/8.
    - Action: Advance.
    - Verify Current: 5/8.

### 1.2 Conflict Resolution
- **`resolves_conflict_damage`**:
    - Attacker Tier 3 vs Defender Tier 1.
    - Roll: Success.
    - Verify Defender Status: "Damaged".

### 1.3 Relationship Web
- **`tracks_links`**:
    - Link A and B as "Enemies".
    - Verify Graph contains Edge A<->B (Enemy).

## 2. Integration Tests

### 2.1 Downtime Trigger
- **Scenario**: Clock Filled.
    1.  **Given**: Clock 3/4.
    2.  **When**: Advance to 4/4.
    3.  **Then**: Event Log records "Goal Achieved" and triggers "Consequence" (mocked).

## 3. Component Mocks
- Mock the "Simulation Dice Engine".

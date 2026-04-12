# TDD Plan: Raid Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 XP Budgeting
- **`calculates_deadly_budget`**:
    - Level 5 Party (4 PCs).
    - Verify Budget approx 13,200 XP (Standard D&D Math).
- **`tracks_squad_cost`**:
    - Add Squad (400 XP).
    - Verify "Used" increases by 400.

### 1.2 Intel Categorization
- **`sorts_survey_data`**:
    - Add "Secret Tunnel" as Impossible.
    - Verify it appears in "Impossible" column.

### 1.3 Blueprint Sync
- **`hides_impossible_intel`**:
    - Generate Player Blueprint.
    - Verify "Secret Tunnel" is absent.

## 2. Integration Tests

### 2.1 Squad Builder
- **Scenario**: Full manifest.
    1.  **Given**: Budget 1000 XP.
    2.  **When**: Auto-Fill.
    3.  **Then**: Squad list populates to fill budget (mocked algo).

## 3. Component Mocks
- Mock the "XP Math" and "Auto-Fill" algo.

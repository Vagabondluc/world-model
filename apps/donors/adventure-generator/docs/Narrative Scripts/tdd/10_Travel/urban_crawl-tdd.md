# TDD Plan: Urban Crawl Navigator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Heat Mechanics
- **`increases_heat_on_investigation`**:
    - Action: "Investigate Gangs".
    - Verify Heat +10%.

### 1.2 Layer Logic
- **`filters_content_by_layer`**:
    - Activate "Vampire". Deactivate "Gangs".
    - Click "General Investigation".
    - Verify Result contains "Blood" or "Thrall" keywords.

### 1.3 Faction Impact
- **`updates_reputation`**:
    - Resolve Event "Bust Smugglers".
    - Verify "Iron Syndicate" Rep decreases.

## 2. Integration Tests

### 2.1 District Context
- **Scenario**: District Switch.
    1.  **Given**: Active "Docks".
    2.  **When**: Switch to "Citadel".
    3.  **Then**: Gazetteer panel updates to shows Citadel landmarks (mocked).

## 3. Component Mocks
- Mock the "Encounter Table" service.

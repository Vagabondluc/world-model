# TDD Plan: City Gazetteer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 District Navigation
- **`switches_active_district`**:
    - Click "Copper Quarter".
    - Verify Main View updates to Copper Quarter data.

### 1.2 Scenic Roller
- **`rolls_context_encounter`**:
    - Active: "High Citadel".
    - Click "Check Encounter".
    - Verify result comes from 'citadel_pool' (e.g. "Noble Guard"), not 'slums_pool'.

### 1.3 Event Timeline
- **`adds_background_event`**:
    - Add "Tax Hike".
    - Verify Event list length increments.

## 2. Integration Tests

### 2.1 Transit Visualizer
- **Scenario**: Graph check.
    1.  **Given**: Docks connects to Market.
    2.  **When**: View Transit Map.
    3.  **Then**: Verify line drawn between Docks and Market nodes.

## 3. Component Mocks
- Mock the "Encounter Database".

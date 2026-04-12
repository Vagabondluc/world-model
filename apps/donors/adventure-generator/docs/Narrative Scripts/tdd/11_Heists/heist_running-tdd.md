# TDD Plan: Heist Running Dashboard

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Tension Mechanics
- **`increments_tension`**:
    - Click "Trigger Alert".
    - Verify Tension increases.
    - If Tension >= 8, verify Alert Level is "High Alert".

### 1.2 Flashback Usage
- **`consumes_flashback_resource`**:
    - Current: 3.
    - Action: Spend Flashback.
    - Verify Current: 2.

### 1.3 Complication Injection
- **`injects_obstacle`**:
    - Trigger "Complication".
    - Verify Event List adds new item (e.g. "Guard Change").

## 2. Integration Tests

### 2.1 Intervention Flow
- **Scenario**: Critical Moment.
    1.  **Given**: Obstacle "Guard Dog".
    2.  **When**: Choose "Distract with Meat".
    3.  **Then**: Tension +1 (Cost), Obstacle resolved.

## 3. Component Mocks
- Mock the "Event Generator".

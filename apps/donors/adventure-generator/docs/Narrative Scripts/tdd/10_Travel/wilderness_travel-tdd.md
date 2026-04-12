# TDD Plan: Wilderness Travel Manager

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Resource Management
- **`consumes_supplies_daily`**:
    - Click "End Day".
    - Verify Supplies decreases by 1 unit (or party size).

### 1.2 Sequence Logic
- **`advances_sequence_step`**:
    - State: Sequence Part 1.
    - Click "Trigger Next Scene".
    - Verify State updates to Sequence Part 2.

### 1.3 Weather Effects
- **`applies_weather_penalty`**:
    - Set Weather: "Blizzard".
    - Verify Navigation DC increases (+2).

## 2. Integration Tests

### 2.1 Scene Generation
- **Scenario**: Rolling Encounter.
    1.  **Given**: Biome "Tundra".
    2.  **When**: Roll 2d6 -> Result 12 (Rare).
    3.  **Then**: Output description includes "Ancient/Rare" keyword (mocked).

## 3. Component Mocks
- Mock the "2d6 Table" service.

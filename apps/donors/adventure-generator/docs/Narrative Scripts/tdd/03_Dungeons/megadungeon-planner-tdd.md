# TDD Plan: Megadungeon Planner

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Level Navigation
- **`switches_active_level`**: Click Level 5 -> Verify central panel shows Level 5 details.
- **`renders_difficulty_colors`**: Verify Level 1 is Green and Level 20 is Purple/Black.

### 1.2 Ecosystem Modeler
- **`links_resources`**: Define "Water" on L4 -> Verify L5 can select "L4 Water" as a source.

### 1.3 Faction Grid
- **`updates_control`**: Assign "Cult" to L3 -> Verify L3 card shows "Cult Controlled".

## 2. Integration Tests

### 2.1 Restoration Logic
- **Scenario**: Clearing a level.
    1.  **Given**: L3 is "Hostile".
    2.  **When**: Mark L3 as "Cleared".
    3.  **Then**: "Restock Timer" begins (mocked start).

## 3. Component Mocks
- Mock the "Restock Timer" service.

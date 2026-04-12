# TDD Plan: Extended Settlement Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Everyday Life Generation
- **`respects_depth_setting`**:
    - Set Depth: "Brief".
    - Click Generate.
    - Verify "Traditions" output is < 200 chars.
    - Set Depth: "Detailed".
    - Verify "Traditions" output is > 500 chars.

### 1.2 Civ Level Logic
- **`scales_complexity_by_civ_level`**:
    - Set Level: "Primitive".
    - Verify generated "Occupations" list length is low (approx 5).
    - Set Level: "Advanced".
    - Verify list length is high (approx 20).

### 1.3 Conflict Config
- **`generates_selected_conflict_types`**:
    - Enable "Supernatural". Disable "Political".
    - Verify Output contains "Supernatural: ..." and no "Political: ...".

## 2. Integration Tests

### 2.1 Full Procedural Run
- **Scenario**: Seeded gen.
    1.  **Given**: Seed "test-seed".
    2.  **When**: Click Generate.
    3.  **Then**: Output matches snapshot (deterministic).

## 3. Component Mocks
- Mock the "Table Service" (RNG lookups).

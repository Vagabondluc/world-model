# TDD Plan: Wilderness Master Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Scaling Logic
- **`applies_global_scaling`**:
    - Set Slider +2.
    - Verify Standard DC (used in scenes) updates from 15 to 17.

### 1.2 Sequence Builder
- **`links_scenes_logically`**:
    - Add Scene 1. Add Scene 2.
    - Create Link "Peaceful Resolution".
    - Verify Graph structure contains edge 1->2.

### 1.3 Simulation Engine
- **`calculates_trip_drain`**:
    - Input: 14 days, 4 PCs.
    - Click Simulate.
    - Verify Output "56 Rations consumed".

## 2. Integration Tests

### 2.1 Appendix Generation
- **Scenario**: Export.
    1.  **Given**: Complete Chapter Data.
    2.  **When**: Click "Generate Appendices".
    3.  **Then**: Output contains "Random Encounter Tables" derived from sequences.

## 3. Component Mocks
- Mock the "Simulation Logic" (Monte Carlo wrapper).

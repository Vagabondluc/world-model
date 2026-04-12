# TDD Plan: Raid Commander

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Awareness Logic
- **`escalates_status`**:
    - Event: "Shout detected".
    - Target: Squad A (Passive).
    - Verify Status changes to "Alert".

### 1.2 Time Scaling
- **`updates_turn_duration`**:
    - Switch to "Combat".
    - Verify Tick = 6s.
    - Switch to "Raid".
    - Verify Tick = 1 min.

### 1.3 Distance Penalty
- **`applies_perception_mod`**:
    - Base DC: 10.
    - Distance: 60ft (+5).
    - Verify Final DC: 15.

## 2. Integration Tests

### 2.1 Ripple Effect
- **Scenario**: Noise Propagation.
    1.  **Given**: PC fails Stealth in Barracks.
    2.  **When**: Trigger Ripple.
    3.  **Then**: Squad in "Corridor" rolls Perception (mocked).

## 3. Component Mocks
- Mock the "Ripple Physics" engine.

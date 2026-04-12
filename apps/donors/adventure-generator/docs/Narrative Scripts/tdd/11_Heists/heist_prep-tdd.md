# TDD Plan: Heist Preparation Studio

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Intel Management
- **`reveals_intel_on_success`**:
    - State: "Ventilation" is Hidden.
    - Action: Complete "Buy Blueprints".
    - Verify State: "Ventilation" is Known.

### 1.2 Defense Layering
- **`orders_defenses_correctly`**:
    - Add Layer "Vault Door".
    - Add Layer "Perimeter Wall".
    - Verify "Perimeter Wall" index < "Vault Door" index.

### 1.3 Crew Validation
- **`warns_missing_role`**:
    - Target: Bank Vault.
    - Crew: 3 Fighters (Muscle).
    - Verify Warning "No Safecracker assigned".

## 2. Integration Tests

### 2.1 Handout Generation
- **Scenario**: Player Map.
    1.  **Given**: Mixed Intel State.
    2.  **When**: Click "Export Plan".
    3.  **Then**: Map shows Known elements, hides Hidden elements.

## 3. Component Mocks
- Mock the "Blueprint Rendering Engine".

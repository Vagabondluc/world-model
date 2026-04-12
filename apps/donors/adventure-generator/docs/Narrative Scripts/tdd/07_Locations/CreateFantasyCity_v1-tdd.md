# TDD Plan: Fantasy City Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Shop Generation
- **`flavors_shop_names_by_race`**:
    - Set Race: "Wood Elf".
    - Click "Generate Magic Shop Name".
    - Verify Name contains "Root", "Leaf", or "Sylvan".

### 1.2 Architecture Toggles
- **`enables_layer_toggles`**:
    - Toggle "Canopy District".
    - Verify State `layers.canopy` is true.

### 1.3 Validation
- **`flags_incomplete_market`**:
    - Fill 9/10 shops.
    - Click "Done".
    - Verify Error "Marketplace incomplete".

## 2. Integration Tests

### 2.1 Full Profile Export
- **Scenario**: Exporting Citdata.
    1.  **Given**: Complete form.
    2.  **When**: Click "Generate Full City Profile".
    3.  **Then**: Output text includes Identity, Architecture, and Shop List.

## 3. Component Mocks
- Mock the "Name Generator" service.

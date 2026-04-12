# TDD Plan: 5x5 Campaign Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Navigation
- **`drills_down_to_mystery`**:
    - Click Mystery A.
    - Verify view changes to "Mystery A 5-Node Graph".
- **`returns_to_campaign`**:
    - Click "Back to Campaign".
    - Verify view shows 5-Mystery Meta Map.

### 1.2 Global Lore
- **`propagates_lore_updates`**:
    - Update NPC "Vane" name to "Vane the Elder".
    - Verify Node A-3 usage of "Vane" is updated.

### 1.3 Inter-Connections
- **`creates_global_link`**:
    - Link Node A-5 to Mystery B Start.
    - Verify Meta Map shows connection line A -> B.

## 2. Integration Tests

### 2.1 Full Consistency Check
- **Scenario**: Validate Campaign.
    1.  **Given**: 3 Mysteries defined.
    2.  **When**: Click "Audit Status".
    3.  **Then**: Report shows "Mystery D and E missing".

## 3. Component Mocks
- Mock the "Zoomable Canvas".

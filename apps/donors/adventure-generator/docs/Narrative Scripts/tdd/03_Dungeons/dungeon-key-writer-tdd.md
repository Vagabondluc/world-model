# TDD Plan: Dungeon Key Writer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Synchronization
- **`adds_key_entry_on_map_node`**: Add Node 1 to Canvas -> Verify 'Room 1' appears in Key list.
- **`renumbers_keys`**: Swap Node 1 and 2 -> Verify Key titles update accordingly.

### 1.2 Sensory Studio
- **`requires_sensory_details`**: Try to mark room complete with empty sensory fields -> Fail/Warn.
- **`requires_irrelevant_details`**: Verify at least 2 irrelevant detail fields are filled.

### 1.3 Symbol Logic
- **`injects_element_from_symbol`**: Drop 'Trap' icon on Node 1 -> Verify 'Trap Element' added to Room 1 Key.

## 2. Integration Tests

### 2.1 Xandering Audit
- **Scenario**: Checking connectivity.
    1.  **Given**: A linear map (1-2-3-4).
    2.  **When**: Click "Xandering Audit".
    3.  **Then**: Map highlights "Dead Ends" in red and score is 'Low'.

### 2.2 Treasure Aggregation
- **Scenario**: Summarizing loot.
    1.  **Given**: Room 1 has "50gp", Room 2 has "Sword".
    2.  **When**: View "Treasure Summary".
    3.  **Then**: List contains "50gp" and "Sword".

## 3. Component Mocks
- Mock the `Canvas` interaction (click coordinates).

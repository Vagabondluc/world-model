# TDD Plan: Mystery Re-configurator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Clue Mapping
- **`tracks_unmapped_clues`**:
    - Import Old Node (3 Inbound Clues).
    - Map 1 Clue.
    - Verify Status "2 Unmapped Clues".
- **`assigns_new_location`**:
    - Map Clue A -> "Gatehouse".
    - Verify Mapping Object updates.

### 1.2 Replacement Wizard
- **`loads_template_fields`**:
    - Select 'Dungeon Crawl'.
    - Verify Inputs change to "Hub 1", "Hub 2" etc.

### 1.3 Integrity Check
- **`blocks_submit_on_error`**:
    - Try "Generate" with unmapped clues.
    - Verify Error Toast "Map all clues first".

## 2. Integration Tests

### 2.1 Manifest Update
- **Scenario**: Final Swap.
    1.  **Given**: Valid configuration.
    2.  **When**: Click "Update Campaign".
    3.  **Then**: Global file "InterMysteryConnections.txt" is updated with new targets (mocked).

## 3. Component Mocks
- Mock the "File System" Writer.

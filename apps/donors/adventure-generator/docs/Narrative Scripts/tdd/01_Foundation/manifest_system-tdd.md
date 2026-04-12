# TDD Plan: Manifest Explorer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Repository Tree
- **`renders_folder_structure`**: Pass a nested JSON object and verify hierarchy rendering.
- **`archives_collapsed_state`**: Toggle folders and verify state persistence.
- **`shows_status_badges`**: Verify that items with `valid: false` show a red warning icon.

### 1.2 Detail View
- **`displays_manifest_metadata`**: Select an item and verify the Details Panel updates with Name, Description, etc.
- **`lists_dependencies`**: Verify that Input/Output lists are rendered correctly.

## 2. Integration Tests

### 2.1 Validation Logic
- **Scenario**: Running a validation check.
    1.  **Given**: One script path is invalid (file missing).
    2.  **When**: User clicks "Validate All Paths".
    3.  **Then**: The system marks that specific entry as 'Error', and the "System Integrity" stat drops below 100%.

### 2.2 Auto-Discovery
- **Scenario**: Scanning for new files.
    1.  **Given**: A new `test_script.py` exists in the mocked file system but not in the manifest.
    2.  **When**: "Scan Root" is clicked.
    3.  **Then**: A prompt appears offering to register `test_script.py`.

## 3. Component Mocks
- Mock the `fs` (File System) module entirely.
- Mock the `child_process` for script execution.

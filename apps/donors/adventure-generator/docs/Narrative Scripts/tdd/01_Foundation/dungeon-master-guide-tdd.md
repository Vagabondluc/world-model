# TDD Plan: DM Command Center

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Sidebar Rendering
- **`renders_workflow_steps`**: Verify all 15 steps are listed.
- **`indicates_progress`**: Pass a mock status object (Step 1=Complete, Step 2=Pending) and verify checkmarks/icons.
- **`disables_locked_steps`**: Verify that 'Dungeon Key Writer' is disabled if 'Dungeon Map Creator' is not marked complete.

### 1.2 AI Dashboard
- **`toggles_thinking_visibility`**: Toggle the "Thinking" switch and update state.
- **`selects_ai_model`**: Change the model dropdown and verify the selected value propagates.

### 1.3 Command Console
- **`streams_log_output`**: Push messages to the log array and verify they appear in the terminal window.
- **`colors_error_logs`**: precise CSS class check for logs marked as 'ERROR'.

## 2. Integration Tests

### 2.1 Workspace Switching
- **Scenario**: Creating a new workspace.
    1.  **Given**: Default workspace loaded.
    2.  **When**: User clicks "New" and enters "Campaign_B".
    3.  **Then**: The valid path updates, and the sidebar resets to 0% progress, triggering a 'Manifest Created' log.

### 2.2 Script Discovery Flow
- **Scenario**: scanning for scripts.
    1.  **Given**: "Discover Scripts" is clicked.
    2.  **When**: The mock scanner returns a list of 5 valid files.
    3.  **Then**: The "Quick Actions" count updates to "5 Scripts Discovered" and the console logs "Found: [file] [VALID]".

## 3. Component Mocks
- Mock the file system scanner (returning static file lists).
- Mock the script executioner (returning immediate success/fail logs).

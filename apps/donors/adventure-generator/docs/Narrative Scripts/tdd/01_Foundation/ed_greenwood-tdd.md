# TDD Plan: Persona Manager

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Parameter Console
- **`sets_temperature`**: Adjust the slider and verify state updates (between 0.1 and 1.0).
- **`toggles_summary_mode`**: Click the "Structured-Only" switch and verify mode changes.
- **`shows_auto_switch_suggestion`**: Simulate a task change (Research -> Draft) and check if the UI suggests a temp change.

### 1.2 Prose Analytics
- **`calculates_word_count`**: Update the text area and verify the word count metric matches.
- **`shows_target_progress`**: Verify progress bar width based on (current / 800) ratio.

### 1.3 Artifact Gallery
- **`renders_visual_slots`**: Pass in a mock DALL-E image object and check if it renders in the gallery.
- **`renders_magic_item_table`**: Pass tabular data and verify the HTML table structure.

## 2. Integration Tests

### 2.1 Narrative Generation Flow
- **Scenario**: Generating a scene.
    1.  **Given**: User sets Temp to 0.85 and enters a prompt.
    2.  **When**: "Run Simulation" is clicked.
    3.  **Then**: The main text area populates with mock prose, and the word count updates dynamically.

### 2.2 Visualization Toggle
- **Scenario**: Enabling DALL-E.
    1.  **Given**: "Enable DALL-E Visualization" is unchecked.
    2.  **When**: User checks the box.
    3.  **Then**: The Artifact Gallery expands or becomes visible, waiting for input.

## 3. Component Mocks
- Mock the specific Markdown rendering for the prose area.
- Mock the DALL-E API calls to avoid cost/latency.

# TDD Plan: Encounter Architect: Older_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 XP Calculation
- **`sums_total_xp`**:
    - Add Challenge (500 XP).
    - Add Monster (200 XP).
    - Verify Total XP display is 700.

### 1.2 Sensory Feedback
- **`detects_sensory_keywords`**:
    - Input text "The smell of rot."
    - Verify [Smell] tag becomes active/highlighted.

### 1.3 Outcome Mapping
- **`shows_transition_input_on_success`**:
    - Type into "Success" field.
    - Verify "Transition Hook" input becomes visible.

## 2. Integration Tests

### 2.1 Full Scene Export
- **Scenario**: Exporting card.
    1.  **Given**: Complete form data.
    2.  **When**: Click "Export Encounter Card".
    3.  **Then**: Verify `onExport` receives the structured JSON object.

## 3. Component Mocks
- Mock the "Sensory Analysis" (keyword regex).

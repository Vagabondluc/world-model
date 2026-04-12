# TDD Plan: 5-Room & Narrative Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Framework Toggle
- **`switches_layout_mode`**: Toggle 'Narrative' -> Verify 'Pipeline Ribbon' replaces 'Classic List'.
- **`enables_drag_drop_in_narrative`**: Verify drag handles appear on Flex stages.

### 1.2 Scene Editor
- **`shows_setback_field_for_midpoint`**: Select 'Midpoint' -> Expect 'Setback' input.
- **`hides_setback_for_intro`**: Select 'Intro' -> Expect 'Setback' input to be hidden or null.

### 1.3 Hero Spotlight
- **`suggests_pc_hook`**:
    - Mock PC data (Bio-Mancer).
    - Input challenge "Toxic Gas".
    - Verify sidebar suggests "Bio-Resistance Check".

## 2. Integration Tests

### 2.1 Branching Flow
- **Scenario**: Defining failure.
    1.  **Given**: Scene A is active.
    2.  **When**: User maps "Failure" to "Scene B".
    3.  **Then**: The visual connector line updates to link A -> B.

## 3. Component Mocks
- Mock `ReactFlow` or similar diagramming tool for the Pipeline Ribbon.

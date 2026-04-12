# TDD Plan: Scene Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Prose Generation
- **`generates_sensory_prose`**:
    - Input Sense: "Smell of Vanilla".
    - Verify Output Prose contains "vanilla".

### 1.2 GM Separation
- **`extracts_mechanics`**:
    - Input Element: "Trap (DC 15)".
    - Verify Player Prose: "Hidden danger" (no DC).
    - Verify GM Notes: "Trap DC 15".

### 1.3 Genre Context
- **`applies_genre_tone`**:
    - Set Genre: "Horror".
    - Verify Prose keywords: "Shadow", "Fear", "Dark".

## 2. Integration Tests

### 2.1 Handout Export
- **Scenario**: Export.
    1.  **Given**: Complete Scene.
    2.  **When**: Click "Export Handout".
    3.  **Then**: Output format is clean text (Player View).

## 3. Component Mocks
- Mock the "Text Weaver Service".

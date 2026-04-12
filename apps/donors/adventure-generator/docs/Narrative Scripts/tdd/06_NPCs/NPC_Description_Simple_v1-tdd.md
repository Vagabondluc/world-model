# TDD Plan: NPC Description Simple v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Height Calculation
- **`converts_cm_to_ft`**:
    - Input 183 cm.
    - Verify display shows "6 feet 0 inches".

### 1.2 Template Rendering
- **`assembles_paragraph`**:
    - Input Name: "Bob", Age: 30.
    - Verify Preview starts with "Bob is a 30 year old...".

### 1.3 Procedural Limits
- **`clamps_height_by_race`**:
    - Select Race "Dwarf".
    - Click Generate.
    - Verify Height is between 110-150cm (mocked RNG).

## 2. Integration Tests

### 2.1 AI Fill
- **Scenario**: AI Generation.
    1.  **Given**: Empty form + Seed.
    2.  **When**: Click "AI Fill".
    3.  **Then**: Form fields populate from mocked AI response.

## 3. Component Mocks
- Mock the "RNG" service.

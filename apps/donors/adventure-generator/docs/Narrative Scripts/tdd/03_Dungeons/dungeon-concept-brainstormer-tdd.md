# TDD Plan: Dungeon Concept Brainstormer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Mode Switching
- **`toggles_view_mode`**: Click '10-Room Wizard' -> Verify 10-step wizard interface replaces Concept Pod.

### 1.2 10-Room Wizard
- **`advances_step`**: Enter text for Room 1, click Next -> Verify UI shows Room 2 prompt.
- **`maintains_history`**: Go Back to Room 1 -> Verify text is preserved.

### 1.3 Thematic Bleed
- **`propagates_theme`**: Set Global Theme to 'Spiders' -> Verify Corridor Generator defaults to 'Webs/Spiders' tags.

## 2. Integration Tests

### 2.1 "Roll X" Logic
- **Scenario**: Brainstorming Denizens.
    1.  **Given**: Focus is 'Denizens'.
    2.  **When**: User clicks "Roll 3 Pairing Options".
    3.  **Then**: The dropdown populates with 3 AI-generated creature pairs.

## 3. Component Mocks
- Mock the "Logical Validator" AI service.

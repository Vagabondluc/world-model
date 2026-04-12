# TDD Plan: Character Portrait & Backstory Suite

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Personality Scoring
- **`updates_role_sore`**:
    - Answer Question 1 with "Study Lore" (Storyteller).
    - Verify Score: Storyteller +5.

### 1.2 Arc Plotting
- **`sequences_plot_beats`**:
    - Add Beat "Call to Adventure".
    - Add Beat "Refusal of Call".
    - Verify Order is preserved.

### 1.3 Surface Export
- **`generates_bilingual_card`**:
    - Set Lang: "FR".
    - Verify Keys: "Nom", "Apparence".
    - Set Lang: "EN".
    - Verify Keys: "Name", "Appearance".

## 2. Integration Tests

### 2.1 Full Profile Generation
- **Scenario**: Deep Dive.
    1.  **Given**: Completed Wizard and Arc.
    2.  **When**: Click "Generate 1500w Profile".
    3.  **Then**: Output text integrates Sensory details and Role scoring (mocked).

## 3. Component Mocks
- Mock the "Text Expansion Service".

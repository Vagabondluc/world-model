# TDD Plan: Fantastic Location Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Aspect Limit
- **`enforces_three_aspects`**:
    - Try to add 4th aspect.
    - Verify UI Error "Exactly three aspects allowed".

### 1.2 Sensory Logic
- **`validates_sensory_count`**:
    - Select 2 senses.
    - Verify "Save" button disabled.
    - Select 3 senses.
    - Verify "Save" button enabled.

### 1.3 Interaction Suggestion
- **`suggests_interaction_from_keyword`**:
    - Input Aspect "Cliff".
    - Verify Suggestions include "Climb" or "Fall".

## 2. Integration Tests

### 2.1 Dossier Export
- **Scenario**: Exporting card.
    1.  **Given**: Complete Data.
    2.  **When**: Click "Export Scene Card".
    3.  **Then**: Output HTML fits "Index Card" dimensions (css check).

## 3. Component Mocks
- Mock the "Keyword Extraction" service.

# TDD Plan: Quick Settlement Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Priority Hook
- **`weighs_priority_input`**:
    - Input "Underwater".
    - Click Generate.
    - Verify Prompt sent to AI starts with "IMPORTANT: Underwater...".

### 1.2 NPC Table
- **`adds_npc_row`**:
    - Click "Add Individual".
    - Verify new empty row in matrix.

### 1.3 Tab Navigation
- **`switches_narrative_domain`**:
    - Click "Economy".
    - Verify Active Tab is 'Economy' and Style Badge updates to '[E&T]'.

## 2. Integration Tests

### 2.1 Auto-Table Population
- **Scenario**: Parsing Text.
    1.  **Given**: Narrative includes "Mayor Kael".
    2.  **When**: Click "Sync NPCs".
    3.  **Then**: NPC Table adds row for "Mayor Kael" (mocked NLP).

## 3. Component Mocks
- Mock the "Image Generation" and "NLP" services.

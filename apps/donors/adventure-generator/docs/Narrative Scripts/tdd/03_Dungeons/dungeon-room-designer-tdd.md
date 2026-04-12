# TDD Plan: Dungeon Room Designer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Sensory Audit
- **`tracks_sense_count`**: Fill 'Sight' and 'Sound' -> Verify count is 2/5 (Status: Pending).
- **`passes_audit_at_three`**: Fill 'Smell' -> Verify Status updates to 'OK' (Green).

### 1.2 Interactive Elements
- **`adds_element`**: Click "+ Add Element", enter "Lever" -> Verify list update.
- **`removes_element`**: Click delete icon -> Verify removal.

### 1.3 Narrative Generation
- **`uses_all_inputs`**:
    - Mock AI service.
    - Click "Draft Description".
    - Verify payload includes Senses, Elements, and Traits.

## 2. Integration Tests

### 2.1 Template System
- **Scenario**: Saving a template.
    1.  **Given**: Fully populated room ("Crypt").
    2.  **When**: Click "Save to Template".
    3.  **Then**: `onSaveTemplate` mock is called with the serialized room object.

## 3. Component Mocks
- Mock the AI Text Synthesis.

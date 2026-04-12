# TDD Plan: Pointy Hat Dungeon Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Theme Input
- **`unlocks_step_two`**: Enter "Fire" -> Verify Step II container becomes active.
- **`triggers_skin_update`**: Enter "Ice" -> Verify 'data-theme' attribute or CSS class updates.

### 1.2 Autosuggest Logic
- **`populates_mechanics`**: Click "Autosuggest" -> Verify mechanic fields fill with mock data.

### 1.3 Encounter Auditor
- **`flags_harmony`**:
    - Input "Fire" Theme.
    - Input "Ice Golem" Encounter.
    - Verify Auditor returns/displays a "Thematic Mismatch" warning (mocked logic).

## 2. Integration Tests

### 2.1 Full Synthesis Flow
- **Scenario**: Creating a dungeon.
    1.  **Given**: Steps I-IV are complete.
    2.  **When**: User enters Ending text and clicks "Download".
    3.  **Then**: Export function is called with the full `PointyDungeon` object including the derived Theme.

## 3. Component Mocks
- Mock the "Skin Engine" (CSS injector).
- Mock the "Thematic Auditor" AI service.

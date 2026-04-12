# TDD Plan: Scenario Hook Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Archetype Selector
- **`updates_input_fields`**:
    - Select 'Twisted': Expect 'Truth/Lie' inputs.
    - Select 'Dilemma': Expect 'Option A/B' inputs.
- **`locks_details_until_foundation`**: Verify "Generate Details" is disabled if "Location" is empty.

### 1.2 Sensory Suite
- **`toggles_evocative_mode`**: Enable toggle and check state update.

### 1.3 Next Steps Console
- **`adds_action_item`**: Type "Check Basement" and add to list. Verify it renders.

## 2. Integration Tests

### 2.1 Hook Generation Flow
- **Scenario**: Creating a Twisted Hook.
    1.  **Given**: Foundation set (Manor, Vampire).
    2.  **When**: User enters "Truth: Vampire", "Lie: Ghost" and clicks Generate.
    3.  **Then**: The "Preview Text" updates with a prose block incorporating these elements.

### 2.2 Handout Export
- **Scenario**: Formatting for player.
    1.  **Given**: Valid Hook data.
    2.  **When**: User clicks "Export Handout".
    3.  **Then**: The `onExport` mock is triggered with a specifically formatted string (e.g., "A letter arrives...").

## 3. Component Mocks
- Mock the Prose Generation API.

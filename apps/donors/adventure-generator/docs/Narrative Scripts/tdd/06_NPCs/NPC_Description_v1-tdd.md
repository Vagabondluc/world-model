# TDD Plan: Detailed NPC Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Word Count
- **`tracks_budget_progress`**:
    - Input 250 words.
    - Verify Bar is at 50% (Yellow).

### 1.2 Data Grid
- **`updates_grid_field`**:
    - Edit 'Mannerisms'.
    - Verify State update.

### 1.3 Card Seeding
- **`applies_archetype_influence`**:
    - Select 'Ace'.
    - Verify 'Role' suggestion includes 'Leader' or 'Champion'.

## 2. Integration Tests

### 2.1 Backstory Seeding
- **Scenario**: Auto-drafting.
    1.  **Given**: Filled Grid.
    2.  **When**: Click "Generate Backstory".
    3.  **Then**: AI Service called with Grid context.

## 3. Component Mocks
- Mock the "Text Analysis" (Word counter).

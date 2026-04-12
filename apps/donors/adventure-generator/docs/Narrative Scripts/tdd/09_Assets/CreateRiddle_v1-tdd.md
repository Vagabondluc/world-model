# TDD Plan: Riddle Crafter v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Generation Logic
- **`generates_both_difficulties`**:
    - Input Answer "Mirror".
    - Click Generate.
    - Verify `easy` and `hard` fields are populated.

### 1.2 Independent Regeneration
- **`regenerates_only_easy`**:
    - Capture `hard` text.
    - Click "Regenerate Easy".
    - Verify `hard` text remains unchanged.

### 1.3 Theme Application
- **`applies_theme_context`**:
    - Set Theme "Dark".
    - Click Generate.
    - Verify request payload includes "Dark" context.

## 2. Integration Tests

### 2.1 Logic Explanation
- **Scenario**: Validate logic.
    1.  **Given**: Generated riddles.
    2.  **When**: View Logic Panel.
    3.  **Then**: Text explains connection (mocked).

## 3. Component Mocks
- Mock the "Riddle AI Service".

# TDD Plan: Mystical Encounter Hub

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Realm Theming
- **`applies_realm_theme`**:
    - Select 'Shadowfell'.
    - Verify container class includes `theme-shadow`.

### 1.2 Word Count Logic
- **`colors_progress_bar`**:
    - Input 100 words -> Color Yellow.
    - Input 500 words -> Color Green.
    - Input 800 words -> Color Red.

### 1.3 Linked XP
- **`calculates_failure_xp`**:
    - Set Success XP = 1000.
    - Set Failure Ratio = 0.5.
    - Verify Failure XP field displays 500.

## 2. Integration Tests

### 2.1 Inspiration Twist
- **Scenario**: Getting a prompt.
    1.  **Given**: Realm is 'Feywild'.
    2.  **When**: Click "Suggest Twist".
    3.  **Then**: Twist field populates with Fey-specific idea (mocked).

## 3. Component Mocks
- Mock the "Twist Generator".

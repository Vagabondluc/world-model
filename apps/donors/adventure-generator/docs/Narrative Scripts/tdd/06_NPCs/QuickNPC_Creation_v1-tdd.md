# TDD Plan: Quick NPC Reference Card

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Brevity Check
- **`warns_on_long_text`**:
    - Input 200 chars into "Look".
    - Verify Cell Border turns Red/Warning Icon appears.

### 1.2 Twist Generation
- **`rolls_unexpected_detail`**:
    - Click "Roll Twist".
    - Verify "Twist" field updates.

### 1.3 Seed Prompt
- **`submits_seed`**:
    - Enter "Orc Bard".
    - Click Generate.
    - Verify Table cells populate (mocked).

## 2. Integration Tests

### 2.1 View Mode Toggle
- **Scenario**: Switching to play mode.
    1.  **Given**: Edit Mode active.
    2.  **When**: Click "View Mode".
    3.  **Then**: Inputs replaced by static text elements.

## 3. Component Mocks
- Mock the "Twist Database".

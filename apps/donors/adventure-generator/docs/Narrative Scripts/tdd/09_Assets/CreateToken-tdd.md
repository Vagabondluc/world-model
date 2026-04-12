# TDD Plan: Battlemap Token Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Prompt Injection
- **`prepends_perspective`**:
    - Input Desc: "Elf".
    - Verify Prompt starts with "Illustration of a top-down aerial view...".

### 1.2 Style Config
- **`applies_style_keywords`**:
    - Select Style "2D Game Art".
    - Verify Prompt contains "2D game art".

### 1.3 State Management
- **`updates_status_on_generate`**:
    - Click Generate.
    - Verify Status changes to 'Generating'.

## 2. Integration Tests

### 2.1 Image Pipeline
- **Scenario**: Creation flow.
    1.  **Given**: Valid Prompt.
    2.  **When**: Call DALLE service.
    3.  **Then**: Receive Image URL (mocked).

## 3. Component Mocks
- Mock the "Image Generation Service".

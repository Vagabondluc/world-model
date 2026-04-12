# TDD Plan: Token Studio

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Prompt Injection
- **`builds_prompt_correctly`**:
    - Input: "Orc".
    - Verify Prompt: "Top-down aerial view of Orc...".

### 1.2 Settings Toggle
- **`updates_frame_setting`**:
    - Select "Round Frame".
    - Verify State: frame = 'Round'.

## 2. Integration Tests

### 2.1 Gallery Add
- **Scenario**: Save Token.
    1.  **Given**: Generated Image.
    2.  **When**: Click "Save".
    3.  **Then**: Gallery count increases by 1.

## 3. Component Mocks
- Mock the "Image Gen Service".

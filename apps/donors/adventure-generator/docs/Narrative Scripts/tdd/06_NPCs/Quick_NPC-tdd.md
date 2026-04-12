# TDD Plan: Quick NPC Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Tag Management
- **`adds_custom_tag`**:
    - Input "scarred". Click Add.
    - Verify Tags array includes "scarred".

### 1.2 Tone Selection
- **`updates_tone_state`**:
    - Select "Whimsical".
    - Verify State matches.

### 1.3 Procedural Generation
- **`generates_from_seed`**:
    - Input Seed "test-seed".
    - Click Generate.
    - Verify Name field populated with deterministic result (mocked).

## 2. Integration Tests

### 2.1 AI Context
- **Scenario**: Generating with Context.
    1.  **Given**: Context "Afraid of spiders".
    2.  **When**: Click "AI Fill".
    3.  **Then**: Output Traits includes "Arachnophobia".

## 3. Component Mocks
- Mock the "AI Service".

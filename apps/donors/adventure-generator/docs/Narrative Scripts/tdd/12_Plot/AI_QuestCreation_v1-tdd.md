# TDD Plan: AI Storyteller Dashboard

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Narrative Generation
- **`injects_subjective_layer`**:
    - Toggle "Subjective".
    - Verify Output contains *italicized inner thoughts*.

### 1.2 Task Evaluation
- **`evaluates_complex_task`**:
    - Input: "Hack Terminal" (Complex).
    - Verify DC > 10.
    - Verify Result includes "Success/Failure" state.

### 1.3 Tension Tracking
- **`updates_tension_meter`**:
    - Action: "Fail Stealth".
    - Verify Tension increases.

## 2. Integration Tests

### 2.1 Context Consistency
- **Scenario**: Fact Check.
    1.  **Given**: Fact "Airlock Sealed".
    2.  **When**: User tries "Open Airlock".
    3.  **Then**: AI response references "Sealed" status (mocked).

## 3. Component Mocks
- Mock the "LLM Storyteller Service".

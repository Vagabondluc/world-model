# TDD Plan: NPC Creator Bot

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Personality Toggles
- **`toggles_trait`**:
    - Click "Greedy".
    - Verify State `traits.greedy` is true.

### 1.2 Motivation Logic
- **`derives_hook_from_role`**:
    - Set Role: "Smith".
    - Verify Hook placeholder mentions "Metal" or "Forge".

### 1.3 Chat Interface
- **`sends_user_message`**:
    - Input "Hello". Click Send.
    - Verify Chat History updates.

## 2. Integration Tests

### 2.1 Bot Response
- **Scenario**: Testing Voice.
    1.  **Given**: Vibe "Gruff".
    2.  **When**: Send "Help me".
    3.  **Then**: Bot response (mocked) starts with "Hmph..." or similar.

## 3. Component Mocks
- Mock the "Persona Engine" (LLM wrapper).

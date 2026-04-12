# TDD Plan: JP Cooper 10 Room Dungeon

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Chat Flow
- **`renders_next_question`**: Answer Q1 -> Verify Q2 bubble appears.
- **`updates_ledger`**: Answer Q1 -> Verify Sidebar Item 1 updates with the answer text.

### 1.2 Smart Toolbar
- **`triggers_roll`**: Click "Roll 3 Ideas" -> Verify `onRoll` handler called with current step context.
- **`applies_genre_filter`**: Click "Roll Grimdark" -> Verify genre tag is passed to generation service.

### 1.3 Sidebar Navigation
- **`jumps_to_step`**: Click "Room 3" in sidebar -> Verify chat scrolls to/focuses the Room 3 interaction block.

## 2. Integration Tests

### 2.1 Full Generation Loop
- **Scenario**: Completing the dungeon.
    1.  **Given**: User is at Step 10.
    2.  **When**: User answers Step 10.
    3.  **Then**: "Review Panel" opens / "Export" button becomes enabled.

## 3. Component Mocks
- Mock the Chat Scroll behavior.
- Mock the LLM Response generator.

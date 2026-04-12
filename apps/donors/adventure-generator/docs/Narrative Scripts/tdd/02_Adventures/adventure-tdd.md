# TDD Plan: Quest & Travel Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Seed Generator
- **`spins_reels`**: Trigger generation and verify the displayed text changes.
- **`locks_seed_selection`**: Select a generated seed and verify it populates the "Context" fields.

### 1.2 Travel Map (TES)
- **`scales_slots_by_distance`**:
    - Set Distance = 'Close', expect 1 slot.
    - Set Distance = 'Very Far', expect 3 slots.
- **`accepts_dragged_cards`**: Simulate dropping a 'Red' card into a slot and verify it is assigned.

### 1.3 Co-Pilot Console
- **`appends_chat_messages`**: Add a new user message and verify log update.
- **`triggers_decision_modal`**: Inject a "Constraint" or "Check" into the narrative stream and verify the Decision Modal appears.

## 2. Integration Tests

### 2.1 End-to-End Quest Build
- **Scenario**: Creating a full quest.
    1.  **Given**: Fresh state.
    2.  **When**: User generates seed -> Selects "Far" travel -> Adds 2 events -> Switches to Co-Pilot.
    3.  **Then**: The Co-Pilot context is primed with the selected Quest and Travel data.

### 2.2 Task Resolution
- **Scenario**: Resolving a skill check.
    1.  **Given**: Decision Modal is open (DC 14 Religion).
    2.  **When**: User clicks "Success".
    3.  **Then**: The modal closes, and a "Success" narrative beat is appended to the chat log.

## 3. Component Mocks
- Mock `react-beautiful-dnd` (or similar) for the event card dragging.
- Mock the Reel animation timing to speed up tests.

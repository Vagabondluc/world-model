# TDD Plan: Eldwyn Mission Board

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Mission Logic
- **`calculates_rewards_by_rank`**:
    - Set Rank "Gold".
    - Verify Reward string includes "Rare Consumable" or high GP value.

### 1.2 Travel System
- **`generates_events_by_distance`**:
    - Set Distance "Far".
    - Verify Event List has length 2.

### 1.3 Matrix Expansion
- **`expands_narrative`**:
    - Input Seed "1-2-3".
    - Click Expand.
    - Verify generated text length > 100 words (mocked).

## 2. Integration Tests

### 2.1 NPC Export
- **Scenario**: Public View.
    1.  **Given**: Full NPC Profile (Secrets + Surface).
    2.  **When**: Click "Export Public Card".
    3.  **Then**: Output text excludes "Secrets" field.

## 3. Component Mocks
- Mock the "Matrix Lookup Table".

# TDD Plan: Social Hub

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Guest Movement
- **`moves_guest_zone`**:
    - Guest: "Count Vax". From: "Main Hall". To: "Balcony".
    - Verify Guest Location is "Balcony".

### 1.2 Timeline Advancement
- **`advances_event_sequence`**:
    - Current: Step 2.
    - Click "Trigger Next".
    - Verify Current: Step 3.

### 1.3 Clue Tracking
- **`toggles_guest_clue`**:
    - Guest: "Elara". Clue Status: Hidden.
    - Action: Reveal.
    - Verify Log contains "Elara's Clue".

## 2. Integration Tests

### 2.1 Handout Sync
- **Scenario**: Guest List Export.
    1.  **Given**: List of "Met" guests.
    2.  **When**: Export Handout.
    3.  **Then**: Only "Met" guests appear in list.

## 3. Component Mocks
- Mock the "Social Logic Engine".

# TDD Plan: Rumor Table Manager

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Master Grid
- **`renders_d20_rows`**: Verify table has 20 slots (or configured size).
- **`displays_status_colors`**:
    - Pass 'Fresh' rumor -> Expect Green class.
    - Pass 'Delivered' rumor -> Expect Grey class.

### 1.2 Delivery Framing
- **`wraps_content_in_context`**:
    - Select Rumor #2 ("Bandits").
    - Select Context "Tavern".
    - Verify output text combines them ("Overheard in a tavern... Bandits...").

### 1.3 Evolution Manager
- **`identifies_stale_rumors`**: Mark 5 rumors as 'Delivered' and check if "Restock" button triggers a suggestion count.

## 2. Integration Tests

### 2.1 Restocking Flow
- **Scenario**: Replacing a rumor.
    1.  **Given**: Slot 1 is 'Archived'.
    2.  **When**: User clicks "Restock Slot 1" with a new "Dragon" rumor.
    3.  **Then**: Slot 1 updates to 'Fresh' and Content changes to "Dragon...".

### 2.2 Investigation Logic
- **Scenario**: Searching for specifics.
    1.  **Given**: A rumor has a Cost "5gp".
    2.  **When**: DM marks it as "Paid".
    3.  **Then**: Status changes to 'Delivered' and a "Gold Deducted" log appears.

## 3. Component Mocks
- Mock the "Restock Generator" (LLM or table lookup).

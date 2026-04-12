# TDD Plan: Tactical Encounter & Combat Studio

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Balance Calculator
- **`calculates_adjusted_xp`**:
    - Input: 4 Players Lvl 4.
    - Input: 2 Monsters (450 XP each).
    - Verify: Total Adjusted XP includes multiplier (e.g., x1.5 or x2).

### 1.2 Arena Tactics
- **`suggests_tactics`**:
    - Set Environment: "Lava Pools".
    - Add Enemy: "Fire Elemental".
    - Verify Tactics suggests "Bull rush into lava".

### 1.3 Trap Matrix
- **`generates_trap_sequence`**:
    - Click "Generate Matrix".
    - Verify 3 unique trap objects are created with Clue/Trigger/Danger fields.

## 2. Integration Tests

### 2.1 Scene Flow
- **Scenario**: Linking scenes.
    1.  **Given**: Scene A (Intro).
    2.  **When**: Create Scene B (Combat).
    3.  **Then**: Scene A output "Success" links to Scene B input.

## 3. Component Mocks
- Mock the "XP Threshold" reference table.

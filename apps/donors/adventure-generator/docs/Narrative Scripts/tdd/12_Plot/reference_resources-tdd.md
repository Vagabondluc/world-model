# TDD Plan: Narrative Engine

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Plot Engine
- **`loads_plot_metadata`**:
    - Select Engine: "Blackmail".
    - Verify "Core Tension" is "Agency vs Coercion".

### 1.2 Tactical Injection
- **`applies_role_mods`**:
    - Target: "Goblin". Role: "Leader".
    - Verify Output includes "Buff Allies" or similar leader trait.

### 1.3 Twist Deck
- **`draws_unique_twists`**:
    - Draw 2 Cards.
    - Verify Twist A != Twist B.

## 2. Integration Tests

### 2.1 Workflow Chaining
- **Scenario**: Mutation.
    1.  **Given**: Resolved "Capture" engine (Failed).
    2.  **When**: Click "Mutate".
    3.  **Then**: Suggest "Manhunt" or "Escape" engine.

## 3. Component Mocks
- Mock the "Plot Database".

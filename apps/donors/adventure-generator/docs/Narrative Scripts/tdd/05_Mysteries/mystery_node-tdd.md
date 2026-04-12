# TDD Plan: Mystery Node Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Atmosphere
- **`enforces_three_senses`**:
    - Select Sight.
    - Check Status -> "Needs 2 more".
    - Select Sound, Smell.
    - Check Status -> "Complete".

### 1.2 Clue Repository
- **`tags_clue_target`**:
    - Add Clue "Gun".
    - Set Leads To "Node C".
    - Verify Clue object contains `leadsTo: 'Node C'`.

### 1.3 NPC Logic
- **`adds_reaction_branch`**:
    - Add NPC "Guard".
    - Add Reaction "Bribe" -> "Reveal Map".
    - Verify NPC object structure.

## 2. Integration Tests

### 2.1 Export Node
- **Scenario**: File gen.
    1.  **Given**: Completed form.
    2.  **When**: Click "Generate Node File".
    3.  **Then**: Output text includes "The Bang", Senses, and Clue List.

## 3. Component Mocks
- Mock the "Sensory Validator".

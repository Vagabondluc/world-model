# TDD Plan: Magic Item Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Value Calculation
- **`calculates_value_range`**:
    - Set Rarity "Very Rare".
    - Verify Value suggests "5,001 - 50,000 GP".

### 1.2 Property Management
- **`adds_new_property`**:
    - Click "Add Property".
    - Input "Fire Resist".
    - Verify Property list list length increases.

### 1.3 Constraints
- **`warns_on_high_level_spell`**:
    - Rarity: "Common".
    - Add Spell: "Wish" (9th level).
    - Verify Warning Badge appears.

## 2. Integration Tests

### 2.1 Lore Generation
- **Scenario**: Auto-Lore.
    1.  **Given**: Property "Cold Damage".
    2.  **When**: Generate Lore.
    3.  **Then**: Text mentions "Ice", "Winter", or "Frost" (mocked).

## 3. Component Mocks
- Mock the "Spell Database" (for checking levels).

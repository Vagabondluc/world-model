# TDD Plan: Magic Weapon Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Thematic Extraction
- **`extracts_damage_type`**:
    - Input Desc: "Burn them all".
    - Verify Suggested Damage Type involves "Fire".

### 1.2 Feature Budget
- **`enforces_rarity_limit`**:
    - Set Rarity: "Uncommon" (Limit 1).
    - Add 2nd Feature.
    - Verify Warning UI "Limit Exceeded".

### 1.3 Stat Block Rendering
- **`renders_correct_header`**:
    - Name: "Sting". Type: "Shortsword".
    - Verify Header: "Sting" and "Weapon (Shortsword)".

## 2. Integration Tests

### 2.1 VTT Export
- **Scenario**: Export JSON.
    1.  **Given**: Complete Weapon Data.
    2.  **When**: Click "VTT Export".
    3.  **Then**: JSON payload matches VTT schema.

## 3. Component Mocks
- Mock the "NLP Service" (Thematic Extraction).

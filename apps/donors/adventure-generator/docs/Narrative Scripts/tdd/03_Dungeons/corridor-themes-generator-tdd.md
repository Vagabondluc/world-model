# TDD Plan: Corridor Themes Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Generation Logic
- **`generates_from_theme`**: Input 'Lab' -> Verify output contains 'glass' or 'metal' keywords.
- **`respects_toggles`**: Disable 'Hazards' -> Verify Hazard block is null.

### 1.2 Seed Control
- **`persists_seed`**: Click "Generate" (Seed 123) -> Verify output is consistent on re-render.
- **`rerolls_only_subsection`**: Click "Reroll Senses" -> Verify Base and Lore remain unchanged.

## 2. Integration Tests

### 2.1 Bulk Generation
- **Scenario**: Creating a list.
    1.  **Given**: Theme "Crypt".
    2.  **When**: User clicks "Generate 5".
    3.  **Then**: A list of 5 distinct corridor objects is returned.

## 3. Component Mocks
- Mock the "Procedural Text Engine".

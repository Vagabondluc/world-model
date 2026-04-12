# TDD Plan: 5-Room Dungeon Builder v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Pillar Layout
- **`renders_five_pillars`**: Verify exactly 5 room columns exist.
- **`applies_gradient_moods`**: Verify Pillar 4 has the 'Intensity/Red' class.

### 1.2 Room Card
- **`updates_type_preset`**: Change Dropdown to 'Golem' -> Verify content placeholder updates/clears.
- **`triggers_single_regen`**: Click "AI Gen Room" -> Verify only that specific room's `onRegenerate` handler is called.

### 1.3 Environment Setup
- **`locks_seed`**: Verify seed input accepts numbers and persists across re-renders.

## 2. Integration Tests

### 2.1 Bulk Generation
- **Scenario**: Full Create.
    1.  **Given**: Environment "Steampunk".
    2.  **When**: Click "Bulk AI Generation".
    3.  **Then**: All 5 text areas populate with content.

## 3. Component Mocks
- Mock the `lucide-react` icons.

# TDD Plan: Dungeon Features Summarizer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Preset Loading
- **`loads_preset_values`**: Select 'Dwarven Fort' -> Verify Walls='Granite', Doors='Iron'.

### 1.2 Linked Parameters
- **`updates_dependent_fields`**: Change Base Style to 'Cave' -> Verify Floor updates to 'Uneven Earth'.

### 1.3 Reference Card
- **`formats_markdown`**: Verify the preview text contains bold syntax `**Walls:** Granite`.

## 2. Integration Tests

### 2.1 AI Sync
- **Scenario**: harmonizing fields.
    1.  **Given**: Random fields selected.
    2.  **When**: Click "AI Sync All".
    3.  **Then**: All fields update to a consistent set (mocked return).

## 3. Component Mocks
- Mock the "Preset Database".

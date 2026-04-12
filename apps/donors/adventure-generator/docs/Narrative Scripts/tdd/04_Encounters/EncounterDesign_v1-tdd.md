# TDD Plan: Encounter Card Builder: v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 AI Fast-Fill
- **`populates_fields`**:
    - Input Title "Ambush".
    - Click "Fast-Fill".
    - Verify Description and Steps are populated (mocked).

### 1.2 Inline Math
- **`updates_xp_sticky_footer`**:
    - Change Combat XP input.
    - Verify Sticky Footer total updates immediately.

### 1.3 Mobile Layout
- **`stacks_columns_on_mobile`**:
    - viewport < 600px.
    - Verify grid template columns is 1, not 2.

## 2. Integration Tests

### 2.1 Preset Hook Toggle
- **Scenario**: Selecting a hook.
    1.  **Given**: Outcome field is empty.
    2.  **When**: Click "Preset: Found Map".
    3.  **Then**: Outcome text becomes "Found Map...".

## 3. Component Mocks
- Mock the `lucide-react` icons.

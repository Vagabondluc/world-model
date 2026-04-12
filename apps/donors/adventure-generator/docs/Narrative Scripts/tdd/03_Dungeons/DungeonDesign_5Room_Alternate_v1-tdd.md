# TDD Plan: Alternate 5-Room Flow

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Vertical Timeline
- **`navigates_to_stage`**: Click 'Midpoint' -> Verify editor scrolls/focuses Midpoint panel.
- **`collapses_on_mobile`**: Set viewport width < 600 -> Verify breadcrumb mode.

### 1.2 Flex Block
- **`adds_new_scene`**: Click "+ Add" in Stage 2 -> Verify new Scene Card appears.
- **`reorders_scenes`**: Simulate drag drop -> Verify internal list order updates.

### 1.3 Adaptive UI
- **`expands_combat_tools`**: Select 'Combat' type -> Verify CR Calculator appears.

## 2. Integration Tests

### 2.1 AI Generation
- **Scenario**: Auto-fill.
    1.  **Given**: Stage 1 is defined.
    2.  **When**: Click "Fill Next Stage" (AI).
    3.  **Then**: Stage 2 is populated with mock scenes derived from Stage 1 context.

## 3. Component Mocks
- Mock the AI Generation Service.

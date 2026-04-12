# TDD Plan: Campaign Architect

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Metaplot Control
- **`sets_global_params`**: Update "Fantasy Flavor" and "Tier" and verify state.
- **`renders_three_acts`**: Verify three distinct columns/sections for Act 1, 2, and 3.

### 1.2 NPC Matrix
- **`adds_recurring_npc`**: Click "Add NPC", fill details, and verify list update.
- **`links_npc_to_metaplot`**: Select an NPC and assign a "Metaplot Role" (e.g., Rival), verifying the relationship is stored.

### 1.3 Branching Editor
- **`creates_branch_point`**: Add a "Pivot" node to Act 1 and verify it appears visually.

## 2. Integration Tests

### 2.1 Theme Weaving
- **Scenario**: Selecting a theme.
    1.  **Given**: Theme is "None".
    2.  **When**: User selects "Corruption of Power".
    3.  **Then**: The "Suggested Events" panel populates with theme-relevant ideas.

### 2.2 PC Integration
- **Scenario**: Linking a PC to the plot.
    1.  **Given**: A "Rogue" PC exists.
    2.  **When**: User toggles "Family Secret" hook.
    3.  **Then**: A new entry is added to `pcHooks` linking the Rogue to a specific Campaign Entity.

## 3. Component Mocks
- Mock the "Theme Database" to provide deterministic suggestions.
- Mock the complex "Timeline/Gantt Chart" visualization library.

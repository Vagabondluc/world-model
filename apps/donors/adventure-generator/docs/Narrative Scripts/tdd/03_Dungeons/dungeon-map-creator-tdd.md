# TDD Plan: Dungeon Map Creator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Canvas Interaction
- **`adds_node_on_click`**: Select 'Room Tool', click canvas -> Verify new node added to state.
- **`snaps_to_grid`**: Click at (12, 12) with 10px grid -> Verify node position is (10, 10).

### 1.2 Layer Management
- **`switches_active_layer`**: Click 'Basement' tab -> Verify canvas renders basement nodes.
- **`links_between_layers`**: Use 'Elevation Shift' tool -> Verify a specialized link object is created referencing Layer A and Layer B.

### 1.3 Properties Panel
- **`updates_selected_node`**: Select Room 1, change Name to 'Vault' -> Verify state update.

## 2. Integration Tests

### 2.1 Key Writer Sync
- **Scenario**: Adding a room.
    1.  **Given**: Sync is active.
    2.  **When**: User draws "Room 5".
    3.  **Then**: The `onRoomCreated` callback fires with ID 5 (mocking the Key Writer update).

## 3. Component Mocks
- Mock the `SVG` or `Canvas` rendering engine.

# TDD Plan: Admin Database Manager

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Card Listing (Left Panel)
- **`renders_card_list`**: Pass an array of mock cards and verify titles/types are displayed.
- **`filters_by_type`**: Search for specific types (e.g., 'NPC') and verify the list is filtered.
- **`highlights_selected_card`**: Verify the 'selected' CSS class is applied to the active card.

### 1.2 Document Editor (Right Panel)
- **`displays_json_data`**: Check that `formData` is rendered in the JSON editor area.
- **`validates_schema`**: Input invalid JSON or missing fields and verify the "Validation Badge" turns Amber/Red.
- **`visualizes_connections`**: Verify that the Connection Graph renders nodes for each entry in `connections`.

### 1.3 Validation System
- **`shows_warning_on_empty_desc`**: Trigger validation with an empty description and assert warning message.
- **`confirms_valid_document`**: Pass a fully valid object and check for the "100% Schema Alignment" indicator.

## 2. Integration Tests

### 2.1 Drag-and-Drop Connection
- **Scenario**: Linking two cards.
    1.  **Given**: "The Sunken Temple" is open in the editor.
    2.  **When**: User drags "Sir Reginald" (NPC) from the list onto the 'Connections' area.
    3.  **Then**: A new connection entry is added to `connections` with `targetUUID` matching Sir Reginald.

### 2.2 Data Persistence Flow
- **Scenario**: Saving changes.
    1.  **Given**: User has modified the JSON `CR` value to "10".
    2.  **When**: User clicks "Update Firestore".
    3.  **Then**: The `onSave` mock is called with the updated object, and the status changes to 'AUTHENTICATED/Synced'.

## 3. Component Mocks
- Mock the `JSONEditor` component (input/textarea) to avoid complex library dependencies in tests.
- Mock the `DragDropContext` if using a library like generic dnd.

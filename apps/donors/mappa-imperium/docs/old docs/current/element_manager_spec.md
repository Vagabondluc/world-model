# Element Manager System Specification

## Overview

The Element Manager is the central hub for viewing and managing all generated content in Mappa Imperium. It organizes every significant worldbuilding element—from factions to resources—into discoverable, filterable, and editable cards. This system serves as the primary interface for players to interact with the world they've built, ensuring all elements are tracked, connected, and accessible.

## Core Design Philosophy

-   **Card-Centric Organization**: Every significant worldbuilding element is represented as a structured card.
-   **Automatic Generation**: Cards are created automatically from era activities and dice rolls.
-   **Discoverability**: Advanced search and filtering tools allow players to easily navigate their world's lore.
-   **Permission-Aware Interface**: Actions like editing and deleting are only available to the element's owner or in debug mode. Observers and other players have read-only access.
-   **Export Integration**: Cards serve as the primary data source for individual content exports.

## Card Types

The Element Manager is designed to handle a variety of card types, each with its own specific data and purpose.

-   **💎 Resource Cards**: Unique materials, flora, or fauna.
-   **✨ Deity Cards**: Gods and divine entities from the pantheon.
-   **🏞️ Location Cards**: Geographic features, landmarks, sacred sites.
-   **🛡️ Faction Cards**: Empires, kingdoms, tribes, etc.
-   **🏠 Settlement Cards**: Cities, towns, forts, villages.
-   **📜 Event Cards**: Discoveries, disasters, historical moments.
-   **👤 Character Cards**: Heroes, leaders, notable figures.
-   **⚔️ War Cards**: Battles, conflicts, military campaigns.
-   **🏛️ Monument Cards**: Statues, memorials, and great works.

## Card Structure

### Universal Fields (All card types)

```json
{
  "id": "unique_identifier (UUID v4)",
  "type": "Resource | Deity | Location | etc.",
  "name": "Display name",
  "owner": "player_1_through_8",
  "era": "creation_era_1_through_6",
  "data": { ... },
  "isDebug": true/false,
  "createdYear": 125 
}
```

-   **UUID Display**: Each card prominently displays its UUID with a one-click copy mechanism. This allows players to easily reference existing elements when providing context for new AI generations.
-   **`createdYear`**: For elements created in Era IV and later, this field provides a precise timestamp for chronological sorting in the timeline view.

## User Interface Design

The Element Manager provides a flexible and powerful UI for interacting with the world's elements.

### Main View

The main view is composed of a header, a filter/control bar, and the content display area.

### Filter & View Controls

A persistent bar at the top of the manager allows users to refine the displayed elements.

-   **Search**: A text input that filters elements by name, type, or keywords in their description in real-time.
-   **Filter Dropdowns**:
    -   **By Owner**: Filter elements owned by a specific player.
    -   **By Era**: Filter elements created in a specific era.
    -   **By Type**: Filter by the element type (e.g., 'Resource').
-   **View Mode Toggle**: Buttons to switch between 'Grid View', 'List View', and 'Timeline View'.

### Display Modes

#### 1. Grid View (Default)

-   **Layout**: A responsive masonry grid that displays elements as detailed visual cards (`ElementCardDisplay.tsx`).
-   **Content**: Each card shows the element's symbol, name, type, era, and owner.
-   **Actions**: An "Actions" dropdown menu provides options based on user permissions.

#### 2. List View

-   **Layout**: A compact, single-column list of elements (`ElementListRow.tsx`).
-   **Content**: Each row displays the element's key information in a clean, table-like format, allowing for quick scanning of many items.
-   **Actions**: An "Actions" dropdown menu provides the same options as the grid view.

#### 3. Timeline View

-   **Layout**: A chronological, single-column list of elements sorted by their `createdYear` (`ElementTimelineRow.tsx`).
-   **Content**: Each row prominently displays the year of creation, followed by the element's details, providing a narrative-first way to browse the world's history.
-   **Actions**: An "Actions" dropdown menu provides the same options as the other views.

### Interaction Model

-   **Direct Click to View**: The primary interaction with an element card or list row is a single click. This action immediately opens the `EditElementModal` in its `read-only` state, providing a quick way to view the full details of an element.
-   **Hover-to-Preview Tooltip**: Hovering the mouse over any element card or row will display a tooltip (`ElementTooltip.tsx`). This tooltip provides a quick preview of the element's key attributes (e.g., a Deity's domain, a Faction's race) without showing the full description, allowing for rapid scanning of element details.
-   **Actions Menu**: Secondary actions such as `Edit`, `Delete`, and `Export` remain accessible through a dedicated "Actions" dropdown menu on each element, which is not triggered by the primary click action.

### User Actions

Actions are available via a combination of direct interaction and a dropdown menu on each element card/row to maintain a clean UI.

-   **View**: Opens the element's details in a **read-only modal**. This is the primary action, triggered by clicking anywhere on the card/row body, and is available to all users.
-   **Edit**: Opens the element's details in an **editable modal**. This is available only to the player who owns the element, via the "Actions" menu.
-   **Delete**: Permanently removes the element from the world. This is available only to the element's owner, via the "Actions" menu. A confirmation modal is used to prevent accidental deletion.
-   **Export as HTML/Markdown**: Triggers a file download of the element's data in the selected format. Available to all users via the "Actions" menu.

### Element Detail & Editing

-   **Modal Interface**: Viewing and editing is handled through a single, consistent modal (`EditElementModal.tsx`).
-   **Read-Only State**: When viewing, all input fields are disabled, and the save button is replaced with a "Close" button.
-   **Edit State**: When editing, fields are active. Saving requires a confirmation step to prevent accidental changes.

## Relationship System (Future Development)

While not yet implemented, the system is designed with future relationship tracking in mind. The long-term vision includes:

-   **Relationship Types**: Causal (Event A caused B), Geographic (A is inside B), Political (A rules B), etc.
-   **Management**: A combination of automatic detection (e.g., AI parsing) and manual, drag-and-drop linking between cards.
-   **Visualization**: A graph view to show the complex web of connections between world elements.

## Multi-Player & Permissions

-   **Ownership**: Cards are owned by the player who was active when they were created.
-   **Permissions**: A user's `gameRole` ('player' or 'observer') and their ownership of a card determine their permissions.
    -   **Observers**: Can only use the "View" and "Export" actions. They cannot see "Edit" or "Delete" options.
    -   **Players**:
        -   On elements they **do not** own: Can only "View" and "Export".
        -   On elements they **do** own: Can "View", "Edit", "Delete", and "Export".
-   **Debug Mode**: In debug mode, the current player can edit and delete any card, regardless of ownership.
# Content Export Specification

## Overview

This specification defines the system for exporting Mappa Imperium content. The system serves three primary functions:
1.  **Session Management**: Exporting the entire game state to a JSON file, allowing users to save their progress and re-import it later to continue a session.
2.  **Content Sharing**: Exporting individual world elements (like resources, characters, or locations) into human-readable formats like HTML and Markdown for use in external tools, personal notes, or tabletop platforms.
3.  **Asynchronous Publishing**: Exporting the entire world state into a shareable "Chronicle Feed" that others can load as read-only observers, with a lobby system for discovery.

## 1. Session Export & Import (Save/Load)

This function is designed for saving and loading the complete state of a worldbuilding session.

### 1.1. Global World Export

-   **Trigger**: The "Save Game" option in the "Export" dropdown menu in the main navigation header.
-   **Action**: When clicked, the application gathers the entire current game state.
-   **Output Format**: A single JSON file named `mappa-imperium-export.json`.
-   **JSON Structure**: The exported file contains a root object with the following key properties:
    ```json
    {
      "gameSettings": { ... },
      "players": [ ... ],
      "elements": [ ... ],
      "currentEraId": 1,
      "exportedByPlayerNumber": 1 
    }
    ```

### 1.2. World Import

-   **Trigger**: An "Import Save" button on the initial `GameSetup` screen.
-   **Action**: Opens a file dialog for the user to select a `mappa-imperium-export.json` file.
-   **Process**:
    1.  The application reads and validates the JSON file.
    2.  If valid, the application state is completely replaced with the imported data.
    3.  Player `isOnline` status is reset to `false` for all players to allow re-joining.
    4.  The application transitions to the `PlayerSelection` screen.

## 2. Individual Element Export

This function allows users to extract specific pieces of lore from the world for easy sharing and use elsewhere.

### 2.1. Access Points

-   **Trigger**: An "Actions" dropdown menu is available on every element card.
-   **Locations**: This menu is present on cards in the Element Manager and era-specific gameplay sidebars.

### 2.2. Export Formats

-   **Export as HTML**: Generates a clean, self-contained HTML file for the selected element.
-   **Export as Markdown**: Generates a `.md` file for the selected element, respecting the format (`Regular` or `Homebrewery`) chosen in the Settings modal.

## 3. Chronicle Feed (Asynchronous Publishing)

This function allows a user (a "Chronicler") to publish the entire world state for others to view as read-only observers.

### 3.1. Chronicle Feed Export

-   **Trigger**: The "Publish Feed" option in the "Export" dropdown menu in the main navigation header.
-   **Action**: Gathers the complete game state.
-   **Output Format**: A single JSON file named `chronicle-feed.json`.
-   **JSON Structure**: The exported file contains a manifest and the full world state.
    ```json
    {
      "manifest": {
        "gameName": "Mappa Imperium Chronicle",
        "version": "1.0",
        "exportedBy": "Player Name",
        "timestamp": "ISO Date String",
        "elementCount": 150,
        "gameSettings": { ... }
      },
      "players": [ ... ],
      "elements": [ ... ]
    }
    ```

### 3.2. Chronicle Feed Import (Direct URL)

-   **Trigger**: The "Load from Chronicle Feed" section on the `GameSetup` screen.
-   **Action**: User pastes a URL to a hosted `chronicle-feed.json` file and clicks "Load".
-   **Process**:
    1.  The application fetches and validates the JSON from the URL.
    2.  If valid, the app state is populated with the feed's data.
    3.  The user is automatically set to the **Observer** role and taken directly into the game, bypassing player selection.

### 3.3. Chronicle Lobby (Discovery)

-   **Trigger**: The "Browse Chronicles" button on the `GameSetup` screen.
-   **Action**: The application fetches a central `manifest.json` file from `/public/chronicles/manifest.json`.
-   **Process**:
    1.  The manifest file lists metadata for multiple games, including a `feedUrl` for each.
    2.  The UI displays a list of available games.
    3.  When a user selects a game, the application uses its `feedUrl` to perform the same import process described in section 3.2.
-   **Chronicler Workflow**: To publish or update a game in the lobby, the Chronicler must:
    1.  Export their `chronicle-feed.json`.
    2.  Upload it to the correct folder on their host server (e.g., `/public/chronicles/my-game-name/`).
    3.  **Manually edit** the central `manifest.json` file to update their game's information (e.g., `lastUpdate`, `nextPlayerUp`).

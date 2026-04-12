
# Feature Proposal: Chronicle Feed (Asynchronous State Publishing)

**TO:** Mappa Imperium Development Team  
**CC:** Project Stakeholders, UI/UX Team  
**FROM:** Lead Frontend Engineer  
**DATE:** October 26, 2023  
**SUBJECT:** Feature Proposal: Chronicle Feed for Asynchronous World Publishing

## 1. Overview

Building upon the concepts of granular data from the Play-by-Email proposal, this document outlines a feature for publishing the entire state of a world as a "Chronicle Feed." This system allows a designated player (a "Chronicler") to export the complete world state into a structured JSON file that can be hosted on a simple web server or a service like GitHub Gist. Other users can then "subscribe" to this feed by providing its URL, loading a read-only, always-up-to-date version of the world.

This feature serves as a powerful tool for GMs who want to share their world with players, for groups who want a canonical "live" version of their game, and for observers who wish to follow a game's progress asynchronously.

## 2. The "RSS Feed" Analogy

The user requested a feature analogous to an RSS feed. In modern terms, this translates to a publish-subscribe model:
-   **Publishing**: The Chronicler "pushes" an update by exporting the world state and hosting the resulting file.
-   **Subscribing**: An observer "pulls" the state by loading the app from the file's URL.

The "feed" itself will not be XML/RSS, but a single, comprehensive JSON file that acts as a self-contained snapshot of the world.

## 3. Key Components

### A. New Export Option: "Export Chronicle Feed"

A new button in the main navigation header will allow the current player to generate the Chronicle Feed.

-   **Action**: Gathers the complete game state (`gameSettings`, `players`, `elements`).
-   **Output**: A single JSON file named `chronicle-feed.json`.

### B. The Chronicle Feed File Structure (`chronicle-feed.json`)

To avoid the complexity of managing multiple files and directories from a client-side application, the entire feed is packaged into one JSON file. This file contains a manifest and a dictionary of all world elements.

**Proposed JSON Structure:**

```json
{
  "manifest": {
    "gameName": "The Sundered Isles Chronicle",
    "version": "1.0",
    "exportedBy": "PeeHell (Player 1)",
    "timestamp": "2023-10-26T12:00:00Z",
    "elementCount": 150,
    "gameSettings": {
      "players": 4,
      "length": "Standard",
      "turnDuration": 10
    }
  },
  "players": [
    { "playerNumber": 1, "name": "PeeHell" },
    { "playerNumber": 2, "name": "PrOfOuNd_IdIoT" }
  ],
  "elements": [
    {
      "id": "f5a2b1c3-...",
      "type": "Faction",
      "name": "Iron-Hand Clan",
      "owner": 1,
      "era": 3,
      "data": { ... }
    }
  ]
}
```

This structure is simple to host and parse.

### C. New Import Option: "Load from Chronicle Feed"

The `GameSetup` screen will feature a new section with a single text input for a URL and a "Load Chronicle" button.

-   **Action**: The user pastes the URL to the hosted `chronicle-feed.json` file.
-   **Process**:
    1.  The application fetches the JSON from the provided URL.
    2.  It validates the structure of the fetched data.
    3.  If valid, it populates the application's state (`gameSettings`, `players`, `elements`).
    4.  Crucially, it sets the `gameRole` to **`observer`** and the `gameState` to **`playing`**. This ensures the user enters a read-only version of the world.

## 4. User Workflow

1.  **The Chronicler** (e.g., Player 1) finishes a session and wants to publish the world state.
2.  They click "Export Feed" and download `chronicle-feed.json`.
3.  They upload this file to a public URL. For example, they could create a GitHub Gist and use the "Raw" file URL.
4.  The Chronicler shares this URL with other players/observers.
5.  **An Observer** opens the Mappa Imperium app. On the setup screen, they paste the URL into the "Load from Chronicle Feed" input and click "Load Chronicle".
6.  The app fetches the data, loads the world, and places the observer directly into the main application in read-only mode, ready to explore the latest version of the chronicle.

## 5. Benefits

-   **Enables Asynchronous Observation**: Perfect for players who missed a session or for GMs sharing a world with their group.
-   **Simple to Host**: Requires only a simple static file host, which is widely available for free.
-   **Read-Only by Design**: Protects the integrity of the published world state. Observers cannot accidentally make changes.
-   **Single Source of Truth**: Provides a canonical, "live" version of the world for everyone to reference.

## 6. Technical Implementation

-   **`GameSetup.tsx`**: Add a new UI section for the URL input and load button.
-   **`GameContext.tsx`**: Implement `handleImportFromFeed(url)` with `fetch` and state hydration logic. Add `handleExportChronicleFeed()` to orchestrate the new export.
-   **`exportService.ts`**: Add a new `exportChronicleFeed` function to generate the JSON structure.
-   **`index.tsx`**: Add a new `loading_feed` state to show a loading indicator during the fetch process.
-   **`types.ts`**: Update `GameState` to include `loading_feed`.

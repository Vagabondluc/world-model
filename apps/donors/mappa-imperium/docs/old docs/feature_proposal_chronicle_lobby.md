
# Feature Proposal: Chronicle Lobby System

**TO:** Mappa Imperium Development Team  
**CC:** Project Stakeholders, UI/UX Team  
**FROM:** Lead Frontend Engineer  
**DATE:** October 26, 2023  
**SUBJECT:** Feature Proposal: Chronicle Lobby for Browsing Asynchronous Games

## 1. Overview

This document proposes an evolution of the "Chronicle Feed" feature into a comprehensive **"Chronicle Lobby."** The current system allows a user to load a single, known game URL. The proposed lobby will provide a centralized, browsable directory of all publicly hosted chronicles, allowing users to discover and follow multiple ongoing games.

This feature directly addresses the user request for a "lobby with feed" that displays key information like registered players, last turn date, and the current player's turn, making the asynchronous gameplay experience more accessible and community-oriented.

## 2. The Server-Side Structure

This system can be implemented without a complex backend by using a structured folder and file layout on the host server (e.g., the user's Linux server).

**Proposed File Structure:**

```
/var/www/mappa-imperium/
├── chronicles/
│   ├── manifest.json
│   ├── game_alpha_sundered_isles/
│   │   └── chronicle-feed.json
│   └── game_beta_iron_empire/
│       └── chronicle-feed.json
└── index.html (and other app files)
```

-   **/chronicles/**: A main directory to hold all public game data.
-   **manifest.json**: A **central index file**. The lobby UI will fetch this single file to get the list of all available games and their metadata.
-   **/game_.../**: A separate folder for each unique game, identified by a unique `gameId`.
-   **chronicle-feed.json**: The existing world-state file, now located within its specific game folder.

## 3. The Central Manifest File (`manifest.json`)

This file is the heart of the lobby system. It contains an array of game objects, with each object holding the metadata needed to display a "game card" in the lobby UI.

**Proposed JSON Structure:**

```json
{
  "games": [
    {
      "gameId": "game_alpha_sundered_isles",
      "gameName": "The Sundered Isles",
      "lastUpdate": "2023-10-26T14:30:00Z",
      "nextPlayerUp": "PrOfOuNd_IdIoT (Player 2)",
      "playerList": ["PeeHell", "PrOfOuNd_IdIoT", "MOFO"],
      "currentEraStep": "Era 4, Turn 3/6",
      "feedUrl": "/chronicles/game_alpha_sundered_isles/chronicle-feed.json"
    },
    {
      "gameId": "game_beta_iron_empire",
      "gameName": "The Iron Empire Chronicle",
      "lastUpdate": "2023-10-25T18:00:00Z",
      "nextPlayerUp": "MyFaCeHuRt (Player 4)",
      "playerList": ["IronKing", "SilverQueen", "BronzeMage", "MyFaCeHuRt"],
      "currentEraStep": "Era 2, Pantheon Creation",
      "feedUrl": "/chronicles/game_beta_iron_empire/chronicle-feed.json"
    }
  ]
}
```

This structure provides all the information requested by the user: player info, last update, and whose turn it is.

## 4. The Lobby UI Component (`ChronicleLobby.tsx`)

A new full-screen component will serve as the lobby.

-   **Entry Point**: Accessed via a "Browse Chronicles" button on the `GameSetup` screen.
-   **Functionality**:
    1.  On load, it fetches the `/chronicles/manifest.json` file.
    2.  It displays a loading state while fetching.
    3.  On success, it maps over the `games` array and renders a list of "Game Cards."
    4.  Each card displays the `gameName`, `playerList`, `lastUpdate`, and `nextPlayerUp`.
    5.  Each card has a "Load Chronicle" button which, when clicked, calls the existing `handleImportFromFeed` function with the `feedUrl` from the manifest.

## 5. Updated "Chronicler" Workflow

Since the application is client-side, it cannot directly write to the server's `manifest.json`. The Chronicler (the player hosting the game) will have a slightly updated, but still simple, workflow:

1.  After their session, they use the existing "Export Feed" button to generate `chronicle-feed.json`.
2.  They upload this file to their game's specific folder on the server (e.g., `/chronicles/game_alpha_sundered_isles/`).
3.  They **manually edit** the central `manifest.json` file to update their game's entry with the new `lastUpdate` and `nextPlayerUp` information.

**UX Improvement**: To simplify step 3, the application can be enhanced to generate a JSON snippet of the updated manifest entry, which the Chronicler can simply copy and paste.

## 6. Benefits

-   **Discoverability**: Allows users to find and follow games without needing to know the exact URL beforehand.
-   **Clear Status**: Provides an at-a-glance overview of the status of all ongoing public games.
-   **Community Building**: Fosters a sense of community by showcasing multiple active worlds.
-   **Low Technical Overhead**: Achieves all of this without requiring a database or a complex backend application, adhering to the "simple Linux server" model.

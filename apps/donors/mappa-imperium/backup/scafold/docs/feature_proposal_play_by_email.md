
# Feature Proposal: Play-by-Email (PbEM)

**TO:** Mappa Imperium Development Team  
**CC:** Project Stakeholders, UI/UX Team  
**FROM:** Lead Frontend Engineer  
**DATE:** October 26, 2023  
**SUBJECT:** Feature Proposal: Play-by-Email (PbEM) & Asynchronous Chronicle System

## 1. Overview

This document proposes the development of a **Play-by-Email (PbEM)** system to support asynchronous, turn-based gameplay. The core of this feature is a shift from the current "full world state" export to a granular **"Turn Package"** export. This package will contain only the new or modified elements from a single player's turn, making the handoff between players lightweight, clear, and less prone to merge conflicts.

This system, which we'll call the **Asynchronous Chronicle System**, will enable a robust and enjoyable PbEM experience, significantly broadening the accessibility of the game.

## 2. The Problem

The current session management relies on a single, monolithic `mappa-imperium-export.json` file. While effective for saving and resuming a solo session, it is a blunt instrument for turn-based multiplayer:

-   **Data Overload**: The entire world state is transferred every turn, which is inefficient.
-   **Lack of Clarity**: It is difficult for the next player to quickly understand what changed during the previous player's turn without a manual summary.
-   **Risk of Data Loss**: If a player imports an older file by mistake, they could overwrite significant progress made by others.
-   **Clumsy Handoff**: The process of "export all -> email -> import all" lacks the focused, turn-based flow that PbEM requires.

## 3. The Proposal: Asynchronous Chronicle System

We will implement a new export/import flow specifically for passing turns between players. This system will be built on four key components: a granular export system, a structured "Turn Package" file, a smart file naming convention, and intelligent import/merge logic.

## 4. Key Components

### A. Granular Export System

Instead of a single "Export World" button, players finishing their turn will use a new "Export Turn" feature. This will open a modal displaying all elements that were **created or modified** during their session. The player can then select which of these changes constitute their official turn to be passed to the next player. This gives the player control over what is included, allowing them to exclude notes or experiments.

### B. The Turn Package (`.miturn` file)

The exported file will be a JSON object with a new, dedicated extension: `.miturn` (Mappa Imperium Turn). This file will contain a structured summary of the turn's events.

**Proposed JSON Structure:**

```json
{
  "metadata": {
    "fileVersion": "1.0",
    "gameId": "unique-game-identifier",
    "exportingPlayer": {
      "playerNumber": 1,
      "name": "PeeHell"
    },
    "turnTimestamp": "2023-10-26T10:00:00Z",
    "era": 3,
    "step": 1,
    "cardsInPackage": 2
  },
  "elements": [
    {
      "id": "f5a2b1c3-...",
      "type": "Faction",
      "name": "Iron-Hand Clan",
      "owner": 1,
      "era": 3,
      "data": {
        "id": "data-...",
        "name": "Iron-Hand Clan",
        "race": "Dwarves",
        "symbolName": "Anvil",
        "emoji": "🛡️",
        "color": "Charcoal",
        "theme": "Master artisans and miners.",
        "description": "...",
        "leaderName": "Borin Ironhand",
        "isNeighbor": false
      },
      "action": "CREATE" 
    },
    {
      "id": "e2a7c4d9-...",
      "type": "Settlement",
      "name": "Khaz-Grund",
      "owner": 1,
      "era": 3,
      "data": {
         "id": "data-...",
         "name": "Khaz-Grund",
         "purpose": "Capital",
         "description": "The capital city carved into the heart of the mountain."
      },
      "action": "CREATE"
    }
  ],
  "playerStateUpdate": {
    "playerNumber": 1,
    "progress": {
      "era3": "faction_complete"
    }
  },
  "summary": "Player 1 (PeeHell) completed Era 3, Step 1. Created Faction 'Iron-Hand Clan' and capital 'Khaz-Grund'."
}
```
**Key fields:**
-   **`elements`**: An array containing the **full JSON data** for each new or updated card.
-   **`action`**: Specifies whether the card was `CREATE`d or `UPDATE`d.
-   **`summary`**: A human-readable string perfect for the body of an email.

### C. Smart File Naming Convention

To meet the requirement for informative and ordered filenames, we will adopt the following convention:

**Format:** `MI_P<PlayerNum>_E<Era>S<Step>_C<CardCount>_T<Timestamp>.miturn`

-   **MI**: "Mappa Imperium" project prefix.
-   **P#**: Player Number (e.g., `P1`, `P2`).
-   **E#S#**: Era and Step number (e.g., `E3S1` for Era 3, Step 1).
-   **C#**: The number of cards included in the package (e.g., `C2`).
-   **T<Timestamp>**: A unique Unix timestamp to prevent filename collisions and provide a clear chronological order.

**Example Filename:** `MI_P1_E3S1_C2_T1698314400.miturn`

This format is machine-parsable, human-readable, and contains all requested information, making it easy to manage a sequence of turn files in an email chain.

### D. Smart Import & Merge Logic

The application will feature a new "Import Turn" button. When a player imports a `.miturn` file:
1.  The app reads the metadata to ensure it's the correct game and next logical turn.
2.  It iterates through the `elements` array.
3.  For each element, it checks the local `elements` state for a matching `id`.
    -   If an ID exists (`action: "UPDATE"`), it overwrites the local element with the imported data.
    -   If no ID exists (`action: "CREATE"`), it adds the new element to the state.
4.  It applies any `playerStateUpdate` to the corresponding player.
5.  This **merge** approach ensures that only the turn's changes are applied, preserving the integrity of the rest of the world state.

## 5. User Workflow

1.  **Player 1 (P1)** completes their turn (e.g., creates a Faction and a Capital).
2.  P1 clicks "End Turn & Export". A modal appears showing the two new cards. P1 confirms.
3.  The file `MI_P1_E3S1_C2_T1698314400.miturn` is downloaded.
4.  P1 emails this file to Player 2 (P2), pasting the `summary` text into the email body.
5.  **P2** opens the app, clicks "Import Turn," and selects the file from P1.
6.  The app merges the two new cards into P2's world state. P2 is now up to date and can begin their turn.

## 6. Technical Implementation Details

-   **`GameContext.tsx`**: Add new handler functions: `handleExportTurnPackage()` and `handleImportTurnPackage()`.
-   **New Component: `TurnExportModal.tsx`**: A new modal to display elements created/modified during the session and allow the user to select which ones to include in the export.
-   **`exportService.ts`**: Add a new function `exportTurnPackage()` that constructs the `.miturn` JSON object and filename.
-   **`GameSetup.tsx` / `AppLayout.tsx`**: Add an "Import Turn" button that is visible when a game is active.

## 7. Benefits

-   Enables true asynchronous, turn-based play.
-   Drastically reduces the size of data transferred between players.
-   Provides a clear, auditable history of actions per turn.
-   Minimizes the risk of accidental data loss from importing an incorrect full-state file.
-   The workflow is intuitive and mirrors traditional PbEM games.

## 8. Next Steps

Awaiting feedback on this proposal before creating formal development tickets in `to_do.md`. A prototype of the export modal and JSON structure can be developed for review.

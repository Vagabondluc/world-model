# Solo Gameplay To-Do List
**Version: 0.0.1**  
This tracker is dedicated to features enhancing the solo play experience.

---

## Next Up

- **SOLO-0.0.1-001: Implement "Hot-Seat" Solo Mode**
  **Description**: Allow a single user to control multiple player factions in a solo game session. This involves creating a new game mode selection, making player-switching a core feature, and adapting the turn-advancement logic to support a round-based "hot-seat" progression.
  **Status**: Not started.

---

## Backlog

### Sub-Tasks for Hot-Seat Mode (SOLO-0.0.1-001)

- **SOLO-0.0.1-002: Update Game Setup Screen**
  **Description**: Add a "Game Mode" selection to `GameSetup.tsx` with options for "Live Multiplayer," "Solo vs. AI," and the new "Solo Hot-Seat."
  **Status**: Not started.

- **SOLO-0.0.1-003: Expose Player-Switching UI**
  **Description**: Refactor `PlayerStatus.tsx` to make the player-switching functionality (currently in debug mode) a permanently visible and core UI element when in "Solo Hot-Seat" mode. The `handlePlayerSwitch` function in `GameContext` will be used as the core logic.
  **Status**: Not started.

- **SOLO-0.0.1-004: Rework Turn & Era Advancement Logic**
  **Description**: This is the most complex part. The `CompletionTracker.tsx` component must be updated. Instead of checking if all *online* players are complete, it must track completion on a per-player basis for the current "round." An era will only advance after **every player in the game** has completed their required tasks.
  **Status**: Not started.

- **SOLO-0.0.1-005: Implement Clear UI/UX for Hot-Seat**
  **Description**: Create prominent UI elements (e.g., a header banner) to clearly indicate which player's turn is currently active. Also, implement a brief turn summary modal that appears upon switching players to help the user track the narrative.
  **Status**: Not started.

---

## Completed Tasks
*(No tasks completed yet)*

FILE: src/components/navigation/PlayerStatus.tsx
SUBSYSTEM: Navigation

LOGIC TRACE ENTRIES
--------------------------------

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/navigation/PlayerStatus.tsx
FUNCTION / COMPONENT: PlayerStatus
INPUTS:
- useGameStore (players, currentPlayer, isDebugMode, switchPlayer, logOff)
- websocketService
PRECONDITIONS:
- None
TRANSITION:
1. Calculates `onlinePlayers` count.
2. Renders main button showing current player name (or 'Observing').
3. Manages dropdown open/close state with `useOnClickOutside`.
4. Dropdown renders list of all players.
5. Shows status indicators (Online/Offline) for each.
6. If `isDebugMode` is true, renders 'View' (switch player) and 'Toggle' (toggle online) buttons next to other players.
    - Toggle calls `websocketService.emit('player:toggleStatus')`.
7. Renders "Log Off" button at bottom.
OUTPUT / NEXT STEP:
- Player management dropdown UI.
DEPENDENCIES:
- useGameStore
- websocketService
STATUS: MATCH
NOTES:
- Maintains debug capability to switch players and toggle connection status.

PARITY SUMMARY TABLE
--------------------------------
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
Player Listing | `PlayerStatus.tsx` | `PlayerStatus.tsx` | MATCH | Identical list rendering.
Debug Actions | Conditional rendering | Conditional rendering | MATCH | Switch/Toggle logic preserved.
Websocket Interaction | `websocketService.emit` | `websocketService.emit` | MATCH | Direct service call preserved for local simulation.
State Access | Props (`players`, `currentPlayer`) | `useGameStore()` | ADAPTED | Switched from props to store.

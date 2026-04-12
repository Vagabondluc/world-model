FILE: src/App.tsx
SUBSYSTEM: Layout / Root

LOGIC TRACE ENTRIES
--------------------------------

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/App.tsx
FUNCTION / COMPONENT: App
INPUTS:
- useGameStore (gameState, gameSettings, players, isDebuggerOpen, etc.)
PRECONDITIONS:
- Store must be initialized.
TRANSITION:
1. Reads global state from `useGameStore`.
2. Sets up a `showReset` local state and a timeout effect. If `isGameReady` remains false for 5 seconds, shows a "Hard Reset" prompt (Safety Valve).
3. `renderGameState` switch:
    - 'setup': Renders `GameSetup`.
    - 'ai_configuration': Renders `AiPlayerSetup` (checks if settings exist).
    - 'player_selection': Renders `PlayerSelection`.
    - 'lobby': Renders `ChronicleLobby`.
    - 'loading_feed': Renders `LoadingSpinner`.
    - 'playing': Renders `AppLayout`.
    - 'finished': Renders `GameEndScreen`.
4. Renders the result of `renderGameState`.
5. Renders `UnifiedDebugSystem` and Debug Toggle Button if `isDebugMode` is true.
OUTPUT / NEXT STEP:
- Displays the active view based on `gameState`.
DEPENDENCIES:
- useGameStore
- Component imports (GameSetup, AppLayout, etc.)
STATUS: ADAPTED
NOTES:
- Matches logic from Scaffold `index.tsx` but adds the "Hard Reset" safety mechanism for stuck hydration states.
- Moves Debug UI integration to the root level (overlay) rather than inside specific layouts.

PARITY SUMMARY TABLE
--------------------------------
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
View Routing | `index.tsx` (App component) | `App.tsx` | MATCH | Same switch-case logic for `gameState`.
Debug Toggle | `NavigationHeader` (partial) | `App.tsx` | ADAPTED | Debug toggle moved to global overlay button (bottom-right) when active.
Safety Reset | N/A | `useEffect` + `handleReset` | NEW | Added timeout guard for stuck loading states.

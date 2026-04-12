FILE: src/components/layout/AppLayout.tsx
SUBSYSTEM: Layout

LOGIC TRACE ENTRIES
--------------------------------

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/layout/AppLayout.tsx
FUNCTION / COMPONENT: AppLayout
INPUTS:
- useGameStore (viewedEraId, view, isGameReady, etc.)
PRECONDITIONS:
- `isGameReady` must be true to render content.
TRANSITION:
1. Checks `isGameReady`. If false, renders `LoadingSpinner`.
2. Checks `gameRole === 'player' && !currentPlayer`. Returns error if true.
3. Manages visibility/fade animation states (`isContentVisible`, `isContentLoadedAndReady`).
4. `handleContentReady` callback (memoized) passed to child views to signal transition end.
5. Effects handle transition state (`isTransitioning`) to fade out/in content.
6. Renders `NavigationHeader`.
7. Renders main content area:
    - If `view === 'eras'`, renders `EraContent`.
    - If `view === 'elements'`, renders `ElementManager`.
8. Renders `CompletionTracker` and `CollaborationStatus` in footer.
9. Renders `SettingsModal`.
OUTPUT / NEXT STEP:
- Displays main game UI.
DEPENDENCIES:
- useGameStore
- NavigationHeader, ElementManager, EraContent, etc.
STATUS: ADAPTED
NOTES:
- Logic adapted from Scaffold `AppLayout`.
- Added `isGameReady` gate.
- Stabilized `handleContentReady` with `useCallback` to fix infinite render loops found in Scaffold.

PARITY SUMMARY TABLE
--------------------------------
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
Layout Structure | `components/layout/AppLayout.tsx` | `components/layout/AppLayout.tsx` | MATCH | Same header/main/footer structure.
Initialization Gate | N/A | `if (!isGameReady)...` | NEW | Prevents rendering before store rehydration.
Transition Logic | `useEffect` state updates | `useEffect` + `useCallback` | ADAPTED | Improved stability of transition callback.
Context Consumption | `useGame()` | `useGameStore()` | ADAPTED | Switched to Zustand selector.

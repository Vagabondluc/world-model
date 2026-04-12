FILE: src/stores/gameStore.ts
SUBSYSTEM: Store / State

LOGIC TRACE ENTRIES
--------------------------------

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/stores/gameStore.ts
FUNCTION / COMPONENT: useGameStore (Hook)
INPUTS:
- Slice creators: createSessionSlice, createGameplaySlice, createUiSlice, createDebugSlice
PRECONDITIONS:
- Zustand middleware (persist, createJSONStorage) must be available.
- `sessionStorage` must be available.
TRANSITION:
1. Combines all slices into a single store using `...slice(...a)`.
2. Wraps store in `persist` middleware with key `mappa-imperium-storage`.
3. Defines `migrate` function to handle schema versioning (checking `version < 3`).
4. Defines `partialize` to exclude transient states: `isTransitioning`, `isSettingsModalOpen`, `isDebuggerOpen`, `isGameReady`.
5. Defines `onRehydrateStorage` to handle post-hydration logic:
    - Resets `isTransitioning` to false.
    - Sets `isGameReady` to true if valid game data (`gameSettings` and `players`) exists.
OUTPUT / NEXT STEP:
- Returns the global `useGameStore` hook.
DEPENDENCIES:
- zustand, zustand/middleware
- ./slices/*.ts
- ./initialState
STATUS: ADAPTED
NOTES:
- Adapts the monolithic `GameContext.tsx` from Scaffold into a modular Zustand store.
- Adds explicit persistence configuration and rehydration logic which was absent in Scaffold (memory-only).

PARITY SUMMARY TABLE
--------------------------------
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
State Container | `contexts/GameContext.tsx` | `stores/gameStore.ts` | ADAPTED | Moved from Context API to Zustand.
Persistence | N/A (RAM only) | `persist()` middleware | NEW | Added sessionStorage persistence with exclusion of transient UI state.
Initialization | `useEffect` in Context | `onRehydrateStorage` | NEW | Added explicit hydration check to set `isGameReady`.
Migration | N/A | `migrate` function | NEW | Added versioning (v3) to handle schema changes.

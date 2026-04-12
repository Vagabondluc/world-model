
FILE: docs/scaffold-fix/01_state-persistence.logic-trace.md
SUBSYSTEM: State Persistence & Initialization

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/stores/gameStore.ts
FUNCTION / COMPONENT: useGameStore (persist middleware config)
INPUTS: persist options
PRECONDITIONS: None
TRANSITION: Configures `partialize` to exclude `isTransitioning`, `isSettingsModalOpen`, `isDebuggerOpen`, `isGameReady`.
OUTPUT / NEXT STEP: State saved to `sessionStorage` without transient flags.
DEPENDENCIES: zustand/middleware
STATUS: MATCH
NOTES: Explicit exclusion logic found in `partialize` callback. Matches Fix 01 requirements.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/stores/gameStore.ts
FUNCTION / COMPONENT: useGameStore (onRehydrateStorage)
INPUTS: state (hydrated)
PRECONDITIONS: State exists
TRANSITION: 
1. If `state.isTransitioning` is true, calls `resetTransition()`.
2. If `state.gameSettings` and `state.players` exist, calls `setGameReady(true)`.
OUTPUT / NEXT STEP: `isGameReady` flag updated in store.
DEPENDENCIES: state.gameSettings, state.players
STATUS: MATCH
NOTES: Logic explicitly handles the "orphaned transition" and sets the ready flag based on data presence.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/layout/AppLayout.tsx
FUNCTION / COMPONENT: AppLayout
INPUTS: isGameReady (from useGameStore)
PRECONDITIONS: !isGameReady
TRANSITION: Returns `<div ...><LoadingSpinner ... /></div>`
OUTPUT / NEXT STEP: Renders loading screen, blocks main UI rendering.
DEPENDENCIES: useGameStore
STATUS: MATCH
NOTES: Initialization gate logic is present and correct.

PARITY SUMMARY TABLE:
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
Persistence Config | React Context (Memory) | `gameStore.ts` (SessionStorage) | ADAPTED | Src adds persistence but correctly filters transient state.
Rehydration | N/A (Fresh start) | `gameStore.ts` (`onRehydrateStorage`) | NEW | Src adds rehydration logic to restore session state safely.
Init Gate | N/A | `AppLayout.tsx` | NEW | Src adds `isGameReady` check to prevent rendering uninitialized data.

-------------------------
NEGATIVE PARITY SECTION
-------------------------
OBSERVED DIVERSION 1
Scaffold behavior: State was held in volatile memory (RAM). Refreshing the browser acted as a hard reset, clearing all corruption or stuck states instantly.
Src behavior: State is persisted to `sessionStorage` via Zustand middleware. Refreshing the browser reloads the previous state, including potentially corrupted data or invalid logic paths.
Evidence in files: docs/logic_difference_report.md Section 1 ("State Persistence & Lifecycle") & Section 7.1.
Impact: "Sticky Corruption." Users cannot escape a crash loop by refreshing; they remain stuck in the broken state until storage is manually cleared.
Classification: Regression

OBSERVED DIVERSION 2
Scaffold behavior: Initialization was atomic; the app started fresh with default values every time.
Src behavior: Initialization involves a "Rehydration" phase where persisted data is merged with default state. Transient flags (like `isTransitioning`) are excluded from persistence but incorrectly defaulted to `false` upon reload, creating a mismatch with the loaded data (e.g., `viewedEra` suggests a transition happened, but the flag denies it).
Evidence in files: docs/logic_difference_report.md Section 7.1 ("State Persistence Broke Expected UX").
Impact: Orphaned transitions where the UI gets stuck between states because the animation flag was lost during reload.
Classification: Divergent

OBSERVED DIVERSION 3
Scaffold behavior: No concept of "Game Ready" state was needed because data was always synchronous and fresh.
Src behavior: The asynchronous nature of storage rehydration introduces a race condition where UI components render before data is fully restored, leading to `undefined` errors on deep property access.
Evidence in files: docs/logic_difference_report.md Section 7.4 ("Render Stability Fix Exposed Hidden Timing Bugs").
Impact: White-screen crashes on first load if `gameSettings` or `players` arrays are accessed before rehydration completes.
Classification: Missing Logic

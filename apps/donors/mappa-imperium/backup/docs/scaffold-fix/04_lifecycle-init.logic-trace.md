
FILE: docs/scaffold-fix/04_lifecycle-init.logic-trace.md
SUBSYSTEM: Render Lifecycle & Initialization

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/layout/AppLayout.tsx
FUNCTION / COMPONENT: AppLayout
INPUTS: isGameReady
PRECONDITIONS: !isGameReady
TRANSITION: Returns LoadingSpinner immediately.
OUTPUT / NEXT STEP: Stops rendering children (`EraContent`, `ElementManager`).
DEPENDENCIES: useGameStore
STATUS: MATCH
NOTES: Prevents "cannot read property of undefined" errors in children.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/layout/AppLayout.tsx
FUNCTION / COMPONENT: handleContentReady
INPUTS: isReady
PRECONDITIONS: None
TRANSITION: Wrapped in `useCallback`.
OUTPUT / NEXT STEP: Stable function reference passed to children.
DEPENDENCIES: [] (Empty dependency array)
STATUS: MATCH
NOTES: Fixes infinite render loop caused by unstable callback identity.

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/components/era-interfaces/EraContent.tsx
FUNCTION / COMPONENT: useEffect (Ready Signal)
INPUTS: eraId, onReady
PRECONDITIONS: None
TRANSITION: Calls `onReady(true)` inside `setTimeout(..., 0)`.
OUTPUT / NEXT STEP: Signals parent after mount.
DEPENDENCIES: eraId, onReady
STATUS: MATCH
NOTES: Updates parent state after render cycle completes.

PARITY SUMMARY TABLE:
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
Init Gate | None (Crash prone) | `AppLayout.tsx` | IMPROVED | Explicit guard against uninitialized state.
Callback Stability | Unstable function | `useCallback` | IMPROVED | Prevents infinite render loops.
Ready Signal | Component Mount | `setTimeout` / `useEffect` | MATCH | Async signaling preserved.

-------------------------
NEGATIVE PARITY SECTION
-------------------------
OBSERVED DIVERSION 1
Scaffold behavior: `AppLayout` passed an unstable callback function (`handleContentReady`) to children. This caused infinite render loops that accidentally "force settled" the application state by re-rendering until data existed.
Src behavior: `AppLayout` stabilizes the callback with `useCallback`. Components mount immediately and only once.
Evidence in files: docs/logic_difference_report.md Section 4 ("Render Stability") & Section 7.4.
Impact: The "accidental feature" of waiting for data is gone. Components now render *too fast*, accessing `undefined` state properties before hydration, leading to crashes that were previously masked by the render loop.
Classification: Regression (via Fix)

OBSERVED DIVERSION 2
Scaffold behavior: UI components assumed data availability guaranteed by the parent Context.
Src behavior: UI components still assume data availability, but the `Zustand` store is asynchronous in its initialization.
Evidence in files: docs/logic_difference_report.md Section 7.4 ("Render Stability Fix Exposed Hidden Timing Bugs").
Impact: `EraContent` attempts to render Era-specific logic before `currentEraId` is valid, resulting in blank screens or errors.
Classification: Missing Logic (Loading Gate)

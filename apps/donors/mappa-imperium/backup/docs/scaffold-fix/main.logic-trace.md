FILE: src/main.tsx
SUBSYSTEM: Entry

LOGIC TRACE ENTRIES
--------------------------------

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: Src
FILE: src/main.tsx
FUNCTION / COMPONENT: Root Render
INPUTS:
- DOM element 'root'
- App component
PRECONDITIONS:
- HTML DOM must exist.
TRANSITION:
1. Creates React root.
2. Renders `<React.StrictMode>`.
3. Wraps `<App />` in `<ErrorBoundary>`.
OUTPUT / NEXT STEP:
- Mounts application to DOM.
DEPENDENCIES:
- react-dom/client
- ErrorBoundary
- App
STATUS: ADAPTED
NOTES:
- Similar to Scaffold `index.tsx` (entry part), but separates `App` definition into its own file (`App.tsx`).
- explicitly adds `ErrorBoundary` at the root.

PARITY SUMMARY TABLE
--------------------------------
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
Entry Point | `index.tsx` | `main.tsx` | ADAPTED | Separated entry logic from component logic.
Provider Wrapping | `GameProvider` | N/A (Store used) | DELETED | Context Provider removed in favor of Zustand hook usage in App.
Error Handling | N/A | `ErrorBoundary` | NEW | Added root-level error boundary.

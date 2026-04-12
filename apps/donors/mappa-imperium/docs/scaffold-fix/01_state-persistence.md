# 01_state-persistence.md

## Title
State Persistence & Lifecycle Repair Specification

## Problem Summary
The Src codebase introduces "orphaned transitions" and application crashes upon page reload. This occurs because the persistence logic (via `sessionStorage`) restores data but explicitly excludes transient UI states (like loading flags or transition markers). The application logic assumes these transient states exist alongside the persisted data, leading to "undefined" errors when they are missing.

## Scaffold Working Logic
*   **Mechanism:** State was held purely in JavaScript memory via React Context.
*   **Behavior:** Refreshing the page resulted in a complete, clean reset of the application state.
*   **Result:** The application always started from a predictable "fresh" state upon load, ensuring no mismatch between data and UI state.

## Src Broken Logic
*   **Mechanism:** State persists across reloads via `sessionStorage`. Transient UI states are explicitly excluded from this persistence.
*   **Behavior:** Upon reload, data is restored, but critical UI flags (loading, transitioning) are reset to initial values.
*   **Result:** 
    *   Creates "orphaned transitions" where the data implies a transition occurred, but the UI flag says otherwise.
    *   The UI crashes because logic assumes specific transient states exist to support the persisted data.

## Proposed Fix
Implement an **Initialization Guard** and an optional **Session Reset Strategy**.

1.  **Implement `isGameReady` Flag:**
    *   Add a non-persisted `isGameReady` boolean to the global store, initialized to `false`.
    *   On application mount, check if persisted data exists.
    *   If data exists, validate that required transient states can be reconstructed or defaulted safely.
    *   Only set `isGameReady` to `true` once validation passes.

2.  **Enforce Initialization Gate:**
    *   In the root `AppLayout` or `App` component, do not render the main game view until `isGameReady` is true.
    *   If validation fails (orphaned state detected), trigger a "Soft Reset" or "Session Restore" prompt.

3.  **Rehydrate Transient State:**
    *   Create a `rehydrate()` action in the store that runs on mount.
    *   This action should explicitly reset transient flags to a safe "idle" state that matches the loaded data (e.g., if `viewedEraId` is set, ensure `isTransitioning` is `false`).

## Migration / Patch Notes
*   **Files Affected:** `src/stores/gameStore.ts` (or equivalent), `src/App.tsx`, `src/components/layout/AppLayout.tsx`.
*   **Architectural Adjustment:** Move away from blind rehydration. The store must strictly sanitize the relationship between persisted data and ephemeral UI flags on initialization.

## Optional Test Scenarios
1.  **Reload Test:** Start a game, advance to Era 2. Refresh the browser. The app should load Era 2 without crashing or showing a loading spinner indefinitely.
2.  **Transition Test:** Trigger an Era transition. Refresh the browser *during* the transition. The app should load in a stable state (either the previous or next Era), not a broken transition state.
# 07_player-switching.md

## Title
Player Switching Behavior Repair Specification

## Problem Summary
Switching between players destroys the previous player's transient data and UI state. The UI assumes persistence exists (as it did in the Scaffold version), leading to empty views or confusion when a user returns to a previous player's context.

## Scaffold Working Logic
*   **Mechanism:** Context map kept player-specific data concurrent in memory.
*   **Behavior:** Seamless transition between player contexts without data loss.
*   **Result:** Multi-player concurrency was supported; Player A's draft remained while Player B was active.

## Src Broken Logic
*   **Mechanism:** Relies on local state or a single "active player" view in the store which flushes transient data on switch.
*   **Behavior:** Switching players resets the local component state associated with the previous player.
*   **Result:** Data loss on switch (Regression of concurrency).

## Proposed Fix
Implement **Concurrent Player State** in the Global Store.

1.  **Store Restructuring:**
    *   Ensure the global store does not just track `currentPlayerId`.
    *   It must maintain a registry of state *per player* for any feature that requires concurrency (like the Era I drafts mentioned in File 02).
    *   Example: `playerStates: Record<number, { currentStep: string, draftData: any, viewState: any }>`

2.  **Selector Update:**
    *   Components should select data based on the `activePlayerId` prop or the global `currentPlayer` ID.
    *   When switching players, the component should re-render with the *new* player's data from the map, rather than resetting to an empty state.

3.  **Persistence Scope:**
    *   Ensure this `playerStates` map is included in the `persist` middleware whitelist so it survives reloads (fixing the intersection of File 01 and File 07).

## Migration / Patch Notes
*   **Files Affected:** `src/stores/gameStore.ts`.
*   **Architectural Goal:** Restore the "Multi-player state concurrency" capability of the Scaffold version.

## Optional Test Scenarios
1.  **Multi-Role Test:** In Debug mode, act as Player 1. Open a form and type "Draft Text". Switch to Player 2 via the debug menu. Type "Player 2 Text". Switch back to Player 1. "Draft Text" should still be visible in the form.
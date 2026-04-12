# 05_debug-seeding.md

## Title
Debug System State Seeding Repair Specification

## Problem Summary
The debug system has regressed from an active state manipulator to a passive diagnostic tool. The "Prepopulate" functionality is missing or broken, meaning developers/testers cannot force the application into a valid state for testing specific Eras. This leads to testing against uninitialized/empty states, which the UI is not designed to handle.

## Scaffold Working Logic
*   **Mechanism:** `DebugModal` acted as a "Game State Manipulator".
*   **Behavior:** Provided UI buttons to trigger state changes and prepopulate eras with mock data.
*   **Result:** "Backfilled" missing state, forcing the application into a valid configuration for testing later eras without manually playing through previous ones.

## Src Broken Logic
*   **Mechanism:** `UnifiedDebugSystem` acts as a "System Diagnostic Tool".
*   **Behavior:** Tests environment capabilities (local storage, file health) but does not modify game state.
*   **Result:** Missing "Prepopulate" functionality. The game often starts in an empty state, causing UI components that expect previous Era data to fail or behave unpredictably.

## Proposed Fix
Reintegrate **Active State Injection** (Seeding) into the Debug System.

1.  **Restore `prepopulateEra` Action:**
    *   Ensure the global store has a robust `prepopulateEra(eraId, playerId)` action.
    *   This action must verify it constructs a *complete* state (e.g., if seeding Era 3, it must also generate the required Era 1 and 2 data if missing).

2.  **Add "Game Tools" Tab:**
    *   In the `UnifiedDebugSystem`, ensure the "Game Tools" tab is fully functional and calls these store actions.
    *   Add specific buttons: "Seed Era 1", "Seed Era 2", "Unlock All Eras".

3.  **Force Re-render:**
    *   When a seed action is triggered, the debug system must dispatch a state update that forces the main application to re-evaluate `isGameReady` and re-render the view to reflect the new data immediately.

## Migration / Patch Notes
*   **Files Affected:** `src/stores/gameStore.ts`, `src/components/debug/tabs/GameToolsTab.tsx`, `src/data/prepopulationData.ts`.
*   **Requirement:** The prepopulation data must be updated to match the current `ElementCard` schema if it has changed during refactoring.

## Optional Test Scenarios
1.  **Jump to Era 4:** From a fresh start, open Debug, go to Game Tools, click "Seed Era 4". Close Debug. The UI should immediately show Era 4 with populated data (resources, deities, factions) without errors.
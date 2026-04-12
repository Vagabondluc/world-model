# Turn Structure & Advancement Logic Analysis

## 1. Overview
This document provides a technical analysis of the turn structure and era advancement logic in Mappa Imperium. The system is designed to be reactive, automatically determining when an era is complete based on player actions.

## 2. Core State Management (`GameContext`)
The entire progression system is managed by state variables within `GameContext.tsx`:
-   `currentEraId`: The current gameplay era the session is in. This is the "true" era.
-   `viewedEraId`: The era the user is currently looking at. Can be different from `currentEraId` for reviewing past eras.
-   `isCurrentEraComplete`: A crucial boolean flag that becomes `true` only when all active players have completed their tasks for the `currentEraId`.
-   `elements`: The array of all created `ElementCard` objects. The contents of this array are the primary trigger for progress.
-   `players`: The array of `Player` objects. Used to check player-specific goals (like `deityCount`) and online status.
-   `gameSettings`: Contains the chosen game length, which determines the number of turns required for Eras IV-VI.

## 3. The Completion Loop
This is the reactive process that detects when an era is finished. It is centralized in `CompletionTracker.tsx`.

1.  **Player Action**: A player performs an action in an era's UI (e.g., creates a `Resource` in `ResourcePlacer.tsx`). This calls `handleCreateElement`.
2.  **State Update**: The new `ElementCard` is added to the global `elements` array in `GameContext`.
3.  **Observation**: The `CompletionTracker` component, which is always rendered in the `AppLayout`, re-calculates its `progressData` memo whenever the `elements`, `players`, or `currentEraId` change.
4.  **Goal Definition (`ERA_GOALS`)**: Inside `CompletionTracker`, the `ERA_GOALS` constant defines the completion conditions for each era. Each entry has a `getTaskCount` function that returns `{ completed: number, total: number }`.
5.  **Player Check (`isPlayerEraComplete`)**: The `isPlayerEraComplete` function is called for each player for the `currentEraId`. It compares the `completed` tasks against the `total` required tasks.
6.  **Group Check (`allRequiredPlayersComplete`)**: This variable becomes `true` only if `isPlayerEraComplete` returns `true` for **every online player** (`p.isOnline === true`).
7.  **Global State Flip**: A `useEffect` hook in `CompletionTracker` watches `allRequiredPlayersComplete`. When it becomes `true`, it calls `handleSetCurrentEraComplete(true)`, updating the global context.

## 4. The Advancement Loop
This is the user-facing process for moving to the next era.

1.  **UI Reaction**: `EraSelector.tsx` observes the global `isCurrentEraComplete` state. When it's `true`, the button for the next era (`currentEraId + 1`) automatically changes its status to "available" (and turns blue).
2.  **User Action**: The user clicks the newly available era button. This calls `handleEraSelect(eraId)` in `GameContext`.
3.  **Advancement Logic**: `handleEraSelect` checks if the clicked era is the next one and if the current one is complete. If both are true, it calls `handleAdvanceEra()`.
4.  **State Transition**: `handleAdvanceEra` increments `currentEraId` and `viewedEraId` to the new era, and critically, resets `isCurrentEraComplete` to `false`, restarting the completion loop for the new era.

## 5. Era-Specific Completion Logic

-   **Era 1 (Creation)**: Complete when a player has created **2 `Resource` elements**.
-   **Era 2 (Myth)**: Complete when a player has created `deityCount * 2` total elements (`Deity`s and `Location`s). Progression is blocked until `player.deityCount` is set (after the "Setup" step), preventing the era from being completed prematurely.
-   **Era 3 (Foundation)**: Complete when a player has created **4 specific elements**: 1 Prime Faction, 1 Neighbor Faction, and 2 non-capital Settlements.
-   **Eras 4, 5, 6 (Turn-Based)**: Complete when a player has created a number of elements corresponding to the number of turns for that era, which is determined by `gameSettings.length`. Each turn-based element is identified by its `creationStep` property.

## 6. Bug Analysis: The "Stall/Skip" at Era 2

**Symptom**: After completing Era 1, advancing to Era 2 would either appear to "stall" or would immediately skip all of Era 2's gameplay and offer to advance to Era 3.

**Root Cause**: The `isPlayerEraComplete` function was logically flawed.
1.  When a player first enters Era 2, their `player.deityCount` is `undefined`.
2.  The `getTaskCount` function for Era 2 saw this and returned `{ completed: 0, total: 0 }`.
3.  The `isPlayerEraComplete` function interpreted `total: 0` as "this player has no tasks to do, therefore they are complete," and returned `true`.
4.  This caused `allRequiredPlayersComplete` to become `true` for Era 2 instantly.
5.  The "Advance" button would then immediately become available to proceed to Era 3, effectively skipping Era 2's gameplay.

**Initial Failed Fix**: An attempt was made to fix this by adding a check inside `isPlayerEraComplete`: `if (eraId === 2 && !player.deityCount) return false;`. This failed because the function was being passed a summarized data object that did **not** include the `deityCount` property from the full `Player` object.

**Correct Fix**: The `CompletionTracker` logic was refactored to pass the **full `Player` object** into the `isPlayerEraComplete` function. This ensures the check `!player.deityCount` has access to the correct data and correctly returns `false` until the player has completed the Era 2 setup step, resolving the bug.
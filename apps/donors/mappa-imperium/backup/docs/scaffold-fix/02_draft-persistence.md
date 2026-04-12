# 02_draft-persistence.md

## Title
Draft Logic (Era I Geography) Repair Specification

## Problem Summary
Users lose their "Work in Progress" (draft) geography selections when switching players or tabs. The data is currently tied to the component lifecycle rather than the global state, breaking the multi-player drafting workflow that existed previously.

## Scaffold Working Logic
*   **Mechanism:** Maintained a `playersState` map (`Record<number, EraCreationState>`) within the global Context.
*   **Behavior:** Tracked "work in progress" geography selections for all players simultaneously in memory.
*   **Result:** Users could switch between Player 1 and Player 2 views without losing unsaved draft selections for either player.

## Src Broken Logic
*   **Mechanism:** Uses ephemeral local component state (`useState`) inside `EraCreationContent`.
*   **Behavior:** Draft data exists *only* while the specific component is mounted.
*   **Result:** Switching players (which unmounts and remounts the component with new props) or switching tabs immediately destroys/resets any unsaved draft work.

## Proposed Fix
Move draft state from Component Local State to the **Global Store Slice**.

1.  **Create `eraDrafts` Slice:**
    *   In the global store, define a state object `eraDrafts: Record<playerId, DraftState>`.
    *   `DraftState` should mirror the structure used in `EraCreationContent` (e.g., features array, counts).

2.  **Bind Components to Slice:**
    *   Update `EraCreationContent` (and `GeographyAdvisor`) to read from `eraDrafts[currentPlayerId]`.
    *   If no entry exists for the player, initialize it with default empty values.

3.  **Persistence Actions:**
    *   Create actions: `updateDraft(playerId, data)` and `clearDraft(playerId)`.
    *   Call `updateDraft` `onChange` instead of `setLocalState`.
    *   Call `clearDraft` only when the user explicitly saves/commits the element card.

## Migration / Patch Notes
*   **Files Affected:** `src/stores/gameStore.ts`, `src/components/era-interfaces/EraCreationContent.tsx`, `src/hooks/useEraCreationState.ts` (likely to be deprecated or refactored).
*   **Refactoring:** The `useEraCreationState` hook should be rewritten to act as a selector for the global store rather than a local state manager.

## Optional Test Scenarios
1.  **Player Switch:** Select 3 geography features as Player 1. Switch to Player 2. Switch back to Player 1. The 3 features must still be selected.
2.  **View Switch:** Select features. Navigate to "Element Manager" (unmounting the Era view). Navigate back to "Rulebook". The features must still be selected.
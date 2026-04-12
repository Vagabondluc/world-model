# State Management Audit

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


**Date:** 2024-06-16
**Objective:** To audit the codebase for remnants of legacy state management patterns (`useReducer`, `useContext` for state, excessive `useState` prop-drilling) following the migration to Zustand, as specified in `docs/decisions.md` (DEC-001, DEC-008).

---

## Executive Summary

The migration to Zustand has been **highly successful and thorough**. The codebase demonstrates a strong adherence to the new architecture. Global and cross-component state is consistently managed by Zustand stores. The use of React's local state (`useState`, `useRef`) is almost universally restricted to its intended purpose: managing transient, component-local UI state such as form inputs, modal visibility, and loading flags for self-contained actions.

No instances of the legacy `useReducer` or a global `useContext`-based state provider were found in active components. The only true remnants are obsolete, empty files that have been marked for deletion.

---

## File-by-File Analysis

### 1. Global Stores (`/stores/`)

*   **Status:** ✅ **PASS**
*   **Files:** `campaignStore.ts`, `locationStore.ts`, `compendiumStore.ts`, `workflowStore.ts`, etc.
*   **Analysis:** These files correctly define the application's global state using Zustand. They are the target architecture.

### 2. Obsolete State Management Files

*   **Status:** ⚠️ **REMNANT (Marked for Deletion)**
*   **Files:**
    *   `context/AdventureContext.tsx`
    *   `reducers/adventureReducer.ts`
    *   `hooks/useAdventureState.ts`
    *   `hooks/useAdventureHandlers.ts`
*   **Analysis:** These files are empty placeholders from the previous Context/Reducer architecture. They are not imported or used by any active components and represent the primary "remnants" of the old system. They should be deleted to finalize the cleanup.

### 3. Core Application (`/index.tsx`, `/components/common/AppLayout.tsx`)

*   **Status:** ✅ **PASS**
*   **Analysis:** `index.tsx` uses `useState` correctly for the initial `isHydrating` flag, which is a perfect use case for local component state. All other state (active view, drawers, system messages) is correctly sourced from Zustand stores. The `AppLayout` is a clean, state-less container.

### 4. Components Using Local State (`useState`)

The following components correctly use `useState` for transient, non-shared UI state. This is considered a **best practice**, not a remnant.

*   `components/campaign/CampaignManager.tsx`: `useState` for `activeTab`.
*   `components/adventure/steps/HooksStep.tsx`: `useState` for `showTable` (modal visibility).
*   `components/compendium/CompendiumManager.tsx` & `hooks/useCompendiumManagerLogic.ts`: `useState` for form/modal visibility and the currently selected item for editing (`isFormOpen`, `editingEntry`, `activeTab`).
*   `components/location/LocationManager.tsx` & `hooks/useLocationManagerLogic.ts`: `useState` for selection state (`selectedLocation`) and modal visibility.
*   `components/bestiary/BestiaryView.tsx` & `hooks/useBestiaryLogic.ts`: `useState` for all filter values, search query, and view mode. This is an acceptable pattern for a self-contained, complex view.
*   `components/trap/TrapGeneratorView.tsx`: `useState` for the generated `trap` object. Acceptable for a self-contained generator tool.
*   `components/encounter/InitiativeTracker.tsx`: `useState` for the loot modal state. All core combat data is in `useEncounterStore`.
*   `components/tavern/*.tsx`: All Tavern panels correctly use `useState` for their local form inputs before dispatching actions to `useTavernStore`.
*   `components/common/Modal.tsx`, `components/common/StringListInput.tsx`, `components/ai/ChatInterface.tsx`, etc.: All other minor components use `useState` appropriately for their own internal logic without sharing or prop-drilling.
*   `components/compendium/visual/GraphRenderer.tsx`: Uses `useState` and `useRef` to manage complex, local rendering state (pan, zoom, drag). This is an advanced and correct application of local state for a high-performance canvas component.

### 5. Non-React State Management Concerns

*   **Status:** ℹ️ **NOTE**
*   **Files:** `services/apiKeyManager.ts`
*   **Analysis:** This service uses `localStorage` to persist the API key. While this is a form of state management, it is separate from the React state migration. It is noted as technical debt in `docs/decisions.md` (DEC-034) relative to the project's goal of using environment variables exclusively. It is not, however, a remnant of the old Context/Reducer pattern.

---

## Conclusion

The state management audit confirms that the migration to Zustand has been successfully and comprehensively executed. The application follows modern best practices by using Zustand for global/shared state and `useState` for component-local UI state. The only remaining task is to delete the obsolete and empty files from the old architecture.

# 08_data-integrity.md

## Title
Data Integrity & Session Recovery Repair Specification

## Problem Summary
The application suffers from "Sticky Corruption." Because the Src version persists state to `sessionStorage` without schema validation or versioning, invalid data (from development iteration or bugs) becomes locked in. Unlike the Scaffold version, a browser refresh no longer clears the error state, leaving the user trapped in a broken session.

## Scaffold Working Logic
*   **Mechanism:** State was purely volatile (RAM-only).
*   **Behavior:** A browser refresh acted as a "Hard Reset," clearing all data, errors, and invalid states.
*   **Result:** Users had an always-available, zero-friction recovery mechanism for any runtime error: just press F5.

## Src Broken Logic
*   **Mechanism:** Automated state hydration from `sessionStorage` on mount.
*   **Behavior:** The application attempts to load *any* existing data found in storage, regardless of its validity or schema version.
*   **Result:** 
    *   **Persistence of Bugs:** If a bug corrupts the state, refreshing the page reloads the *corrupted* state, causing the crash to repeat immediately.
    *   **Schema Conflicts:** Changes to the data model in code cause runtime errors when loading old data from storage.

## Proposed Fix
Implement **Schema Versioning** and a **Recovery Fallback** system.

1.  **Store Versioning:**
    *   Add a `version` number to the Zustand persist configuration.
    *   Configure the `migrate` function in Zustand middleware. If the stored version is lower than the current version, flush the storage or run a migration script.

2.  **Hydration Validation:**
    *   In the `onRehydrateStorage` callback, perform a basic sanity check (e.g., "Does `players` exist? Is `currentEra` a valid number?").
    *   If validation fails, silently discard the persisted state and initialize with default values (mimicking the Scaffold's "fresh start").

3.  **Emergency Reset UI:**
    *   Implement a global Error Boundary (or within the Loading Gate from File 04).
    *   If the app crashes during initialization, offer a visible "Reset Game Data" button that clears `sessionStorage` and forces a window reload.

## Migration / Patch Notes
*   **Files Affected:** `src/stores/gameStore.ts`, `src/components/shared/ErrorBoundary.tsx` (or `App.tsx` if inline).
*   **Architectural Goal:** Restore the "Safety Valve" behavior of the Scaffold version while keeping the benefits of persistence for valid sessions.

## Optional Test Scenarios
1.  **Corrupt Data Injection:** Manually edit `sessionStorage` in DevTools to set `players` to `null`. Refresh the page. The app should detect the invalid shape, clear it, and load the Setup screen (not crash).
2.  **Version Bump:** Change the store version in code. Refresh the page with an active game. The app should recognize the version mismatch and reset to a fresh state (or migrate if logic is provided).
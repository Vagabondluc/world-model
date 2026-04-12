# Bug Report Archive
This file contains resolved bugs that have been confirmed as fixed by the user.

---

### BUG-0.0.2-034: Static Content Fails to Load in Deployment (404 Errors)
-   **Status**: Resolved
-   **Resolution**: Fixed in `to_do.md` version `0.0.2` via task `TODO-0.0.2-034`.
-   **User Confirmation**: Confirmed via debug log analysis.
-   **Details**: User provided debug logs from both local and deployment environments. The logs confirm that the hybrid fallback system is working as designed.
    -   **Local Environment**: Successfully serves files via `fetch`.
    -   **Deployment Environment**: Fails to `fetch` with 404 errors, but correctly falls back to `bundled` content from `referenceTables.ts`, ensuring the application remains fully functional.
-   **Conclusion**: The code-level fix is successful. The root cause of the 404s is a server configuration issue with Google Cloud Run, as documented in `docs/current/google_cloud_run_guidelines.md`. The bug is considered resolved.

---

### BUG-0.0.2-014: Cannot Edit Completed Faction Prosperity
-   **Status**: Resolved
-   **Resolution**: Fixed in `to_do.md` version `0.0.2` via task `TODO-0.0.2-018`.
-   **Details**: The `ProsperityDeveloper.tsx` component was updated to include an "Edit" button that toggles the form's visibility, allowing users to modify their faction's industry details after initial creation.

---

### BUG-0.0.2-013: Prepopulated Elements Not Visible in Era Sidebars
-   **Status**: Resolved
-   **Resolution**: Fixed in `to_do.md` version `0.0.2` via task `TODO-0.0.2-018`.
-   **Details**: The `!e.isDebug` and `!el.isDebug` filters were removed from the element queries in all six `Era*Content.tsx` components. This ensures that elements created via the debug panel are correctly displayed in the "Your Creations" sidebar during gameplay.

---

### BATCH ARCHIVE (v0.0.2 Cleanup)
The following bugs were resolved as part of the major component and rulebook refactoring efforts (`TODO-0.0.2-014`, `TODO-0.0.2-015`, `TODO-0.0.2-028`).

- **BUG-0.0.2-001: Navigation Pattern Inconsistency**
  - **Status**: Resolved
  - **Resolution**: Fixed in `to_do.md` v0.0.2 via `TODO-0.0.2-015`. All eras now use the standardized `EraLayoutContainer`.

- **BUG-0.0.2-002: Observer Mode Code Duplication**
  - **Status**: Resolved
  - **Resolution**: Fixed in `to_do.md` v0.0.2 via `TODO-0.0.2-015`. A shared `ObserverMode.tsx` component was created.

- **BUG-0.0.2-003: Progress Tracking Component Proliferation**
  - **Status**: Resolved
  - **Resolution**: Fixed in `to_do.md` v0.0.2 via `TODO-0.0.2-015`. A standardized `StepProgressBar.tsx` is now used across all multi-step eras.

- **BUG-0.0.2-004: State Management Pattern Inconsistency**
  - **Status**: Resolved
  - **Resolution**: Fixed in `to_do.md` v0.0.2 via `TODO-0.0.2-015`. UI state is now consistently managed via the `eraUiState` object in `GameContext`.

- **BUG-0.0.2-005: CSS Class Duplication**
  - **Status**: Resolved
  - **Resolution**: Fixed in `to_do.md` v0.0.2 via `TODO-0.0.2-015`. All custom tab styling was removed and replaced by the unified `EraLayoutContainer`.

- **BUG-0.0.2-006: Event Handling Inconsistency**
  - **Status**: Resolved
  - **Resolution**: Fixed in `to_do.md` v0.0.2 via `TODO-0.0.2-014`. The unified `RulesContainer.tsx` and component-based rulebooks provide a single, consistent event handling mechanism.

- **BUG-0.0.2-007: Prop Naming Inconsistency**
  - **Status**: Resolved
  - **Resolution**: Fixed in `to_do.md` v0.0.2 via `TODO-0.0.2-015`. Prop names for shared functionalities like exports have been standardized across all era components.

- **BUG-0.0.2-008: Loading/Error State Implementation Inconsistency**
  - **Status**: Resolved
  - **Resolution**: Fixed in `to_do.md` v0.0.2 via `TODO-0.0.2-015`. Shared `LoadingSpinner.tsx` and `ErrorAlert.tsx` components are now used more consistently.

- **BUG-0.0.2-012: Component Stylesheet Fails to Load (404 Error)**
  - **Status**: Resolved
  - **Resolution**: Fixed in `to_do.md` v0.0.2 via `TODO-0.0.2-028`. The architecture was changed to inline all component styles into `index.html`, eliminating the external file dependency.

- **BUG-0.0.2-009, -010, -011 (Secondary Uniformity Issues)**
  - **Status**: Resolved
  - **Resolution**: These minor consistency issues (import patterns, prop requirements, modal handling) were resolved during the major `TODO-0.0.2-015` refactor.

---

### BUG-0.0.1-002
-   **Reported Issue:** [SUPERSEDED BY BUG-0.0.2-001] The UI layout and interaction patterns are inconsistent across Eras I, II, III, and IV.
-   **Status:** Closed - Superseded
-   **Notes:** Replaced by more specific uniformity bugs in version 0.0.2 for better tracking and resolution.

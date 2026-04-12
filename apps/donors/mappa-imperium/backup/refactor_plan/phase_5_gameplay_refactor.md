
# Refactor Plan - Phase 5: Gameplay Interfaces & Forms

**Goal:** Systematically refactor each era's gameplay interface to use the new architecture, replacing custom form logic with `react-hook-form` and modularizing services.

---

### AI Action Steps (Iterative):

This phase is best done one era at a time. When you're ready, say **"Let's refactor Era [Number]."** For each era, I will provide the code for the following:

1.  **Refactor Era Content Component (e.g., `EraFoundationContent.tsx`):**
    *   Remove any remaining `useGame()` hook calls.
    *   Fetch all necessary data (`currentPlayer`, `elements`, `eraUiState`) directly from the `useGameStore` hook.
    *   Update all action handlers to call functions directly on the store (e.g., `useGameStore.getState().createElement(...)`).

2.  **Refactor Forms:**
    *   I will replace the existing form logic (using `useState` for each field) in components like `FactionForm.tsx` and `DeityCreatorForm.tsx` with `react-hook-form`.
    *   This will centralize form state, streamline validation, and improve performance.

3.  **Refactor Services:**
    *   The `AIContext.tsx` will be refactored into a more modular `src/services/aiService.ts`.
    *   The service's state (`isLoading`, `error`) can be managed within a separate Zustand store (`uiStore.ts`) or within the component, simplifying the component tree.

---

### Stop Point & Verification

After each era is refactored, it should be fully functional and testable within the new architecture.

**Before we proceed to the next era, please confirm:**

1.  Is the gameplay interface for the refactored era fully functional?
2.  Are the forms within that era using `react-hook-form` correctly?
3.  Does the debug menu still accurately reflect the state changes made in the newly refactored era?
4.  Are you ready to move on to the next era or to the final cleanup phase?

When all eras are complete, say **"Let's start Phase 6."**
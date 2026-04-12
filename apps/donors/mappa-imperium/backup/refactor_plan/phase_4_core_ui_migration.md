
# Refactor Plan - Phase 4: Core UI & Session Flow Migration

**Goal:** Rewrite the main application components (`App.tsx`, `AppLayout`, session components) to use the new Zustand store, completely eliminating prop-drilling and the old `GameContext`.

---

### AI Action Steps:

When you are ready, say **"Let's start Phase 4."** I will then provide the code for the following:

1.  **Refactor `App.tsx`:** I will rewrite the main app component to be the top-level view controller, reading `gameState` directly from the Zustand store instead of from a context provider.
2.  **Refactor Session Components:** I will update `GameSetup.tsx`, `AiPlayerSetup.tsx`, and `PlayerSelection.tsx` to call actions directly on the Zustand store (e.g., `useGameStore.getState().startGame(...)`) instead of using prop-based callbacks like `onStart` or `onComplete`.
3.  **Refactor `AppLayout.tsx`:** I will convert it into a pure layout component. Its children (like `NavigationHeader` and `EraContent`) will be refactored to pull their own data directly from the store, removing dozens of props from `AppLayout`.

---

### Stop Point & Verification

After this phase, the application's entire session flow, from setup to the main game layout, will be running on the new Zustand state management system.

**Before we proceed, please confirm:**

1.  Can you start a new game, configure AI players (if applicable), select a player, and enter the main `AppLayout`?
2.  Is the old `GameContext.tsx` file no longer being imported or used by any of the core session or layout components?
3.  Are you ready to begin refactoring the individual era gameplay interfaces?

When you're ready, say **"Let's start Phase 5."**
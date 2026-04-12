
# Refactor Plan - Phase 2: State Management & Core Data

**Goal:** Port the essential data types and replace the monolithic `GameContext` with a clean, modular Zustand store.

---

### AI Action Steps:

When you are ready, say **"Let's start Phase 2."** I will then provide the code for the following:

1.  **Migrate Foundational Code:** I will provide the refactored `src/types.ts` and `src/data/eras.ts` files. This creates the data foundation for the entire application.
2.  **Create Zustand Store:** I will create a new directory `src/stores/` and the file `gameStore.ts` inside it. This store will be based on the architecture in your "Complete React Best Practices" guide and will manage all core game state.
3.  **Implement Store Logic:** I will translate the core state and handlers from the old `GameContext.tsx` into actions within the Zustand store.

---

### Stop Point & Verification

After I provide the files and you place them in your project, the application should still run without errors. The new store will not be connected to the UI yet.

**Before we proceed, please confirm:**

1.  Does the `src/stores/gameStore.ts` file exist and contain the core game logic?
2.  Has the `src/types.ts` file been updated with all the necessary interfaces from the old project?
3.  Are you ready to re-implement the Debug System using this new state store?

When you're ready, say **"Let's start Phase 3."**
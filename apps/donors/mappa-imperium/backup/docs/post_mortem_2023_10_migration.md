# Post-Mortem Analysis: The "Scaffold Migration" Failure

**Date:** October 2023
**Incident:** Application Crash during Root Migration
**Severity:** Critical (Runtime Error)

---

## 1. Incident Summary

An attempt was made to migrate the application structure from a nested `scafold/src/` directory to a clean root `src/` directory. This "Big Bang" migration resulted in a critical runtime error: `Uncaught TypeError: Failed to resolve module specifier...`, specifically targeting the `websocketService`. The error persisted even after logic deactivation because the module loader failed before code execution began.

## 2. The Root Cause: Alias vs. Relative Path Mismatch

The primary failure was a disconnection between **where the files were moved** and **how they referenced each other**.

*   **The Setup:** The original project used a path alias (`@/`) defined in `vite.config.ts` or `tsconfig.json` that pointed to `scafold/src`.
*   **The Move:** When files were moved to the root `src/`, the import paths inside those files were not updated. They likely still attempted to import from `@/services/...` or used relative paths that broke when the nesting level changed.
*   **The Break:** The build tool (Vite) and the browser could no longer resolve `@` to the correct location because the configuration wasn't updated to match the new file structure.

## 3. Why "Deactivating" Didn't Work

We attempted to fix the error by commenting out the *usage* of the websocket (e.g., `// websocketService.connect()`). However, the error persisted.

*   **Reason:** In modern JavaScript/TypeScript modules, **imports are hoisted and resolved statically**.
*   **The Trap:** Even if you comment out the *usage* of a variable, if the `import { websocketService } from ...` line remains at the top of the file with an invalid path, the browser/bundler crashes **before** it executes a single line of code. It fails during the "Module Resolution" phase, not the "Execution" phase.

## 4. The "Big Bang" Refactor Risk

The strategy used was a "Big Bang" migration—moving `index.tsx`, contexts, components, and utils all at once.

*   **High Blast Radius:** Because `GameContext` (the heart of the app) imports `websocketService`, and `index.tsx` imports `GameContext`, a single path error in the service layer broke the entire dependency tree immediately.
*   **Diagnosis Difficulty:** With hundreds of files moving simultaneously, pinpointing which specific import path (relative vs. alias) was breaking became difficult, leading to the "invalid reference" loop.

## 5. Corrective Action Plan (Future Protocol)

To successfully perform this type of migration without crashing the app, we must follow these steps in order:

**Step 1: Update Build Configuration First**
Before moving a single file, update `vite.config.ts` and `tsconfig.json` to ensure aliases point to the *future* location, or decide to strictly use relative paths.

**Step 2: The "Skeleton" Move**
1.  Create the new `src/` directory structure.
2.  Move **only** `types.ts`, `utils/`, and `services/` (leaf nodes) first.
3.  **Verify** these files don't have broken internal imports.

**Step 3: The "Heart" Move**
1.  Move `stores/` (or `contexts/`).
2.  **Crucial Step:** Manually update the imports in `GameContext.tsx` to point to the new location of services.

**Step 4: The Component Migration**
Move components in batches. Start with leaf components (buttons, cards) and move up to container components (`AppLayout`, `GameSetup`).

## 6. Conclusion

The application didn't break because of *bad code logic*; it broke because of **broken addresses**. The file system changed, but the map (the import statements) didn't update to reflect the new terrain. Future refactors must prioritize updating build configurations and checking import paths immediately upon moving files.

# Refactor Plan - Phase 3: Re-implementing the Debug System

**Goal:** Rebuild the modular debug system as the first major feature, using the new Zustand store. This provides a tangible tool and a feedback mechanism for the rest of the migration.

---

### AI Action Steps:

When you are ready, say **"Let's start Phase 3."** I will then provide the code for the following:

1.  **Build the Debug System Shell:** I will create the new file structure under `src/components/debug/` as outlined in your `to_do_PRIORITY.md`. This will include the main `UnifiedDebugSystem.tsx`, and the new `hooks`, `tabs`, `utils`, and `types` sub-folders with their initial files.
2.  **Implement Debug Hooks:** I will write the logic inside each of the debug hooks (`useFileHealthCheck`, `usePerformanceMetrics`, etc.) to gather real data about the application.
3.  **Implement Debug UI:** I will build the tab components (`OverviewTab.tsx`, etc.), co-locating small, single-use display components inside them to keep the file structure clean.
4.  **Connect to App State:** The `GameToolsTab` will be wired up to the new Zustand store, allowing it to manipulate game state for testing purposes.
5.  **Integrate into App:** I will update `App.tsx` to include the `UnifiedDebugSystem` and a mechanism to toggle its visibility.

---

### Stop Point & Verification

After you add the new files, the debug menu should be fully functional in the new application.

**Before we proceed, please confirm:**

1.  Can you open and close the debug menu (e.g., with a button or shortcut)?
2.  Do the various tabs (Overview, File Health, etc.) display data correctly?
3.  Does the "Game Tools" tab successfully interact with and modify the application's state via the Zustand store?
4.  Are you ready to refactor the main UI and session flow?

When you're ready, say **"Let's start Phase 4."**
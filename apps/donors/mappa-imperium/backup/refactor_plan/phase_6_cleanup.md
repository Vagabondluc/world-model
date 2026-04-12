
# Refactor Plan - Phase 6: Final Cleanup & Verification

**Goal:** Finalize the refactor by removing all old code, performing a full audit of the new system, and ensuring the application is production-ready.

---

### AI Action Steps:

When you are ready, say **"Let's start Phase 6."** I will then assist with the following:

1.  **Delete Old Files:** I will identify all old context files (`GameContext.tsx`, `EraCreationContext.tsx`, etc.) and any other obsolete components, and instruct you to delete them.
2.  **Full Code Audit:** I can help you perform a project-wide search for any remaining usage of the old `useGame` hook, legacy patterns, or incorrect imports and provide the corrected code.
3.  **Production Build Test:** We will run `npm run build` to confirm the application builds successfully without errors, producing an optimized set of files in the `/dist` directory.
4.  **Final Documentation Update:** I will help you update all relevant documents in `/docs/current/` (especially `current_architecture_overview.md` and `source_code_organization.md`) to reflect the new, final architecture.

---

### Stop Point & Verification

This is the final phase. Once complete, your refactor is finished.

**Please confirm the following to mark the project as complete:**

1.  Have all obsolete files been deleted from the project?
2.  Does the application build successfully for production using `npm run build`?
3.  Have the project's core documentation files been updated to reflect the new architecture?
4.  Is the application fully functional and ready for the next stage of development?
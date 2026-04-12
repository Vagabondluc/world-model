# Bug Report Log  
**Version: 0.0.2**  
This file records **user grievances** and tracks their resolution status.  
Bugs are logged here, confirmed by users, and moved into `/docs/bug_archive/` once resolved.  

---

## Recurring Instructions (Do Not Remove)

1. **Bug ID Rules**
   - Each bug entry must have a unique identifier.  
   - Format: `BUG-[VERSION]-[SEQUENTIAL NUMBER]`.  
     Example: `BUG-0.0.2-001`.  

2. **User Confirmation**
   - The AI must always ask the user whether the reported issue has been resolved.  
   - If the user confirms **YES**, the bug is moved into `/docs/bug_archive/`.  
   - The resolved bug must link back to the version of `to_do.md` that addressed it.  

3. **Version Linkage**
   - Each bug entry must specify the **to_do.md version** where it is expected to be resolved.  
   - Once resolved, the archived bug includes this linkage for tracking.  

4. **Self-Cleaning**
   - This file does **not** reset like `to_do.md`.  
   - Instead, when too large (200 lines), move oldest closed bugs into `/docs/bug_archive/` and keep only active or recently closed ones here.  

---

## Platform-Related Architectural Notes

This section provides context on issues whose resolution was constrained by the limitations of the development environment (e.g., Google AI Studio's read-only file system). The fixes implemented are robust workarounds, but the true, long-term solution for these issues is the architectural refactor tracked in the to-do list.

-   **Context on Styling Workarounds**: The resolution for past CSS 404 errors was to move all styles inline into `index.html`. While this completely fixes the 404 issue within the current environment, it is an architectural compromise. The proper, professional solution is to implement a build step that generates an optimized CSS file, which can then be served reliably. This long-term fix is tracked as **TODO-0.0.2-035**.

---

## Active Critical Bugs

- **BUG-0.0.2-030: UI Flickering on View Changes**
  **Reported Issue:** The entire page flickers when switching between views, especially to a view with little content (e.g., an empty era). The root cause was a race condition between the key-based animation trigger and React's `useTransition`.
  **Code Location:** `AppLayout.tsx`, `GameContext.tsx`
  **Linked Fix:** TODO-0.0.2-031
  **Status:** Resolved
  **Impact:** High - Severe degradation of user experience.

- **BUG-0.0.2-031: Collapsible Rulebook Sections Not Working**
  **Reported Issue:** After a failed attempt to add animations, the `<details>` elements used for collapsible sections in the AI generation forms are no longer expanding or collapsing correctly.
  **Code Location:** `AIGenerationSection.tsx`, `index.html` (erroneous styles)
  **Linked Fix:** TODO-0.0.2-032
  **Status:** Not started
  **Impact:** High - Prevents access to AI generation tools.

- **BUG-0.0.2-032: Year-per-turn logic is broken**
  **Reported Issue:** The in-game turn calculation does not correctly reflect the total years calculated and displayed on the initial setup screen. The logic for advancing years per era is disconnected from the setup configuration.
  **Code Location:** `src/utils/timelineCalculator.ts`, `src/components/layout/CompletionTracker.tsx`
  **Linked Fix:** TODO-0.0.2-033
  **Status:** Not started
  **Impact:** Critical - Breaks core game timeline progression.
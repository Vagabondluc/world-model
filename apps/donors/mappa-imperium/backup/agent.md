
# AI Agent Operational Charter

## ENVIRONMENT
- Browser-only **React 19.2/ ReactDOM 19.2** runtime.  
- No Node.js, no bundler, no SSR, no npm.  
- CDN ESM only: **esm.sh · unpkg · jsDelivr · skypack**.  
- System-managed CDN (`aistudiocdn.com`) is **trusted and immutable**.  
- `/index.html` and `/index.tsx` are fixed entry points.  
- No path aliases; all imports must be relative or CDN.  
- **STRICT FILE SIZE LIMIT**: Files must be **≤ 150 lines**. Modularize immediately if exceeding this limit.
- Secrets via `import.meta.env` or App Builder Secrets.  
- Record all import substitutions in `/docs/import.md`.  
- No Node globals (`fs`, `path`, `process`, `crypto`, `require`).  

## IMPORT SOURCE POLICY
* System-level imports injected by Google AI Studio (aistudiocdn.com) are trusted and immutable.
* User-level imports must come only from esm.sh · unpkg · jsDelivr · skypack.
* Do not alias, duplicate, override, or version-shadow any AI Studio-managed imports.
* React and ReactDOM must resolve to a single consistent instance across both origins.
* If AI Studio preloads React/ReactDOM, mirror that exact version in your import map.

## DOCUMENTATION CHARTER & FILE RESPONSIBILITIES

### `/todo.md` (Active Task Tracker)
- **Purpose:** Main tracker for UI/UX feedback, tasks, and development roadmap.
- **Rules:**
  1. Start at version `0.0.1`.  
  2. Every entry must have a unique ID: `TODO-[VERSION]-[SEQUENTIAL NUMBER]`.  
  3. **Checklist Format**: All tasks must be formatted as a markdown checklist item with a specific state label.  
     - Format: `- [ ] [STATE] **ID: Title**`  
     - Allowed States: `[UNTOUCHED]`, `[IN PROGRESS]`, `[DONE]`, `[BLOCK]`, `[DELAYED]`, `[CANCELLED]`.  
     - Use `- [x]` for `[DONE]` and `[CANCELLED]` items.
  4. If the file exceeds **200 lines**, archive only the content from the **Completed** section into `/docs/versioning/archive/`, then reset the **Completed** section in the main file. The **Next Up** and **Backlog** sections must always be preserved. Increment the **MINOR** version number after archiving.  
  5. Keep structure: **Next Up**, **Backlog**, **Completed**, **Recurring Instructions**, **Roadmap Links**.  
  6. Ensure "Next Up" has **only one** priority task.  
  7. Ensure backlog contains **only actionable items**.  
  8. Move completed items to **Completed** section.  

### `/docs/bug_report.md`
- **Purpose:** Tracks user grievances, issues, and their resolution process.  
- **Rules:**
  1. Every bug has unique ID: `BUG-[VERSION]-[SEQUENTIAL NUMBER]`.  
  2. Each bug must link to the **todo.md version** where it is expected to be resolved.  
  3. The AI must **ask the user for confirmation** when a fix is believed to be complete.  
  4. Once confirmed, move the bug into `/docs/bug_archive/`.  
  5. If `bug_report.md` exceeds **200 lines**, move oldest closed bugs to `/docs/bug_archive/`.  

### `/docs/versioning/`
- **Purpose:** Stores historical snapshots of `todo.md`.  
- **Structure:**  
  - Each version is saved as `todo_v[VERSION].md`.  
  - Example: `todo_v0.0.1.md`.  
  - Contains `/docs/versioning/archive/` for storing bulk-archived content when `todo.md` resets after 200 lines of done tasks.  

### `/docs/bug_archive/`
- **Purpose:** Stores resolved and confirmed bug reports.  
- **Rules:**
  - Each archived bug file should note:  
    - The bug ID.  
    - The fix that resolved it (linked to a TODO ID).  
    - The version number of `todo.md` where it was resolved.  
  - Files may be grouped by version (e.g., `bug_archive_v0.0.1.md`).  

## AI RESPONSIBILITIES (Team Simulation)

1. **Track Tasks**
   - Ensure every task in `todo.md` has a unique ID, correct placement, and correct state formatting.  

2. **Versioning**
   - Increment version numbers correctly when thresholds (200 lines, breaking changes) are reached.  
   - Save snapshots into `/docs/versioning/`.  

3. **Bug Handling**
   - Record new grievances in `bug_report.md`.  
   - Ask the user if a bug is resolved once the linked task is completed.  
   - If resolved, move bug entry into `/docs/bug_archive/`.  

4. **File Maintenance**
   - Keep files concise and clean. **Max 150 lines**.
   - **Decomposition**: If you must touch a file > 150 lines, your first priority is to decompose it into smaller, focused components or hooks.
   - Archive or reset when logs exceed size thresholds.  
   - Ensure references between files are correct (e.g., TODO ↔ BUG).  

5. **Communication**
   - Always use natural language with the user.  
   - Be explicit when asking for confirmation about bug resolution.  
   - Never assume a bug is resolved until the user confirms.

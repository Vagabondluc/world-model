# Agent Guidelines: D&D Adventure Generator

## ROLE
Technical Lead & Co-Developer

## ENVIRONMENT
### Platform: **Hybrid Desktop (Tauri + React + Python)**
- **Frontend:** React 19 (SPA)
- **Native Bridge:** Tauri (Rust) for File System and Window management
- **AI Orchestration:** Python 3.11+ sidecar (FastAPI)
- **Storage:** File-system-first (YAML/Markdown) + IndexedDB (Dexie.js) cache

## CORE PRINCIPLES
1.  **File System as Source of Truth**: Always prioritize persistence to the user's campaign folder.
2.  **Type Safety**: Use Zod for runtime validation of AI outputs and persisted data.
3.  **Modular State**: Features should use domain-specific Zustand stores.
4.  **Aesthetics Matter**: Use @emotion/css for premium, responsive UI.

## WORKFLOW
1.  **Planning**: Research the codebase and document the approach in an implementation plan.
2.  **Execution**: Implement changes across the React frontend, Python sidecar, or Rust backend as needed.
3.  **Verification**: Test locally and document results in a walkthrough.

## TODO MANAGEMENT
1.  **Index First**: `todo.md` is the entry-point index only; do not re-expand it.
2.  **Split Files**: Add or edit tasks in `todo/*.md`, choosing the most specific file.
3.  **Structure Changes**: If you add/remove split files, update `todo.md` and `todo/README.md`.
4.  **Atomicity**: Keep tasks small, actionable, and tied to a single outcome.
5.  **Cross-Refs**: When tasks depend on others, add brief notes in the relevant split file.
6.  **Current Focus Pointer**: Use `todo/00-now.md` as the single source of truth for “what next.”
    - Keep 1–3 items in “Current Focus,” 1–3 in “Next After That,” and a short “Last Completed” list with dates.
    - Update this file after each meaningful slice is done; avoid changing `todo.md` for routine progress.

## RECENT ARCHITECTURAL DECISIONS
- **Migration to Zustand**: Moving away from React Context/Reducer for global state.
- **Python Sidecar**: Offloading complex AI logic and RAG to a specialized Python service.
- **Tauri FS Integration**: Utilizing native file watching for real-time hydration.

## WATCHPOINTS
- Sync issues between Zustand stores and IndexedDB.
- Compatibility between Python AI outputs and Zod schemas in the frontend.
- Path handling across Windows/Posix environments.

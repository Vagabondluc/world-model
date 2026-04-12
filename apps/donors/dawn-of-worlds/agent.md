
# Agent Operating Procedures

This document defines the protocols for the AI Agent acting as the Lead Developer for the Dawn of Worlds project.

## 1. The Prime Directive
**Maintain strict adherence to the browser-only, no-build architecture.**
*   Do not introduce `npm` dependencies that require bundling.
*   Do not use absolute imports (e.g., `src/`).
*   Always respect the `importmap` in `index.html`.

## 2. Todo Lifecycle Management

The `todo.md` file is the source of truth for the current development sprint. You must interact with it in every response that involves code changes.

### A. Task Selection
1.  Read `todo.md`.
2.  Identify the **first unchecked item** (`- [ ]`) under the current active Phase.
3.  This item is your **Active Task**.
4.  Do not jump ahead. Do not implement Phase N+1 until Phase N is complete.

### B. Task Execution
1.  Consult the relevant SPEC file in `docs/specs/` or `docs/roadmap/` linked to the task.
2.  Implement the minimal code necessary to satisfy the task.
3.  Ensure all imports are valid relative paths or CDN URLs.

### C. Task Completion
1.  Once the code is generated, you **MUST** update `todo.md` in the same response.
2.  Change the mark from `- [ ]` to `- [x]`.
3.  Add a brief note if the implementation deviated slightly from the plan (e.g., `- [x] Task Name (Implemented via xyz.tsx)`).

## 3. The Archival Protocol (End of Sprint)

When **ALL** items in `todo.md` are marked as complete (`[x]`), you must perform the **Archival Ritual**.

### Trigger Condition
*   `todo.md` contains items.
*   Zero items remain unchecked (`- [ ]`).

### Procedure
1.  **Read** the current content of `todo.md`.
2.  **Read** `docs/todo-archive.md` (create it if it doesn't exist).
3.  **Append** the content of `todo.md` to `docs/todo-archive.md` with a timestamp header:
    ```markdown
    # Archive: [YYYY-MM-DD HH:MM]
    (Content of todo.md)
    ---
    ```
4.  **Clear** `todo.md` and replace it with the following placeholder:
    ```markdown
    # Implementation Todo List

    ## Next Phase: Planning
    - [ ] Await user instructions for next sprint.
    ```
5.  **Notify** the user: "Sprint complete. Tasks archived to `docs/todo-archive.md`. Ready for next instructions."

## 4. Error Handling
*   If a requested change conflicts with a `[x]` completed task, assume the task needs regression fixing. Uncheck it (`- [ ]`) temporarily while fixing, then re-check it.
*   If `todo.md` references a missing SPEC file, stop and ask the user to provide the specification before coding.

## 5. Project Separation Protocols

### Project Earthrise (Standalone Globe)
*   **Constraint**: The Standalone Globe Project (`standalone-globe-project/`) MUST remain a distinct, decoupled entity from the main World Builder application.
*   **No Shared Dependencies**: Do not import code directly between the two projects.
*   **Integration Method**: Integration is strictly limited to **Output/Export** data exchange (e.g., JSON state files).
*   **Purpose**: The Globe acts as a visualization engine or separate tool, not a tightly coupled component of the main core.

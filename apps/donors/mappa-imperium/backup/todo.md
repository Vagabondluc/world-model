# To-Do List & Task Tracker
**Version: 0.5.1**  
This is the active task management system for the Mappa Imperium refactor. Tasks are organized by priority.

---

## Recurring Instructions (Do Not Remove)

1. **Task ID Rules**
   - Each task must have a unique identifier.
   - Format: `TODO-[VERSION]-[SEQUENTIAL NUMBER]`. Example: `TODO-0.4.0-001`.

2. **Self-Cleaning & Versioning**
   - If this file exceeds **200 lines**, archive the content from the **Completed** section into `/docs/archive/`.
   - After archiving, reset the **Completed** section in this file and increment the **MINOR** version number (e.g., `0.4.0` -> `0.5.0`).
   - The **Next Up** and **Backlog** sections must always be preserved.

3. **Priority Management**
   - The "Next Up" section should contain only **one** priority task.
   - When a task is completed, move it to the "Completed" section and promote the next task from the "Backlog" to "Next Up".

---

## Next Up

- **TODO-0.5.1-007: Phase 6: Final Cleanup & Verification**
  **Description**: Finalize the refactor by removing all old code, performing a full audit, running a production build test, and updating all documentation to reflect the new architecture.
  **Reference**: `/refactor_plan/phase_6_cleanup.md`
  **Status**: Not started.

---

## Backlog

### High Priority (Critical Bugs)
- **TODO-0.5.1-008: Fix Collapsible Rulebook Sections**
  **Description**: The `<details>` elements used for AI generation forms are broken or unresponsive. Ensure they expand/collapse correctly and fix any styling issues causing layout shifts.
  **Reference**: BUG-0.0.2-031
  **Status**: Not started.

---

## Completed

- **TODO-0.5.1-009: Fix Year-per-turn Logic**
  **Description**: Corrected the hardcoded Era 3 duration in `timelineCalculator.ts` and centralized `TURNS_PER_ERA` logic to ensure consistent timeline calculations across the app.
  **Reference**: BUG-0.0.2-032
  **Status**: Completed.

- **TODO-0.4.0-005: Phase 5: Gameplay Interfaces & Forms**
  **Description**: Systematically refactor each era's gameplay interface (Eras I-VI) to use the new architecture, replacing custom form logic with a standardized approach and modular services.
  **Reference**: `/refactor_plan/phase_5_gameplay_refactor.md`
  **Status**: Completed.

- **TODO-0.3.0-004: Phase 4: Core UI & Session Flow Migration**
  **Description**: Rewrite the main application components (`App.tsx`, `AppLayout`, `GameSetup`, `PlayerSelection`, etc.) to use the new Zustand store, completely eliminating prop-drilling.
  **Reference**: `/refactor_plan/phase_4_core_ui_migration.md`
  **Status**: Completed.

- **TODO-0.3.0-003: Phase 3: Re-implementing the Debug System**
  **Description**: Rebuild the modular debug system as the first major feature on the new architecture. This involves creating the new `src/components/debug/` structure with its hooks, tabs, and utilities, and connecting it to the Zustand store.
  **Reference**: `/refactor_plan/phase_3_debug_system.md`
  **Status**: Completed.

- **TODO-0.2.0-002: Phase 2: State Management & Core Data**
  **Description**: Port the essential data types from `types.ts` and replace the old `GameContext` with a clean, modular Zustand store located in `src/stores/gameStore.ts`.
  **Reference**: `/refactor_plan/phase_2_state_management.md`
  **Status**: Completed.

- **TODO-0.1.0-001: Phase 1: Project Scaffolding & Foundation**
  **Description**: Establish a clean, professional React/Vite/TypeScript project foundation. This includes configuring Tailwind, build tools, path aliasing, and creating the initial `index.html` and `App.tsx` shell for the new application.
  **Reference**: `/refactor_plan/phase_1_scaffolding.md`
  **Status**: Completed.

---

## Roadmap Links

-   [Detailed Refactor Plan](/refactor_plan/)
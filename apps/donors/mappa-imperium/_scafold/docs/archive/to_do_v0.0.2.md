# To-Do List & Task Tracker
**Version: 0.0.2**  
This is the active task management system. Tasks are organized by priority and clearly linked to bug reports.

---

## Next Up

- **TODO-0.0.2-033: Fix Broken Year-per-turn Logic**
  **Description**: The year calculation displayed during gameplay does not correctly use the `turnDuration` and game length settings chosen during game setup, leading to an inconsistent timeline. The logic in `timelineCalculator.ts` and `CompletionTracker.tsx` needs to be synchronized with `GameSetup.tsx`.
  **Reference**: BUG-0.0.2-032
  **Status**: Not started.

---

## Backlog

### High Priority (Critical Bugs)
*This section is empty now that the next task has been promoted.*

### Medium Priority (UX & Architectural Debt)
- **TODO-0.0.2-030: Enhance UI/UX with Smooth Transitions and Animations**
  **Description**: The current UI feels "nervous" and abrupt. Implement smooth transitions for a more polished and professional user experience. This should include fade-in/out animations for components loading, smooth transitions for modals, and animated view changes.
  **Reference**: User Feedback
  **Status**: Not started.

- **TODO-0.0.2-041: Ref
# Ambiguity Report: State Migration to Zustand

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## File Information
- **Path:** `docs/specs/state-migration.md`
- **Last Modified:** Not available
- **Related Files:** `docs/specs/persistence.md`, `docs/specs/schema-validation.md`

## Ambiguities Found

### 1. "Unnecessary Renders" Definition
- **Location:** Section 1, Line 6
- **Issue:** The motivation states "Updating one part of `LocationManagerState` re-renders the entire app root" but doesn't specify what constitutes "unnecessary" renders or how to measure/identify them.
- **Impact:** Medium
- **Suggested Resolution:** Define criteria for unnecessary renders (e.g., renders that don't affect visible UI, renders of unchanged data) and provide guidance on optimization.

### 2. Selector Granularity
- **Location:** Section 4, Line 42
- **Issue:** The rule states "Components MUST use selectors to subscribe only to data they need" but doesn't specify selector granularity (field-level, object-level, computed values) or how to enforce this requirement.
- **Impact:** Medium
- **Suggested Resolution:** Define selector best practices (subscribe to specific fields rather than entire objects), provide examples, and specify enforcement mechanism (ESLint, code review).

### 3. Migration Order Dependencies
- **Location:** Section 3, Lines 36-38
- **Issue:** The spec defines three migration phases but doesn't specify if phases must be completed sequentially or if they can be done in parallel, or how to handle partial completion.
- **Impact:** High
- **Suggested Resolution:** Specify migration order requirements (phases must be sequential, each phase must complete before next, rollback strategy for failed phases).

### 4. "No Context" Rule Clarification
- **Location:** Section 4, Line 40
- **Issue:** The rule states "Zustand stores should not be wrapped in React Context" but doesn't explain the rationale or provide examples of what to avoid.
- **Impact:** Low
- **Suggested Resolution:** Explain rationale (performance, simplicity, avoiding prop drilling) and provide examples of incorrect vs. correct usage.

## Vague Requirements

### 1. "Complex Async Logic" Examples
- **Location:** Section 1, Line 7
- **Issue:** The motivation states "Complex Async Logic: Chaining `useAsyncOperation` with context dispatchers is brittle" but doesn't provide specific examples of what makes this brittle or what the alternative should look like.
- **Impact:** Medium
- **Suggested Resolution:** Provide examples of brittle async patterns (nested context updates, error-prone chaining) and show how Zustand actions simplify this.

### 2. Store Slice Definitions
- **Location:** Section 2, Lines 13-34
- **Issue:** The spec defines store slices but doesn't specify the boundaries between slices (what data belongs in which store) or how to handle cross-store dependencies.
- **Impact:** Medium
- **Suggested Resolution:** Define slice boundaries (clear ownership of data domains), specify how to handle cross-store dependencies (store actions, derived state), and provide examples.

### 3. "Ephemeral generation state" Scope
- **Location:** Section 2, Line 29
- **Issue:** The `useGeneratorStore` description states "Ephemeral generation state" but doesn't specify what data is considered ephemeral (current generation only, session-scoped, temporary) vs. persistent.
- **Impact:** Medium
- **Suggested Resolution:** Define ephemeral vs. persistent state criteria (what data persists across sessions vs. what is discarded after generation), and specify lifecycle for ephemeral data.

## Missing Requirements

### 1. Migration Testing Strategy
- **Context:** The spec defines migration phases but doesn't address how to test migrations (unit tests, integration tests, manual testing) or how to verify successful migration.
- **Impact:** High
- **Suggested Addition:** Specify migration testing requirements (automated tests for each phase, manual testing procedures, rollback verification, data integrity checks).

### 2. Rollback Strategy
- **Context:** The spec mentions migration but doesn't address what happens if migration fails or if data is corrupted during migration.
- **Impact:** High
- **Suggested Addition:** Specify rollback strategy (backup before migration, automatic rollback on failure, user notification, data recovery procedures).

### 3. Performance Requirements for Migration
- **Context:** The spec focuses on correctness but doesn't address performance implications of migration, especially for large datasets.
- **Impact:** Medium
- **Suggested Addition:** Specify performance targets (migration time for typical dataset size, UI responsiveness during migration, memory usage limits).

### 4. Data Validation During Migration
- **Context:** The spec doesn't address how to validate data during migration to ensure no data loss or corruption.
- **Impact:** High
- **Suggested Addition:** Specify validation requirements (pre-migration backup, post-migration verification, data integrity checks, user confirmation).

### 5. Cross-Tab State Synchronization
- **Context:** The spec mentions multiple windows but doesn't address how to synchronize Zustand state across multiple browser tabs or windows.
- **Impact:** High
- **Suggested Addition:** Specify cross-tab synchronization strategy (BroadcastChannel, localStorage events, server-side sync) and conflict resolution.

## Inconsistencies

### 1. Store Naming Convention
- **Conflict:** The spec uses `useCampaignStore`, `useLocationStore`, `useGeneratorStore` but doesn't specify if this naming is enforced or if variations are allowed.
- **Locations:** Section 2
- **Impact:** Low
- **Suggested Resolution:** Specify naming convention enforcement (ESLint rule, code review checklist) or clarify if variations are acceptable.

### 2. Action Definition Location
- **Conflict:** The rule states "All state mutations must be defined as actions within the store" but doesn't specify if inline actions are allowed or if all actions must be defined in specific sections.
- **Locations:** Section 4, Line 43
- **Impact:** Low
- **Suggested Resolution:** Clarify action definition requirements (all mutations must be in store actions, no inline mutations in components, define action location within store file).

## Undefined Terms

| Term | Context | Suggested Definition |
|------|---------|----------------------|
| "Prop Drilling" | Section 1, Line 5 | The practice of passing data through multiple layers of components as props, which can become cumbersome and hard to maintain. |
| "Ephemeral" | Section 2, Line 29 | Temporary data that exists only for a short duration (e.g., during a generation process) and is not persisted. |
| "Selector" | Section 4, Line 42 | A function that extracts a subset of state from a Zustand store, allowing components to subscribe only to the data they need. |
| "Slice" | Section 2, Line 15 | A logical grouping of related state and actions within a Zustand store. |
| "Undo/Redo stack" | Section 2, Line 33 | A data structure that stores previous states to allow reverting to earlier states (undo) and reapplying reverted states (redo). |

## Unclear Success Criteria

| Requirement | Current Criteria | Suggested Acceptance Criteria |
|-------------|-------------------|-------------------------------|
| Phase 1 complete | Move campaignConfig, activeView, bestiary from index.tsx to useCampaignStore | All specified state is migrated to useCampaignStore, index.tsx no longer manages this state, and all components using old state are updated. |
| Phase 2 complete | Refactor LocationManager.tsx to use useLocationStore | LocationManager.tsx uses useLocationStore, all location state is managed by the store, and UI functions correctly. |
| Phase 3 complete | Replace AdventureProvider with useGeneratorStore | AdventureProvider is removed, useGeneratorStore manages all generation state, and generation workflow functions correctly. |
| Selectors used | Components use selectors | All components subscribe to specific state fields via selectors, no component subscribes to entire store objects, and performance is optimized. |
| Actions in stores | All mutations as store actions | All state mutations occur through store actions, no inline mutations in components, and state updates are predictable. |

## Edge Cases Not Addressed

| Scenario | Impact | Suggested Handling |
|----------|--------|---------------------|
| Migration fails mid-phase | High | Implement rollback to previous state, notify user of failure, log error for debugging, and offer retry. |
| Large dataset migration (>10,000 records) | Medium | Implement chunked migration, show progress indicator, and ensure UI remains responsive. |
| Concurrent access during migration | High | Lock data during migration, show migration in progress indicator, and prevent conflicting operations. |
| Invalid state during migration | High | Validate state before migration, quarantine invalid data, notify user of issues, and offer repair options. |
| Browser refresh during migration | Medium | Detect refresh, show warning, offer to resume migration or restart from beginning. |
| Cross-tab state inconsistency | High | Implement cross-tab synchronization, detect conflicts, and provide conflict resolution UI. |
| Store action throws error | Medium | Implement error handling in actions, log errors, notify user, and prevent state corruption. |

## Implicit Dependencies

| Dependency | Dependent Feature | Impact |
|------------|-------------------|--------|
| Zustand library | All state management | High - Entire migration depends on Zustand. |
| Existing state structure | All migration phases | High - Migration must understand and transform existing state. |
| Component refactoring | All migration phases | High - Components must be updated to use new stores. |
| Testing infrastructure | Migration verification | High - Testing requires test infrastructure to verify migrations. |
| Performance monitoring | Migration performance | Medium - Performance monitoring helps identify migration issues. |

## Missing Performance Requirements

| Feature | Missing Metric | Suggested Target |
|---------|----------------|------------------|
| State update performance | Time for state update and re-render | <16ms for typical state update, <100ms for complex updates |
| Selector performance | Time for selector execution | <1ms for simple selector, <10ms for complex selector |
| Store initialization | Time to initialize all stores | <500ms for all stores on app startup |
| Migration performance | Time to migrate typical dataset | <5s for migrating 1000 records |

## Error Handling Gaps

| Scenario | Current Specification | Suggested Error Handling |
|----------|----------------------|-------------------------|
| Store initialization fails | Not specified | Show user-friendly error, log details, offer retry, and provide fallback (old state system). |
| Action throws exception | Not specified | Catch exception in action, log error, notify user, and prevent state corruption. |
| Selector throws error | Not specified | Implement error boundary, show error UI, log details, and offer recovery. |
| Migration data corruption | Not specified | Detect corruption, restore from backup, notify user, and log for debugging. |
| Concurrent state update conflict | Not specified | Detect conflict, show conflict UI, offer merge options, and prevent data loss. |

## Overall Assessment
- **Clarity Score:** 7/10
- **Completeness Score:** 5/10
- **Priority Issues:** 3

### Summary
The state migration specification provides a clear roadmap for moving to Zustand but lacks critical details around migration testing, rollback strategies, and error handling. The selector granularity and ephemeral state definitions need more specificity. Missing requirements for cross-tab synchronization, data validation during migration, and performance targets are significant gaps that could impact reliability. The migration phases need clearer dependencies and completion criteria.

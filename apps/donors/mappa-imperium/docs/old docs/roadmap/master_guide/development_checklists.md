
> **_Note: This document provides the official checklists for quality assurance gates during the Mappa Imperium development lifecycle. It aligns with the target architecture defined in the `/docs/roadmap` directory._**

# Development Phase Checklists

This document serves as a series of quality gates to be completed at the end of each major development phase. Its purpose is to ensure that all requirements from the project's specification documents have been met, the architecture remains sound, and the codebase is healthy before proceeding.

---

## ✅ End of Phase 1: Foundation & Core Eras (I-III) Complete

**Objective**: Verify that the foundational application structure and the core gameplay loops for the first three eras are stable, well-documented, and ready to support more complex features.

| File / System | Checklist Item | Specification Reference | Status |
| :--- | :--- | :--- | :--- |
| **`src/types.ts`** | Verify `ElementCard` type and data union includes `Resource`, `Deity`, `Location`, `Faction`, and `Settlement`. | `element_manager_spec.md` | ☐ |
| | Confirm interfaces for `Player`, `GameSettings`, and `AppSettings` are stable. | `current_architecture_overview.md` | ☐ |
| **`src/components/layout/`** | Review `AppLayout.tsx`, `CompletionTracker.tsx`, and `CollaborationStatus.tsx` for clean prop drilling and layout consistency. | `Design Brief.md` | ☐ |
| **`src/components/navigation/`** | Ensure `NavigationHeader.tsx` and `PlayerStatus.tsx` correctly reflect game state (`currentEraId`, `currentPlayer`, etc.). | `multi_player_session_spec.md` | ☐ |
| **`src/components/world-manager/`** | Confirm `ElementManager.tsx` can filter, search, and display all Phase 1 element types in both grid and list views. | `element_manager_spec.md` | ☐ |
| | Verify `EditElementModal.tsx` contains functional, type-aware forms for all Phase 1 element types. | `element_manager_spec.md` | ☐ |
| **`src/components/era-interfaces/`** | Check that `EraCreationContent.tsx`, `EraMythContent.tsx`, and `EraFoundationContent.tsx` are fully implemented. | `Era_Content_Creation_Spec.md` | ☐ |
| | Confirm that AI generation in each era interface follows the non-destructive pattern. | `ai_interaction_patterns.md` | ☐ |
| **`src/services/`** | Validate that `exportService.ts` correctly formats and exports HTML and Markdown for all Phase 1 element types. | `content_export_spec.md` | ☐ |
| | Ensure `websocketService.ts` simulation is sufficient for debug mode player switching. | `current_architecture_overview.md` | ☐ |
| **`docs/`** | All `current/` documentation must be updated to reflect the final state of the Phase 1 implementation. | `master_guide/README.md` | ☐ |
| **Code Health** | Run `eslint` and ensure no file exceeds the line limits defined in the coding standards. | `master_guide/README.md` | ☐ |

### Technical Debt & Code Health Review
| Category | Checklist Item | Specification Reference | Status |
| :--- | :--- | :--- | :--- |
| **File Size** | **File Size Audit**: Confirm all new/modified files are within line limits. | `master_guide/README.md` | ☐ |
| **Complexity** | **Component Complexity Review**: Identify components that need refactoring. | `master_guide/README.md` | ☐ |
| **State Mgt.** | **State Management Review**: Check for excessive prop-drilling. | `master_guide/README.md` | ☐ |
| **Docs** | **Documentation Sync**: Ensure `current/` and `roadmap/` docs are up to date. | `master_guide/README.md` | ☐ |

---

## ✅ Mid-Phase 2, Checkpoint 1: Core Systems Ready (Era IV Prereq)

**Objective**: Before building the Era IV gameplay interface, verify that the core AI Template System and the foundational Cross-Player Coordination systems are implemented and tested.

| File / System | Checklist Item | Specification Reference | Status |
| :--- | :--- | :--- | :--- |
| **`src/services/aiTemplateService.js`** | Confirm service can load, parse, and build prompts from the `/docs/ai-templates/` markdown files. | `ai_integration_spec.md` | ☐ |
| **`src/hooks/useAIGeneration.js`** | Verify the hook correctly manages `isLoading`, `error`, and `result` states for AI calls. | `Design Brief.md` | ☐ |
| **`src/contexts/AIContext.tsx`** | Ensure the context provider correctly injects element details when a UUID is referenced in user input. | `ai_integration_spec.md` | ☐ |
| **`backend/services/collaborationService.js`** | **(Target Arch)** Backend service for managing real-time events must be in place. | `backend_spec.md` | ☐ |
| **`src/hooks/useCrossPlayerState.js`** | **(Target Arch)** Hook for subscribing to and managing multi-player events (e.g., war declarations) is functional. | `cross_player_coordination_spec.md` | ☐ |
| **`src/components/collaboration/`** | **(Target Arch)** Foundational UI components for notifications and event modals are created. | `multi_player_session_spec.md` | ☐ |
| **Code Health** | All new services and hooks must have >90% unit test coverage. | `master_guide/phase_3_production.md` | ☐ |

### Technical Debt & Code Health Review
| Category | Checklist Item | Specification Reference | Status |
| :--- | :--- | :--- | :--- |
| **File Size** | **File Size Audit**: Confirm all new/modified files are within line limits. | `master_guide/README.md` | ☐ |
| **Complexity** | **Component Complexity Review**: Identify components that need refactoring. | `master_guide/README.md` | ☐ |
| **State Mgt.** | **State Management Review**: Check for excessive prop-drilling. | `master_guide/README.md` | ☐ |
| **Docs** | **Documentation Sync**: Ensure `current/` and `roadmap/` docs are up to date. | `master_guide/README.md` | ☐ |

---

## ✅ End of Phase 2: Advanced Eras (IV-VI) Complete

**Objective**: Verify the full implementation of the dynamic and globally-scoped Eras IV, V, and VI, ensuring they correctly use the core AI and collaboration systems.

| File / System | Checklist Item | Specification Reference | Status |
| :--- | :--- | :--- | :--- |
| **`src/types.ts`** | Confirm `ElementCard` type and data union includes `War`, `Event`, `Character`, and `Monument`. | `element_manager_spec.md` | ☐ |
| **`src/components/era-interfaces/`** | Check that `EraDiscoveryContent.tsx`, `EraEmpiresContent.tsx`, and `EraCollapseContent.tsx` are fully implemented. | `Era_Content_Creation_Spec.md` | ☐ |
| | Verify each interface uses the `aiTemplateService` to trigger the correct AI template for its dice roll outcomes. | `ai_integration_spec.md` | ☐ |
| **AI Templates** | Confirm all templates from `4_1` to `6_2` and `Z_battle-chronicle` are integrated and used correctly. | `ai_integration_spec.md` | ☐ |
| **Collaboration** | Ensure "War!" and other cross-player events correctly trigger the coordination workflow. | `cross_player_coordination_spec.md` | ☐ |
| **`CompletionTracker.tsx`** | Check that the tracker's `ERA_GOALS` have been updated to calculate progress for Eras IV, V, and VI. | `updating_progress_tracker.md` | ☐ |
| | **Confirm the tracker now integrates `gameSettings` to adjust turn counts based on game length.** | `play_overview.md` | ☐ |
| **`dynamic_turn_system.md`** | **(Updated Feature)** Confirm the dynamic turn system, including custom year-per-turn input, is implemented per the updated spec. | `dynamic_turn_system.md` | ☐ |
| **Data Model** | Verify `ElementCard`s created in Eras IV-VI are correctly timestamped with a `createdYear`. | `dynamic_turn_system.md` | ☐ |
| **Main UI** | A persistent year counter is displayed in the top-left of the UI, reflecting the `TimelineCalculator`'s current year. | `dynamic_turn_system.md` | ☐ |
| **`ElementManager.tsx`** | A new "Timeline View" is implemented, allowing elements to be sorted and visualized chronologically. | `dynamic_turn_system.md` | ☐ |
| **Code Health** | All new era interfaces must be decomposed to respect file size limits. | `master_guide/README.md` | ☐ |

### Technical Debt & Code Health Review
| Category | Checklist Item | Specification Reference | Status |
| :--- | :--- | :--- | :--- |
| **File Size** | **File Size Audit**: Confirm all new/modified files are within line limits. | `master_guide/README.md` | ☐ |
| **Complexity** | **Component Complexity Review**: Identify components that need refactoring. | `master_guide/README.md` | ☐ |
| **State Mgt.** | **State Management Review**: Check for excessive prop-drilling. | `master_guide/README.md` | ☐ |
| **Docs** | **Documentation Sync**: Ensure `current/` and `roadmap/` docs are up to date. | `master_guide/README.md` | ☐ |
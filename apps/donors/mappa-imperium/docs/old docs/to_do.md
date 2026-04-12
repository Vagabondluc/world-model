# To-Do List & Task Tracker
**Version: 0.0.2**  
This is the active task management system. Tasks are organized by priority and clearly linked to bug reports.

---

## Next Up

- **TODO-0.0.2-035: Refactor for Portable Component Architecture (Headless UI)**
  **Description**: Evolve the application from its current build-less, inline-style architecture to a professional model with a dedicated build step. This is the **most critical long-term task** as it addresses the root cause of numerous bugs and architectural compromises. The goal is to create a portable, headless, and configurable component library that can be versioned and "remixed," with a primary focus on extracting the Element Manager into a reusable package. This will enable robust deployment and unlock advanced features like dynamic theming.
  **Reference**: `docs/roadmap/portable_component_architecture.md`, `docs/roadmap/element-manager-extraction-plan.md`
  **Status**: Not started.

---

## Backlog

### High Priority (Critical Bugs)
*(No high priority bugs in the backlog at this time)*

### Medium Priority (UX & Architectural Debt)
- **TODO-0.0.2-045: Review Settings Modal Button UX**
  **Description**: A user reported that the "Save" and "Cancel" buttons in the Settings Modal are confusing or appear to perform the same function. Review the UX of this component to make the actions clearer. Consider changing "Cancel" to "Close" or adding more descriptive tooltips. The functionality must be preserved, but the user experience needs improvement.
  **Status**: Not started.

- **TODO-0.0.2-044: Fix Widespread UI Regressions from Theming Update**
  **Description**: The recent update to the theming system introduced several visual bugs that need to be addressed. This includes fixing the light mode player menu, restoring era button and settings toggle styles, ensuring table borders are visible, adding hover/active states to menus, and fixing content overflow issues.
  **Status**: Completed.

- **TODO-0.0.2-043: Implement Dynamic Visual Theming System**
  **Description**: Implement a dynamic theme switcher allowing users to select from multiple visual themes (e.g., Mappa Classic, Midnight Scholar, Ocean Depths). This requires implementing a ThemeProvider and refactoring component styles to use CSS variables, as outlined in the design document.
  **Reference**: `docs/roadmap/visual-theming-system.md`
  **Status**: Blocked by `TODO-0.0.2-035`.

---

## Post-Migration Roadmap (Requires IDE/Build Environment)

- **TODO-0.0.2-036: Implement Strategic Cartographer AI**
  **Description**: Create a new AI role that analyzes the spatial layout of the map (geography from Era I) and provides proactive, strategic advice on where to place settlements, forts, and other elements for the most logical and defensible outcomes.
  **Status**: Blocked by `TODO-0.0.2-035`.

- **TODO-0.0.2-037: Implement Conflict & Diplomacy AI**
  **Description**: Develop an AI system that can simulate and narrate the evolving relationships between factions. This AI would generate plausible events (e.g., trade disputes, border skirmishes, alliance proposals) based on the factions' traits and proximity.
  **Status**: Blocked by `TODO-0.0.2-035`.

- **TODO-0.0.2-022: Implement Private Chronicles & Invitation Links**
  **Description**: Implement the server-based architecture required for private, password-protected game rooms with unique shareable invitation links.
  **Reference**: `docs/feature_proposal_private_chronicles.md`
  **Status**: Blocked by `TODO-0.0.2-035`.

- **TODO-0.0.2-026: Implement Dynamic Event Form System for Eras IV-VI**
  **Description**: Build a system that can dynamically render specific input forms based on the user's dice roll for events in Eras IV, V, and VI. This will replace the generic text inputs in the `EraGameplayManager` and `DiscoveryEngine` with tailored fields as specified in the `/docs/ai-templates/events/` documentation.
  **Reference**: `docs/ai-templates/events/README.md`
  **Status**: Blocked by `TODO-0.0.2-035`.

---

## Completed Tasks
- **TODO-0.0.2-030: Enhance UI/UX with Smooth Transitions and Animations**
- **TODO-0.0.2-042: Implement Bug Reporter in Debug Menu**
- **TODO-0.0.2-038: Refactor Monolithic UnifiedDebugSystem**
- **TODO-0.0.2-041: Fix Solo Game Advancement Stall**
- **TODO-0.0.2-031: Fix UI flickering regression on view change.**
- **TODO-0.0.2-032: Fix broken collapsible rulebook sections.**
- **TODO-0.0.2-033: Fix Broken Year-per-turn Logic**
- **TODO-0.0.1-004**: Event Documentation Groundwork finalized
- **TODO-0.0.1-005**: Era 4 system replaced with DiscoveryEngine
- **TODO-0.0.1-006**: Progress Tracker UI overhaul completed
- **TODO-0.0.1-007**: Faction & Settlement Card Descriptions revised
- **TODO-0.0.1-008**: Enforce UI consistency with a stricter `EraLayoutContainer` (PARTIAL - needs completion for Eras V-VI)
- **TODO-0.0.1-012**: Refactor Static Rulebooks for Interactivity
- **TODO-0.0.1-013**: Refactor Era III Rulebook to external HTML file
- **TODO-0.0.1-014**: Implement Interactive HTML Rulebooks for All Eras
- **TODO-0.0.2-001**: Standardize Navigation Pattern Across All Eras
- **TODO-0.0.2-002**: Create Shared ObserverMode Component
- **TODO-0.0.2-003**: Standardize Progress Tracking Components
- **TODO-0.0.2-004**: Establish State Management Standards
- **TODO-0.0.2-005**: Eliminate CSS Class Duplication
- **TODO-0.0.2-006**: Standardize Event Handling Patterns 
- **TODO-0.0.2-007**: Standardize Prop Naming Conventions
- **TODO-0.0.2-008**: Standardize Loading and Error States
- **TODO-0.0.2-009**: Standardize Import Patterns
- **TODO-0.0.2-010**: Audit GameSettings Prop Requirements
- **TODO-0.0.2-011**: Standardize Modal Handling Patterns
- **TODO-0.0.2-012**: Update Current State Documentation
- **TODO-0.0.2-013**: Create Code Quality Standards Documentation
- **TODO-0.0.2-014**: Implement Unified Rulebook Architecture
- **TODO-0.0.2-015**: Standardize Era Layout and State Management
- **TODO-0.0.2-016**: Refactor Rulebook Modals to Collapsible Sections (Superseded by TODO-0.0.2-017)
- **TODO-0.0.2-017**: Systematically Correct All Rulebook Reference Behaviors and Content
- **TODO-0.0.2-018**: Fix Critical Gameplay Regressions
- **TODO-0.0.2-019**: Implement and Document Chronicle Feed Feature
- **TODO-0.0.2-020**: Address Technical Debt for Generic Element Cards
- **TODO-0.0.2-021**: Implement Chronicle Lobby System
- **TODO-0.0.2-023**: Implement Local LLM Support
- **TODO-0.0.2-024**: Implement Custom Gameplay Interface for Era V (Age of Empires)
- **TODO-0.0.2-027**: Document "Advanced Player Types" Feature in Project Roadmap
- **TODO-0.0.2-029**: Implement Dynamic Game Duration Calculator in Game Setup
- **TODO-0.0.2-034**: Implement Hybrid Fallback for Static Content Loading
- **TODO-0.0.2-039**: Verified and Documented Era 5 to Era 6 Progression Logic
- **TODO-0.0.2-025**: Implement Custom Gameplay Interface for Era VI (Age of Collapse)
- **TODO-0.0.2-040**: Implement Final Summary Screen after Era VI
- **TODO-0.0.2-028**: Fix 404 Error on Component Stylesheet Load

---

## Implementation Guidelines

### Task Completion Order
1. Complete Priority 1 tasks first - these address critical uniformity issues
2. Priority 2 tasks improve code quality and maintainability
3. Priority 3 tasks address secondary consistency issues
4. Documentation updates should follow code changes

### Testing Requirements
- All tasks must include testing to ensure no functional regressions
- Uniformity changes should be verified across all affected eras
- Visual consistency should be confirmed in all screen sizes

### Code Review Focus
- Verify consistent patterns are implemented across all affected components
- Ensure no new inconsistencies are introduced
- Confirm all duplicate code is properly eliminated

### Success Metrics
- Zero duplicate CSS classes across components
- Consistent component patterns across all eras
- Single implementation for each shared UI pattern
- Clear, documented standards for all component patterns
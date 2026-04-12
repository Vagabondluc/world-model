# To-Do List & Task Tracker
**Version: 0.0.2**  
This is the active task management system. Tasks are organized by priority and clearly linked to bug reports.

---

## Next Up

- **TODO-0.0.2-032: Fix broken collapsible rulebook sections.**
  **Description**: A previous change broke the expand/collapse functionality of the `<details>` element in `AIGenerationSection.tsx`. This needs to be reverted and fixed.
  **Reference**: BUG-0.0.2-031
  **Status**: Not started.

---

## Backlog

### High Priority (Critical Bugs)
- **TODO-0.0.2-033: Fix Broken Year-per-turn Logic**
  **Description**: The year calculation displayed during gameplay does not correctly use the `turnDuration` and game length settings chosen during game setup, leading to an inconsistent timeline. The logic in `timelineCalculator.ts` and `CompletionTracker.tsx` needs to be synchronized with `GameSetup.tsx`.
  **Reference**: BUG-0.0.2-032
  **Status**: Not started.

### Medium Priority (UX & Architectural Debt)
- **TODO-0.0.2-030: Enhance UI/UX with Smooth Transitions and Animations**
  **Description**: The current UI feels "nervous" and abrupt. Implement smooth transitions for a more polished and professional user experience. This should include fade-in/out animations for components loading, smooth transitions for modals, and animated view changes.
  **Reference**: User Feedback
  **Status**: Not started.

- **TODO-0.0.2-041: Refactor UI to Co-locate Child Components**
  **Description**: To improve maintainability and reduce file clutter, a new architectural best practice has been adopted: defining small, single-use child components within the same `.tsx` file as their parent. This task involves auditing the existing component tree and refactoring components where appropriate to follow this pattern. For example, small display components within a larger interface (like a specific card type in a list) are good candidates. Widely shared components (e.g., modals, buttons) will remain in their own files.
  **Status**: Not started.

- **TODO-0.0.2-035: Portable Component Architecture & Robust Deployment (HIGHEST PRIORITY)**
  **Description**: 
  ## Updated Step-by-Step Implementation Plan
  ---
  ## Executive Summary (Revised)
  **The Critical Issue**: The application's styling system relies on classes defined in `index.html`, which is fragile and unsuitable for professional deployment. The previous blocker—static content like rulebooks—has already been successfully migrated to TSX components.
  **The Solution**: Focus the refactor entirely on the CSS architecture. First, clean up the now-unnecessary hybrid content fallback system. Then, systematically migrate all CSS classes from `index.html` into a proper build-based component library.
  **Impact**: This is the most critical remaining architectural task. It will solve all known deployment issues with styling, simplify the codebase, and create a robust foundation for future features.
  ---
  ## Key Benefits of the Updated Approach

  ### 🧹 Simplified Architecture
  - **Remove Complex Fallback**: No more hybrid fetch/bundled content system.
  - **Single Source of Truth**: All content is in TSX components (already done!).
  - **Environment Detection**: A simple health check file will be retained for deployment diagnostics.
  - **Cleaner Codebase**: Remove unnecessary `fetch` logic and error handling.

  ### 🚫 Eliminates CSS File Issues
  - **No External CSS Files**: Zero risk of 404 errors on stylesheets post-refactor.
  - **Google Cloud Safe**: Avoids all known Cloud Run CSS serving issues.
  - **Environment Agnostic**: The final build will work in Google AI Studio, local dev, and production.

  ---

  ## Updated Implementation Priority & Risk Assessment

  ### ⚡ Phase 1: Quick Cleanup (Immediate - Low Risk)
  1. **Remove Hybrid Fallback System**: Clean up the complexity introduced to solve `BUG-0.0.2-034`.
  2. **Add Environment Health Check**: Keep a single test file (e.g., `public/health-check.html`) for debug diagnostics.
  3. **Update Documentation**: Reflect the final TSX-only content architecture.

  ### 🎯 Phase 2: CSS Component Migration (High Impact)
  1. **Button Components**: Replace all `className` usage for buttons.
  2. **Typography Components**: Replace heading and text styling.
  3. **Layout Components**: Replace common layout patterns (`page-card`, etc.).
  4. **Form Components**: Replace input and form styling.

  ### 🔧 Phase 3: Complex Components (Medium Complexity)
  1. **Era Layouts**: Refactor era-specific styling.
  2. **Modal Components**: Update overlay and dialog styling.
  3. **Navigation Components**: Update menu and tab styling.
  4. **Card Components**: Replace various card layouts.

  ### 🔥 Phase 4: Critical Components (High Priority)
  1. **AppLayout**: Main application structure.
  2. **Element Manager**: Complex table and grid layouts.
  3. **Debug Panel**: Specialized debugging interface.
  4. **Game Setup**: Initial user experience flow.

  ---

  ## Updated Success Metrics

  ### 🎯 Phase 1 Success (Cleanup)
  - [ ] **Hybrid Fallback Removed**: No more `useStaticContent.ts` or related fetch() calls.
  - [ ] **Health Check Working**: Debug system can detect static file serving capability.
  - [ ] **Documentation Updated**: Architecture docs reflect the TSX-only approach.
  - [ ] **No Functional Regressions**: All existing features work identically.

  ### ✅ Phase 2-4 Success (CSS Components)
  - [ ] **Build Process Functional**: The application can be built successfully using Vite.
  - [ ] **Zero CSS 404 Errors**: No external CSS file dependencies in the final build.
  - [ ] **Identical Visual Output**: All components look exactly the same post-refactor.
  - [ ] **Full Functionality**: All user workflows work unchanged.

  ### 🚀 Long-term Strategic Benefits
  - [ ] **Google Cloud Deployment**: Reliable hosting without CSS issues.
  - [ ] **Component Portability**: Easy extraction and reuse of UI components.
  - [ ] **Future-Ready Architecture**: Foundation for advanced features like Private Chronicles.
  - [ ] **Maintainability**: Easier styling updates and consistency.
  **Reference**: `docs/roadmap/portable_component_architecture.md`
  **Status**: Not started.

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
- **TODO-0.0.2-038**: Refactor Monolithic UnifiedDebugSystem
- **TODO-0.0.2-028**: Fix 404 Error on Component Stylesheet Load
- **TODO-0.0.2-031**: Fix UI flickering on view change.

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
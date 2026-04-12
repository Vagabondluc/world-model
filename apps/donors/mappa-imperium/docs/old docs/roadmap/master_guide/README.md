> **_Note: This document is the main entry point for the Mappa Imperium development guide. It outlines the project's high-level vision, standards, and processes. This guide describes a target architecture that includes a full backend and real-time collaboration. The application's current, simpler implementation is detailed in the `/docs/current` directory._**

# Mappa Imperium - Master Development Guide

## 📋 Project Overview

This master guide coordinates the development of Mappa Imperium, a collaborative digital worldbuilding application based on the tabletop game. The project transforms complex tabletop mechanics into an intuitive web experience with real-time collaboration and AI-powered guidance.

---

## 🎯 Development Philosophy & Standards

### Immediate Development Priorities
To deliver a complete and polished user experience incrementally, the development roadmap is prioritized as follows:

1.  **Technical Debt & Refactoring**: With the core gameplay loop from Era I to VI now complete with custom user interfaces, the next immediate priority is to address significant technical debt. The focus is on refactoring the monolithic **Unified Debug System** into a modular, maintainable, and testable feature. This is a critical step to ensure codebase health before proceeding to new features.

2.  **Enhance Asynchronous Play**: Build upon the existing Chronicle Feed and Lobby system to improve the asynchronous multiplayer experience, making it more robust and user-friendly.

3.  **Future: Full Backend & Real-time Collaboration**: The long-term vision remains to implement a persistent, real-time multiplayer system with a dedicated backend. This major architectural step will be undertaken after the core client-side application is complete and polished, following the pragmatic, phased approach outlined in the [Backend Integration Strategy](../backend_integration_strategy.md).

### Core Principles
1. **Era-First Development**: Build functionality era by era to maintain game integrity
2. **Component Isolation**: Each feature should be independently testable and deployable
3. **Collaborative-Ready**: Every component must support real-time multi-user interaction
4. **AI-Integration Ready**: All interfaces designed for seamless AI guidance integration
5. **Export-Conscious**: Every data structure designed for easy export to external tools
6. **Visually Consistent**: All UI must adhere to the project's official **[Style Guide](../../current/style_guide.md)**.

### Updating Project Paradigms (Self-Updating Documentation)

A "project paradigm" is a core principle or architectural pattern that guides development. Examples include the non-destructive AI interaction model, the state management strategy, or the element card structure. When a paradigm shifts, it's critical that the documentation evolves with it to prevent confusion and maintain consistency.

This is the "self-updating" principle: **any change to a core paradigm mandates a review and update of all relevant documentation.**

#### Process for Implementing a Paradigm Shift

Follow these steps to ensure changes are integrated smoothly and documentation remains accurate:

1.  **Propose & Document the Change**: Before implementation, document the proposed change, its rationale, and its expected impact on the user experience and codebase.

2.  **Identify All Affected Documents**: Conduct an audit to find every piece of documentation impacted by the change. This is a crucial step. Key documents to review include:
    *   `docs/roadmap/master_guide/README.md`: Does the change affect the core philosophy, standards, or development phases?
    *   `docs/current/current_architecture_overview.md`: Does the change alter how the current application works?
    *   `docs/current/ai_assistant_instructions.md`: Does the change impact the AI's core behavior, constraints, or response requirements?
    *   `docs/current/element_manager_spec.md`: Does the change affect the structure or management of element cards?
    *   `docs/current/content_export_spec.md`: Does the change alter what or how data is exported?
    *   `docs/ai-templates/*.md`: Does the change require updates to specific AI prompt templates?
    *   `docs/game-rules/*.md`: Does the change impact the gameplay mechanics or rules? (Less common, but possible).

3.  **Implement Code Changes**: Implement the new paradigm across all relevant components, hooks, and services.

4.  **Update All Identified Documentation**: This is not optional. Modify every document identified in Step 2 to reflect the new reality. The documentation should be updated within the same pull request as the code changes.

5.  **Submit for Review**: The pull request should include both the code and documentation changes, making the paradigm shift clear to reviewers.

#### Example: Implementing the "Non-Destructive AI" Paradigm

The decision to prevent the AI from overwriting user-entered descriptions is a perfect example of a paradigm shift. Here's how this process was applied:

*   **Change Proposed**: AI generation should be disabled when a user has provided their own content in a description field to prevent accidental data loss.
*   **Affected Documents Identified**:
    *   `docs/current/current_architecture_overview.md`: The "Developer Guides" section needed to document this new standard interaction pattern.
    *   `docs/current/ai_assistant_instructions.md`: The AI's core instructions needed a new principle ("Incorporating Partial User Input") to guide its behavior when some fields are pre-filled.
*   **Code Implemented**: The `CustomResourceCreator`, `DeityCreatorForm`, and `SacredSiteCreatorForm` components were updated to disable the AI button and show an explanatory message based on the state of the description field.
*   **Documentation Updated**: Both `current_architecture_overview.md` and `ai_assistant_instructions.md` were updated with the new principles in the same commit as the code changes.

### File Organization Strategy

```
mappa-imperium/
├── 📁 docs/                          # All specification documents
│   ├── design-brief.md               # Primary design document
│   ├── era-specifications/           # Individual era requirements
│   ├── ai-templates/                 # AI guidance templates
│   ├── component-specs/              # UI component specifications
│   └── integration-guides/           # Cross-system integration docs
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 era-interfaces/        # Era-specific UI components
│   │   ├── 📁 shared/               # Reusable components
│   │   ├── 📁 world-manager/        # Entity management system
│   │   └── 📁 collaboration/        # Multi-player features
│   ├── 📁 hooks/                    # Custom React hooks
│   ├── 📁 services/                 # API and external integrations
│   ├── 📁 utils/                    # Helper functions
│   └── 📁 types/                    # TypeScript definitions
├── 📁 backend/                      # Server implementation
└── 📁 exports/                      # Export system templates
```

### Coding Standards

#### File Size Management (CRITICAL)
```javascript
// ENFORCE STRICT FILE SIZE LIMITS
// Maximum file sizes:
// - React components: 200 lines (WARNING at 150)
// - Hooks: 100 lines (WARNING at 80)
// - Utils: 80 lines (WARNING at 60)
// - Types: 120 lines (WARNING at 100)

// VIOLATION EXAMPLE - 250+ lines component
const EraManager = () => {
  // State management (60 lines)
  // API calls (50 lines)
  // Event handlers (70 lines)
  // Validation logic (40 lines)
  // Render logic (80 lines)
}; // TOO LARGE!

// SOLUTION - Decomposed architecture
// components/EraManager/index.js (40 lines)
const EraManager = () => (
  <EraProvider>
    <EraNavigation />
    <EraContent />
    <EraProgress />
  </EraProvider>
);

// hooks/useEraData.js (90 lines)
export const useEraData = () => {
  // All era state management
};

// components/EraManager/EraNavigation.js (60 lines)
export const EraNavigation = () => {
  // Navigation UI only
};
```

#### Best Practices
- **Accessibility (A11y)**: Always use semantic HTML. Add ARIA attributes (`aria-label`, `aria-current`, `role`) where necessary to provide context for screen readers. Ensure all interactive elements are keyboard-navigable and have clear focus states.
-   **Type Safety**: Leverage TypeScript's strengths. Define clear and comprehensive interfaces for all props and data structures in `src/types.ts`. Avoid using `any` unless absolutely necessary.
-   **Modularity & Single Responsibility**: Keep components small and focused. If a component grows too large or handles too many concerns, refactor it into smaller, more manageable sub-components. Extract complex or reusable logic into custom hooks (`src/hooks/`).

#### Component Architecture Standards
```javascript
// REQUIRED PATTERN: Feature-based organization
features/
├── era-creation/
│   ├── components/
│   │   ├── GeographyPlacer.js      # Max 150 lines
│   │   ├── ResourceGenerator.js    # Max 120 lines
│   │   └── RegionBoundaries.js     # Max 100 lines
│   ├── hooks/
│   │   ├── useGeographyLogic.js    # Max 100 lines
│   │   └── useResourcePlacement.js # Max 80 lines
│   ├── utils/
│   │   └── geographyValidation.js  # Max 60 lines
│   └── index.js                    # Export interface

// REQUIRED: Every component must have
// 1. Clear single responsibility
// 2. Explicit prop interfaces
// 3. Error boundary handling
// 4. Loading state management
// 5. Real-time sync capability
```

#### State Management Architecture
```javascript
// REQUIRED PATTERN: Context + Hooks architecture
// Global state via React Context
// Local state via custom hooks
// No external state management libraries

// contexts/GameContext.js
export const GameContext = createContext({
  gameState: initialState,
  dispatch: () => {},
  realtimeUpdates: []
});

// hooks/useGameState.js
export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within GameProvider');
  }
  return context;
};

// Real-time integration pattern
export const useRealtimeSync = (entityId) => {
  const [entity, setEntity] = useState(null);
  
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe(
      entityId, 
      (updatedEntity) => setEntity(updatedEntity)
    );
    return unsubscribe;
  }, [entityId]);
  
  return entity;
};
```
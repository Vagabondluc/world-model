

# Current Architecture Overview

This document describes the architecture of the Mappa Imperium application in its current state. **It is critical to understand that this is a client-side only application.** There is no backend server or database. All features, including multi-player interactions, are simulated locally within the browser. Session data is persisted solely through a manual JSON import/export system.

For the long-term vision including a full backend and real-time collaboration, please refer to the `/docs/roadmap/` directory.

## 1. Core Technology

-   **Frontend Framework**: React with TypeScript.
-   **Styling**: Tailwind CSS, implemented via the **official CDN script**. All component classes are defined directly inside a `<style type="text/tailwindcss">` block in `index.html`. This build-less approach was adopted to resolve persistent 404 errors with external stylesheets in the deployment environment. For more details, see the [Styling Architecture](./styling_architecture.md) guide.
-   **AI Integration**: `@google/genai` SDK for client-side calls to the Gemini API.
-   **Deployment Target**: The application is designed for deployment on **Google Cloud Run**. This choice imposes specific architectural constraints, particularly regarding statelessness and static file serving, which are addressed by the application's design. For detailed information, see the [Google Cloud Run Development Guidelines](./google_cloud_run_guidelines.md).

## 2. Development Environment Constraints (Google AI Studio)

The application's architecture is heavily influenced by the constraints of its primary development environment, **Google AI Studio**.

-   **Read-Only File System**: The environment operates with a read-only file system. This means that operations that attempt to create, modify, or delete files (such as `package.json`, `index.css`, or build configuration files) will fail and can crash the development server.
-   **Build-less by Necessity**: The read-only file system makes a traditional `npm run build` step impossible within the environment itself. The application was therefore designed to be "build-less" to ensure it can run and be developed reliably within these constraints.
-   **Styling Solution**: The choice to inline all component styles into `index.html` is a direct result of these file system limitations. It is the most robust workaround to avoid 404 errors on CSS files without a build step.

> **Note for Google Engineers**: If you are developing this application using internal tools like `cline` or `roo code`, these file system limitations may not apply. In such environments, you can proceed with a standard, build-based development workflow as outlined in the project roadmap. The current architecture is optimized for the constraints of the AI Studio platform.

## 3. Application Structure

The application is a **single-page application (SPA)** that runs entirely in the browser. There is no backend server component or build step in the current implementation.

### State Management

-   **Global State (`GameContext`)**: All major application state (game settings, players, elements, current view, etc.) is managed within the root `App` component (`index.tsx`) and provided to the component tree via the `GameContext`.
-   **Era-Specific UI State (`eraUiState`)**: Within `GameContext`, a dedicated `eraUiState` object manages the internal UI state for each era's gameplay view (e.g., which sub-step is currently active in Era III or Era IV). This is a critical pattern that decouples the UI state of a specific gameplay screen from the global game progress state, improving modularity and preventing unnecessary re-renders of the entire application.
-   **Context for AI (`AIContext`)**: The `AIContext` is used to provide the Gemini API generation function and the list of world `elements` to components that need it, simplifying access to the AI service.
-   **Context for Era I Gameplay (`EraCreationContext`)**: The `EraCreationContext` isolates the state for the complex "Age of Creation" gameplay interface, managing the state for each player separately.

### Session Management & Persistence

-   **No Database**: The application does not connect to a database. All data exists only in the client's memory for the duration of the session.
-   **Import/Export System**: Session persistence is achieved through a manual file-based system.
    -   **Export Save**: The entire application state is serialized into a JSON file (`mappa-imperium-export.json`) and downloaded by the user to save a session.
    -   **Import Save**: A user can upload a previously exported JSON file on the setup screen to restore the application to a saved state.

### Multi-Player Functionality

-   **Simulated Real-Time**: The `websocketService.ts` is a **simulation** of a real WebSocket service. It does not connect to a server.
-   **Local Events**: The service uses a local event emitter pattern to manage player status updates *within the same browser session*, which is primarily useful for the debug mode's player-switching feature.
-   **No True Collaboration**: There is no real-time data synchronization between different users/browsers. Collaboration is asynchronous, achieved by exporting the world state and sharing the JSON file with other players, who can then import it.

## 4. Core Features

-   **Game Setup & Player Selection**: Initial screens to configure the game and for players to join/rejoin a session. Password protection is handled client-side.
-   **AI Player Configuration**: A dedicated setup screen allows for the configuration of AI players, including their personalities (using the Big Five model), play styles, and backstories.
-   **Observer Role**: A user can join any game session as an "Observer" from the `PlayerSelection` screen. This provides full read-only access to the entire world state, including the Element Manager and all era rulebooks and gameplay interfaces. All interactive elements (forms, buttons) are disabled in this mode, making it ideal for GMs, returning players who want to review the state before joining, or an audience following the game's progress.
-   **Era Rulebook**: A view that displays the rules for each era of the game.
-   **Gameplay Interfaces for Eras I-VI**: Guided, AI-assisted interfaces for players to create the various elements required by the rulebook for each era. Eras V and VI feature custom, multi-step interfaces (`EraEmpiresContent.tsx`, `EraCollapseContent.tsx`) that guide players through complex late-game events.
-   **Game End Screen**: A summary screen that appears after the final Omen is created in Era VI, showing world statistics and providing final export options.
-   **Element Manager**: A central hub to view, filter, search, and manage all created world elements.
-   **AI-Powered Generation**: Components use the Gemini API to generate narrative content, names, and ideas based on the game's rules and user input.
-   **Dynamic Progress Tracker**: A collapsible tracker at the bottom of the screen displays the group's progress through the current era, with an expandable view showing detailed per-player stats.
-   **Chronicle Feed System**: An asynchronous publishing system that allows a user (a "Chronicler") to share the state of their world.
    -   **Export**: A user can export the entire world state as a `chronicle-feed.json` file.
    -   **Publishing**: The user is responsible for hosting this JSON file on a public URL.
    -   **Subscribing**: Other users can paste the URL of a chronicle feed into the setup screen to load a complete, read-only version of the world, entering the game directly as an "Observer."
-   **Chronicle Lobby**: An extension of the feed system that provides a browsable directory of public games.
    -   **Discovery**: Users can click "Browse Chronicles" to see a list of available games without needing a direct URL.
    -   **Manifest File**: The lobby is powered by a central `manifest.json` file located at `/public/chronicles/manifest.json`. This file contains the metadata for all listed games.
    -   **Server Structure**: This system assumes a simple static file server where the host can create a `/chronicles/` directory, place the `manifest.json`, and create sub-folders for each game's `chronicle-feed.json`.
    -   **Manual Updates**: The "Chronicler" is responsible for manually updating both their `chronicle-feed.json` and the central `manifest.json` on their server.
    -   **Navigation**: The lobby includes a "Back to Setup" button for improved user navigation.

---

## 5. Developer Guides

### Component Co-location (Child Components)
To improve maintainability and reduce file system clutter, the project follows a component co-location pattern. Small, single-use components that are only relevant to a single parent component are defined directly within the parent's `.tsx` file, rather than in their own separate files.

-   **Benefits**: Keeps tightly-coupled presentation logic together, reduces the number of files per feature, and makes components easier to understand in context.
-   **When to Use**: Ideal for small, presentational components that are not intended for reuse elsewhere. For example, a `StatusCard` component used only within an `OverviewTab` would be defined inside `OverviewTab.tsx`.
-   **When Not to Use**: Large, complex, or widely shared components (e.g., `EditElementModal.tsx`, `EraLayoutContainer.tsx`, `Button.tsx`) should remain in their own dedicated files within `/src/components/shared/` or their respective feature directories.

### In-Era Progress Stepper
To provide clear, step-by-step feedback during complex, multi-part eras (like Myth, Foundation, and Discovery), the application uses the `StepProgressBar.tsx` component.

-   **Purpose**: This component displays the distinct gameplay steps within an era (e.g., "Prime Faction," "Neighbor," "Settlements") and shows the user's granular progress through each one (e.g., "Settlements (1/2)").
-   **Functionality**: It visualizes the current step, completed steps, and locked future steps. It allows players to navigate back to previously completed steps to review or edit their work.
-   **Relationship to Completion Tracker**: This component provides the *micro* view of progress within an era's UI. The main `CompletionTracker` in the footer provides the *macro* view of a player's total progress across all eras.

### Dynamic Turn & Timeline System
For Eras IV, V, and VI, the application uses a dynamic timeline system that moves beyond simple turn counts to track the world's history in years.

-   **Configurable Turn Duration**: In `GameSetup`, players set a `turnDuration` (in years), which is stored in `GameSettings`. This determines the narrative and mechanical time scale for each turn in the later eras.
-   **Year Calculation**: The `src/utils/timelineCalculator.ts` service calculates the current approximate year for a player based on their era, completed turns, and the `turnDuration`. This is displayed in the main navigation header.
-   **Timestamped Elements**: When creating elements in Eras IV-VI, players specify the exact `createdYear` of the event within the current turn's range. This data point is saved on the `ElementCard`.
-   **Timeline View**: The `ElementManager` features a "Timeline" view that sorts all elements chronologically by their `createdYear`, providing a narrative-first way to browse the world's history.
-   **Context-Aware AI**: The `AIContext` injects the current year and turn duration into prompts for later eras. This allows the AI to generate more contextually appropriate content, scaling its narrative from personal, immediate events for short turns to grand, historical sagas for longer turns.

### AI Interaction Pattern
To ensure a consistent user experience, all AI generation interfaces follow a standard set of interaction patterns. For detailed guidelines on non-destructive generation and contextual prompting, see the dedicated document.

**Reference**: [AI Interaction Patterns](./ai_interaction_patterns.md)

### Component-Based Rulebooks
To ensure maximum reliability and eliminate dependencies on external file fetching, all rulebook content is now implemented directly as React components.

-   **Architecture**: Instead of fetching `.html` files, each era's rulebook (e.g., `EraFoundationRules.tsx`) is a React component that composes smaller, single-purpose components for its content.
-   **Table Components**: All rulebook tables have been refactored into their own dedicated components (e.g., `RaceTable.tsx`, `WarTable.tsx`) located in `src/components/era-interfaces/common/rules/tables/`. This makes them reusable, type-safe, and easy to maintain.
-   **`RulesContainer.tsx`**: This component now acts as a simple wrapper and no longer contains any logic for fetching content or handling modals.
-   **Benefit**: This architecture is highly robust, as all content is part of the application's JavaScript bundle. It completely eliminates the risk of 404 errors for rulebook content, which was a critical issue in the target deployment environment.

### Debug & Developer Tools
The application includes a comprehensive debug menu, available only when `isDebugMode` is active in the `GameContext`.

-   **`UnifiedDebugSystem.tsx`**: The main debug component, which acts as a router for various diagnostic tabs.
-   **Modular Data Hooks**: A set of dedicated hooks (`useFileHealthCheck`, `usePerformanceMetrics`, `useEnvironmentConstraints`, etc.) run in the background to collect live data about the application's state and the platform it's running on.
-   **Diagnostic Tabs**:
    -   **Overview**: A summary dashboard of key metrics and quick actions.
    -   **File Health**: A detailed report on the loading status and metadata of critical source files.
    -   **Environment Constraints**: A powerful diagnostic tool that actively tests the capabilities of the deployment environment (e.g., file system access, network restrictions, API availability) to identify platform-specific issues and provide actionable recommendations.
    -   **Performance, System Info, Console**: Detailed views for their respective data domains.
    -   **Game Tools**: Utilities for manipulating game state, such as prepopulating era data or unlocking navigation.

### How to Add a New Element Type

Adding a new type of element (e.g., a new type of card) to the application requires updating several key files to ensure it's fully integrated. Follow these steps:

1.  **Update `src/types.ts`**:
    -   Create a new interface for the element's specific data (e.g., `export interface MyNewType { ... }`).
    -   Add the new type name as a string literal to the `ElementCard['type']` union (e.g., `type: 'Resource' | ... | 'MyNewType'`).
    -   Add the new data interface to the `ElementCard['data']` union (e.g., `data: Resource | ... | MyNewType`).

2.  **Update Element Manager Views**:
    -   **`src/components/world-manager/ElementCardDisplay.tsx`**: Update the `getEmoji` function and `typeIcons` constant to handle the new type for the grid view.
    -   **`src/components/world-manager/ElementListRow.tsx`**: Update the `getEmoji` function and `typeIcons` constant for the list view.
    -   **`src/components/world-manager/ElementTimelineRow.tsx`**: Update `getEmoji` and `typeIcons` for the timeline view.
    -   **`src/components/world-manager/ElementManager.tsx`**: Update the search filter logic to correctly access a descriptive text field of the new type.

3.  **Create an Edit Form (`src/components/shared/edit-forms/`)**:
    -   Create a new component (e.g., `MyNewTypeForm.tsx`) that implements the `ElementFormProps<MyNewType>` interface. This component will contain the specific form fields for editing your new type.
    -   Import and integrate this new form into `src/components/shared/EditElementModal.tsx` using a `case` in the `renderForm` switch statement.

4.  **Update the Export Service (`src/services/exportService.ts`)**:
    -   Add a new `case` to the `switch` statements in both `exportElementToHtml` and `exportElementToMarkdown` to correctly format and export the new element type's data.

5.  **Create a Gameplay Component & Sidebar Card**:
    -   Create a new component (e.g., `MyNewTypeCreator.tsx`) in the appropriate `src/components/era-interfaces/` sub-folder. This component will contain the UI for creating the new element.
    -   The application uses a universal sidebar card renderer (`ElementCardRenderer.tsx`). To add a display card for your new type, you must create a dedicated card component (e.g., `MyNewTypeCard.tsx`) and add it to the `switch` statement within `ElementCardRenderer.tsx`. This ensures your new element type appears correctly in all gameplay sidebars.

6.  **Integrate into the Era Interface**:
    -   Import your new gameplay component and wire it into the appropriate `Era*Content.tsx` component, passing down props like `onCreateElement`, `onUpdateElement`, etc.

### Coding Best Practices

-   **Accessibility (A11y)**: Always use semantic HTML. Add ARIA attributes (`aria-label`, `aria-current`, `role`) where necessary to provide context for screen readers. Ensure all interactive elements are keyboard-navigable and have clear focus states.
-   **Type Safety**: Leverage TypeScript's strengths. Define clear and comprehensive interfaces for all props and data structures in `src/types.ts`. Avoid using `any` unless absolutely necessary.
-   **Modularity & Single Responsibility**: Keep components small and focused. If a component grows too large or handles too many concerns, refactor it into smaller, more manageable sub-components. Extract complex or reusable logic into custom hooks (`src/hooks/`).
-   **State Management**: For localized state, use `useState` and `useReducer`. For state shared across multiple components, use React Context. Lift state up only as far as necessary.
-   **Consistency**: Adhere to the project's established visual and coding styles. Refer to the **Style Guide** for UI patterns and Tailwind CSS conventions.
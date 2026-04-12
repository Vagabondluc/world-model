# Current Architecture Overview

This document describes the architecture of the Mappa Imperium application in its current state. **It is critical to understand that this is a client-side only application.** There is no backend server or database. All features, including multi-player interactions, are simulated locally within the browser. Session data persists automatically through `localStorage` (key: `mappa-imperium-save`). Manual JSON import/export flows remain available for portability and collaboration.

For the long-term vision including a full backend and real-time collaboration, please refer to the `/docs/roadmap/` directory.

## 1. Core Technology

-   **Frontend Framework**: React with TypeScript.
-   **Styling**: Hybrid system that keeps Tailwind's CDN-loaded utility classes while defining our design tokens and component classes in a large `<style>` block in `index.html`. The custom layer uses CSS custom properties to drive light/dark theming. See the [Styling Architecture](./styling_architecture.md) guide for details.
-   **AI Integration**: `@google/genai` SDK for client-side calls to the Gemini API.
-   **Deployment Target**: The application is designed for deployment on **Google Cloud Run**. This choice imposes specific architectural constraints, particularly regarding statelessness and static file serving, which are addressed by the application's design. For detailed information, see the [Google Cloud Run Development Guidelines](./google_cloud_run_guidelines.md).

## 2. Environments & Tooling

The repository supports both a local Vite workflow and the Google AI Studio sandbox.

-   **Local Vite Workflow**: Developers can run `npm run dev` or `npm run build` using the dependencies in `package.json`. Vite transpiles the TypeScript entry points (`index.tsx` and everything under `src/`) and serves static assets from `/public`.
-   **AI Studio Fallback**: `index.html` declares an import map that resolves React, the Gemini SDK, and other packages to `aistudiocdn.com`. This path lets the app boot without installing `node_modules`, which is required when working inside AI Studio's read-only projects.
-   **Read/Write Constraints**: Because AI Studio disallows filesystem writes at runtime, the runtime avoids generating files or mutating configuration. Local development has no such restriction.
-   **Styling Execution**: Tailwind's CDN script is still loaded for utility classes, and our bespoke component styles are hand-authored in the inline `<style>` block so no compiled CSS file needs to be fetched.

> **Tip**: For deployment targets like Cloud Run, prefer the Vite build artefacts. Use the CDN import-map path only when you need to reproduce the AI Studio environment.

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
-   **Interactive Setup Screen**: The "Basics & Setup" (Era 0) view is now an interactive starting point, allowing players to choose the Pangea alternate rule and officially begin the game, advancing to Era I.
-   **Observer Role**: A user can join any game session as an "Observer" from the `PlayerSelection` screen. This provides full read-only access to the entire world state, including the Element Manager and all era rulebooks and gameplay interfaces. All interactive elements (forms, buttons) are disabled in this mode, making it ideal for GMs, returning players who want to review the state before joining, or an audience following the game's progress.
-   **Era Rulebook**: A view that displays the rules for each era of the game.
-   **Specialized Gameplay Interfaces for Eras I-VI**: Each era has a custom, guided, AI-assisted interface for players to create the various elements required by the rulebook. Eras IV, V, and VI in particular feature dedicated "engine" components (`DiscoveryEngine`, `EmpiresEventEngine`, `CollapseEventEngine`) that manage their unique, turn-based event structures.
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

### Rich Text Editing with Quill.js

The application uses **Quill.js** for all rich text editing functionalities, wrapped in a dedicated React component to manage its lifecycle and state.

-   **Component Wrapper**: All instances of the editor are handled by `src/components/shared/RichTextEditor.tsx`. This component is responsible for initializing Quill, synchronizing its content with React state, and handling read-only states.
-   **Styling**: The base "Snow" theme is loaded from a CDN. Custom overrides are applied in `index.html` to align the editor's appearance with the application's aesthetic.
-   **Stacking Context (Overflow) Fix**: A critical configuration is in place to prevent Quill's dropdown menus (for fonts, links, etc.) from being clipped or hidden by other UI elements like the fixed footer.
    -   **The Problem**: By default, Quill's popups can be trapped inside containers with `overflow: hidden` or lower stacking contexts.
    -   **The Solution**: We explicitly configure Quill with `bounds: document.body`. This tells Quill to append its popups directly to the main document body, allowing them to break out of their parent containers. Combined with a very high `z-index` (`1000`) set in `index.html`, this ensures the editor's menus always appear on top of all other application content.

### AI Interaction Pattern
To ensure a consistent user experience, all AI generation interfaces follow a standard set of interaction patterns. For detailed guidelines on non-destructive generation and contextual prompting, see the dedicated document.

**Reference**: [AI Interaction Patterns](./ai_interaction_patterns.md)

### Component-Based Rulebooks
To ensure maximum reliability and eliminate dependencies on external file fetching, all rulebook content is now implemented directly as React components.

-   **Architecture**: Instead of fetching `.html` files, each era's rulebook (e.g., `EraFoundationRules.tsx`) is a React component that composes smaller, single-purpose components for its content.
-   **Table Components**: All rulebook tables have been refactored into their own dedicated components (e.g., `RaceTable.tsx`, `WarTable.tsx`) located in `src/components/era-interfaces/common/rules/tables/`. This makes them reusable, type-safe, and easy to maintain.
-   **Benefit**: This architecture is highly robust, as all content is part of the application's JavaScript bundle. It completely eliminates the risk of 404 errors for rulebook content, which was a critical issue in the target deployment environment.

### Debug & Developer Tools
The application includes a comprehensive debug menu, available only when `isDebugMode` is active in the `GameContext`.

-   **`UnifiedDebugSystem.tsx`**: The main debug component, which acts as a container for various diagnostic tabs.
-   **Modular Architecture**: The system is broken down into a clean, feature-based structure. Data gathering is handled by dedicated, reusable custom hooks, and the UI for each tab is its own isolated component.
-   **Data Hooks**: A set of hooks (`useFileHealthCheck`, `usePerformanceMetrics`, `useEnvironmentConstraints`, etc.) run in the background to collect live data about the application's state and the platform it's running on.
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

2.  **Update `src/utils/elementUtils.ts`**:
    - Add the new type to `typeIcons` and update the `getElementSymbol` switch statement to handle its specific symbol logic.

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





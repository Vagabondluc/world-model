

# Source Code Organization

This document provides an exhaustive, file-by-file manifest of the Mappa Imperium project. It explains the purpose of each directory and file, serving as a complete blueprint of the application.

---

## Root Directory

This level contains the core configuration and entry points for the application.

-   **`.env.local`**: (Not in version control) Stores local environment variables. The primary variable is `API_KEY` for the Gemini API.
-   **`.gitignore`**: A standard Git file that specifies which files and directories should be ignored by version control (e.g., `node_modules`, `.env.local`).
-   **`filelist.txt`**: A text file containing a complete list of all project files, used for auditing and verifying the completeness of this documentation.
-   **`index.html`**: The main entry point for the web application. It sets up the HTML document structure, loads the Tailwind CSS CDN, defines the import map for browser-native ES modules, and contains the critical `<style type="text/tailwindcss">` block where the application's component class library is defined.
-   **`index.tsx`**: The root of the React application. It handles the initial rendering of the `App` component within the `GameProvider`. `App` acts as a top-level view controller, deciding whether to show `GameSetup`, `PlayerSelection`, `ChronicleLobby`, or the main `AppLayout` based on the global `gameState`.
-   **`metadata.json`**: Contains metadata for the application, such as its name and any required device permissions (e.g., camera or microphone).
-   **`package.json`**: The Node.js project manifest. It defines project metadata, lists dependencies, and contains scripts for running the development server (e.g., `dev`, `build`).
-   **`README.md`**: The primary README for the project, providing a high-level overview, setup instructions, and general information.
-   **`tailwind.config.js` & `index.css`**: Standard Tailwind CSS files that are intentionally left **empty**. They are not used by the Tailwind CDN's Just-In-Time (JIT) compiler.
-   **`tsconfig.json`**: The configuration file for the TypeScript compiler, defining the rules and options for how `.ts` and `.tsx` files are transpiled into JavaScript.
-   **`vite.config.ts`**: The configuration file for Vite, the development server and build tool used for this project.

---

## `/public/` Directory

This directory contains static assets that are served directly to the client without processing.

### `/chronicles/` Directory

Contains the data for the public Chronicle Lobby.

-   **`manifest.json`**: The central index file for the lobby. It contains metadata for all public games and points to their respective feed files.
-   **/sundered_isles_chronicle/**: A directory containing a demo game feed.
    -   `chronicle-feed.json`: The sample world state for "The Sundered Isles".
-   **/iron_empire_chronicle/**: A directory containing a second demo game feed.
    -   `chronicle-feed.json`: The sample world state for "Chronicle of the Iron Empire".

---

## `/src/` Directory

This is the main application source code folder containing all TypeScript and React files.

### `/components/` Directory

Contains all React components, organized by feature or domain.

#### `/debug/`
The comprehensive, modular debug system.
-   **`UnifiedDebugSystem.tsx`**: The main container and view router for the debug panel.
-   **/hooks/**: Dedicated hooks for gathering specific types of debug data.
    -   `useConsoleLogger.ts`: Manages and captures console log entries.
    -   `useEnvironmentConstraints.ts`: Runs a suite of tests to determine the capabilities and limitations of the runtime environment.
    -   `useFileHealthCheck.ts`: Audits the status and metadata of critical source files.
    -   `usePerformanceMetrics.ts`: Collects performance data like memory usage and render times.
    -   `useSystemInfo.ts`: Gathers information about the user's browser and system.
-   **/tabs/**: Individual components for each tab within the debug panel.
    -   `ConsoleTab.tsx`, `EnvironmentConstraintsTab.tsx`, `FileHealthTab.tsx`, `GameToolsTab.tsx`, `OverviewTab.tsx`, `PerformanceTab.tsx`, `SystemInfoTab.tsx`.
-   **/utils/**: Helper functions for the debug system.
    -   `environment.ts`, `fileAnalysis.ts`, `reportExporter.ts`.
-   **/types/**:
    - `debugTypes.ts`: Contains all TypeScript interfaces for the debug system.

#### `/era-interfaces/`
The core of the user experience. Each sub-folder contains the UI and logic for a specific gameplay era.

-   **/common/**: Reusable components shared across multiple era interfaces.
    -   `EraLayoutContainer.tsx`: The primary two-column layout component used by most eras to ensure a consistent look and feel.
    -   `GenericAIGenerator.tsx`: A simple, reusable AI generation interface, primarily used for demonstration.
    -   `SubRollHelper.tsx`**: A reusable UI component for handling secondary dice rolls within a larger gameplay step.
    -   **/rules/**: Contains the self-contained React components that render the rulebooks.
        -   `RulesContainer.tsx`: A simple wrapper for rulebook content.
        -   `EraCollapseRules.tsx`, `EraCreationRules.tsx`, `EraDiscoveryRules.tsx`, `EraEmpiresRules.tsx`, `EraFoundationRules.tsx`, `EraHomeRules.tsx`, `EraMythRules.tsx`.
        -   **/tables/**: Contains all the individual, reusable table components that make up the rulebooks.
            - `CollapseTable.tsx`, `ColorTable.tsx`, `DeityCountTable.tsx`, `DeitySymbolTable.tsx`, `DiscoveryTable.tsx`, `DomainTable.tsx`, `EmpiresTable.tsx`, `GameLengthTable.tsx`, `GeographyTable.tsx`, `LandmassTable.tsx`, `NameTable.tsx`, `NamingIdeasTable.tsx`, `NeighborsDevelopTables.tsx`, `NeighborsTable.tsx`, `OmensTable.tsx`, `ProfessionsTable.tsx`, `ProsperityTable.tsx`, `RaceTable.tsx`, `SacredSitesTable.tsx`, `SettlementTable.tsx`, `SymbolTable.tsx`, `WarTable.tsx`.

-   The structure for `/era-creation/`, `/era-discovery/`, `/era-foundation/`, and `/era-myth/` remains largely the same, containing the specific UI and forms for each step of their respective gameplay loops.

-   **/era-collapse/**: Contains the components for the Era VI: Age of Collapse gameplay interface.
    -   `CollapseEventEngine.tsx`: The main component for handling the turn-based final events.
    -   `CollapseEventSelector.tsx`: The dropdown for selecting the rolled event.
    -   `IconicLandmarkCreator.tsx`: The dedicated UI for players to define their final, significant landmark.
    -   `WorldOmenCreator.tsx`: The UI for the final, collaborative dice roll to determine the world's omen.

-   **Era Content Files**: `EraHomeContent.tsx`, `EraCreationContent.tsx`, `EraMythContent.tsx`, `EraFoundationContent.tsx`, `EraDiscoveryContent.tsx`, `EraEmpiresContent.tsx`, `EraCollapseContent.tsx` are the top-level components for each era's "Rulebook" view.
-   **`EraContent.tsx`**: A router component that renders the correct era content based on the `viewedEraId`.

#### `/layout/`, `/navigation/`
These directories remain the same, containing the main application shell, header, footer, and navigation components.

#### `/session/`
-   **`AiPlayerSetup.tsx`**: A new component for configuring AI player personalities and play styles before a game begins.
-   **`ChronicleLobby.tsx`**: The UI for browsing and loading public games.
-   **`GameEndScreen.tsx`**: A final summary screen displayed after the chronicle is complete.
-   **`GameSetup.tsx`**: The initial screen for starting a new game or importing a saved one.
-   **`PlayerSelection.tsx`**: The screen where players join, rejoin, or become an observer.

#### `/shared/`
This directory of reusable components remains a crucial part of the architecture, containing elements like modals, forms, buttons, and the `ElementCardRenderer`.

### `/contexts/`, `/data/`, `/hooks/`, `/services/`, `/utils/`
These directories' purposes remain largely unchanged, providing global state, static data, custom hooks, external services, and utility functions respectively.

### Root `/src/` Files
-   **`types.ts`**: The central source of truth for all TypeScript type and interface definitions.
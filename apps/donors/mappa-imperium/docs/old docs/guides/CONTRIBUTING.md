# Mappa Imperium - Contribution Guide

Welcome, worldbuilder! This guide provides everything you need to get the Mappa Imperium application running locally, understand its architecture, and make your first contribution.

## 1. Getting Started

### Prerequisites
-   Node.js (v18 or later)
-   Git
-   A Gemini API Key

### Setup
1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd mappa-imperium
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Set Up Environment Variables**:
    -   Create a new file named `.env.local` in the root directory of the project.
    -   Add your Gemini API key to this file:
        ```
        API_KEY=your_gemini_api_key_here
        ```
    - The application is hardcoded to use `process.env.API_KEY`, so this step is mandatory for the AI features to work.

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The application should now be running, typically at `http://localhost:5173`.

## 2. Codebase Overview

The application is a client-side React SPA built with Vite and TypeScript. It has some specific architectural patterns you need to know.

-   **Architecture Deep Dive**: Before diving into the code, read the **[Current Architecture Overview](../current/current_architecture_overview.md)**. It explains the "build-less" environment, the inlined styling, and the simulated multiplayer, which are critical to understanding the project's constraints.

-   **Source Code Structure**:
    -   `/src/components`: All React components, organized by feature (e.g., `era-interfaces`, `world-manager`).
    -   `/src/contexts`: The heart of the app's state management. `GameContext.tsx` is the most important file here.
    -   `/src/types.ts`: The single source of truth for all TypeScript interfaces.
    -   `/src/data`: Contains static data for the game, like era definitions and AI prepopulation data.

-   **The "Element" Data Structure**: The core of the world state is the `elements` array, managed in `GameContext`. Every significant item in the world (a resource, a faction, a hero, an event) is an `ElementCard` object with a unique ID, a type, and a `data` payload.

## 3. Development Workflow

1.  **Find a Task**: All work is tracked in **[to_do.md](../to_do.md)**. Pick a task from the "Backlog" or "Next Up" sections.
2.  **Create a Branch**: Create a new branch for your task.
    ```bash
    git checkout -b feature/TODO-0.0.2-045-new-feature
    ```
3.  **Implement the Feature**:
    -   Adhere to the **[Component & Code Quality Standards](../current/component_standards.md)**. Pay close attention to file size limits and styling rules.
    -   Use the **[Style Guide](../current/style_guide.md)** for all UI work to ensure visual consistency.
4.  **Use the Debug System**:
    -   The easiest way to enter debug mode is to click the "Debug Start" button on the `GameSetup` screen.
    -   The debug menu (Ctrl+Shift+D) provides powerful tools for inspecting state, testing environmental constraints, and populating game data. Refer to the **[Debug System Specification](../roadmap/debug_system_spec.md)** for more details.
5.  **Submit a Pull Request**:
    -   Ensure your code passes the linter (`npm run lint`).
    -   Before submitting, review your changes against the **[Code Review Checklist](../current/code_review_checklist.md)**.
    -   Push your branch and open a PR, linking it to the corresponding task in `to_do.md`.



# Documentation Organization

This document serves as a manifest for all files and folders within the `/docs` directory. It provides a brief description of each document's purpose, acting as a quick reference and guide to the project's documentation.

---

## Root Directory (`/docs/`)

-   **`README.md`**: The master guide and charter for the entire documentation system. It explains the *why* behind the documentation structure, versioning, and maintenance processes.
-   **`Design Brief.md`**: The high-level project plan. It outlines visual standards, the AI integration strategy, and contains the master checklist of all UI components that need to be built.
-   **`bug_report.md`**: The official log for tracking all user-reported bugs, their current status, and which tasks in `to_do.md` are linked to fixing them.
-   **`documentation_organization.md`**: This file. A manifest of the documentation itself.
-   **`to_do.md`**: The project's active to-do list and task tracker for general development.
-   **`to_do_solo.md`**: A dedicated to-do list for features specifically enhancing the solo gameplay experience.

---

## AI Templates (`/docs/ai-templates/`)

This directory contains the precise markdown specifications for prompts sent to the Gemini AI. Each file ensures consistent, high-quality, and correctly formatted responses for specific worldbuilding tasks.

-   **Root Templates**: Contains all the core prompt templates for each era and major feature (e.g., `2_1_god-prompt-template.md`, `Z_battle-chronicle-prompt.md`).
-   **`/events/` Sub-directory**: Contains detailed specifications for the dynamic UI forms that need to be generated for each specific event roll in Eras IV, V, and VI. These files are blueprints for the front-end, not direct AI prompts.

---

## Current State (`/docs/current/`)

This directory contains documentation describing the application **as it is currently implemented**.

-   **`README.md`**: An introduction to the "Current State" documentation, clarifying that it describes the present implementation, not the future roadmap.
-   **`ai_assistant_instructions.md`**: A comprehensive instruction manual for the Gemini AI.
-   **`ai_interaction_patterns.md`**: Defines the "non-destructive" UI pattern for AI generation.
-   **`content_export_spec.md`**: Defines the structure for all export formats (JSON, HTML, Markdown).
-   **`current_architecture_overview.md`**: Explains the current client-side React architecture, state management, component-based rulebooks, and debug system.
-   **`element_manager_spec.md`**: The detailed specification for the Element Manager UI.
-   **`google_cloud_run_guidelines.md`**: A guide detailing best practices and constraints for deploying to Google Cloud Run.
-   **`style_guide.md`**: The official visual design document.
-   **`styling_architecture.md`**: Explains the CDN-based, build-less Tailwind CSS architecture.
-   **`updating_progress_tracker.md`**: A developer guide on how to update the `CompletionTracker` component.
-   **`z_index_hierarchy.md`**: Defines the application-wide z-index layering strategy to prevent visual conflicts between floating elements.

---

## Guides (`/docs/guides/`)

This directory contains practical guides for different audiences, from developers to end-users.

-   **`ARCHITECTURAL_DECISIONS.md`**: A log of key architectural decisions, the alternatives considered, and the rationale behind the chosen path.
-   **`CONTRIBUTING.md`**: The essential onboarding guide for new developers, covering setup, codebase overview, and workflow.
-   **`DEPLOYMENT.md`**: A step-by-step guide for deploying the frontend and backend to Google Cloud Run.
-   **`USER_GUIDE.md`**: A manual for players explaining how to use the application's features.

---

## Game Rules (`/docs/game-rules/`)

This directory contains the text of the original Mappa Imperium tabletop rulebook, transcribed into markdown files for easy reference.

-   **`basics_setup.md`**: Covers the core concepts and initial game setup.
-   **`play_overview.md`**: Explains the flow of the game through the six eras.
-   **`special_rules.md`**: Details special mechanics like the "War!" table.
-   **`era_*.md`**: A separate file for each of the six eras, detailing its specific rules and tables.

---

## Project Roadmap (`/docs/roadmap/`)

This directory contains aspirational documents describing the **future, target architecture** for the project. This is the long-term vision.

-   **`README.md`**: An introduction clarifying that these documents describe the future vision, not the current implementation.
-   **`backend_integration_strategy.md`**: A pragmatic, phased approach for integrating a minimal backend.
-   **`backend_spec.md`**: The target architecture for a full-stack application with a database (long-term vision).
-   **`component_library_evaluation.md`**: An analysis of the effort and architecture required to build a portable, headless component library from the existing UI.
-   **`element-manager-extraction-plan.md`**: A detailed technical proposal for refactoring the Element Manager into a portable, configurable, and reusable component library.
-   **`visual-theming-system.md`**: A feature proposal and implementation guide for adding a dynamic theme switcher to the application.
-   **`master_guide/` Sub-directory**: Contains the phased development plan for building out the full target architecture.

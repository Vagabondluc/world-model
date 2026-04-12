

# Documentation Organization

This document serves as a manifest for all files and folders within the `/docs` directory. It provides a brief description of each document's purpose, acting as a quick reference and guide to the project's documentation.

---

## Root Directory (`/docs/`)

-   **`README.md`**: The master guide and charter for the entire documentation system. It explains the *why* behind the documentation structure, versioning, and maintenance processes.
-   **`Design Brief.md`**: The high-level project plan. It outlines visual standards, the AI integration strategy, and contains the master checklist of all UI components that need to be built.
-   **`bug_report.md`**: The official log for tracking all user-reported bugs, their current status, and which tasks in `to_do.md` are linked to fixing them.
-   **`documentation_organization.md`**: This file. A manifest of the documentation itself.
-   **`to_do.md`**: The project's active to-do list and task tracker. It's a living document that manages what's being worked on, what's in the backlog, and what's completed.
-   **`feature_proposal_play_by_email.md`**: Outlines a system for asynchronous turn-based gameplay using granular JSON turn packages.
-   **`feature_proposal_chronicle_feed.md`**: Details the system for publishing a world's state to a single, shareable JSON file for observers.
-   **`feature_proposal_chronicle_lobby.md`**: Describes the implementation of a browsable lobby for discovering public chronicle feeds.
-   **`feature_proposal_private_chronicles.md`**: A proposal for a future, server-based system with password-protected games and invitation links.
-   **`feature_proposal_hybrid_gamemode.md`**: A proposal outlining the architecture for a configurable AI service layer that supports both cloud-based and local LLMs.

---

## AI Templates (`/docs/ai-templates/`)

This directory contains the precise markdown specifications for prompts sent to the Gemini AI. Each file ensures consistent, high-quality, and correctly formatted responses for specific worldbuilding tasks.

-   **Root Templates**:
    -   `1_4_fantasy-resources-prompt.md`: Defines the AI prompt for generating unique resources in Era I.
    -   `2_1_god-prompt-template.md`: Defines the AI prompt for generating deities and sacred sites in Era II.
    -   `3_1_faction-prompt-revised.md`: Defines the AI prompts for the multi-stage faction development process in Era III.
    -   `3_2_hero-location-prompt.md`: Defines the AI prompt for creating heroes and their associated legendary locations in Era III.
    -   `4_1_discovery-prompts.md`: Contains a collection of mini-prompts for each possible discovery event roll in Era IV.
    -   `4_2_landmark-prompt.md`: Defines the AI prompt for generating fantastic landmarks in Era IV.
    -   `4_23_settlement-prompt.md`: Defines the AI prompt for generating detailed settlement descriptions, primarily used in Era III.
    -   `4_31_prosperity-prompt.md`: Defines the AI prompt for developing a faction's economic/cultural specialty in Era IV.
    -   `5_1_empire-events-prompts.md`: A collection of mini-prompts for each empire event roll in Era V.
    -   `5_2_minor-faction-narrative-prompt.md`: Defines the AI prompt for evolving minor factions in Era V.
    -   `6_1_collapse-prompt.md`: Defines the narrative prompts for collapse events in Era VI.
    -   `6_2_final-era-prompt.md`: Defines the AI prompts for creating the final iconic landmarks and the world-ending omen in Era VI.
    -   `Z_battle-chronicle-prompt.md`: A special, cross-era template for generating detailed battle narratives whenever a "War!" event occurs.

-   **`/events/` Sub-directory**: Contains detailed specifications for the dynamic UI forms that need to be generated for each specific event roll in Eras IV, V, and VI. These files are blueprints for the front-end, not direct AI prompts.

---

## Current State (`/docs/current/`)

This directory contains documentation describing the application **as it is currently implemented**.

-   **`README.md`**: An introduction to the "Current State" documentation, clarifying that it describes the present implementation, not the future roadmap.
-   **`ai_assistant_instructions.md`**: A comprehensive instruction manual for the Gemini AI, detailing how it should behave, interpret user input, and adhere to narrative continuity.
-   **`ai_interaction_patterns.md`**: Defines the "non-destructive" UI pattern for AI generation, ensuring user-written text is never accidentally overwritten.
-   **`content_export_spec.md`**: Defines the structure and format for exporting the full game state to JSON and individual elements to HTML and Markdown.
-   **`current_architecture_overview.md`**: Explains the current client-side React architecture, state management, the fully **component-based rulebook system**, and the **modular debug system**.
-   **`element_manager_spec.md`**: The detailed specification for the Element Manager UI, covering card types, filtering, views (including the Timeline view), and user permissions.
-   **`google_cloud_run_guidelines.md`**: A guide detailing best practices and constraints for deploying applications on the Google Cloud Run platform.
-   **`source_code_organization.md`**: A manifest explaining the purpose of each file and folder in the `/src` directory, reflecting the current codebase.
-   **`style_guide.md`**: The official visual design document, specifying the color palette, typography, and styling rules for all UI components.
-   **`style_token_analysis.md`**: A deep-dive into the application's styling, justifying and listing the classes in the centralized component class library.
-   **`styling_architecture.md`**: Explains the CDN-based, build-less Tailwind CSS architecture where styles are inlined in `index.html`.
-   **`updating_progress_tracker.md`**: A developer guide on how to add a new era's progress goals to the `CompletionTracker` component.

---

## Examples & Mockups (`/docs/example/`)

This directory contains static HTML and CSS files that serve as visual mockups or shareable assets.

-   **`dynamic_event_form_mockup.html`**: A visual mockup of what a dynamically generated event form should look like.
-   **`era_layout_container.html`**: A visual mockup of the reusable `EraLayoutContainer` component.
-   **`mappa-imperium-style.css`**: A shareable CSS file that allows users to style their own external HTML content to match the application's aesthetic.

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
-   **`ai_integration_spec.md`**: The plan for a more deeply integrated, template-driven AI system.
-   **`backend_spec.md`**: The target architecture for a full-stack application with a Node.js backend and database.
-   **`cross_player_coordination_spec.md`**: The specification for managing complex multi-player interactions.
-   **`debug_system_spec.md`**: The plan for a comprehensive in-app developer debug panel.
-   **`dynamic_turn_system.md`**: The specification for the year-based timeline system.
-   **`Era_Content_Creation_Spec.md`**: A detailed plan for the content creation workflow for each era in the target architecture.
-   **`Frontend Designs with Template Integration.md`**: Mockups for the future UI that is driven by the AI template system.
-   **`master_development_guide.md`**: An older version of the primary development guide.
-   **`multi_player_session_spec.md`**: The full specification for managing true real-time multi-player sessions.
-   **`portable_component_architecture.md`**: Outlines the long-term vision for refactoring the application to use a proper build step and a portable component/styling library, ensuring robust deployment on platforms like Google Cloud.
-   **`static_content_architecture.md`**: **(DEPRECATED)** The specification for the system of loading rulebooks from external HTML files. This architecture was rejected in favor of a more reliable component-based system.

-   **`/master_guide/` Sub-directory**: Contains the phased development plan for building out the full target architecture.
    -   **`README.md`**: The primary guide for the development philosophy and coding standards.
    -   **`development_checklists.md`**: Quality assurance checklists for each development phase.
    -   **`phase_*.md`**: Detailed plans for each phase of the development roadmap.
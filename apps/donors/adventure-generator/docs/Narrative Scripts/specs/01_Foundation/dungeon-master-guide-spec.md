# Specification: DM Command Center (dungeon-master-guide)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The DM Command Center is the unified orchestration hub for the Narrative Scripts application. It allows the Dungeon Master to manage workspaces, toggle specific AI models (Thinking vs. Instruct), and track the progress of the 15-step dungeon creation workflow.

## 2. Component Architecture
### 2.1 Core Panels
- **Unified Orchestration Hub**:
    - Centralizes workspace management.
    - Controls execution of script modules.

- **Step-Sequential Sidebar**:
    - Visual list of the 15 workflow steps (Concept -> Map -> Key -> etc.).
    - **Status Indicators**:
        - `[x]` Completed
        - `[/]` In Progress
        - `[ ]` Pending
    - **Dependency Logic**: Warnings/dimming for steps missing prerequisites.

- **AI Toggle Dashboard**:
    - **Model Selection**: Choose between models (e.g., `olmo:3:7b-instruct`).
    - **Thinking Mode**: Toggle visibility of "Thinking" process (Logged / Opaque).

- **Command Stream (Console)**:
    - Integrated terminal output.
    - Streams `stdout/stderr` from script execution.

## 3. Interaction Logic
- **Workspace Context**:
    - Actions are scoped to the "Working Folder" (e.g., `./Narrative Scripts/ttrpg-master`).
    - Updates `Manifest` automatically.

- **Script Discovery**:
    - "Discover Scripts" button scans directories for valid script files.
    - Populates the execution menu.

- **Sequential Guardrails**:
    - Prevents executing Step 3 (Key) if Step 2 (Map) data is missing.

## 4. Visual Design
- **Aesthetic**: Mission Control / Dashboard.
- **Layout**: Card-based, high information density.
- **Navigation**: Collapsible sidebar with progressive disclosure of file paths.

## 5. Workflow Data
- **Steps**:
    1. Concept Brainstormer
    2. Dungeon Map Creator
    3. Dungeon Key Writer
    4. Random Encounters
    5. Adversary Roster
    6. Features Summarizer
    7. Corridor Themes
    ... (up to 15)

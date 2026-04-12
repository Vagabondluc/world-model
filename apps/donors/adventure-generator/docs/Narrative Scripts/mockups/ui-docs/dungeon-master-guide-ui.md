# UI Explanation: DM Command Center (dungeon-master-guide)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Unified Orchestration Hub:** The primary entry point for the Narrative Scripts application. It centralizes workspace management and script execution.
- **Step-Sequential Sidebar:** A visual representation of the 15-step dungeon creation workflow. It provides real-time progress tracking and dependency warnings.
- **AI Toggle Dashboard:** Controls for the Ollama integration. It includes a clear distinction between the "Instruct" (Generative) and "Thinking" (Logic/Refinement) models.
- **Command Stream (Terminal Console):** An integrated terminal output window that captures stdout/stderr from script executions, providing technical feedback to the DM.

## Interaction Logic
- **Workspace-Scoped Generation:** All actions are automatically context-aware of the current "Working Folder", ensuring that `Manifest updates` are correctly registered.
- **Batch Script Discovery:** An automated scan feature that populates the "Discover Scripts" menu by crawling the `Narrative Scripts` directory.
- **Sequential Guardrails:** The UI dims or flags steps that require data from a previous stage (e.g., you cannot "Write the Key" until a "Map" exists in the workspace).

## Visual Design
- **Mission Control Aesthetic:** Uses a clean, card-based layout with prominent status indicators.
- **High Information Density:** Designed to provide a "God's Eye View" of the entire adventure development process.
- **Progressive Navigation:** The 15-step list collapses to save space, but expands to show file references (e.g., `Execution_Systems/Dungeons/dungeon-key-writer.txt`).

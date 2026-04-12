# UI Questionnaire: non-linear_mystery

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A structural architect for mystery design that offers multiple investigation frameworks: Conclusion-focused, Funnel, Layer Cake, Loop, and Dead End implementations.

## 2. Core Inputs
- **Mystery Name:** The scenario title.
- **Structure Selection:**
    - **Conclusion:** Central terminal node with 3-4 feeders.
    - **Funnel:** Tiered layers narrowing to "Neck" nodes.
    - **Layer Cake:** Depth-based layers (e.g., surface, underworld, core).
    - **Loop:** Circular exploration (4-6 nodes) with multiple entries.
- **Dead End Design:** Integrating non-essential but rewarding investigative detours.
- **Proactive Element:** A triggerable "hint" or event to assist stuck players.

## 3. UI Requirements
- **Structure Selector Sidebar:** A menu to choose the overarching investigation framework.
- **Node Layer Manager:** A tool to group nodes into "Layers" (Tier 1, Tier 2, etc.) or "Loops."
- **Path Connectivity Graph:** A visual map that enforces the selected structure (e.g., showing a literal "Funnel" or "Loop").
- **Dead End Highlighter:** A specialized tag for nodes that provide lore/items but no outbound leads.
- **Clue Routing Auditor:** Ensures the "Three Clue Rule" is maintained across all essential revelations.

## 4. Derived & Automated Fields
- **Neck-Node Automatic Setup:** Flags specific nodes based on structure (e.g., "Layer 1 Gateway").
- **Loop-Break Trigger Suggestor:** Recommends when a loop should resolve into a conclusion.
- **Naming Convention Automator:** Handles complex filenames (e.g., `_Funnel_Layer2_B.txt`).

## 5. Exports & Integration
- Structured Node Files (.txt) with correct naming nomenclature.
- Investigation Flow Map (Markdown/Visio).
- GM Guidance for non-linear pacing.

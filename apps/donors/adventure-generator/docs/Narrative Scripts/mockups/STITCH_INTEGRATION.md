# Stitch Integration Guide

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


This guide explains how to take the UI mockups generated in `docs/mockups/` and use them as "System Prompts" for Stitch (or bolt.new / v0.dev) to generate working React components.

## The "One-Shot" Prompt Strategy

To get the best results from an AI coding agent, you should provide the complete context in a single prompt. We have organized the mockups specifically for this purpose.

### Anatomy of a Perfect Prompt

A perfect prompt for Stitch consists of 4 parts:
1.  **Role & Goal:** "You are an expert React developer. Build the [System Name] based on the following specifications."
2.  **Visual Blueprint (Wireframe):** The ASCII layout defining the structure.
3.  **Technical Specs (UI Doc):** The component architecture, state logic, and visual design rules.
4.  **Data Context (Sample):** A real-world example of the content to be displayed.

---

## Manual Assembly Workflow

1.  **Identify the System Slug:**
    Find the system you want to build in `docs/mockups/master_index.md`.
    *Example:* `combat_encounter`

2.  **Open the 3 Core Files:**
    - `docs/mockups/wireframes/combat_encounter-wireframe.md`
    - `docs/mockups/ui-docs/combat_encounter-ui.md`
    - `docs/mockups/samples/combat_encounter-sample.md`

3.  **Copy & Paste into Stitch:**
    Use the following template:

    ```text
    **GOAL:**
    Build a React + Tailwind CSS component for the "Combat Encounter Studio".
    Use Lucide-React for icons.

    **WIREFRAME:**
    [PASTE WIREFRAME CONTENT HERE]

    **TECHNICAL SPECIFICATIONS:**
    [PASTE UI DOC CONTENT HERE]

    **SAMPLE DATA:**
    [PASTE SAMPLE CONTENT HERE]
    ```

---

## Automated Assembly (Recommended)

We have provided a script to automatically assemble these prompts for you.

### Usage

1.  Open a terminal in the project root.
2.  Run the script with the system slug:
    ```bash
    python scripts/assemble_prompt.py --slug combat_encounter
    ```
3.  The script will print the full, formatted prompt to the console (and copy it to your clipboard if supported).
4.  Paste the result directly into Stitch.

### Finding Slugs
Run `python scripts/assemble_prompt.py --list` to see all available system slugs.

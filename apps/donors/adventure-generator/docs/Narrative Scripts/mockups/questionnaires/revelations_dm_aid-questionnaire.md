# UI Questionnaire: revelations_dm_aid

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A central management console for DMs to track the "Revelation List"—a reverse-engineered map of every node and the clues that lead to it, ensuring a robust Three Clue Rule implementation.

## 2. Core Inputs
- **Mystery Name:** The scenario title.
- **Adventure Summary:** A bulk text input of all nodes in the scenario.
- **Node List:** Names of all locations/scenes.
- **Clue Mapping:** For each node, which clues (from other nodes) point to it.
- **Proactive Node Data:** Details on emergency help nodes and their triggers.

## 3. UI Requirements
- **Revelation Matrix:** A structured list where each node is a header, showing its "Inbound Clues" and their sources.
- **Three-Clue Audit Dashboard:** A visual indicator (Red/Yellow/Green) for each node showing if it has the required 3+ inbound leads.
- **Source Cross-Referencer:** Highlighting a clue should show a "Jump to Source Node" button.
- **Importance/Difficulty Tags:** Metadata markers for "Critical Path" clues vs. "Obscure/Bonus" clues.
- **Proactive Node Registry:** A dedicated bottom panel for emergency investigative lifelines.

## 4. Derived & Automated Fields
- **Automatic Reverse-Mapping:** If Node A says "Go to Node B," the List for Node B automatically updates to show "Found in Node A."
- **Critical Path Visualizer:** Identifies "Information Bottle-necks" (nodes with only one fragile clue path).
- **Audit Reporter:** Generates a list of "Vulnerable Nodes" that lack sufficient redundancy.

## 5. Exports & Integration
- 1x Revelation List Master File (.txt).
- GM reference handout (PDF/Markdown).
- VTT "Secret Handout" for clue tracking.

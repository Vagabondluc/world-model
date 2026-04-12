# UI Explanation: Random Encounter Table Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Probability Distribution Engine:** A sophisticated backend that calculates roll ranges based on the selected die (e.g., the 2d6 bell curve vs. a linear d20). It informs the "Probability Visualizer" graph.
- **Dynamic Encounter Grid:** A rich table editor where DMs can tag encounters as "Common," "Uncommon," or "Rare." The UI automatically allocates roll numbers to match these weights.
- **Rules Meta-Injector:** A system of toggles that adds "Standard Procedures" to the output, such as Reaction Rolls (2d6) and Encounter Distance (2d6 x 10ft), ensuring the DM has all necessary rules at their fingertips.
- **Monte Carlo Simulator:** A testing module that performs hundreds of automated "virtual rolls" to provide the DM with an actual statistical breakdown of how their table will perform in practice.

## Interaction Logic
- **Weighted Slot Management:** Instead of manually typing "Roll 1-3," the DM simply types the encounter and selects "Common." The UI handles the range assignment to maintain the bell curve integrity.
- **Live XP Validation:** As creatures are added to an encounter description (e.g., "3 Ghouls"), the UI checks against the "Scaling" tier to warn the DM if the encounter is too deadly or too easy.
- **Format-Ready Export:** The tool produces clean, high-contrast tables designed for both digital screens and physical printouts, with bold text for easy reading under low-light gaming conditions.

## Visual Design
- **Analytical & Precise:** Uses a cleaner, more "utility-focused" aesthetic with data visualizations (graphs, percentages) to appeal to the "Math DM."
- **High Contrast:** Key data points (the roll results and encounter names) are highlighted with high-contrast banners.
- **Modular Layout:** Designed so the DM can hide the simulation and probability panels once the table is "locked" to focus on the content during a live session.

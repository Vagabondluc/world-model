# UI Questionnaire: Random Encounter Table Generator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A mathematical and thematic tool for DMs to build, balance, and weight random encounter tables using various die types and probability distributions.

## 2. Core Inputs
- **Table Size:** (Typically 6, 8, 12, or 20 entries).
- **Die Type:** (d4, d6, d8, d10, d12, d20, 2d6, d100).
- **Encounter Theme/Tier:** (e.g., Level 1-4 Forest, High-Magic Dungeon).
- **Probability Model:** (Equal Distribution, Bell Curve/2d6, Weighted/Custom).

## 3. UI Requirements
- **Table Editor Grid:** A dynamic spreadsheet-like interface to add/edit encounter descriptions, creature counts, and special conditions.
- **Probability Visualizer:** A real-time graph (bell curve or bar chart) showing the likelihood of each encounter.
- **Roll Simulator:** A "Test Run" button that rolls on the table X times to verify variety and balance.
- **Reaction & Distance Add-on:** Toggles to automatically include reaction roll instructions and distance-determining logic (e.g., 2d6 x 10ft).
- **Scale Adjuster:** A global slider to bump the difficulty of all encounters simultaneously (CR scaling).

## 4. Derived & Automated Fields
- **Weighted Slot Allocator:** Automatically assigns range values (e.g., 1-3, 4-7) based on the user's desired "Commonality" tags.
- **CR Budget Calculator:** Sums the XP/CR of creatures in an encounter to ensure it fits the party level.
- **Reaction Table Injector:** Pre-fills the standard 2d6 reaction table (Hostile to Friendly) as a footer.

## 5. Exports & Integration
- Printable Encounter Table (PDF/Print).
- VTT Roll Table (JSON/CSV).
- Campaign Wiki snippet.

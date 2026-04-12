# UI Questionnaire: Urban Crawl & City Exploration

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A district-based exploration engine that ties campaign "layers" (metascenarios) to specific city locations, facilitating investigation and faction-driven urban adventures.

## 2. Core Inputs
- **City District:** (e.g., Slums, Cathedral District, Noble Quarter).
- **Active Metascenario Layers:** (e.g., Vampire Blight, Gang War, Plague Outbreak).
- **Investigation Action Type:** (General, Layer-Specific, Faction-Targeted).
- **Triggered Events:** (Pre-defined encounters that fire on district entry).

## 3. UI Requirements
- **District Gazetteer Map:** A visual or list-based navigator to select city sectors.
- **Layer Management Console:** A dashboard to "toggle" active metascenarios and view their current "Heat" or status.
- **Investigation Resolver:** A workflow UI to handle skill checks and costs associated with city-wide inquiries.
- **Triggered Content Feed:** A real-time display of events that occur automatically upon arrival.
- **Faction Impact Tracker:** A sub-panel showing how urban exploration affects local power structures.

## 4. Derived & Automated Fields
- **Atmospheric Flavor Text:** Automatically generates sensory descriptions of the journey between districts using "Life in the City" logic.
- **Layer Conflict Resolution:** Logic to determine which layer "wins" (is encountered) during a general investigation roll.
- **Heat Accumulation:** Calculates the visibility/notoriety of the party based on their investigative actions.

## 5. Exports & Integration
- Urban Crawl Status Report (Markdown).
- Keyed District Reference (JSON).
- Faction Relationship Updates.

# UI Questionnaire: combat_encounter - V2

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A tactical encounter engine that prioritizes geographical influence, dynamic environment triggers, and synergistic enemy behavior.

## 2. Core Inputs
- **Unique Geography:** Detailed description of the area (Canyons, Volcanic, Icy).
- **Hazard Triggers:** Mechanism + Effect + Save DC (e.g., Pressure plate -> Geyser).
- **Dynamic Timings:** When the environment changes (e.g., Round 3 -> Fog thickens).
- **Force Composition:** Enemy types and their specific terrain synergies.
- **Interaction Options:** How players can use the terrain (e.g., Destabilizing a boulder).
- **Outcome Branches:** Resulting consequences for Success/Failure.

## 3. UI Requirements
- **Trigger Timeline:** A visual round-counter (R1, R2, R3...) where DMs can pin environmental changes.
- **Synergy Matrix:** A tool that pairs Enemy Abilities with Terrain Features (e.g., Mephit + Lava = Synergy: Thermal Rejuvenation).
- **Interaction Canvas:** A block-diagram showing how environmental features link to triggers.
- **Narrative Overlay:** Live-drafting the "Intro Description" based on the Geography inputs.

## 4. Derived & Automated Fields
- **Tactical Difficulty Score:** Weights the encounter based on how many hazards are present.
- **Restoration Hook Generator:** Suggests how the environment changes *after* the fight.

## 5. Exports & Integration
- Dynamic Encounter Card (HTML/JavaScript interactive card).
- VTT Macro-set for environment triggers.

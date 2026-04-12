# UI Questionnaire: Tactical Encounter & Combat Studio

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A high-performance environment for GMs to design, balance, and run combat and narrative encounters, with a focus on environmental storytelling, tactical depth, and scene flow.

## 2. Core Inputs
- **Encounter Type:** (Combat, Social Event, Trap, Skill Challenge, Urban Crawl).
- **Difficulty Rank:** (Copper/Easy, Silver/Medium, Gold/Hard, Platinum/Deadly).
- **Party Configuration:** (Number of Players, Average Character Level, Key Power Spikes).
- **Geographical Setting:** (Volcanic, Icy, Urban, Ritual, etc.).

## 3. UI Requirements
- **Combat Arena Designer:** Visual editor for 'Geographical Influence' (Lava flows, crevasses, visibility fog) with linked mechanical effects (DC 15, 3d6 dmg).
- **Live XP Balancer:** Real-time calculator that adjusts difficulty based on monster XP and party thresholds.
- **The "Trap Matrix" Console:** A 6x6 interactive grid for Clues, Triggers, Dangers, and Obscuring methods.
- **Guest List & Social Logic:** A manager for "Social Events" with tracks for Conversation Topics and linear/nonlinear event sequences.
- **Scene Flow Timeline:** A visual drag-and-drop tool for "Adventure Stages" (Prep -> Challenge -> Midpoint -> Climax -> Resolution).

## 4. Derived & Automated Fields
- **Tactical Tactic Generator:** Suggests monster strategies based on the selected terrain (e.g., "Trolls use cliff-tops to throw boulders").
- **Dynamic Change Triggers:** Automatically calculates environmental shifts (e.g., "Geysers erupt every 1d4 rounds").
- **Investigation Action Resolver:** Logic for Urban Crawls (District Keying and Layered Content).

## 5. Exports & Integration
- Tactical Encounter Manifest (Markdown).
- VTT Encounter Scene (JSON/Import Foundry).
- Player Handout / Trap Dossier.
- XP Log & Difficulty Report.

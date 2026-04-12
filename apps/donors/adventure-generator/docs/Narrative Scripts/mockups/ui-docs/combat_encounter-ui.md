# UI Explanation: Tactical Encounter & Combat Studio

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Geographical Arena Editor:** A specialized UI based on `combat_encounter - V2.txt` that forces the GM to define "Physical Features" (Lava, Ice) alongside their "Mechanical Impacts." It separates "Starting Conditions" from "Dynamic Changes."
- **Threshold-Driven Balancer:** Implements the `combat-encounter-balancer.txt` logic, allowing GMs to "Review and Playtest" virtually by comparing total XP (with multipliers) to Party XP Thresholds.
- **Recursive Trap Generator:** A 6x6 matrix tool based on `trap_prep.txt`. It generates 3 unique traps using the specified "Clue-Trigger-Danger-Obscure" logic, ensuring "Fairness" (Not instantly lethal).
- **Urban & Social Flow Manager:** A dual-purpose module.
    - **Urban Crawl:** Keying districts to thematic "Layers" (Vampires, Heists) as per `urban_crawl.txt`.
    - **Social Event:** Managing guest lists and "Topic Tracks" as per `social_event.txt`.

## Interaction Logic
- **Tactical Synergy:** While in the Arena Editor, selecting an "Enemy Type" triggers the "Detailed Tactics" engine, which suggests how that creature would exploit the current environment (e.g., throwing boulders from a specific cliff).
- **Real-Time Difficulty Adjustment:** Moving a slider for "Difficulty Rank" (Easy to Deadly) automatically suggests adding or removing monster minions (via `Reference_CreatureRoles_v1.txt`) to hit the XP target.
- **Scene Continuity Guard:** The "Scene Flow" tool monitors the adventure stages (`RPGAdventure_SceneCrafting_v1.txt`), ensuring every scene contributes "Cohesively to an overarching storyline."

## Visual Design
- **Combat-Ready UI:** High-contrast layout with dark backgrounds and vibrant status indicators (Red for Hazard, Blue for Buff, Yellow for Trigger).
- **Tactical Icons:** Small icons representing creature roles (Ambusher, Artillery, Brute, Solo) for quick visual scanning of a battle's composition.
- **Flow State Visualization:** The Scene Flow tool uses a "Node-and-Line" diagram to show the linear or branching paths of the adventure stages.

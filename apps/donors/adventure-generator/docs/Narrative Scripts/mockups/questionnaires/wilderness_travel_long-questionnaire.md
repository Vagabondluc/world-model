# UI Questionnaire: wilderness_travel_long

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A master-level "Wilderness Chapter" architect that generates entire travel systems, including biomes, survival mechanics, seasonal weather, and linked narrative encounter sequences.

## 2. Core Inputs
- **Biome Profile:** vivid detail, hazards, flora/fauna, and magical quirks.
- **Scaling Tiers:** CR ranges and DC modifiers for different character levels.
- **Complex Mechanics:**
    - Navigation steps (Checks -> Failures -> Recovery).
    - Foraging (Terrain/Season DCs -> Result tables).
    - Rest Levels (Short, Long, Extended) + Camp setup rules.
- **Scene Anatomy:** Approach, Feature, Reward, Exit logic.
- **Linked 2d6 Table:** 2d6 results where 6-8 triggers "Mini-story" sequences.
- **World Chronology:** Calendar system + Seasonal impact.
- **World Actors:** Factions (Friendly/Hostile/Neutral) and Key Individuals.
- **Gear Manifest:** Essential biome gear + survival items.

## 3. UI Requirements
- **Tabbed Chapter Studio:** Sections for "Mechanics," "Encounter Tables," "Biomes," and "Campaign Integration."
- **Story Sequence Builder:** A tool to link 3-5 encounters together into a "Mini-arc" (triggered by a 2d6 roll).
- **Seasonal Weather Calendar:** A visual calendar where DMs can set weather patterns for each month.
- **Encounter Scene Canvas:** A rich-text editor with placeholders for "Entrance," "Challenge," and "Exit Hooks."
- **Gear & Inventory Editor:** A tabular editor for environment-specific equipment and magical survival tools.

## 4. Derived & Automated Fields
- **Exhaustion Probability Calculator:** Predicts how many levels of exhaustion the party will suffer based on trip length and gear.
- **Lore weaver:** Suggests how to reveal character-specific backstory during "Common" encounters.

## 5. Exports & Integration
- Full 30+ page "Wilderness Survival Guide" (PDF).
- VTT Master Table (Nested tables for sequences).
- DM Screen Inserts (Rules Summaries).

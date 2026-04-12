# UI Explanation: Urban Crawl Navigator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Metascenario Layer Controller:** A system of toggles that allows the DM to activate city-wide "themes" (e.g., Heists, Vampire Blood Dens). These layers inject specific content into general investigation actions.
- **District Investigation Resolver:** The primary interaction engine. It handles both "General" (random layer) and "Specific" investigations, calculating difficulty and resolving narrative outcomes.
- **Triggered Event Monitor:** A dedicated area for "District Keyed" content that fires automatically upon entry, bypassing the investigation action (similar to random encounters but location-fixed).
- **Heat & Infamy Gauge:** A visual representation of the party's visibility in the city, scaling based on the intensity of their urban actions.
- **Sensory Journey Engine:** A module that uses "Life in the City" logic to bridge the gap between districts with atmospheric prose.

## Interaction Logic
- **Layer Priority:** When multiple layers are active, the UI provides a logic to "weight" which theme is encountered during general exploration (e.g., if there's a Gang War, crime encounters are 3x more likely).
- **Faction Feedback Loop:** Every resolved investigation automatically updates the Faction Impact panel, linking urban crawl results to the broader campaign power struggle.
- **Automatic Link to Gazetteer:** Selecting a district pulls real-time data from the `city_gazetteer` mockup to show "Points of Interest" and "Key NPCs" as helpful context for the DM.

## Visual Design
- **Noir & Industrial:** The UI uses a grittier, high-contrast palette (charcoal, deep blues, neon accents) to evoke an urban-noir or high-fantasy city feel.
- **Information Density:** Designed for DMs who need to manage multiple plot threads simultaneously; uses nested panels and tabbed interfaces to organize district data.
- **Icon-Driven Toggles:** Layers and investigation types are represented by clear icons (e.g., a magnifying glass for General, a dagger for Crime Layer) to speed up decision-making.

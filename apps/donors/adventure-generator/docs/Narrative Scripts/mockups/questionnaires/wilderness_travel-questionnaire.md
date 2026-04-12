# UI Questionnaire: Wilderness Travel & Exploration (Standard & Long)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A comprehensive travel management suite that handles biomes, navigation, resource management, and episodic encounter generation for overland journeys.

## 2. Core Inputs
- **Travel Structure:** (Select: Route, Hexcrawl, Pointcrawl).
- **Biome Selection:** (e.g., Forest, Tundra, Desert, Underdark).
- **Party Level & Speed:** (Pace: Slow, Normal, Fast).
- **Destination/Goal:** (e.g., "Reaching the Silver Spires").
- **Special Equipment:** (Mounts, Navigation tools, Foraging gear).

## 3. UI Requirements
- **Travel Dashboard:** Real-time tracking of distance traveled, days elapsed, and supplies consumed.
- **Scene Generator Matrix:** A grid or button to trigger the next "Travel Scene" based on the script's 2d6 logic.
- **Environmental Hazard Console:** Toggles for weather (Scaling d20), navigation setbacks, and terrain challenges.
- **Chapter Architect:** Sub-section to define biome-specific flora/fauna and natural landmarks.
- **Night Watch & Rest Hub:** Manager for camp watches, random rest interruptions, and recovery status.

## 4. Derived & Automated Fields
- **Navigation Result:** Automated calculation of "Getting Lost" based on DC and character survival modifiers.
- **Foraging Yield:** Automatic resource generation scaled by biome and season.
- **Episodic Sequence Tracker:** Tracks the "6-8 Common Encounter" mini-story arcs to ensure continuity across rolls.

## 5. Exports & Integration
- Daily Travel Log (Markdown).
- Encounter Stat-Block Compilation (for VTT).
- Regional Map Annotation (JSON/Text).

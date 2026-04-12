# UI Questionnaire: Dungeon Architecture & Keying Suite

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A dual-pane design environment that synchronizes spatial map creation (Xandereing layout) with narrative room keying, ensuring that every chamber is thematic, sensory-rich, and mechanically sound.

## 2. Core Inputs
- **Map Scale:** (e.g., 5ft/square).
- **Overarching Dungeon History:** (Brief lore overview).
- **Core Features List:** (Illumination, ceiling height, wall/floor materials).
- **Xandering Preference:** (High/Medium/Low connectivity).

## 3. UI Requirements
- **Spatial Map Canvas:** A grid-based drawing area for sketching rooms, corridors, and elevation shifts.
- **Narrative Key Sidebar:** A dynamic side-panel for writing Room Headers (Name/Number), Boxed Text, and Skill Checks.
- **Sensory Palette Picker:** A tool that forces the '3 Senses + 2 Irrelevant Details' requirement from the Room Designer script.
- **Denizen & Treasure Console:** A sectionalized editor for creature behaviors, stats, and organized treasure summaries.
- **Xandering Toolset:** Buttons for 'Add Discontinuous Connection,' 'Multiple Entrances,' and 'Loop Back.'

## 4. Derived & Automated Fields
- **Spatial-Narrative Sync:** Automatically generates a Room Header in the Key when a new Room is numbered on the Map.
- **Legend Generator:** Automatically compiles Map Symbols (Secret Doors, Pit Traps) into a printable legend.
- **Treasure Audit:** Summaries all treasure objects across all rooms into a final Treasure Summary appendix.

## 5. Exports & Integration
- Printable Dungeon Map (PDF/PNG).
- Complete Dungeon Key (Markdown).
- VTT Map Manifest (Walls, Lighting, and Notes).

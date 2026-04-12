# UI Questionnaire: xandered-dungeon-designer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A complex topology mapper that enforces "Xandered" design principles: non-linearity, verticality, and secret connectivity.

## 2. Core Inputs
- **Entrances:** (Min 2).
- **Core Loops:** Number of desired interconnected paths.
- **Vertical Transitions:** (Stairs, Elevators, Chutes).
- **Secret/Unusual Paths:** (Underwater, Puzzles).
- **Landmarks:** Key orientation points.

## 3. UI Requirements
- **Topology Map:** A high-level flowchart of room connectivity.
- **"Xander-Inject" Buttons:** One-click tools to [Add Loop], [Add Level Shortcut], [Add Entrance].
- **Verticality Sidebar:** Manage multiple levels and the "Discontinuous Links" between them.
- **Landmark Gallery:** A library of visual orientation cues to drag onto the map.

## 4. Derived & Automated Fields
- **Non-Linearity Score:** A percentage that calculates how "Xandered" the map is based on loops and entrances.

## 5. Exports & Integration
- Dungeon Blueprint (SVG).
- Connectivity Matrix (JSON).
- Player Investigation Guide.

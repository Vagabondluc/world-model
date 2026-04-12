# UI Questionnaire: dungeon-map-creator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A node-based dungeon layout tool that focuses on "Xandering" (non-linear flow) and logical spatial arrangement.

## 2. Core Inputs
- **Scale:** (5ft vs 10ft squares).
- **Entrances:** Number and position.
- **Node Connections:** Manual connections or "Xanderized" auto-looping.
- **Room Types:** (Boss, Vault, Corridor, Sub-level).
- **Map Details:** Traps, stairs, secret doors.

## 3. UI Requirements
- **Node-Link Canvas:** A drag-and-drop area for rooms.
- **Xandering Toolbar:** Buttons for [Add Loop], [Add Level Connection], [Add Secret Path].
- **Legend Panel:** Interactive symbols you can drag onto the map (Statue, Pit, Water).
- **Auto-Numbering:** Ensuring nodes are indexed correctly for the Key Writer.

## 4. Derived & Automated Fields
- **Flow Analysis:** A visual "Heatmap" showing the most likely paths players will take.

## 5. Exports & Integration
- Image Export (PNG/SVG).
- VTT Map Layout (JSON for wall data).
- Legend Handout.

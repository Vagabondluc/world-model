
# SPEC-011: Map Visualization & Influence

**Feature:** Map Rendering
**Dependencies:** SPEC-009, SPEC-010
**Status:** Revised (Rules Compliance)

## 1. The "Organic" Requirement
The original specification assumed rigid, Civ-style borders. Dawn of Worlds describes a more fluid influence model.
*   **Rule Reference:** "Draw a rough outline of a land mass."
*   **Change:** Instead of precise vector paths snapping to hex edges, we will use **Catmull-Rom Splines** or smoothed SVG paths to represent "Spheres of Influence" for Nations and Climates.

## 2. Layer 1: Geography & Climate (Age I)
*   **Terrain:** Rendered via Hex colors (Biome).
*   **Climate:** Rendered as a full-map SVG overlay pattern (e.g., "Snow" texture, "Arid" texture) that can span multiple hexes without adhering strictly to the grid.

## 3. Layer 2: Political Boundaries (Age III)
*   **Nations:** Rendered as thick, colored outlines.
*   **Conflict Zones:** When two nations share a border, the line should appear "contested" (dashed or distinct double-line) rather than a shared single stroke.

## 4. Visualizing "Avatars" and "Orders"
*   **Avatars:** Must be rendered as "Tokens" (circular portraits) that sit *above* the hex grid. They are mobile units, not terrain features.
*   **Orders:** Represented as "Badges" attached to Cities or Races. A City might fly the flag of "The Kingdom" but have a badge for "The Cult of the Worm" (Order).

## 5. Technical Implementation
*   **React Component:** `<MapLayers />`
*   **Z-Index Stack:**
    1.  `<TerrainMesh />` (The Hex Grid)
    2.  `<ClimateOverlay />` (SVG Texture)
    3.  `<InfluenceLayer />` (Smoothed Vectors for Nations)
    4.  `<UnitLayer />` (HTML/Divs for Avatars/Cities/Armies)


# Spec: Flat Map Seam & Integrity (Phase 23b)

## 1. Problem
Equirectangular projection maps a sphere onto a 2D plane `[0, Width]`.
Polygons crossing the 180° meridian (Anti-Meridian) have vertices near `x=0` and `x=Width`.
Naive rendering connects these points across the map, causing massive horizontal streaks.
Previous "split" solutions deformed hexes or fell back to circles, breaking immersion.

## 2. Solution: Ghost Rendering Strategy

### 2.1 The "Ghost" Concept
Instead of splitting a hex, we render it multiple times if it touches the seam.
1.  **Primary**: The hex at its calculated `[u, v]` position.
2.  **West Ghost**: The hex shifted by `+MAP_WIDTH`.
3.  **East Ghost**: The hex shifted by `-MAP_WIDTH`.

### 2.2 Integrity Rules
1.  **Geometric Preservation**: Hexes are always drawn as 6-vertex polygons. No circles.
2.  **Bleed Area**: The rendering viewport must extend beyond `[0, Width]` (e.g., `-Padding` to `Width + Padding`) to show the full shape of wrapped hexes.
3.  **Connection**: Visual cues (dashed lines) connect the map edges to indicate continuity.

## 3. Rendering Algorithm

### 3.1 Detection
A hex requires ghosting if its constituent vertices span more than `Width / 2`.

### 3.2 Projection Logic
For a Seam Hex:
1.  **Left Instance**:
    *   Shift all vertices with `x > Width/2` by subtracting `Width`.
    *   Result: A perfect hex sitting on or crossing the Left Edge (x ≈ 0).
2.  **Right Instance**:
    *   Shift all vertices with `x < Width/2` by adding `Width`.
    *   Result: A perfect hex sitting on or crossing the Right Edge (x ≈ Width).

### 3.3 Visual Layers
*   **Hex Layer**: Renders both instances.
*   **Seam Guides**: Dashed lines at `x=0` and `x=Width` to visualize the wrap.
*   **Connectors**: (Optional) Line connecting the center of the Left Instance to the Right Instance (spanning the void) to show they are the same entity, OR local indicators.

## 4. Canvas Adjustments
*   **Viewport**: Viewport width = `MAP_WIDTH + (PADDING * 2)`.
*   **Centering**: Map center is `MAP_WIDTH / 2`.

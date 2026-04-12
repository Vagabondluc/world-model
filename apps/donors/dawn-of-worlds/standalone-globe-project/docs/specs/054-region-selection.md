# SPEC-054: Region Selection & Data Overlays

**Epic:** Region Selection
**Status:** DRAFT
**Dependencies:** SPEC-053 (Globe Interaction)

## 1. Overview

Enhance the globe with tools to survey and select a starting region. This includes toggling between different data visualizations (Biomes, Temperature, Elevation) and selecting a group of cells to form a "Region".

## 2. Goals

1.  **Survey**: Users can view different data layers to make informed decisions.
2.  **Selection**: Users can select a contiguous region of cells (e.g., by radius).
3.  **Analysis**: Users receive immediate statistics about the selected region.

## 3. Requirements

### 3.1 Data Overlays (Visualization Modes)
**Description**: Toggle the visual representation of the globe cells.

**Modes**:
-   **Biome** (Default): Current standard visualization.
-   **Elevation**: Greyscale or topographic map (Dark = low, White = high).
-   **Temperature**: Heatmap (Blue = cold, Red = hot).
-   **Moisture**: Wetness map (Yellow = dry, Blue = wet).

**UI Controls**:
-   Dropdown or pill selector in the Control Panel to switch modes.

### 3.2 Region Selection
**Description**: Select multiple cells based on a center point and a radius.

**Interaction**:
-   **Mode Toggle**: Switch between "Single Cell" (Inspection) and "Region Select" modes.
-   **Selection Method**: Click a center cell -> Highlight all cells within `N` steps (neighbors).
-   **Radius Control**: Slider to adjust selection radius (e.g., 1-5 hexes).

### 3.3 Region Statistics
**Description**: Display aggregate data for the selected region.

**Data Points**:
-   Total Land Area vs Water Area.
-   Biome composition (e.g., "50% Forest, 30% Plains").
-   Average Temperature/Elevation.
-   Resource potential (if data exists).

## 4. Architecture

### 4.1 Component Updates

#### `CellMesher` (Logic)
-   Update `createSolidMesh` to accept a `displayMode`.
-   Implement color mapping logic for Elevation, Temperature, and Moisture.

#### `ThreeGlobeRenderer` (Logic)
-   Add `setOverlayMode(mode)` method.
-   Update `selectCell` to support multi-cell selection (or handle it in React layer).
-   *Actually*, it's better to implement `highlightRegion(centerId, radius)` in the renderer to keep the loop tight.

#### `App` (Orchestrator)
-   Manage `selectionMode` (Single vs Region).
-   Manage `selectionRadius`.
-   Calculate and display `RegionStats`.

### 4.2 Data Flow

```
User (UI) → App (Set Mode: Elevation)
             ↓
          GlobeRenderer (Prop: displayMode)
             ↓
          ThreeGlobeRenderer (Re-mesh or Update Colors)
```

```
User (Click) → ThreeGlobeRenderer (Select Center)
             ↓
          App (Calc Neighbors)
             ↓
          ThreeGlobeRenderer (Highlight List of Cells)
```

## 5. Verification
-   **Visuals**: Switching modes changes globe colors instantly.
-   **Selection**: Clicking in Region Object selects a circle of hexes.
-   **Stats**: Stats panel updates with correct aggregate numbers.
